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
          <div className="space-y-12">
            
            {/* 1. Where am I forecasting? */}
            <div className="h-[400px]">
              <WeatherMap 
                location={forecast.location} 
                locations={locations}
                variable={selectedVariable} 
                onLocationSelect={setSelectedLocationId}
              />
            </div>

            {/* 2. What will the weather be? */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-text-primary">What will the weather be?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
              </div>
              <div className="h-[400px]">
                <ForecastChart 
                  data={forecast.forecast} 
                  variable={selectedVariable}
                  uncertainty={forecast.uncertainty ? forecast.uncertainty[selectedVariable] : undefined}
                />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 3. What do the individual models predict? */}
              <section>
                <h2 className="text-xl font-semibold mb-4 text-text-primary">What do the individual models predict?</h2>
                <ModelComparison 
                  models={forecast.models} 
                  variable={selectedVariable} 
                  missingSources={forecast.missing_sources}
                />
              </section>

              {/* 4. How did Bharat Forecast combine them? */}
              <section className="h-full">
                <h2 className="text-xl font-semibold mb-4 text-text-primary">How did Bharat Forecast combine them?</h2>
                <ModelWeights 
                  weights={forecast.source_weights} 
                  locationName={forecast.location.name}
                  variable={selectedVariable}
                  runTime={forecast.run.initialization_time}
                  leadTime={`${forecastPeriod}h`}
                  modelVersion={forecast.run.model_version}
                />
              </section>
            </div>

            {/* 5. How uncertain is the forecast? */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-text-primary">How uncertain is the forecast?</h2>
              {forecast.uncertainty && forecast.uncertainty[selectedVariable] ? (
                <div className="bg-surface border border-border p-5 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <h3 className="font-medium text-text-primary">{selectedVariable} Range</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-3">
                    Based on ensemble spread and historical performance, the expected range is:
                  </p>
                  <div className="text-2xl font-semibold text-text-primary">
                    {forecast.uncertainty[selectedVariable].lowerBound.toFixed(1)} - {forecast.uncertainty[selectedVariable].upperBound.toFixed(1)}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-border text-xs font-medium">
                    <span className={`w-2 h-2 rounded-full ${
                      forecast.uncertainty[selectedVariable].confidence === 'High' ? 'bg-status-success' : 
                      forecast.uncertainty[selectedVariable].confidence === 'Medium' ? 'bg-status-warning' : 'bg-status-danger'
                    }`}></span>
                    {forecast.uncertainty[selectedVariable].confidence} Confidence
                  </div>
                </div>
              ) : (
                 <div className="bg-surface border border-border p-5 rounded-xl text-text-secondary text-sm shadow-sm">
                   Uncertainty data is currently unavailable for {selectedVariable}.
                 </div>
              )}
            </section>

            {/* 6. Are there any official warnings? */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Are there any official warnings?</h2>
              {forecast.warning?.active ? (
                <div className="bg-red-50 border border-red-200 text-status-danger px-5 py-4 rounded-xl flex gap-4 shadow-sm">
                  <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-base mb-1">Official {forecast.warning.title}</h4>
                    <p className="text-sm text-red-700/90 leading-relaxed">
                      {forecast.warning.description} Valid for {forecast.warning.district} until {new Date(forecast.warning.valid_until!).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}.
                    </p>
                    <div className="mt-2 text-xs font-medium uppercase tracking-wider text-red-700/70">Source: India Meteorological Department (IMD)</div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-border text-text-secondary px-5 py-4 rounded-xl flex items-center gap-3 text-sm shadow-sm">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <span>No active official IMD warnings for {forecast.location.name}.</span>
                </div>
              )}
            </section>

            {/* 7. When was this forecast generated? */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-text-primary">When was this forecast generated?</h2>
              <div className="bg-surface border border-border p-5 rounded-xl shadow-sm text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="block text-text-secondary mb-1">Model Run (Initialization)</span>
                    <span className="font-medium text-text-primary">{new Date(forecast.run.initialization_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} UTC</span>
                  </div>
                  <div>
                    <span className="block text-text-secondary mb-1">Published At</span>
                    <span className="font-medium text-text-primary">{new Date(forecast.run.published_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} UTC</span>
                  </div>
                  <div>
                    <span className="block text-text-secondary mb-1">Model Version</span>
                    <span className="font-medium text-text-primary">{forecast.run.model_version}</span>
                  </div>
                  <div>
                    <span className="block text-text-secondary mb-1">Data Sources</span>
                    <div className="flex items-center gap-1.5 font-medium text-text-primary">
                      <span className={`w-2 h-2 rounded-full ${forecast.missing_sources.length > 0 ? 'bg-status-warning' : 'bg-status-success'}`}></span>
                      {4 - forecast.missing_sources.length} / 4 available
                    </div>
                  </div>
                </div>
                {forecast.missing_sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border flex gap-2 text-status-warning">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Missing sources during run: <strong>{forecast.missing_sources.join(", ")}</strong>. Weights were dynamically redistributed.</span>
                  </div>
                )}
              </div>
            </section>

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
