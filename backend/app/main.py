from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import forecast, models, health

load_dotenv()

app = FastAPI(
    title=os.environ.get("APP_NAME", "Bharat Forecast API"),
    version=os.environ.get("APP_VERSION", "1.0.0"),
    description="Backend API for the Bharat Forecast hybrid forecasting system."
)

frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
origins = [origin.strip() for origin in frontend_origin.split(",")] if frontend_origin else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(forecast.router, prefix="/api/v1", tags=["Forecast"])
app.include_router(models.router, prefix="/api/v1/models", tags=["Models"])

@app.get("/")
def root():
    return {"message": "Welcome to Bharat Forecast API. Visit /docs for documentation."}
