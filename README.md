# Bharat Forecast

Bharat Forecast is a hybrid weather forecasting system tailored specifically for the Indian subcontinent. The system aims to blend multiple global weather models (such as GFS, GEFS, ECMWF IFS, and AIFS) to deliver highly confident, unified deterministic and probabilistic weather forecasts.

## Project Structure

This repository is divided into two main applications:

- **[`/backend`](./backend)**: A Python FastAPI application that handles processing, blending, and serving the weather data.
- **[`/frontend`](./frontend)**: A React web application built with TypeScript, Vite, and Tailwind CSS for visualizing the weather data and map interfaces.

## Getting Started

To run the full stack locally, you will need to start both the backend and frontend development servers.

### 1. Backend Setup

The backend requires Python 3.11+ and uses a virtual environment.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On Linux/macOS:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Setup environment variables:
   Create a `.env` file in the root of the `backend/` directory (see `.env.example`):
   ```env
   APP_NAME="Bharat Forecast API"
   APP_VERSION=1.0.0
   ENVIRONMENT=development
   FRONTEND_ORIGIN=http://localhost:5173
   USE_MOCK_DATA=true
   ```
5. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will now be running at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup

The frontend requires Node.js.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be running at `http://localhost:5173`. Ensure `FRONTEND_ORIGIN` is configured correctly on the backend to avoid CORS issues.

## API Endpoints

When the backend is running, the following endpoints are available:

- `GET /api/v1/forecast`: Retrieve the blended forecast for a location.
- `GET /api/v1/models/compare`: Compare source forecasts with the Bharat Blend.
- `GET /api/v1/locations`: Search and retrieve supported forecast locations.
- `GET /api/v1/weights`: Retrieve model contribution weights for a location.
- `GET /api/v1/official-warnings`: Retrieve official IMD warnings for a location.
- `GET /api/v1/runs/latest`: Retrieve the latest forecast run status.
- `GET /api/v1/health`: Check API service health.
- `GET /api/v1/verification`: Retrieve forecast verification metrics (Future).

**Example Request:**
```bash
curl -s "http://localhost:8000/api/v1/forecast?lat=28.6&lon=77.2&hours=24&variable=rainfall&location_id=delhi"
```

## Docker Usage (Backend)

Build and run the production image:
```bash
docker build -t bharat-forecast-api ./backend
docker run -p 8000:8000 bharat-forecast-api
```

## Architecture Overview

Currently, the backend includes a "Mock Mode" for development (`USE_MOCK_DATA=true`). This bypasses the heavy data-science modules and database requirements, generating mathematically consistent synthetic forecasts directly in-memory to facilitate frontend development. **Never represent these demo/mock values as real verified weather forecasts.**

```text
React Frontend (Vite, Tailwind, Recharts, MapLibre GL)
      ↓ REST API
FastAPI Backend (Python, Pydantic)
      ↓
Forecast Services
      ↓
Mock / Prepared Data
```

In the future, the backend will interface with active data science pipelines fetching real-time data from global weather models.
