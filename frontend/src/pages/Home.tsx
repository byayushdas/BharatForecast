import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CloudRain, Thermometer, Wind, AlertTriangle, RefreshCw, ChevronDown, Activity, MapPin } from "lucide-react";
import { getForecast, getLocations } from "../lib/api";
import type { WeatherVariable } from "../types/weather";

import WeatherCard from "../components/WeatherCard";
import ForecastChart from "../components/ForecastChart";
import ModelComparison from "../components/ModelComparison";
import ModelWeights from "../components/ModelWeights";
import WeatherMap from "../components/WeatherMap";

export default function Home() {
  const [selectedLocationId, setSelectedLocationId] = useState("kolkata");
  const [selectedVariable, setSelectedVariable] = useState<WeatherVariable>("Rainfall");
  const [forecastPeriod, setForecastPeriod] = useState<number>(120);
  
  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => getLocations()
  });

  const { data: forecast, isLoading: isLoadingForecast, isError, refetch: refetchForecast, isRefetching } = useQuery({
    queryKey: ['forecast', selectedLocationId, forecastPeriod],
    queryFn: () => getForecast(selectedLocationId, forecastPeriod),
    enabled: !!selectedLocationId
  });

  const handleRefresh = () => {
    refetchForecast();
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="bg-surface border-b border-border pt-12 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight mb-4">
            Smarter Forecasts for a Changing India
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Bharat Forecast combines multiple physical and AI weather forecasts to provide a context-aware blended forecast.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-primary hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
              Explore Forecast
            </button>
            <a href="/about" className="bg-white hover:bg-gray-50 text-text-primary border border-border px-5 py-2 rounded-lg font-medium transition-colors">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Control Bar */}
      <div className="bg-surface border-b border-border sticky top-16 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-secondary">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  disabled={isLoadingLocations}
                  className="pl-9 pr-10 py-2 bg-gray-50 border border-border rounded-lg text-sm font-medium text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-40"
                >
                  {locations?.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
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

              <div className="relative hidden sm:block">
                <select
                  value={forecastPeriod}
                  onChange={(e) => setForecastPeriod(Number(e.target.value))}
                  className="pl-4 pr-10 py-2 bg-gray-50 border border-border rounded-lg text-sm font-medium text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value={24}>24 hours</option>
                  <option value={72}>3 days</option>
                  <option value={120}>5 days</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 border border-transparent"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Forecast</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Loading State */}
        {isLoadingForecast && (
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Row 1 Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
              </div>
              <div className="h-[350px] lg:h-auto min-h-[350px] bg-gray-200 rounded-xl"></div>
              
              {/* Row 2 Skeleton */}
              <div className="h-[400px] bg-gray-200 rounded-xl"></div>
              <div className="h-[400px] bg-gray-200 rounded-xl"></div>
              
              {/* Row 3 Skeleton */}
              <div className="lg:col-span-2 h-[300px] bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        )}
        {/* Forecast Content */}
        {!isLoadingForecast && forecast && (
          <div className="space-y-6">
            
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

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Row 1: Summary Cards & Map */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                <WeatherCard 
                  title="Temperature" 
                  value={forecast.summary.temperature} 
                  unit="°C" 
                  icon={<Thermometer className="w-5 h-5 text-red-500" />}
                  subtitle="Current forecast"
                />
                <WeatherCard 
                  title="Rainfall" 
                  value={forecast.summary.rainfall} 
                  unit="mm" 
                  icon={<CloudRain className="w-5 h-5 text-blue-500" />}
                  subtitle="Expected accumulation"
                />
                <WeatherCard 
                  title="Wind" 
                  value={forecast.summary.wind_speed} 
                  unit="km/h" 
                  icon={<Wind className="w-5 h-5 text-green-500" />}
                  subtitle="Speed & direction"
                />
                
                {forecast.uncertainty && forecast.uncertainty[selectedVariable] ? (
                  <WeatherCard 
                    title={`${selectedVariable} Range`} 
                    value={`${forecast.uncertainty[selectedVariable].lowerBound.toFixed(1)} - ${forecast.uncertainty[selectedVariable].upperBound.toFixed(1)}`}
                    icon={<Activity className="w-5 h-5 text-purple-500" />}
                    subtitle={`Forecast uncertainty`}
                  />
                ) : (
                  <WeatherCard 
                    title="Forecast Confidence" 
                    value="N/A"
                    icon={<Activity className="w-5 h-5 text-gray-400" />}
                    subtitle="Data unavailable"
                  />
                )}
              </div>
              <div className="h-[350px] lg:h-auto min-h-[350px]">
                <WeatherMap 
                  location={forecast.location} 
                  locations={locations}
                  variable={selectedVariable} 
                  onLocationSelect={setSelectedLocationId}
                />
              </div>

              {/* Row 2: Chart & Weights */}
              <div className="h-[400px]">
                <ForecastChart 
                  data={forecast.forecast} 
                  variable={selectedVariable}
                  uncertainty={forecast.uncertainty ? forecast.uncertainty[selectedVariable] : undefined}
                />
              </div>
              <div className="h-[400px]">
                <ModelWeights 
                  weights={forecast.source_weights} 
                  locationName={forecast.location.name}
                  variable={selectedVariable}
                  runTime={forecast.run.initialization_time}
                  leadTime={`${forecastPeriod}h`}
                  modelVersion={forecast.run.model_version}
                />
              </div>

              {/* Row 3: Model Comparison */}
              <div className="lg:col-span-2">
                <ModelComparison 
                  models={forecast.models} 
                  variable={selectedVariable} 
                  missingSources={forecast.missing_sources}
                />
              </div>

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
            <p className="text-text-secondary mb-6">Select another location from the menu to view data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
