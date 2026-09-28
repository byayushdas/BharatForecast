# Bharat Forecast — Backend Build Prompt

## 1. Project Goal

Build the **complete backend** for a modern weather forecasting prototype called **Bharat Forecast**.

This backend is the API layer for a **Hybrid AI–NWP Multi-Model Forecast Blending System**.

The backend should be intentionally lightweight and prototype-friendly.

The immediate objective is:

- provide stable APIs for the React frontend
- serve realistic mock/prepared forecast data
- organize model comparison and model weights
- expose forecast metadata
- expose official-warning data
- expose health/status information
- keep the architecture ready for later integration with real GFS, GEFS, ECMWF IFS, ECMWF AIFS, IMD and IMERG data

The backend does **not** need to implement the full scientific ingestion/training infrastructure in the first version.

The architecture concept is:

```text
Frontend
   ↓
FastAPI
   ↓
Forecast Service
   ↓
Mock / Prepared Forecast Data
   ↓
API Response
```

Later it can become:

```text
Frontend
   ↓
FastAPI
   ↓
Forecast Service
   ↓
Forecast Processing / AI Blending
   ↓
GFS / GEFS / IFS / AIFS
   ↓
IMD / IMERG Verification
```

---

# 2. Existing Folder Structure

Use this exact backend structure:

```text
backend/
├── app/
│   ├── main.py
│   │
│   ├── routes/
│   │   ├── forecast.py
│   │   ├── models.py
│   │   └── health.py
│   │
│   ├── services/
│   │   └── forecast_service.py
│   │
│   └── schemas/
│       └── forecast.py
│
├── requirements.txt
├── Dockerfile
└── README.md
```

Do not introduce PostgreSQL, Redis, Celery, GRIB processing, PostGIS, object storage or training workers into the first prototype unless explicitly needed later.

The architecture document identifies those technologies for the full system, but the first milestone is intentionally much smaller: one reproducible blending experiment, a working forecast API, and a dashboard showing the blend with its inputs. The full system separates application APIs from scientific processing and background workers. 

---

# 3. Technology Requirements

Use:

- **Python 3.11+**
- **FastAPI**
- **Uvicorn**
- **Pydantic**
- **python-dotenv**
- **HTTPX** for future external API access
- **NumPy** only if lightweight calculation is needed
- **scikit-learn** only if a small prototype blending model is actually implemented

Keep the initial backend simple.

Do not add heavy scientific dependencies such as `xarray`, `cfgrib`, `ecCodes`, PyTorch or PostgreSQL until the prototype genuinely needs them.

The full architecture can later use FastAPI + Pydantic, SQLAlchemy + psycopg, NumPy/pandas/scipy, xarray/cfgrib/ecCodes and scikit-learn, with PyTorch only if needed for adaptive weighting.

---

# 4. Backend Responsibilities

The prototype backend should do five things well:

```text
1. Receive frontend requests
2. Select the requested location / variable
3. Retrieve prepared or mock forecast data
4. Return a consistent forecast response
5. Keep the API contract ready for real data later
```

Do not place frontend-specific presentation logic inside the backend.

The backend should return **structured data**, not HTML.

---

# 5. main.py

Create the FastAPI application.

Responsibilities:

- create the FastAPI app
- configure CORS
- register routes
- expose API metadata
- provide a simple root endpoint

Use a structure conceptually like:

```text
FastAPI application
        │
        ├── /api/v1/forecast
        ├── /api/v1/models
        └── /api/v1/health
```

The frontend must be able to call the backend from a local Vite development server.

Allow a configurable frontend origin through environment variables.

Do not use unrestricted `allow_origins=["*"]` as the permanent production solution.

For prototype development, allow:

```text
http://localhost:5173
```

---

# 6. API Versioning

Use:

```text
/api/v1
```

for all application endpoints.

This is important because the frontend can later continue using the same contract even when the implementation behind it changes.

