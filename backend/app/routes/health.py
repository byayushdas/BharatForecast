from fastapi import APIRouter
from app.schemas.forecast import HealthResponseSchema
import os

router = APIRouter()

@router.get("/health", response_model=HealthResponseSchema)
def check_health():
    return HealthResponseSchema(
        status="ok",
        service=os.environ.get("APP_NAME", "Bharat Forecast API"),
        version=os.environ.get("APP_VERSION", "1.0.0")
    )
