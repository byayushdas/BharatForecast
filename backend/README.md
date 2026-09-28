# Bharat Forecast API

The backend API for the Bharat Forecast hybrid forecasting system.

## Project Purpose
Bharat Forecast blends multiple global weather models (GFS, GEFS, ECMWF IFS, AIFS) into a single, high-confidence deterministic and probabilistic forecast specifically calibrated for the Indian subcontinent. This backend serves the prepared, blended data to the frontend application.

## Tech Stack
- **Framework:** FastAPI (Python 3.11+)
- **Server:** Uvicorn
- **Validation:** Pydantic
- **Environment Management:** python-dotenv
- **Containerization:** Docker

## Folder Structure
```text
app/
├── main.py
├── schemas/        # Pydantic validation schemas
├── routes/         # API endpoint definitions
└── services/       # Core business logic and providers
```

## Environment Setup
Create a virtual environment and install dependencies:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables
Create a `.env` file in the root of the `backend/` directory (see `.env.example`):
```env
APP_NAME=Bharat Forecast API
APP_VERSION=1.0.0
ENVIRONMENT=development
FRONTEND_ORIGIN=http://localhost:5173
USE_MOCK_DATA=true
```

## Running Locally
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`.

## API Endpoints
- `GET /api/v1/forecast`: Retrieve the blended forecast for a location.
- `GET /api/v1/models/compare`: Compare source forecasts with the Bharat Blend.
- `GET /api/v1/locations`: Search and retrieve supported forecast locations.
- `GET /api/v1/weights`: Retrieve model contribution weights for a location.
- `GET /api/v1/official-warnings`: Retrieve official IMD warnings for a location.
- `GET /api/v1/runs/latest`: Retrieve the latest forecast run status.
- `GET /api/v1/health`: Check API service health.
- `GET /api/v1/verification`: Retrieve forecast verification metrics (Future).

Interactive documentation is automatically generated at: `http://localhost:8000/docs`

## Example Requests
```bash
curl -s "http://localhost:8000/api/v1/forecast?lat=28.6&lon=77.2&hours=24&variable=rainfall&location_id=delhi"
```

## Example Responses
```json
{
  "location": {
    "id": "delhi",
    "name": "New Delhi",
    "state": "Delhi",
    "latitude": 28.61,
    "longitude": 77.23
  },
  "variable": "rainfall",
  "unit": "mm",
  "run": {
    "id": "run-20260928-1200",
    "initialization_time": "2026-09-28T12:00:00Z",
    "published_at": "2026-09-28T14:30:00Z",
    "model_version": "blend-v1-demo"
  },
  "summary": {
    "rainfall": 12.5,
    "temperature": 32.1,
    "wind_speed": 4.2
  },
  "source_weights": {
    "GFS": 0.25,
    "GEFS": 0.00,
    "IFS": 0.35,
    "AIFS": 0.40
  },
  "missing_sources": [
    "GEFS"
  ],
  "models": [
    {
      "model": "GFS",
      "value": 31.2,
      "unit": "mm"
    },
    ...
  ]
}
```

## Docker Usage
Build and run the production image:
```bash
docker build -t bharat-forecast-api .
docker run -p 8000:8000 bharat-forecast-api
```

## Mock Mode
When `USE_MOCK_DATA=true`, the API routes bypass all databases and heavy data-science modules, generating mathematically consistent synthetic forecasts directly in-memory. **Never represent these demo/mock values as real verified weather forecasts.**

## Frontend Integration
The Vite React frontend communicates with the backend via `VITE_API_BASE_URL`. Ensure `FRONTEND_ORIGIN` is configured correctly on the backend to avoid CORS issues. 

## Current Architecture
```text
React Frontend
      ↓
FastAPI API
      ↓
Forecast Service
      ↓
Mock / Prepared Data
```

## Future Real-Data Integration
The backend is designed using the Provider pattern to seamlessly swap the mock data provider for a Postgres Repository and live inference APIs once the data science pipelines are ready.

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