The architecture proposes stable application-facing endpoints under `/api/v1`, including forecast, model comparison, weights, official warnings, verification, latest-run status and map tiles. The MVP only needs the endpoints required by the dashboard.

---

# 7. Required Routes

Implement:

```text
GET /api/v1/forecast
GET /api/v1/models/compare
GET /api/v1/health
```

Also prepare the backend structure so these can be added later:

```text
GET /api/v1/weights
GET /api/v1/official-warnings
GET /api/v1/runs/latest
GET /api/v1/verification
GET /api/v1/locations
```

Do not build unnecessary endpoints just to make the project look larger.

---

# 8. GET /api/v1/health

Purpose:

Check whether the backend is running.

Response:

```json
{
  "status": "ok",
  "service": "bharat-forecast-api",
  "version": "1.0.0"
}
```

Keep this endpoint independent of weather data.

Use it for:

- local development
- frontend connectivity testing
- Docker health checks
- deployment monitoring

---

# 9. GET /api/v1/forecast

This is the main endpoint.

Example:

```text
GET /api/v1/forecast?lat=22.5726&lon=88.3639&hours=120&variable=rainfall
```

Support query parameters:

```text
lat
lon
hours
variable
```

Optional future parameters:

```text
location_id
run_id
```

Validate:

- latitude between -90 and 90
- longitude between -180 and 180
- forecast hours within a sensible range
- variable must be supported

Supported initial variables:

```text
rainfall
temperature
wind
```

---

# 10. Forecast Response

Return a response with a stable structure such as:

```json
{
  "location": {
    "id": "kolkata",
    "name": "Kolkata",
    "state": "West Bengal",
    "latitude": 22.5726,
    "longitude": 88.3639
  },
  "run": {
    "id": "demo-run-001",
    "initialization_time": "2026-09-29T00:00:00Z",
    "published_at": "2026-09-29T01:00:00Z",
    "model_version": "blend-v1"
  },
  "summary": {
    "rainfall": 29.4,
    "temperature": 31.2,
    "wind_speed": 4.8,
    "wind_direction": 210
  },
  "forecast": [
    {
      "time": "2026-09-29T12:00:00Z",
      "rainfall": 4.2,
      "temperature": 31.0,
      "wind_speed": 4.5,
      "wind_direction": 205
    }
  ],
  "uncertainty": {
    "rainfall_low": 22.1,
    "rainfall_high": 37.0
  },
  "event_probability": {
    "heavy_rain": 0.34
  },
  "source_weights": {
    "GFS": 0.20,
    "GEFS": 0.15,
    "IFS": 0.30,
    "AIFS": 0.35
  },
  "models": [
    {
      "model": "GFS",
      "model_type": "NWP",
      "value": 31.2,
      "unit": "mm",
      "initialization_time": "2026-09-29T00:00:00Z"
    },
    {
      "model": "GEFS",
      "model_type": "ENSEMBLE",
      "value": 28.7,
      "unit": "mm",
      "initialization_time": "2026-09-29T00:00:00Z"
    },
    {
      "model": "IFS",
      "model_type": "NWP",
      "value": 27.9,
      "unit": "mm",
      "initialization_time": "2026-09-29T00:00:00Z"
    },
    {
      "model": "AIFS",
      "model_type": "AI",
      "value": 30.1,
      "unit": "mm",
      "initialization_time": "2026-09-29T00:00:00Z"
    },
    {
      "model": "BLEND",
      "model_type": "BLENDED",
      "value": 29.4,
      "unit": "mm"
    }
  ],
  "missing_sources": []
}
```

The exact values above are demonstration values only.

The backend must clearly treat them as demo/mock data.

---

# 11. schemas/forecast.py

Create Pydantic models for every public API response.

At minimum create:

```text
LocationSchema
ForecastRunSchema
ForecastPointSchema
ForecastSummarySchema
UncertaintySchema
EventProbabilitySchema
ModelForecastSchema
ForecastResponseSchema
ModelComparisonResponseSchema
HealthResponseSchema
```

