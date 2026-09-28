from fastapi import APIRouter, Query
from app.schemas.forecast import ModelComparisonResponseSchema
from app.services.forecast_service import ForecastService

router = APIRouter()

@router.get("/compare", response_model=ModelComparisonResponseSchema)
def get_model_comparison(
    location_id: str = Query(...),
    variable: str = Query("rainfall")
):
    return ForecastService.get_model_comparison(location_id, variable)
