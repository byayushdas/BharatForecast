import type { ForecastResponse, Location, ModelForecast, WeatherVariable } from '../types/weather';

// Synthetic, deterministic examples. Never use these values for weather decisions.
const locations: Location[] = [
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.209 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', latitude: 19.076, longitude: 72.8777 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245 },
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', latitude: 26.1445, longitude: 91.7362 },
];
export const getMockLocations = () => locations;
const round = (n: number) => Math.round(n * 10) / 10;

export function getMockForecast(locationId: string, hours = 120, variable: WeatherVariable = 'Rainfall'): ForecastResponse {
  const location = locations.find(l => l.id === locationId);
  if (!location) throw new Error('This location is not available in the demo.');
  const index = locations.indexOf(location);
  const baseTemp = [29, 35, 28, 24, 30, 26][index];
  const baseRain = [2.4, 0.1, 12, 1.5, 4, 9][index];
  const baseWind = [4.2, 3.5, 6.8, 3.2, 4.8, 2.6][index];
  const start = new Date();
  start.setUTCMinutes(0, 0, 0);
  start.setUTCHours(Math.floor(start.getUTCHours() / 6) * 6);
  const forecast = Array.from({ length: Math.ceil(hours / 6) }, (_, i) => ({
    time: new Date(start.getTime() + i * 3600000 * 6).toISOString(),
    rainfall: round(Math.max(0, baseRain * (0.7 + Math.sin(i * 1.3 + index) * 0.55 + Math.cos(i * 0.6) * 0.35))),
    temperature: round(baseTemp + Math.sin((start.getUTCHours() + 5.5 + i * 6 - 8) * Math.PI / 12) * 3.5),
    windSpeed: round(baseWind + Math.sin(i * 0.8) * 1.2),
    windDirection: (135 + i * 12) % 360,
  }));
  const summary = {
    rainfall: round(forecast.reduce((sum, point) => sum + point.rainfall, 0)),
    temperature: round(forecast.reduce((sum, point) => sum + point.temperature, 0) / forecast.length),
    wind_speed: round(forecast.reduce((sum, point) => sum + point.windSpeed, 0) / forecast.length),
  };
  const source_weights = location.id === 'delhi' ? { GFS: 0.25, GEFS: 0, IFS: 0.35, AIFS: 0.4 } : { GFS: 0.2, GEFS: 0.15, IFS: 0.3, AIFS: 0.35 };
  const base = variable === 'Rainfall' ? summary.rainfall : variable === 'Temperature' ? summary.temperature : summary.wind_speed;
  const unit = variable === 'Rainfall' ? 'mm' : variable === 'Temperature' ? '°C' : 'm/s';
  const names = ['GFS', 'GEFS', 'IFS', 'AIFS'] as const;
  const offsets = variable === 'Temperature' ? [1.8, -0.7, -1.5, 0.7] : [0.15, -0.05, -0.1, 0.08].map(value => value * base);
  const weightedOffset = names.reduce((sum, name, i) => sum + source_weights[name] * offsets[i], 0);
  const models: ModelForecast[] = names.filter(name => source_weights[name] > 0).map(name => ({
    model: name, value: round(base + offsets[names.indexOf(name)] - weightedOffset), unit,
    initializationTime: start.toISOString(), isEnsemble: name === 'GEFS', isAi: name === 'AIFS',
  }));
  models.push({ model: 'BLEND', value: round(models.reduce((sum, model) => sum + source_weights[model.model as keyof typeof source_weights] * model.value, 0)), unit });
  return {
    location, variable: variable.toLowerCase(), unit,
    run: { id: 'demo-run-001', initialization_time: start.toISOString(), published_at: start.toISOString(), model_version: 'blend-v1-demo' },
    summary, forecast,
    uncertainty: {
      Rainfall: { lowerBound: round(Math.max(0, summary.rainfall * 0.65)), upperBound: round(summary.rainfall * 1.4 + 1), confidence: 'Medium' },
      Temperature: { lowerBound: round(summary.temperature - 2), upperBound: round(summary.temperature + 2), confidence: 'High' },
      Wind: { lowerBound: round(Math.max(0, summary.wind_speed - 1.5)), upperBound: round(summary.wind_speed + 1.5), confidence: 'Medium' },
    },
    event_probability: { 'Heavy rain': baseRain > 8 ? 0.8 : 0.1, 'Extreme heat': baseTemp > 34 ? 0.25 : 0.05 },
    source_weights, models, missing_sources: location.id === 'delhi' ? ['GEFS'] : [],
    warning: { source: 'Demo', warnings: location.id === 'mumbai' ? [{ id: 'demo-warning', region: location.name, type: 'Heavy rainfall example', severity: 'orange', valid_until: new Date(start.getTime() + 86400000).toISOString() }] : [] },
  };
}