Do not return arbitrary Python dictionaries throughout the application.

Use Pydantic response models so that:

- API responses are validated
- FastAPI generates accurate OpenAPI documentation
- frontend developers know exactly what they receive
- backend changes are easier to control

Example:

```python
class LocationSchema(BaseModel):
    id: str
    name: str
    state: str
    latitude: float
    longitude: float
```

---

# 12. forecast_service.py

This should contain the backend's forecast logic.

Do NOT put weather logic directly in route files.

The route should be thin:

```text
HTTP request
    ↓
validate input
    ↓
forecast_service
    ↓
response schema
    ↓
HTTP response
```

Create functions such as:

```python
get_forecast(...)
get_model_comparison(...)
get_model_weights(...)
get_latest_run(...)
```

For now these functions can read from mock/prepared data.

Later these same functions can call:

- Open-Meteo
- direct GFS
- GEFS
- ECMWF IFS
- ECMWF AIFS
- internal blending services

The frontend should not need to know which implementation is currently being used.

---

# 13. Mock Data Strategy

For the prototype, do not hardcode large JSON responses directly inside route functions.

Store prepared values in a Python data structure inside:

```text
forecast_service.py
```

or, if it becomes large, add a small data file later.

Support at least:

```text
Kolkata
Delhi
Mumbai
Bengaluru
Bhubaneswar
Guwahati
```

Each location should have realistic demo values.

Add a clear code comment:

```text
DEMO DATA ONLY.
Replace this data source with the production forecast pipeline/API.
```

The backend must never present mock values as verified live observations.

---

# 14. Location Matching

For the first prototype, support simple nearest-location matching.

Example:

```text
lat/lon near Kolkata
        ↓
Kolkata demo dataset
```

Use the stored latitude/longitude for each demo location.

Do not implement a complicated GIS engine.

A simple distance calculation is enough for the prototype.

Later this can be replaced by PostGIS or a location database.

The full architecture recommends PostgreSQL/PostGIS for locations, district boundaries, stations and spatial queries.

---

# 15. Model Comparison Endpoint

Implement:

```text
GET /api/v1/models/compare
```

Example request:

```text
GET /api/v1/models/compare?lat=22.5726&lon=88.3639&variable=rainfall
```

Return:

```json
{
  "location": {
    "id": "kolkata",
    "name": "Kolkata",
    "state": "West Bengal"
  },
  "variable": "rainfall",
  "models": [
    {
      "model": "GFS",
      "model_type": "NWP",
      "value": 31.2,
      "unit": "mm"
    },
    {
      "model": "GEFS",
      "model_type": "ENSEMBLE",
      "value": 28.7,
      "unit": "mm"
    },
    {
      "model": "IFS",
      "model_type": "NWP",
      "value": 27.9,
      "unit": "mm"
    },
    {
      "model": "AIFS",
      "model_type": "AI",
      "value": 30.1,
      "unit": "mm"
    },
    {
      "model": "BLEND",
      "model_type": "BLENDED",
      "value": 29.4,
      "unit": "mm"
    }
  ]
}
```

The four initial source models are GFS, GEFS, ECMWF IFS and ECMWF AIFS.

---

# 16. Model Weights

Prepare the service and response structure for:

```text
GET /api/v1/weights
```

Example:

```json
{
  "location": "Kolkata",
  "variable": "rainfall",
  "lead_hours": 24,
  "weights": {
    "GFS": 0.20,
    "GEFS": 0.15,
    "IFS": 0.30,
    "AIFS": 0.35
  }
}
```

These are **model contributions**, not accuracy percentages.

For the prototype, the weights can be static demo values.

Do not implement the real adaptive ML system unless specifically requested.

---

# 17. Do Not Fake AI

The prototype may display:

```text
Adaptive Model Weights
```

