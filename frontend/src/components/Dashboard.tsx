import { Suspense, lazy, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownToLine, ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, CloudRain, CloudSun, FlaskConical, Info, Layers3, MapPin, RefreshCw, ShieldCheck, Sun, Thermometer, TriangleAlert, Wind } from 'lucide-react';
import { DEFAULT_DEMO, getForecast, getLocations } from '../lib/api';
import { formatIST, number, units } from '../lib/format';
import type { ForecastResponse, WeatherVariable } from '../types/weather';
import ForecastChart from './ForecastChart';
import ModelComparison from './ModelComparison';
import ModelWeights from './ModelWeights';
import WeatherCard from './WeatherCard';

const WeatherMap = lazy(() => import('./WeatherMap'));

function downloadForecast(forecast: ForecastResponse, demo: boolean) {
  const rows = [
    ['Location', 'Data type', 'Time (UTC)', 'Rainfall (mm)', 'Temperature (°C)', 'Wind speed (m/s)'],
    ...forecast.forecast.map(p => [forecast.location.name, demo ? 'SYNTHETIC DEMO' : 'API forecast', p.time, p.rainfall ?? '', p.temperature ?? '', p.windSpeed ?? '']),
  ];
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a'); link.href = url; link.download = `bharat-${forecast.location.id}-${demo ? 'demo-' : ''}forecast.csv`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Dashboard({ explorer = false }: { explorer?: boolean }) {
  const [params, setParams] = useSearchParams();
  const [tableOpen, setTableOpen] = useState(false);
  const [today] = useState(() => new Date().toISOString());
  const locationId = params.get('location') || 'kolkata';
  const variable: WeatherVariable = ['Rainfall', 'Temperature', 'Wind'].includes(params.get('variable') || '') ? params.get('variable') as WeatherVariable : 'Rainfall';
  const hours = [24, 72, 120].includes(Number(params.get('hours'))) ? Number(params.get('hours')) : 120;
  const demo = params.has('demo') ? params.get('demo') === 'true' : DEFAULT_DEMO;
  const update = (key: string, value: string) => setParams(previous => { const next = new URLSearchParams(previous); next.set(key, value); return next; });
  const locationsQuery = useQuery({ queryKey: ['locations', demo], queryFn: ({ signal }) => getLocations(demo, signal) });
  const selectedLocation = locationsQuery.data?.find(l => l.id === locationId);
  const forecastQuery = useQuery({
    queryKey: ['forecast', locationId, hours, variable, demo],
    queryFn: ({ signal }) => getForecast(selectedLocation!, hours, variable, demo, signal),
    enabled: !!selectedLocation,
  });
  const forecast = forecastQuery.data;
  const synthetic = demo || !!forecast && /demo|mock/i.test(`${forecast.run.id} ${forecast.run.model_version}`);
  const busy = locationsQuery.isLoading || (!!selectedLocation && forecastQuery.isLoading);
  const error = locationsQuery.isError || forecastQuery.isError;
  const unknownLocation = !!locationsQuery.data && !selectedLocation;
  const refresh = () => { if (locationsQuery.isError) void locationsQuery.refetch(); else void forecastQuery.refetch(); };
  const uncertainty = forecast?.uncertainty?.[variable];
  const sourceCount = forecast?.models.filter(m => m.model !== 'BLEND').length || 0;
  const periodLabel = hours === 24 ? '24 hours' : `${hours / 24} days`;
  const first = forecast?.forecast[0];
  const temps = forecast?.forecast.flatMap(p => p.temperature === undefined ? [] : [p.temperature]) || [];
  const title = explorer ? 'Forecast explorer' : 'Weather overview';

  return <>
    <div className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{explorer ? 'Forecast explorer' : 'Overview'}</strong></div><div className="topbar-right"><span className="prototype-badge"><FlaskConical size={13} /> Experimental preview</span><Link to={`/about?${params}`} className="topbar-help" aria-label="About this forecast"><Info size={19} /></Link></div></div>
    <div className="page-content">
      <header className="page-heading"><div><div className="eyebrow">A LITTLE MORE CLARITY, COME RAIN OR SHINE</div><h1>{title}<span className="heading-dot">.</span></h1><p>{explorer ? 'Explore the details behind your local outlook.' : 'A local outlook. A wider perspective. All in one place.'}</p></div><div className="heading-date"><CalendarDays size={17} /><span>{formatIST(today, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}<small>India Standard Time · UTC +5:30</small></span></div></header>

      <div className="filter-bar"><div className="location-control"><MapPin size={18} /><label className="sr-only" htmlFor="location">Forecast location</label><select id="location" value={locationId} disabled={!locationsQuery.data?.length} onChange={e => update('location', e.target.value)}>{!locationsQuery.data?.length && <option value={locationId}>Select a location</option>}{unknownLocation && <option value={locationId}>Unknown location</option>}{locationsQuery.data?.map(l => <option key={l.id} value={l.id}>{l.name}, {l.state}</option>)}</select><ChevronDown size={15} /></div><div className="filter-divider" /><div className="period-control" role="group" aria-label="Forecast period">{[24, 72, 120].map(period => <button key={period} aria-pressed={hours === period} className={hours === period ? 'active' : ''} onClick={() => update('hours', String(period))}>{period === 24 ? '24 hours' : `${period / 24} days`}</button>)}</div><button className="icon-button refresh-button" title="Refresh forecast" aria-label="Refresh forecast" disabled={busy || unknownLocation || forecastQuery.isRefetching || locationsQuery.isRefetching} onClick={refresh}><RefreshCw size={17} className={forecastQuery.isFetching || locationsQuery.isFetching ? 'spin' : ''} /></button></div>

      {synthetic && <div className="demo-banner"><FlaskConical size={16} /><p><strong>Demo workspace</strong><span>Explore synthetic weather data. These are not real forecasts or official warnings.</span></p>{!DEFAULT_DEMO && <button onClick={() => update('demo', 'false')}>Connect to API <ArrowUpRight size={13} /></button>}</div>}
      {busy && <div className="dashboard-skeleton" role="status" aria-label="Loading forecast"><div className="skeleton hero-skeleton" /><div className="skeleton map-skeleton" />{[1, 2, 3, 4].map(i => <div className="skeleton metric-skeleton" key={i} />)}<span className="sr-only">Loading forecast…</span></div>}
      {error && <div className="empty-state panel" role="alert"><span className="empty-icon"><CloudSun size={36} /></span><h2>Your outlook is taking a little longer.</h2><p>We couldn’t reach the forecast service. Try again, or explore the interface with clearly labeled sample data.</p><div className="button-row"><button className="button button-primary" onClick={refresh}><RefreshCw size={16} />Try again</button><button className="button" onClick={() => update('demo', 'true')}>Explore demo <ArrowRight size={16} /></button></div></div>}
      {unknownLocation && <div className="empty-state panel" role="alert"><MapPin size={30} /><h2>Let’s find another location.</h2><p>This location isn’t available. Choose a city from the location menu.</p></div>}
      {!busy && !error && forecast && <>
        {!forecast.forecast.length ? <div className="empty-state panel"><CloudSun size={32} /><h2>No forecast intervals available.</h2><p>Try another city or forecast period.</p></div> : <>
          {!explorer && <div className="outlook-grid"><section className="current-weather" aria-label={`${forecast.location.name} outlook`}><div className="current-top"><span><MapPin size={14} /> LOCAL OUTLOOK</span><span className="weather-blend-badge">Bharat Blend</span></div><h2>{forecast.location.name}<span>{forecast.location.state}, India</span></h2><div className="temperature-display"><div>{number(first?.temperature)}<span>°</span><small>CELSIUS</small></div><div className="weather-art" aria-hidden="true"><span className="weather-sun" /><CloudSun size={108} strokeWidth={1.1} /></div></div><div className="weather-condition">{(first?.rainfall ?? 0) > 0.5 ? 'Rain in the outlook' : 'A mostly dry outlook'}<span>{temps.length ? `H: ${number(Math.max(...temps))}°  /  L: ${number(Math.min(...temps))}°` : 'Temperature range unavailable'}</span></div><div className="current-footer"><span className="small-dot" />Forecast starts {first && formatIST(first.time)} IST</div></section><Suspense fallback={<div className="panel map-placeholder" role="status">Loading regional map…</div>}><WeatherMap location={forecast.location} locations={locationsQuery.data} onLocationSelect={id => update('location', id)} /></Suspense></div>}

          <div className="section-heading"><h2>{explorer ? 'At a glance' : 'The details that shape your day'}</h2><span>Over the next {periodLabel}</span></div>
          <div className="metrics-grid"><WeatherCard title="Expected rainfall" value={number(forecast.summary.rainfall)} unit="mm" subtitle="Total forecast accumulation" icon={<CloudRain size={18} />} /><WeatherCard title="Average temperature" value={number(forecast.summary.temperature)} unit="°C" subtitle="Across forecast intervals" icon={<Thermometer size={18} />} tone="orange" /><WeatherCard title="Average wind" value={number(forecast.summary.wind_speed)} unit="m/s" subtitle="Across forecast intervals" icon={<Wind size={18} />} tone="teal" /><WeatherCard title="Forecast confidence" value={uncertainty?.confidence || 'Unavailable'} subtitle={synthetic ? `Illustrative · ${sourceCount} source models` : `Reported for ${variable.toLowerCase()}`} icon={<ShieldCheck size={18} />} tone="purple" /></div>

          <div className="analysis-grid"><ForecastChart data={forecast.forecast} variable={variable} hours={hours} onVariableChange={value => update('variable', value)} /><ModelWeights weights={forecast.source_weights} locationName={forecast.location.name} variable={variable} runTime={forecast.run.initialization_time} leadTime={`${hours}h`} modelVersion={forecast.run.model_version} /></div>

          <div className="detail-grid"><ModelComparison models={forecast.models} variable={variable} missingSources={forecast.missing_sources} /><section className="panel uncertainty-panel"><div className="panel-heading"><div><span className="eyebrow">ROOM FOR UNCERTAINTY</span><h2>A range, not a promise.</h2></div><span className="metric-icon purple"><Layers3 size={20} /></span></div><p>Weather models don’t always agree. The reported range helps put this outlook in context.</p>{uncertainty ? <><div className="range-values"><span>{number(uncertainty.lowerBound)}<small>LOWER ESTIMATE</small></span><span className="range-unit">{units[variable]}</span><span>{number(uncertainty.upperBound)}<small>UPPER ESTIMATE</small></span></div><div className="uncertainty-track"><span /><span /><span /></div><div className="uncertainty-caption">{variable} · {uncertainty.confidence.toLowerCase()} confidence</div></> : <p className="inline-note">No uncertainty range has been supplied for {variable.toLowerCase()}.</p>}<div className="range-note"><Info size={15} /><span>{synthetic ? 'Illustrative range for the demo. This is not a validated confidence interval.' : 'Provider-reported range. Confidence describes uncertainty, not a guarantee.'}</span></div></section></div>

          <section className="warning-panel"><span className="warning-icon"><TriangleAlert size={20} /></span><div><h3>{synthetic ? 'Official warnings are not connected in this demo' : forecast.warning?.warnings.length ? `${forecast.warning.source} advisories` : 'No active advisories returned'}</h3><p>{synthetic ? 'For current alerts and weather decisions, check the India Meteorological Department.' : forecast.warning?.warnings.length ? forecast.warning.warnings.map(w => `${w.type} · ${w.region} · valid until ${formatIST(w.valid_until)} IST`).join('; ') : 'An empty response does not establish safe conditions. Check IMD for current warnings.'}</p></div><a href="https://mausam.imd.gov.in/" target="_blank" rel="noreferrer">Visit IMD <ArrowUpRight size={15} /></a></section>

          <section className="panel data-panel"><div className="panel-heading"><div><h2>Forecast data</h2><p>{forecast.forecast.length} intervals · All displayed times in IST</p></div><div className="button-row"><button className="button button-small" onClick={() => setTableOpen(!tableOpen)} aria-expanded={tableOpen} aria-controls="forecast-data-table">{tableOpen ? 'Hide' : 'View'} data<ChevronDown size={14} className={tableOpen ? 'rotate' : ''} /></button><button className="button button-small" onClick={() => downloadForecast(forecast, synthetic)}><ArrowDownToLine size={14} />Export CSV</button></div></div>{tableOpen && <div className="table-scroll" id="forecast-data-table"><table><caption className="sr-only">{forecast.location.name} forecast intervals, {synthetic ? 'synthetic demo data' : 'API data'}</caption><thead><tr><th scope="col">Time (IST)</th><th scope="col">Rainfall (mm)</th><th scope="col">Temperature (°C)</th><th scope="col">Wind (m/s)</th></tr></thead><tbody>{forecast.forecast.map(p => <tr key={p.time}><td>{formatIST(p.time)}</td><td>{number(p.rainfall)}</td><td>{number(p.temperature)}</td><td>{number(p.windSpeed)}</td></tr>)}</tbody></table></div>}</section>
          <footer className="dashboard-footer"><span><span className="small-dot" />{synthetic ? 'Synthetic demo run' : 'Forecast run'} · {formatIST(forecast.run.initialization_time)} IST</span><span>{forecast.run.model_version} <span className="footer-divider">/</span> Made for India <Sun size={13} /></span></footer>
        </>}
      </>}
    </div>
  </>;
}
