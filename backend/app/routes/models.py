from fastapi import APIRouter, Query
from app.schemas.forecast import ModelComparisonResponseSchema
from app.services.forecast_service import ForecastService

router = APIRouter()

from app.main import APIError

@router.get("/compare", response_model=ModelComparisonResponseSchema)
def get_model_comparison(
    location_id: str = Query(...),
    variable: str = Query("rainfall")
):
    if variable.lower() not in ["rainfall", "temperature", "wind"]:
        raise APIError(code="UNSUPPORTED_VARIABLE", message="The requested variable is not supported.")
    return ForecastService.get_model_comparison(location_id, variable)