but do not claim that a trained machine-learning model generated those weights unless one actually exists.

For demo mode, metadata can say:

```text
Weight mode: Demo
Model version: blend-v1-demo
```

Later:

```text
Weight mode: Learned
Model version: blend-v2
```

This keeps the prototype honest.

---

# 18. Official Warnings

Prepare the backend architecture for:

```text
GET /api/v1/official-warnings
```

For now return mock data.

Example:

```json
{
  "source": "IMD",
  "warnings": [
    {
      "id": "warning-001",
      "region": "Kolkata",
      "type": "Heavy Rainfall",
      "severity": "orange",
      "valid_until": "2026-09-29T18:00:00Z"
    }
  ]
}
```

Clearly identify these as:

```text
Official IMD Warning
```

Do not merge them into model-generated forecast output.

The architecture specifically calls for official IMD warnings to be shown separately and attributed.

---

# 19. Latest Run Status

Prepare for:

```text
GET /api/v1/runs/latest
```

Example:

```json
{
  "run_id": "demo-run-001",
  "initialization_time": "2026-09-29T00:00:00Z",
  "published_at": "2026-09-29T01:00:00Z",
  "model_version": "blend-v1-demo",
  "sources_available": 4,
  "sources_expected": 4,
  "status": "complete"
}
```

This supports the frontend's data-status panel.

The architecture expects issue time, freshness, missing-source information and model version to be exposed.

---

# 20. Optional Open-Meteo Adapter

Do not make Open-Meteo mandatory for the initial backend.

Prepare `forecast_service.py` so that the mock implementation can later be replaced or augmented with an Open-Meteo implementation.

Potential future structure:

```text
forecast_service.py
        ↓
forecast provider abstraction
        ├── mock
        └── open_meteo
```

Open-Meteo provides an easier JSON route for an initial connected dashboard and exposes model-specific forecast and ensemble endpoints.

For the current prototype:

```env
USE_MOCK_DATA=true
```

Later:

```env
USE_MOCK_DATA=false
```

can activate the real provider integration.

---

# 21. Environment Variables

Create:

```text
.env
```

locally, but do not commit it.

Provide:

```text
.env.example
```

containing:

```env
APP_NAME=Bharat Forecast API
APP_VERSION=1.0.0
ENVIRONMENT=development

FRONTEND_ORIGIN=http://localhost:5173

USE_MOCK_DATA=true

OPEN_METEO_BASE_URL=https://api.open-meteo.com
```

Later variables may include:

```env
IMD_API_KEY=
ECMWF_API_KEY=
DATABASE_URL=
REDIS_URL=
```

Do not require these for the first prototype.

---

# 22. CORS

Configure CORS using:

```env
FRONTEND_ORIGIN
```

For local development:

```text
http://localhost:5173
```

Support a comma-separated list if convenient.

Do not expose unrestricted CORS as the production configuration.

---

# 23. Error Handling

Return consistent API errors.

Example:

```json
{
  "error": {
    "code": "LOCATION_NOT_FOUND",
    "message": "No forecast data is available for the requested location."
  }
}
```

Possible error codes:

```text
INVALID_COORDINATES
UNSUPPORTED_VARIABLE
LOCATION_NOT_FOUND
FORECAST_UNAVAILABLE
SOURCE_UNAVAILABLE
INTERNAL_ERROR
```

The frontend should be able to display the `message` without understanding backend internals.

---

# 24. Missing Source Behavior

The backend must not fail completely because one source is unavailable.

Example:

```json
{
  "source_weights": {
    "GFS": 0.25,
    "GEFS": 0.00,
    "IFS": 0.35,
    "AIFS": 0.40
  },
  "missing_sources": [
    "GEFS"
  ]
}
```

For mock mode, you can demonstrate this with one location or a toggle.

---

# 25. Metadata Rules

Every forecast response should contain enough metadata to identify what the value represents.

At minimum:

