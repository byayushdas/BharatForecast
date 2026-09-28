# Bharat Forecast Backend

This is the API layer for the Bharat Forecast prototype. It is a lightweight FastAPI application providing stable APIs for the React frontend.

## Tech Stack
- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic

## Folder Structure
- `app/main.py`: Application entrypoint
- `app/routes/`: API endpoint definitions
- `app/services/`: Business logic and data providers
- `app/schemas/`: Pydantic models for validation

## Running Locally

1. Create a virtual environment: `python -m venv .venv`
2. Activate it: `source .venv/bin/activate` (or `.venv\Scripts\activate` on Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env`
5. Run the server: `uvicorn app.main:app --reload`

## API Documentation
Once running, visit `http://localhost:8000/docs` to see the interactive API documentation.
