import { getMockLocations, getMockForecast } from "../data/mockForecast";
import type { ForecastResponse, Location, ModelComparisonResponse, ForecastRun, OfficialWarning } from "../types/weather";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const getLocations = async (query?: string): Promise<Location[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const locations = getMockLocations();
        if (query) {
          resolve(locations.filter(l => l.name.toLowerCase().includes(query.toLowerCase())));
        } else {
          resolve(locations);
        }
      }, 500);
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/locations${query ? `?query=${query}` : ''}`);
  if (!response.ok) throw new Error('Failed to fetch locations');
  return response.json();
};

export const getForecast = async (locationId: string, hours: number = 120): Promise<ForecastResponse> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockForecast(locationId)), 800);
    });
  }
  
  // Determine lat/lon from mock data dictionary for the backend request if using real API
  const mockLocations = getMockLocations();
  const loc = mockLocations.find(l => l.id === locationId);
  const lat = loc ? loc.latitude : 0;
  const lon = loc ? loc.longitude : 0;
  
  const response = await fetch(`${API_BASE_URL}/api/v1/forecast?lat=${lat}&lon=${lon}&hours=${hours}`);
  if (!response.ok) throw new Error('Failed to fetch forecast');
  return response.json();
};

export const getModelComparison = async (locationId: string, variable: string): Promise<ModelComparisonResponse> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mock = getMockForecast(locationId);
        resolve({
          location: mock.location,
          run: mock.run,
          models: mock.models,
          variable
        });
      }, 500);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/models/compare?location_id=${locationId}&variable=${variable}`);
  if (!response.ok) throw new Error('Failed to fetch model comparison');
  return response.json();
};

export const getModelWeights = async (locationId: string, variable: string): Promise<Record<string, number>> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockForecast(locationId).source_weights), 500);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/weights?location_id=${locationId}&variable=${variable}`);
  if (!response.ok) throw new Error('Failed to fetch model weights');
  return response.json();
};

export const getLatestRun = async (): Promise<ForecastRun> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockForecast("kolkata").run), 300);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/runs/latest`);
  if (!response.ok) throw new Error('Failed to fetch latest run');
  return response.json();
};

export const getOfficialWarnings = async (locationId: string): Promise<OfficialWarning> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const warning = getMockForecast(locationId).warning;
        resolve(warning || { active: false });
      }, 400);
    });
  }
  
  const response = await fetch(`${API_BASE_URL}/api/v1/official-warnings?location_id=${locationId}`);
  if (!response.ok) throw new Error('Failed to fetch official warnings');
  return response.json();
};