```text
location
variable
unit
issue time
valid period
forecast run
model version
source models
missing-source state
```

Do not return ambiguous numbers.

A raw value such as `rainfall = 20 mm` is incomplete without its location, valid period, spatial scale and forecast run.

---

# 26. Time Handling

Use ISO 8601 timestamps:

```text
2026-09-29T12:00:00Z
```

Use UTC internally.

The frontend may convert timestamps into local Indian time for display.

Do not return inconsistent date formats from different endpoints.

---

# 27. Unit Handling

Use explicit units.

Examples:

```text
rainfall → mm
temperature → °C
wind speed → m/s
wind direction → degrees
```

Do not return values with missing units.

---

# 28. Forecast Service Design

Keep the service simple but replaceable.

Conceptually:

```python
class ForecastService:
    def get_forecast(...)
    def get_model_comparison(...)
    def get_weights(...)
```

Internally:

```text
ForecastService
      ↓
Data provider
      ├── MockProvider
      └── OpenMeteoProvider (future)
```

Do not make routes know where data comes from.

This is the main design decision that makes backend integration easy later.

---

# 29. Route Design

Routes should mainly:

```text
1. Parse request
2. Validate request
3. Call service
4. Return schema
```

Avoid placing:

- calculations
- mock datasets
- external API calls
- data transformation
- long business logic

inside route functions.

Keep those responsibilities inside services.

---

# 30. Logging

Add simple application logging.

Useful messages:

```text
Forecast request received
Location resolved
Forecast generated
External provider request
Forecast unavailable
```

Do not log:

- API secrets
- authentication keys
- unnecessary personal information

Keep logs concise.

---

# 31. API Documentation

FastAPI should automatically expose:

```text
/docs
/redoc
```

The API documentation should have useful endpoint summaries.

For example:

```text
GET /api/v1/forecast
Retrieve the blended forecast for a location.

GET /api/v1/models/compare
Compare source forecasts with the Bharat Blend.

GET /api/v1/health
Check API service health.
```

Make query parameters and response models visible.

---

# 32. Backend Package Organization

Keep imports clean.

Use:

```text
app/
    main.py
    routes/
    services/
    schemas/
```

When the project grows later, additional packages can be introduced for:

```text
adapters/
processing/
features/
blending/
verification/
workers/
database/
```

These correspond to the full architecture's scientific and operational modules.

Do not create empty folders now purely for future appearance.

---

# 33. requirements.txt

Keep the prototype dependency list small.

It should contain only what is actually used, such as:

```text
fastapi
uvicorn[standard]
pydantic
python-dotenv
httpx
```

Add other libraries only when required.

Do not install the entire full-system scientific stack for the prototype.

---

# 34. Dockerfile

Create a simple production-oriented Dockerfile.

Requirements:

- Python 3.11+
- install requirements
- expose port `8000`
- run Uvicorn
- use environment variables
- do not run development reload in production

Expected command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The full architecture recommends Docker for consistent execution of application components.

---

# 35. Local Development

The backend must run with:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

On Windows:

```text
.venv\Scripts\activate
```

Expected local URL:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

# 36. Frontend Integration

The React frontend should be able to use:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_DATA=false
```

The primary request:

```text
GET http://localhost:8000/api/v1/forecast?lat=22.5726&lon=88.3639&hours=120&variable=rainfall
```

must return data matching the frontend TypeScript interfaces.

Do not require any frontend changes beyond configuring the API URL and turning mock mode off.

---

# 37. Production Integration

The backend should be deployable independently from the frontend.

Example:

```text
Frontend
https://bharatforecast.example

Backend
https://api.bharatforecast.example
```

Configure:

```env
FRONTEND_ORIGIN=https://bharatforecast.example
```

The backend must not assume it is running on the same domain as the frontend.

---

# 38. Future Real-Data Architecture

The first backend does not need to implement this, but design it so it can eventually support:

```text
                FastAPI
                   │
            Forecast Service
                   │
         ┌─────────┴─────────┐
         │                   │
      Providers          Blending
         │                   │
 ┌───────┼────────┐          │
 ↓       ↓        ↓          ↓
