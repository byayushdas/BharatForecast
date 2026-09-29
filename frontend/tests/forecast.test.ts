import assert from 'node:assert/strict';
import test from 'node:test';
import { getMockForecast, getMockLocations } from '../src/data/mockForecast.ts';

test('forecast horizons contain the requested six-hour intervals', () => {
  for (const hours of [24, 72, 120]) {
    const result = getMockForecast('kolkata', hours);
    assert.equal(result.forecast.length, hours / 6);
    assert.equal(result.summary.rainfall, Math.round(result.forecast.reduce((sum, point) => sum + point.rainfall!, 0) * 10) / 10);
    assert.equal(Date.parse(result.forecast.at(-1)!.time) - Date.parse(result.forecast[0].time), (hours - 6) * 3_600_000);
  }
});

test('every location and variable has consistent units, weights, and blend values', () => {
  for (const location of getMockLocations()) {
    for (const variable of ['Rainfall', 'Temperature', 'Wind'] as const) {
      const forecast = getMockForecast(location.id, 24, variable);
      const unit = { Rainfall: 'mm', Temperature: '°C', Wind: 'm/s' }[variable];
      assert.equal(forecast.unit, unit);
      assert.ok(Math.abs(Object.values(forecast.source_weights).reduce((a, b) => a + b, 0) - 1) < 0.000001);
      const sources = forecast.models.filter(model => model.model !== 'BLEND');
      const weighted = sources.reduce((sum, model) => sum + model.value * forecast.source_weights[model.model], 0);
      assert.equal(forecast.models.find(model => model.model === 'BLEND')!.value, Math.round(weighted * 10) / 10);
      assert.ok(forecast.models.every(model => model.unit === unit && model.value >= 0));
      for (const missing of forecast.missing_sources) {
        assert.equal(forecast.source_weights[missing], 0);
        assert.ok(!sources.some(model => model.model === missing));
      }
    }
  }
});

test('sample forecasts are repeatable and explicitly identified as demo data', () => {
  const first = getMockForecast('mumbai');
  const second = getMockForecast('mumbai');
  assert.deepEqual(first, second);
  assert.match(first.run.model_version, /demo/);
  assert.equal(first.warning?.source, 'Demo');
  assert.throws(() => getMockForecast('unknown-location'), /not available/);
});
