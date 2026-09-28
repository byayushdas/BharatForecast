from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HealthResponseSchema(BaseModel):
    status: str
    service: str
    version: str

class LocationSchema(BaseModel):
    id: str
    name: str
    state: str
    latitude: float
    longitude: float

class ForecastRunSchema(BaseModel):
    id: str
    initialization_time: str
    published_at: str = Field(..., alias="published_at")
    model_version: str

class ForecastSummarySchema(BaseModel):
    rainfall: float
    temperature: float
    wind_speed: float

class ForecastPointSchema(BaseModel):
    time: str
    rainfall: Optional[float] = None
    temperature: Optional[float] = None
    windSpeed: Optional[float] = Field(None, alias="windSpeed")
    windDirection: Optional[float] = Field(None, alias="windDirection")
    
    class Config:
        populate_by_name = True

class ForecastUncertaintySchema(BaseModel):
    lowerBound: float = Field(..., alias="lowerBound")
    upperBound: float = Field(..., alias="upperBound")
    confidence: str
    
    class Config:
        populate_by_name = True

class WarningItemSchema(BaseModel):
    id: str
    region: str
    type: str
    severity: str
    valid_until: str

class OfficialWarningSchema(BaseModel):
    source: str
    warnings: List[WarningItemSchema]

class ModelForecastSchema(BaseModel):
    model: str
    value: float
    unit: str
    initializationTime: Optional[str] = Field(None, alias="initializationTime")
    isAi: Optional[bool] = Field(None, alias="isAi")
    isEnsemble: Optional[bool] = Field(None, alias="isEnsemble")
    
    class Config:
        populate_by_name = True

class ForecastResponseSchema(BaseModel):
    location: LocationSchema
    run: ForecastRunSchema
    summary: ForecastSummarySchema
    forecast: List[ForecastPointSchema]
    uncertainty: Optional[Dict[str, ForecastUncertaintySchema]] = None
    event_probability: Optional[Dict[str, float]] = None
    source_weights: Dict[str, float]
    models: List[ModelForecastSchema]
    missing_sources: List[str]
    warning: Optional[OfficialWarningSchema] = None

class ModelComparisonResponseSchema(BaseModel):
    location: LocationSchema
    run: ForecastRunSchema
    models: List[ModelForecastSchema]
    variable: str

class LatestRunResponseSchema(BaseModel):
    run_id: str
    initialization_time: str
    published_at: str
    model_version: str
    sources_available: int
    sources_expected: int
    status: str