GFS     GEFS     ECMWF    AI weights
                 │
             IFS/AIFS
```

The full architecture proposes source adapters, ingestion workers, processing workers, feature builders, training services, inference workers, publication services and verification workers.

Those should be added only when the project moves beyond the quick website prototype.

---

# 39. Scientific Boundaries

Do not pretend the prototype has implemented the complete scientific system.

The real system eventually needs:

```text
forecast acquisition
data alignment
bias correction
feature construction
adaptive weighting
uncertainty calibration
verification
```

The architecture's development sequence starts from simple baselines, then bias correction, issue-time features, adaptive weights, uncertainty calibration and chronological evaluation.

The current backend should simply provide the API surface required by the frontend.

---

# 40. Do Not Leak Future Complexity Into the MVP

Do not add:

- user authentication
- complex database schema
- Redis
- Celery
- Kubernetes
- microservices
- GRIB processing
- NetCDF processing
- real-time streaming
- model retraining
- distributed ML infrastructure

unless specifically required.

The goal is a **quick deployable project demonstration**, not the final national forecasting infrastructure.

---

# 41. Security Basics

Even for the prototype:

- never commit `.env`
- never hardcode API secrets
- validate request parameters
- handle external HTTP failures
- set reasonable request timeouts
- do not expose stack traces to API users
- use HTTPS in production
- restrict CORS in production

---

# 42. Health and Deployment Readiness

The backend should start cleanly in Docker and locally.

The following should all work:

```text
GET /
GET /api/v1/health
GET /docs
GET /api/v1/forecast
GET /api/v1/models/compare
```

The backend should return HTTP 200 for healthy demo requests.

Invalid parameters should return appropriate HTTP 4xx responses.

---

# 43. Example API Flow

### Step 1 — Frontend asks for forecast

```text
GET /api/v1/forecast
```

### Step 2 — FastAPI validates coordinates

```text
22.5726, 88.3639
```

### Step 3 — Forecast service resolves location

```text
Kolkata
```

### Step 4 — Service gets prepared/demo forecast

```text
GFS
GEFS
IFS
AIFS
```

### Step 5 — Service returns blended result

```text
Bharat Blend
```

### Step 6 — Frontend displays

```text
Weather
Model comparison
Model weights
Uncertainty
Forecast chart
Run metadata
```

---

# 44. Example Response Relationship

The same run should be internally consistent.

If the model values are:

```text
GFS  = 31.2
GEFS = 28.7
IFS  = 27.9
AIFS = 30.1
```

and demo weights are:

```text
GFS  = 0.20
GEFS = 0.15
IFS  = 0.30
AIFS = 0.35
```

then the blended output should be mathematically consistent with those values.

Do not return unrelated random values from different endpoints.

The architecture defines the blended forecast as a weighted combination of corrected source forecasts.

---

# 45. Performance

The prototype should be fast.

For mock data:

```text
Target API response:
< 500 ms locally
```

Do not perform unnecessary expensive processing per request.

Prepared data should be returned directly.

Later, expensive forecast processing should happen in background workflows and the frontend should retrieve an already prepared forecast.

---

# 46. Future Database Integration

Do not implement the database now.

But keep the service interface compatible with a future database.

Current:

```text
ForecastService
   ↓
Mock data
```

Future:

```text
ForecastService
   ↓
Repository
   ↓
