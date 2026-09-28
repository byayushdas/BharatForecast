from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict

from app.schemas.forecast import (
    ForecastResponseSchema,
    LocationSchema,
    OfficialWarningSchema,
    LatestRunResponseSchema
)
from app.services.forecast_service import ForecastService

router = APIRouter()

from app.main import APIError

@router.get("/forecast", response_model=ForecastResponseSchema)
def get_forecast(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    hours: int = Query(120, ge=1),
    variable: str = Query("rainfall"),
    location_id: str = Query(None)
):
    if variable.lower() not in ["rainfall", "temperature", "wind"]:
        raise APIError(code="UNSUPPORTED_VARIABLE", message="The requested variable is not supported.")
    
    return ForecastService.get_forecast(lat, lon, hours, variable, location_id)

@router.get("/locations", response_model=List[LocationSchema])
def get_locations(query: str = None):
    return ForecastService.get_locations(query)

@router.get("/weights", response_model=Dict[str, float])
def get_weights(location_id: str, variable: str):
    # For now, return mock weights directly by looking up the mock forecast
    forecast = ForecastService.get_forecast(0, 0, 120, variable, location_id)
    return forecast.source_weights

@router.get("/official-warnings", response_model=OfficialWarningSchema)
def get_official_warnings(location_id: str):
    forecast = ForecastService.get_forecast(0, 0, 120, "rainfall", location_id)
    return forecast.warning

@router.get("/runs/latest", response_model=LatestRunResponseSchema)
def get_latest_run():
    return ForecastService.get_latest_run()
