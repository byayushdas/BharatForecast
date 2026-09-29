import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronDown, MapPin, CloudRain, Thermometer, Wind, AlertTriangle, RefreshCw, Activity } from "lucide-react";
import { getForecast, getLocations } from "../lib/api";
import type { WeatherVariable } from "../types/weather";

import ForecastChart from "../components/ForecastChart";
import ModelComparison from "../components/ModelComparison";
import ModelWeights from "../components/ModelWeights";

export default function Forecast() {
  const [selectedLocationId, setSelectedLocationId] = useState("kolkata");
  const [selectedVariable, setSelectedVariable] = useState<WeatherVariable>("Rainfall");
  const [forecastPeriod, setForecastPeriod] = useState<number>(120);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => getLocations()
  });

  const { data: forecast, isLoading: isLoadingForecast, isError, refetch: refetchForecast, isRefetching } = useQuery({
    queryKey: ['forecast', selectedLocationId, forecastPeriod],
    queryFn: () => getForecast(selectedLocationId, forecastPeriod),
    enabled: !!selectedLocationId
  });

  // Reset selected day when changing global filters
  useEffect(() => {
    setSelectedDayIndex(null);
  }, [selectedLocationId, forecastPeriod]);

  // Compute daily aggregates for the timeline
  const dailyForecasts = useMemo(() => {
    if (!forecast) return [];
    const days: any[] = [];
    let currentDayDate = "";
    let currentDayData: any = null;

    forecast.forecast.forEach(point => {
      const date = new Date(point.time).toLocaleDateString();
      if (date !== currentDayDate) {
        if (currentDayData) days.push(currentDayData);
        currentDayDate = date;
        currentDayData = {
          date: new Date(point.time),
          label: days.length === 0 ? "Today" : days.length === 1 ? "Tomorrow" : `Day ${days.length + 1}`,
          points: [],
          maxTemp: -Infinity,
          minTemp: Infinity,
          totalRain: 0,
          maxWind: 0
        };
      }
      currentDayData.points.push(point);
      if (point.temperature !== undefined) {
        currentDayData.maxTemp = Math.max(currentDayData.maxTemp, point.temperature);
        currentDayData.minTemp = Math.min(currentDayData.minTemp, point.temperature);
      }
      if (point.rainfall !== undefined) currentDayData.totalRain += point.rainfall;
      if (point.windSpeed !== undefined) currentDayData.maxWind = Math.max(currentDayData.maxWind, point.windSpeed);
    });
    if (currentDayData) days.push(currentDayData);
    return days;
  }, [forecast]);

  // Filter chart data if a specific day is clicked
  const displayData = selectedDayIndex !== null && dailyForecasts[selectedDayIndex] 
    ? dailyForecasts[selectedDayIndex].points 
    : forecast?.forecast || [];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold text-text-primary mb-2">Detailed Forecast</h1>
        <p className="text-text-secondary">Analyze blended forecast data and model contributions</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 bg-surface p-4 rounded-xl border border-border shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary">
            <MapPin className="w-4 h-4" />
          </div>
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            disabled={isLoadingLocations}
            className="pl-9 pr-10 py-2 bg-gray-50 border border-border rounded-lg text-sm font-medium text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48"
          >
            {locations?.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}, {loc.state}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
        </div>

        <div className="relative">
          <select
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value as WeatherVariable)}
            className="pl-4 pr-10 py-2 bg-gray-50 border border-border rounded-lg text-sm font-medium text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="Rainfall">Rainfall</option>
            <option value="Temperature">Temperature</option>
            <option value="Wind">Wind</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary">
            <Calendar className="w-4 h-4" />
          </div>
          <select
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(Number(e.target.value))}
            className="pl-9 pr-10 py-2 bg-gray-50 border border-border rounded-lg text-sm font-medium text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value={24}>Next 24 hours</option>
            <option value={72}>Next 3 days</option>
            <option value={120}>Next 5 days</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
        </div>
      </div>

      {isLoadingForecast && (
        <div className="animate-pulse space-y-8">
          {/* Current Forecast Summary Skeleton */}
          <div className="h-32 bg-gray-200 rounded-xl"></div>
          
          {/* Timeline Skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="h-36 bg-gray-200 rounded-xl"></div>
              <div className="h-36 bg-gray-200 rounded-xl"></div>
              <div className="h-36 bg-gray-200 rounded-xl"></div>
              <div className="h-36 bg-gray-200 rounded-xl"></div>
              <div className="h-36 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
          
          {/* Chart Skeleton */}
          <div className="h-[450px] bg-gray-200 rounded-xl"></div>
          
          {/* Bottom Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px] bg-gray-200 rounded-xl"></div>
            <div className="h-[300px] bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      )}
      
      {!isLoadingForecast && forecast && (
        <div className="space-y-8">
          
          {forecast.missing_sources && forecast.missing_sources.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl flex items-center gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm">
                <span className="font-semibold">Data Status Issue: </span>
                The following data sources were unavailable for this forecast: {forecast.missing_sources.join(", ")}. Weights have been dynamically redistributed.
              </div>
            </div>
          )}

          {/* Run Status & Warnings Bar */}
          <div className="flex flex-col md:flex-row justify-between gap-4 bg-surface p-4 rounded-xl border border-border shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-text-secondary">
              <div>
                <span className="block font-medium text-text-primary mb-0.5">Forecast run</span>
                {new Date(forecast.run.initialization_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} UTC
              </div>
              <div>
                <span className="block font-medium text-text-primary mb-0.5">Published</span>
                {new Date(forecast.run.published_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} UTC
              </div>
              <div>
                <span className="block font-medium text-text-primary mb-0.5">Sources</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${forecast.missing_sources.length > 0 ? 'bg-status-warning' : 'bg-status-success'}`}></span>
                  {4 - forecast.missing_sources.length} / 4 available
                </div>
              </div>
              
              <div className="flex items-end ml-2">
                <button 
                  onClick={() => refetchForecast()}
                  aria-label="Refresh forecast data"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-md transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
                  <span className="font-medium">Refresh</span>
                </button>
              </div>
            </div>

            {forecast.warning?.active ? (
              <div className="bg-red-50 border border-red-200 text-status-danger px-4 py-3 rounded-lg flex gap-3 max-w-md">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Official {forecast.warning.title}</h4>
                  <p className="text-xs mt-1 text-red-700/80">{forecast.warning.description} Valid for {forecast.warning.district} until {new Date(forecast.warning.valid_until!).toLocaleTimeString()}.</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-border text-text-secondary px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
                <Activity className="w-4 h-4" />
                <span>Official IMD Warnings: No active warning for {forecast.location.name}</span>
              </div>
            )}
          </div>

          {/* Current Forecast Summary */}
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-wrap items-center justify-between gap-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
            <div>
               <h2 className="text-xl font-semibold text-text-primary mb-1">Current Forecast Summary</h2>
               <p className="text-text-secondary text-sm">{forecast.location.name}, {forecast.location.state}</p>
            </div>
            <div className="flex flex-wrap gap-8">
               <div className="flex items-center gap-3">
                 <Thermometer className="w-8 h-8 text-red-500 opacity-80" />
                 <div>
                   <div className="text-2xl font-semibold text-text-primary">{forecast.summary.temperature.toFixed(1)}°C</div>
                   <div className="text-xs text-text-secondary uppercase tracking-wide">Temperature</div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <CloudRain className="w-8 h-8 text-blue-500 opacity-80" />
                 <div>
                   <div className="text-2xl font-semibold text-text-primary">{forecast.summary.rainfall.toFixed(1)} mm</div>
                   <div className="text-xs text-text-secondary uppercase tracking-wide">Rainfall</div>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Wind className="w-8 h-8 text-green-500 opacity-80" />
                 <div>
                   <div className="text-2xl font-semibold text-text-primary">{forecast.summary.wind_speed.toFixed(1)} km/h</div>
                   <div className="text-xs text-text-secondary uppercase tracking-wide">Wind Speed</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Forecast Timeline */}
          <div>
            <div className="flex justify-between items-end mb-4">
               <div>
                 <h2 className="text-lg font-semibold text-text-primary">Forecast Timeline</h2>
                 <p className="text-sm text-text-secondary">Click a day to filter the chart below</p>
               </div>
               {selectedDayIndex !== null && (
                 <button 
                   onClick={() => setSelectedDayIndex(null)} 
                   className="text-sm text-primary hover:underline font-medium bg-primary-light/50 px-3 py-1.5 rounded-md"
                 >
                   View Full Period
                 </button>
               )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {dailyForecasts.slice(0, 5).map((day, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedDayIndex === idx 
                      ? 'border-primary bg-primary-light/40 ring-1 ring-primary shadow-sm' 
                      : 'border-border bg-surface hover:border-primary/40 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <div className="font-semibold text-text-primary mb-0.5">{day.label}</div>
                  <div className="text-xs text-text-secondary mb-4">{day.date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                  
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-red-400"/> Temp</span>
                      <span className="font-medium text-text-primary">{day.maxTemp.toFixed(0)}° / {day.minTemp.toFixed(0)}°</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5 text-blue-400"/> Rain</span>
                      <span className="font-medium text-text-primary">{day.totalRain.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-green-400"/> Wind</span>
                      <span className="font-medium text-text-primary">{day.maxWind.toFixed(1)} km/h</span>
                    </div>
                    
                    {/* Event Probability / Warning indicator */}
                    {forecast.event_probability && forecast.event_probability["Heavy Rain"] > 0.5 && idx < 2 && (
                       <div className="mt-3 pt-2 border-t border-border flex items-start gap-1.5 text-status-warning text-xs font-medium">
                         <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                         High Rain Risk
                       </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[450px]">
            <ForecastChart 
              data={displayData} 
              variable={selectedVariable}
              uncertainty={forecast.uncertainty ? forecast.uncertainty[selectedVariable] : undefined}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModelComparison 
              models={forecast.models} 
              variable={selectedVariable} 
              missingSources={forecast.missing_sources}
            />
            <ModelWeights 
              weights={forecast.source_weights} 
              locationName={forecast.location.name}
              variable={selectedVariable}
              runTime={forecast.run.initialization_time}
              leadTime={`${forecastPeriod}h`}
              modelVersion={forecast.run.model_version}
            />
          </div>
        </div>
      )}
      
      {!isLoadingForecast && isError && (
        <div className="text-center py-20 bg-surface border border-border rounded-xl mt-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <AlertTriangle className="w-12 h-12 text-status-danger mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Unable to load forecast data.</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">There was an issue retrieving the latest forecast information. Please ensure the backend services are running.</p>
          <button 
            onClick={() => refetchForecast()}
            className="px-6 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoadingForecast && !isError && forecast && forecast.forecast.length === 0 && (
        <div className="text-center py-20 bg-surface border border-border rounded-xl mt-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300">
          <CloudRain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No forecast available for this location.</h3>
          <p className="text-text-secondary mb-6">Select another location to view data.</p>
        </div>
      )}
    </div>
  );
}