PostgreSQL / PostGIS
```

The full architecture recommends PostgreSQL for locations, model versions, forecast-run metadata and verification summaries, with PostGIS for district boundaries and station/spatial queries.

---

# 47. Future Verification Integration

Prepare the response schema so verification can later be added without breaking existing fields.

Future endpoint:

```text
GET /api/v1/verification
```

Potential data:

```text
MAE
RMSE
Bias
Brier Score
CRPS
Reliability
Misses
False Alarms
```

These correspond to the evaluation categories identified in the architecture.

Do not implement the full verification system in the first prototype.

---

# 48. API Contract Stability

This is extremely important.

Once the frontend is using:

```text
ForecastResponseSchema
```

do not casually rename fields.

Prefer:

```text
source_weights
```

rather than changing it later to:

```text
weights
```

without versioning or a migration.

The purpose of `/api/v1` is to provide a stable application-facing contract.

---

# 49. Code Quality

All backend code should be:

- clean
- readable
- typed where practical
- Pydantic validated
- modular
- easy to replace with real data services
- free of unnecessary abstraction
- free of duplicated logic
- free of hardcoded frontend URLs
- free of API secrets
- free of debug print statements

Use Python type hints.

Prefer descriptive function names.

Keep route files short.

---

# 50. Backend README Documentation

The backend README should explain:

```text
Project purpose
Tech stack
Folder structure
Environment setup
Environment variables
Running locally
API endpoints
Example requests
Example responses
Docker usage
Mock mode
Frontend integration
Future real-data integration
```

Include a simple architecture diagram:

```text
React Frontend
      ↓
FastAPI API
      ↓
Forecast Service
      ↓
Mock / Prepared Data
```

And future architecture:

```text
React
 ↓
FastAPI
 ↓
Forecast Services
 ↓
GFS / GEFS / IFS / AIFS
 ↓
Blending / Processing
 ↓
Published Forecast
```

---

# 51. Final User Experience

The backend exists to make the frontend feel like a real weather intelligence platform.

The user should be able to:

```text
Select Kolkata
       ↓
Request forecast
       ↓
See rainfall/temperature/wind
       ↓
Compare GFS / GEFS / IFS / AIFS
       ↓
See Bharat Blend
       ↓
See model contribution
       ↓
See uncertainty/probability
       ↓
See forecast run metadata
```

All of this should work in mock mode.

---

# 52. Definition of Done

The backend is complete when:

- [ ] FastAPI starts without errors
- [ ] `/` works
- [ ] `/api/v1/health` works
- [ ] `/docs` works
- [ ] `/api/v1/forecast` works
- [ ] `/api/v1/models/compare` works
- [ ] Pydantic response schemas are implemented
- [ ] query parameters are validated
- [ ] invalid coordinates return errors
- [ ] unsupported variables return errors
- [ ] mock data supports multiple Indian locations
- [ ] rainfall works
- [ ] temperature works
- [ ] wind works
- [ ] model comparison works
- [ ] blended forecast is internally consistent
- [ ] model weights are returned
- [ ] run metadata is returned
- [ ] missing sources can be represented
- [ ] CORS works for the React development server
- [ ] `.env` configuration works
- [ ] API base URL is configurable
- [ ] frontend can consume the API without changing UI components
- [ ] Docker build succeeds
- [ ] Docker container starts successfully
- [ ] no secrets are committed
- [ ] no unnecessary database/ML infrastructure is required

---

# 53. Build Instruction

Generate the backend completely.

Do not stop at creating empty files.

Actually implement:

- FastAPI application
- route registration
- CORS
- Pydantic models
- validation
- forecast service
- mock weather data
- model comparison
- model weights
- forecast metadata
- error handling
- health endpoint
- environment configuration
- API documentation
- Docker support

The backend must work immediately using:

```text
USE_MOCK_DATA=true
```

It must not require:

- PostgreSQL
- Redis
- Celery
- external API keys
- GRIB files
- NetCDF files
- trained ML models

The first version should be a **clean, fast, deployable prototype API**.

The architecture should remain compatible with future integration of direct forecast-provider data and the scientific blending pipeline.

Never represent demo/mock values as real verified weather forecasts.

Keep the implementation simple, professional, maintainable and ready for the React frontend to consume.
