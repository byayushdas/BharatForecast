import { getMockForecast, getMockLocations } from '../data/mockForecast';
import type { ForecastResponse, Location, WeatherVariable } from '../types/weather';

export const DEFAULT_DEMO = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function fetchApi<T>(endpoint: string, params: Record<string, string | number> = {}, signal?: AbortSignal): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const response = await fetch(url, { signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(12_000)]) : AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`The forecast service returned an error (${response.status}).`);
  return response.json();
}
export async function getLocations(demo = DEFAULT_DEMO, signal?: AbortSignal): Promise<Location[]> {
  return demo ? getMockLocations() : fetchApi<Location[]>('/api/v1/locations', {}, signal);
}
export async function getForecast(location: Location, hours = 120, variable: WeatherVariable = 'Rainfall', demo = DEFAULT_DEMO, signal?: AbortSignal): Promise<ForecastResponse> {
  if (demo) return getMockForecast(location.id, hours, variable);
  return fetchApi<ForecastResponse>('/api/v1/forecast', { location_id: location.id, lat: location.latitude, lon: location.longitude, hours, variable: variable.toLowerCase() }, signal);
}
