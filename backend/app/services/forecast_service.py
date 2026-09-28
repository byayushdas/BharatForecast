import os
import math
from datetime import datetime, timedelta
from typing import List, Dict, Any

from app.schemas.forecast import (
    LocationSchema, ForecastResponseSchema, ForecastRunSchema,
    ForecastSummarySchema, ForecastPointSchema, ForecastUncertaintySchema,
    OfficialWarningSchema, ModelForecastSchema, ModelComparisonResponseSchema,
    LatestRunResponseSchema
)

# DEMO DATA ONLY
# Replace this data source with the production forecast pipeline/API.

LOCATIONS = [
    {"id": "kolkata", "name": "Kolkata", "state": "West Bengal", "latitude": 22.5726, "longitude": 88.3639},
    {"id": "delhi", "name": "Delhi", "state": "Delhi", "latitude": 28.6139, "longitude": 77.2090},
    {"id": "mumbai", "name": "Mumbai", "state": "Maharashtra", "latitude": 19.0760, "longitude": 72.8777},
    {"id": "bengaluru", "name": "Bengaluru", "state": "Karnataka", "latitude": 12.9716, "longitude": 77.5946},
    {"id": "bhubaneswar", "name": "Bhubaneswar", "state": "Odisha", "latitude": 20.2961, "longitude": 85.8245},
    {"id": "guwahati", "name": "Guwahati", "state": "Assam", "latitude": 26.1445, "longitude": 91.7362},
]

def generate_forecast_data(base_temp: float, base_rain: float, base_wind: float, hours: int = 120):
    data = []
    now = datetime.utcnow()
    for i in range(0, hours, 6):
        time = now + timedelta(hours=i)
        hour = time.hour
        temp_variation = math.sin((hour - 6) * math.pi / 12) * 5
        import random
        
        data.append(ForecastPointSchema(
            time=time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            rainfall=max(0, base_rain + (random.random() * 5 - 2.5)),
            temperature=base_temp + temp_variation + (random.random() * 2 - 1),
            windSpeed=max(0, base_wind + (random.random() * 2 - 1)),
            windDirection=random.random() * 360
        ))
    return data

class ForecastService:
    @staticmethod
    def get_locations(query: str = None) -> List[LocationSchema]:
        locs = [LocationSchema(**l) for l in LOCATIONS]
        if query:
            query = query.lower()
            return [l for l in locs if query in l.name.lower()]
        return locs

    @staticmethod
    def _find_location(lat: float, lon: float, location_id: str = None) -> LocationSchema:
        if location_id:
            loc_data = next((l for l in LOCATIONS if l["id"] == location_id), None)
            if not loc_data:
                from app.main import APIError
                raise APIError(code="LOCATION_NOT_FOUND", message=f"No forecast data is available for location ID: {location_id}", status_code=404)
            return LocationSchema(**loc_data)
            
        # simple nearest neighbor
        best_loc = LOCATIONS[0]
        min_dist = float('inf')
        for l in LOCATIONS:
            dist = (l["latitude"] - lat)**2 + (l["longitude"] - lon)**2
            if dist < min_dist:
                min_dist = dist
                best_loc = l
        return LocationSchema(**best_loc)

from abc import ABC, abstractmethod

class ForecastProvider(ABC):
    @abstractmethod
    def get_forecast(self, lat: float, lon: float, hours: int, variable: str, location_id: str = None) -> ForecastResponseSchema:
        pass
        
    @abstractmethod
    def get_model_comparison(self, location_id: str, variable: str) -> ModelComparisonResponseSchema:
        pass
        
    @abstractmethod
    def get_latest_run(self) -> LatestRunResponseSchema:
        pass

