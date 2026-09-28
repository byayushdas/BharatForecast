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

from fastapi.responses import JSONResponse
from fastapi import Request

class APIError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code

@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message
            }
        }
    )

from fastapi.exceptions import RequestValidationError

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    code = "INVALID_REQUEST"
    message = "The request was invalid."
    
    for err in errors:
        loc = err.get("loc", [])
        if "lat" in loc or "lon" in loc:
            code = "INVALID_COORDINATES"
            message = "The provided coordinates are invalid or out of bounds."
            break
            
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": code,
                "message": message
            }
        }
    )

app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(forecast.router, prefix="/api/v1", tags=["Forecast"])
app.include_router(models.router, prefix="/api/v1/models", tags=["Models"])

@app.get("/")
def root():
    return {"message": "Welcome to Bharat Forecast API. Visit /docs for documentation."}
