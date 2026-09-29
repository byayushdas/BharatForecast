import { useId } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CloudRain, Thermometer, Wind } from 'lucide-react';
import type { ForecastPoint, WeatherVariable } from '../types/weather';
import { dataKeys, formatIST, number, units } from '../lib/format';

interface Props { data: ForecastPoint[]; variable: WeatherVariable; hours: number; onVariableChange: (variable: WeatherVariable) => void }
const colors = { Rainfall: '#3f70e9', Temperature: '#e79550', Wind: '#399e98' };
export default function ForecastChart({ data, variable, hours, onVariableChange }: Props) {
  const gradientId = useId().replaceAll(':', '');
  const color = colors[variable];
  const values = data.flatMap(point => point[dataKeys[variable]] === undefined ? [] : [point[dataKeys[variable]]!]);
  return <section className="panel forecast-chart">
    <div className="panel-heading"><div><h2>Your forecast, over time</h2><p>The next {hours === 24 ? '24 hours' : `${hours / 24} days`} · 6-hour intervals</p></div><span className="chart-live-label"><span className="small-dot" />Bharat Blend</span></div>
    <div className="chart-toolbar"><div className="variable-tabs" role="group" aria-label="Weather variable">{([{ name: 'Rainfall', Icon: CloudRain }, { name: 'Temperature', Icon: Thermometer }, { name: 'Wind', Icon: Wind }] as const).map(({ name, Icon }) => <button key={name} className={variable === name ? 'active' : ''} aria-pressed={variable === name} onClick={() => onVariableChange(name)}><Icon size={14} />{name}</button>)}</div><span className="chart-unit">{units[variable]}</span></div>
    <div className="chart-canvas" role="img" aria-label={`${variable} forecast over ${hours} hours. ${values.length ? `Values range from ${number(Math.min(...values))} to ${number(Math.max(...values))} ${units[variable]}.` : 'No values available.'} Detailed values available in the Forecast data table below.`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={data} margin={{ top: 14, right: 12, left: -24, bottom: 0 }}>
          <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.19} /><stop offset="100%" stopColor={color} stopOpacity={0.01} /></linearGradient></defs>
          <CartesianGrid vertical={false} stroke="#e9edf4" strokeDasharray="4 4" />
          <XAxis dataKey="time" tickFormatter={time => formatIST(time, hours === 24 ? { hour: '2-digit', minute: '2-digit' } : { day: 'numeric', month: 'short', hour: '2-digit' })} axisLine={false} tickLine={false} tick={{ fill: '#8792a6', fontSize: 10 }} minTickGap={42} dy={9} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8792a6', fontSize: 10 }} domain={variable === 'Temperature' ? ['auto', 'auto'] : [0, 'auto']} />
          <Tooltip labelFormatter={label => `${formatIST(String(label))} IST`} formatter={value => [`${number(Number(value))} ${units[variable]}`, variable]} contentStyle={{ border: '1px solid #e6ebf3', borderRadius: 12, boxShadow: '0 8px 24px #17345c12', fontSize: 12 }} />
          <Area type="monotone" dataKey={dataKeys[variable]} name={variable} stroke={color} strokeWidth={2.5} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 3 }} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="chart-bottom"><span>Forecast timeline <span>· IST</span></span><span>Each point is a forecast interval</span></div>
  </section>;
}
