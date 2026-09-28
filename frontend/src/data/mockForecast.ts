import type { ForecastResponse, Location } from "../types/weather";

// DEMO DATA ONLY — replace with API responses when backend integration is enabled.

const locations: Location[] = [
  { id: "kolkata", name: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639 },
  { id: "delhi", name: "Delhi", state: "Delhi", latitude: 28.6139, longitude: 77.2090 },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", latitude: 19.0760, longitude: 72.8777 },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", latitude: 12.9716, longitude: 77.5946 },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", latitude: 20.2961, longitude: 85.8245 },
  { id: "guwahati", name: "Guwahati", state: "Assam", latitude: 26.1445, longitude: 91.7362 },
];

const generateForecastData = (baseTemp: number, baseRain: number, baseWind: number) => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < 120; i += 6) { // 5 days, every 6 hours
    const time = new Date(now.getTime() + i * 3600000);
    const timeStr = time.toISOString();
    
    // Create realistic-looking daily cycles
    const hour = time.getHours();
    const tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 5; 
    
    data.push({
      time: timeStr,
      rainfall: Math.max(0, baseRain + (Math.random() * 5 - 2.5)),
      temperature: baseTemp + tempVariation + (Math.random() * 2 - 1),
      windSpeed: Math.max(0, baseWind + (Math.random() * 2 - 1)),
      windDirection: Math.random() * 360
    });
  }
  return data;
};

export const getMockLocations = (): Location[] => {
  return locations;
};

export const getMockForecast = (locationId: string): ForecastResponse => {
  const location = locations.find(l => l.id === locationId) || locations[0];
  
  // Create location-specific base variations
  let baseTemp = 30;
  let baseRain = 2;
  let baseWind = 5;
  
  if (location.id === "delhi") {
    baseTemp = 35; baseRain = 0;
  } else if (location.id === "mumbai") {
    baseTemp = 28; baseRain = 15; baseWind = 12;
  } else if (location.id === "guwahati") {
    baseTemp = 26; baseRain = 20;
  }
  
  return {
    location,
    run: {
      id: "demo-run-001",
      initialization_time: new Date(new Date().setHours(0,0,0,0)).toISOString(),
      published_at: new Date(new Date().setHours(1,0,0,0)).toISOString(),
      model_version: "blend-v1"
    },
    summary: {
      rainfall: parseFloat((baseRain * 4).toFixed(1)),
      temperature: parseFloat(baseTemp.toFixed(1)),
      wind_speed: parseFloat(baseWind.toFixed(1))
    },
    forecast: generateForecastData(baseTemp, baseRain, baseWind),
    uncertainty: {
      "Rainfall": {
        lowerBound: Math.max(0, (baseRain * 4) - 5),
        upperBound: (baseRain * 4) + 8,
        confidence: "Medium"
      },
      "Temperature": {
        lowerBound: baseTemp - 2,
        upperBound: baseTemp + 2,
        confidence: "High"
      }
    },
    event_probability: {
      "Heavy Rain": baseRain > 10 ? 0.8 : 0.1,
      "Heatwave": baseTemp > 38 ? 0.7 : 0.05
    },
    source_weights: {
      "GFS": 0.20,
      "GEFS": 0.15,
      "IFS": 0.30,
      "AIFS": 0.35
    },
    models: [
      { model: "GFS", value: parseFloat(((baseRain * 4) + 1.8).toFixed(1)), unit: "mm", initializationTime: new Date(new Date().setHours(0,0,0,0)).toISOString(), isEnsemble: false, isAi: false },
      // Simulate missing GEFS for Delhi
      ...(locationId === "delhi" ? [] : [{ model: "GEFS" as const, value: parseFloat(((baseRain * 4) - 0.7).toFixed(1)), unit: "mm", initializationTime: new Date(new Date().setHours(0,0,0,0)).toISOString(), isEnsemble: true, isAi: false }]),
      { model: "IFS", value: parseFloat(((baseRain * 4) - 1.5).toFixed(1)), unit: "mm", initializationTime: new Date(new Date().setHours(0,0,0,0)).toISOString(), isEnsemble: false, isAi: false },
      { model: "AIFS", value: parseFloat(((baseRain * 4) + 0.7).toFixed(1)), unit: "mm", initializationTime: new Date(new Date().setHours(0,0,0,0)).toISOString(), isEnsemble: false, isAi: true },
      { model: "BLEND", value: parseFloat((baseRain * 4).toFixed(1)), unit: "mm", isEnsemble: false, isAi: false }
    ],
    missing_sources: locationId === "delhi" ? ["GEFS"] : [],
    warning: {
      source: "IMD",
      warnings: location.id === "mumbai" ? [{
        id: "warning-001",
        region: location.name,
        type: "Heavy Rainfall",
        severity: "orange",
        valid_until: new Date(new Date().getTime() + 86400000).toISOString()
      }] : []
    }
  };
};
