import { memo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import type { ForecastPoint, WeatherVariable, ForecastUncertainty } from '../types/weather';

interface ForecastChartProps {
  data: ForecastPoint[];
  variable: WeatherVariable;
  uncertainty?: ForecastUncertainty;
}

const ForecastChart = memo(function ForecastChart({ data, variable, uncertainty }: ForecastChartProps) {
  
  // Format time for X-axis
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      return (
        <div className="bg-surface p-3 border border-border shadow-md rounded-md text-sm">
          <p className="text-text-secondary mb-2">{date.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium text-text-primary">
                {entry.name}: {entry.value.toFixed(1)} {variable === 'Rainfall' ? 'mm' : variable === 'Temperature' ? '°C' : 'km/h'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (variable) {
      case 'Rainfall':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" tickFormatter={formatTime} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area type="monotone" name="Blended Rainfall" dataKey="rainfall" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRain)" />
          </AreaChart>
        );
      case 'Temperature':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" tickFormatter={formatTime} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line type="monotone" name="Temperature" dataKey="temperature" stroke="#DC2626" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'Wind':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
             <defs>
              <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="time" tickFormatter={formatTime} stroke="#475569" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area type="monotone" name="Wind Speed" dataKey="windSpeed" stroke="#16A34A" strokeWidth={2} fillOpacity={1} fill="url(#colorWind)" />
          </AreaChart>
        );
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Forecast Timeline</h3>
          <p className="text-sm text-text-secondary">{variable} over next 5 days</p>
        </div>
        
        {uncertainty && (
          <div className="text-right">
            <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">Uncertainty</div>
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 border border-border text-xs font-medium">
              <span className={`w-2 h-2 rounded-full ${
                uncertainty.confidence === 'High' ? 'bg-status-success' : 
                uncertainty.confidence === 'Medium' ? 'bg-status-warning' : 'bg-status-danger'
              }`}></span>
              {uncertainty.confidence} Confidence
            </div>
            <div className="text-xs text-text-secondary mt-1">
              Range: {uncertainty.lowerBound.toFixed(1)} - {uncertainty.upperBound.toFixed(1)}
            </div>
          </div>
        )}
      </div>
      
      <div 
        className="flex-1 min-h-[300px]" 
        role="figure" 
        aria-label={`Interactive 5-day ${variable} forecast chart`}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default ForecastChart;