class MockProvider(ForecastProvider):
    def get_forecast(self, lat: float, lon: float, hours: int, variable: str, location_id: str = None) -> ForecastResponseSchema:
        loc = ForecastService._find_location(lat, lon, location_id)
            
        loc = ForecastService._find_location(lat, lon, location_id)
        
        base_temp = 30.0
        base_rain = 2.0
        base_wind = 5.0
        
        if loc.id == "delhi":
            base_temp = 35.0
            base_rain = 0.0
        elif loc.id == "mumbai":
            base_temp = 28.0
            base_rain = 15.0
            base_wind = 12.0
        elif loc.id == "guwahati":
            base_temp = 26.0
            base_rain = 20.0
            
        run = ForecastRunSchema(
            id="demo-run-001",
            initialization_time=datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT%H:%M:%SZ"),
            published_at=datetime.utcnow().replace(hour=1, minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT%H:%M:%SZ"),
            model_version="blend-v1-demo"
        )
        
        summary = ForecastSummarySchema(
            rainfall=float(f"{base_rain * 4:.1f}"),
            temperature=float(f"{base_temp:.1f}"),
            wind_speed=float(f"{base_wind:.1f}")
        )
        
        forecast = generate_forecast_data(base_temp, base_rain, base_wind, hours)
        
        uncertainty = {
            "Rainfall": ForecastUncertaintySchema(
                lowerBound=max(0, (base_rain * 4) - 5),
                upperBound=(base_rain * 4) + 8,
                confidence="Medium"
            ),
            "Temperature": ForecastUncertaintySchema(
                lowerBound=base_temp - 2,
                upperBound=base_temp + 2,
                confidence="High"
            )
        }
        
        event_probability = {
            "Heavy Rain": 0.8 if base_rain > 10 else 0.1,
            "Heatwave": 0.7 if base_temp > 38 else 0.05
        }
        
        weights = {
            "GFS": 0.20,
            "GEFS": 0.15,
            "IFS": 0.30,
            "AIFS": 0.35
        }
        
        init_time = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT%H:%M:%SZ")
        
        unit_map = {
            "rainfall": "mm",
            "temperature": "°C",
            "wind": "m/s"
        }
        var_unit = unit_map.get(variable.lower(), "mm")
        
        base_val = base_rain * 4
        if variable.lower() == "temperature":
            base_val = base_temp
        elif variable.lower() == "wind":
            base_val = base_wind
            
        models = [
            ModelForecastSchema(model="GFS", value=float(f"{base_val+1.8:.1f}"), unit=var_unit, initializationTime=init_time, isEnsemble=False, isAi=False)
        ]
        
        missing = []
        if loc.id == "delhi":
            missing.append("GEFS")
            weights = {
                "GFS": 0.25,
                "GEFS": 0.00,
                "IFS": 0.35,
                "AIFS": 0.40
            }
        else:
            models.append(ModelForecastSchema(model="GEFS", value=float(f"{base_val-0.7:.1f}"), unit=var_unit, initializationTime=init_time, isEnsemble=True, isAi=False))
            
        models.extend([
            ModelForecastSchema(model="IFS", value=float(f"{base_val-1.5:.1f}"), unit=var_unit, initializationTime=init_time, isEnsemble=False, isAi=False),
            ModelForecastSchema(model="AIFS", value=float(f"{base_val+0.7:.1f}"), unit=var_unit, initializationTime=init_time, isEnsemble=False, isAi=True),
        ])
        
        blend_val = sum(weights.get(m.model, 0.0) * m.value for m in models)
        models.append(ModelForecastSchema(model="BLEND", value=float(f"{blend_val:.1f}"), unit=var_unit, isEnsemble=False, isAi=False))
        
        from app.schemas.forecast import WarningItemSchema
        
        warning_item = WarningItemSchema(
            id="warning-001",
            region=loc.name,
            type="Heavy Rainfall",
            severity="orange",
            valid_until=datetime.utcnow().replace(hour=18, minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT%H:%M:%SZ")
        )
        
        warning = OfficialWarningSchema(
            source="IMD",
            warnings=[warning_item] if base_rain > 10 else []
        )
        
        unit_map = {
            "rainfall": "mm",
            "temperature": "°C",
            "wind": "m/s"
        }
        
        return ForecastResponseSchema(
            location=loc,
            variable=variable.lower(),
            unit=unit_map.get(variable.lower(), ""),
            run=run,
            summary=summary,
            forecast=forecast,
            uncertainty=uncertainty,
            event_probability=event_probability,
            source_weights=weights,
            models=models,
            missing_sources=missing,
            warning=warning
        )

    def get_model_comparison(self, location_id: str, variable: str) -> ModelComparisonResponseSchema:
        loc = ForecastService._find_location(0, 0, location_id)
        forecast_resp = self.get_forecast(loc.latitude, loc.longitude, 120, variable, location_id)
        
        return ModelComparisonResponseSchema(
            location=forecast_resp.location,
            run=forecast_resp.run,
            models=forecast_resp.models,
            variable=variable
        )
        
    def get_latest_run(self) -> LatestRunResponseSchema:
        return LatestRunResponseSchema(
            run_id="demo-run-001",
            initialization_time=datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT%H:%M:%SZ"),
            published_at=datetime.utcnow().replace(hour=1, minute=0, second=0, microsecond=0).strftime("%Y-%m-%dT%H:%M:%SZ"),
            model_version="blend-v1-demo",
            sources_available=4,
            sources_expected=4,
            status="complete"
        )

    @staticmethod
    def get_provider() -> ForecastProvider:
        if os.environ.get("USE_MOCK_DATA", "true").lower() == "true":
            return MockProvider()
        raise NotImplementedError("Open-Meteo adapter not yet implemented. Please set USE_MOCK_DATA=true.")

    @staticmethod
    def get_forecast(lat: float, lon: float, hours: int, variable: str, location_id: str = None) -> ForecastResponseSchema:
        return ForecastService.get_provider().get_forecast(lat, lon, hours, variable, location_id)

    @staticmethod
    def get_model_comparison(location_id: str, variable: str) -> ModelComparisonResponseSchema:
        return ForecastService.get_provider().get_model_comparison(location_id, variable)

    @staticmethod
    def get_latest_run() -> LatestRunResponseSchema:
        return ForecastService.get_provider().get_latest_run()

