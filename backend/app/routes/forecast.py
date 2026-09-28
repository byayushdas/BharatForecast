from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict

from app.schemas.forecast import (
    ForecastResponseSchema,
    LocationSchema,
    OfficialWarningSchema,
    LatestRunResponseSchema,
    VerificationResponseSchema,
    VerificationMetricsSchema
)
from app.services.forecast_service import ForecastService

router = APIRouter()

from app.main import APIError

@router.get("/forecast", response_model=ForecastResponseSchema, summary="Retrieve the blended forecast for a location.")
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

@router.get("/locations", response_model=List[LocationSchema], summary="Search and retrieve supported forecast locations.")
def get_locations(query: str = None):
    return ForecastService.get_locations(query)

@router.get("/weights", response_model=Dict[str, float], summary="Retrieve model contribution weights for a location.")
def get_weights(location_id: str, variable: str):
    # For now, return mock weights directly by looking up the mock forecast
    forecast = ForecastService.get_forecast(0, 0, 120, variable, location_id)
    return forecast.source_weights

@router.get("/official-warnings", response_model=OfficialWarningSchema, summary="Retrieve official IMD warnings for a location.")
def get_official_warnings(location_id: str):
    forecast = ForecastService.get_forecast(0, 0, 120, "rainfall", location_id)
    return forecast.warning

@router.get("/runs/latest", response_model=LatestRunResponseSchema, summary="Retrieve the latest forecast run status.")
def get_latest_run():
    return ForecastService.get_latest_run()

@router.get("/verification", response_model=VerificationResponseSchema, summary="Retrieve forecast verification metrics (Future).")
def get_verification(location_id: str, variable: str, period: str = "last_30_days"):
    # STUB: Returns a 501 Not Implemented or empty mock until the full verification system is integrated
    raise HTTPException(status_code=501, detail="Verification system not yet implemented in prototype.")