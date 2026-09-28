export interface Location {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
}

export type WeatherVariable = "Rainfall" | "Temperature" | "Wind";

export interface ForecastPoint {
  time: string;
  rainfall?: number;
  temperature?: number;
  windSpeed?: number;
  windDirection?: number;
}

export interface ModelForecast {
  model: "GFS" | "GEFS" | "IFS" | "AIFS" | "BLEND";
  value: number;
  unit: string;
  initializationTime?: string;
  isAi?: boolean;
  isEnsemble?: boolean;
}

export interface ModelWeight {
  model: "GFS" | "GEFS" | "IFS" | "AIFS";
  weight: number;
}

export interface ForecastUncertainty {
  lowerBound: number;
  upperBound: number;
  confidence: string; // e.g., "High", "Medium", "Low"
}

export interface ForecastRun {
  id: string;
  initialization_time: string;
  published_at: string;
  model_version: string;
}

export interface ForecastSummary {
  rainfall: number;
  temperature: number;
  wind_speed: number;
}

export interface WarningItem {
  id: string;
  region: string;
  type: string;
  severity: string;
  valid_until: string;
}

export interface OfficialWarning {
  source: string;
  warnings: WarningItem[];
}

export interface ForecastResponse {
  location: Location;
  run: ForecastRun;
  summary: ForecastSummary;
  forecast: ForecastPoint[];
  uncertainty?: Record<string, ForecastUncertainty>; // Key could be variable name
  event_probability?: Record<string, number>;
  source_weights: Record<string, number>;
  models: ModelForecast[];
  missing_sources: string[];
  warning?: OfficialWarning;
}

export interface ModelComparisonResponse {
  location: Location;
  run: ForecastRun;
  models: ModelForecast[];
  variable: string;
}

