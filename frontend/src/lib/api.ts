import { getMockLocations, getMockForecast } from "../data/mockForecast";
import type { ForecastResponse, Location, ModelComparisonResponse, ForecastRun, OfficialWarning } from "../types/weather";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchApi<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new ApiError('Unable to retrieve data. Please try again.', response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network connection failed. Please check your internet connection.');
  }
}

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

  return fetchApi<Location[]>('/api/v1/locations', { query });
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
  
  return fetchApi<ForecastResponse>('/api/v1/forecast', { lat, lon, hours });
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
  
  return fetchApi<ModelComparisonResponse>('/api/v1/models/compare', { location_id: locationId, variable });
};

export const getModelWeights = async (locationId: string, variable: string): Promise<Record<string, number>> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockForecast(locationId).source_weights), 500);
    });
  }
  
  return fetchApi<Record<string, number>>('/api/v1/weights', { location_id: locationId, variable });
};

export const getLatestRun = async (): Promise<ForecastRun> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getMockForecast("kolkata").run), 300);
    });
  }
  
  return fetchApi<ForecastRun>('/api/v1/runs/latest');
};

export const getOfficialWarnings = async (locationId: string): Promise<OfficialWarning> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const warning = getMockForecast(locationId).warning;
        resolve(warning || { source: "IMD", warnings: [] });
      }, 400);
    });
  }
  
  return fetchApi<OfficialWarning>('/api/v1/official-warnings', { location_id: locationId });
};
