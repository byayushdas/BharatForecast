# Bharat Forecast — Frontend Build Prompt

## 1. Project Goal

Build the **complete frontend** for a modern weather forecasting prototype called **Bharat Forecast**.

This is a frontend-first prototype of a **Hybrid AI–NWP Multi-Model Forecast Blending System**. The interface should visually communicate that Bharat Forecast receives forecasts from multiple weather models, compares them, calculates/receives model contributions, and presents a blended forecast.

The first prototype does **not** need to implement the real scientific forecasting pipeline. Use realistic mock data behind a clean data/API abstraction so the frontend can later connect to a FastAPI backend without changing the UI architecture.

The system concept is:

```text
GFS
GEFS
ECMWF IFS
ECMWF AIFS
   ↓
Model Forecast Comparison
   ↓
AI / Adaptive Blending
   ↓
Blended Forecast
   ↓
Weather Dashboard
```

The frontend should make **forecast values, model comparison, model contributions, uncertainty, verification, data freshness, and official warnings** understandable without overwhelming the user.

---

# 2. Existing Folder Structure

Use this exact frontend structure:

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── WeatherCard.tsx
│   │   ├── ModelComparison.tsx
│   │   ├── ForecastChart.tsx
│   │   ├── WeatherMap.tsx
│   │   └── ModelWeights.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Forecast.tsx
│   │   └── About.tsx
│   │
│   ├── data/
│   │   └── mockForecast.ts
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   ├── types/
│   │   └── weather.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── public/
│   └── logo.svg
│
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

Do not add unnecessary frontend folders unless absolutely required.

---

# 3. Technology Requirements

Use:

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **TanStack Query** for API/server-state handling
- **Recharts** for charts
- **MapLibre GL JS** for maps
- **Lucide React** for icons

Use modern functional React components and hooks.

Do not use jQuery.

Do not use a large UI framework such as Material UI unless there is a compelling reason.

Keep the code modular and readable.

---

# 4. Design Direction

Create a **professional Indian weather intelligence dashboard**, not a generic weather app.

The UI should feel suitable for:

- a Smart India Hackathon prototype
- a government/scientific technology demonstration
- an AI/weather research project
- desktop presentation and laptop demo
- responsive mobile viewing

The visual language should be:

- clean
- modern
- restrained
- scientific
- trustworthy
- spacious
- data-focused

## Do NOT use

- neon colors
- excessive gradients
- glowing effects
- glassmorphism everywhere
- excessive rounded cards
- oversized decorative illustrations
- random bright colors
- purple/pink cyberpunk styling
- excessive animation
- cluttered dashboards
- emoji as primary UI elements

Avoid anything that makes the website look like a gaming dashboard.

## Recommended color system

Use a restrained palette:

```text
Background:       #F8FAFC
Surface:          #FFFFFF
Primary text:     #0F172A
Secondary text:   #475569
Border:           #E2E8F0
Primary blue:     #2563EB
Light blue:       #EFF6FF
Success:          #16A34A
Warning:          #D97706
Danger:           #DC2626
```

Use color primarily to communicate **status and weather meaning**, not decoration.

Charts should use a small coordinated palette and should remain readable in both desktop and mobile sizes.

---

# 5. Global Layout

The application should use this structure:

```text
┌─────────────────────────────────────────────────────┐
│ Bharat Forecast                         Nav / About │
├─────────────────────────────────────────────────────┤
│                                                     │
│              Main page content                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Desktop:

- centered content
- maximum content width around `1400px`
- comfortable horizontal padding
- consistent vertical spacing

Mobile:

- collapsible navigation
- cards stack vertically
- charts remain readable
- map becomes responsive
- no horizontal overflow

---

# 6. Navbar.tsx

Create a clean sticky navigation bar.

Left side:

- Bharat Forecast logo
- text: **Bharat Forecast**
- small subtitle: **Hybrid Weather Intelligence**

Right side:

- Home
- Forecast
- About

Include an optional compact live-data status indicator:

```text
● Data services online
```

The status should be visually subtle.

Use React Router links.

On mobile:

- show a compact menu button
- use a simple mobile navigation drawer/dropdown

Navbar should have:

- white background
- subtle bottom border
- no giant shadows
- no excessive animation

---

# 7. Home.tsx

The Home page should be the main landing/dashboard page.

## Hero section

Create a strong but minimal hero section.

Headline:

**Smarter Forecasts for a Changing India**

Supporting text:

**Bharat Forecast combines multiple physical and AI weather forecasts to provide a context-aware blended forecast.**

Include two buttons:

```text
Explore Forecast
How It Works
```

Do not use a huge image as the hero background.

Instead, use the weather data UI itself as the visual focus.

---

# 8. Home Dashboard

Immediately after the hero, show a location/forecast control bar.

Example:

```text
Location: [ Kolkata              ▼ ]
Variable: [ Rainfall             ▼ ]
Forecast: [ 5 Days               ▼ ]
```

Add:

```text
[ Refresh Forecast ]
```

The controls must actually work with mock data.

Changing location should update:

- weather summary
- chart
- model comparison
- model weights
- map location
- metadata

Changing variable should update available values and labels.

---

# 9. Weather Summary Cards

Use `WeatherCard.tsx`.

Create a row of key metric cards.

For the selected location show:

```text
Temperature
Current / forecast temperature

Rainfall
Expected accumulated rainfall

Wind
Speed + direction

Forecast Confidence / Uncertainty
Show an actual uncertainty/range when mock data provides it
```

Important:

Do NOT fabricate a confidence percentage based only on model agreement.

Use wording such as:

```text
Forecast range
Probability
Uncertainty
```

when those values are actually provided by the mock data.

Each card should contain:

- icon
- metric label
- main value
- unit
- small supporting information
- optional trend indicator

Example:

```text
RAIN
29.4 mm
Next 24 hours
```

---

# 10. ForecastChart.tsx

Build the primary forecast visualization with Recharts.

For rainfall:

- x-axis = time
- y-axis = rainfall
- main line/area = blended forecast
- optional uncertainty band
- tooltip with exact timestamp/value

For temperature:

- temperature line
- clear units

For wind:

- wind-speed line

The chart must update when:

- location changes
- variable changes
- forecast period changes

Add a chart legend.

Keep charts clean.

Do not put too many visual elements into one chart.

---

# 11. ModelComparison.tsx

This is one of the most important project-specific components.

Display the individual model predictions beside the blended result.

Example:

```text
                 Rainfall
GFS                31.2 mm
GEFS               28.7 mm
ECMWF IFS          27.9 mm
ECMWF AIFS         30.1 mm
--------------------------------
Bharat Blend       29.4 mm
```

Use a compact table/card layout.

Show:

- model name
- model type
- forecast value
- difference from blend
- initialization time if available

Model labels:

```text
GFS
GEFS
ECMWF IFS
ECMWF AIFS
Bharat Blend
```

Use small badges:

```text
NWP
ENSEMBLE
NWP
AI
BLENDED
```

Do not imply that the blend is accurate simply because it exists.

---

# 12. ModelWeights.tsx

Show the adaptive model contribution.

Example:

```text
Model contribution

ECMWF AIFS      35%
ECMWF IFS       30%
GFS             20%
GEFS            15%
```

Use a clean horizontal bar visualization or donut chart.

Also show context:

```text
Location     Kolkata
Variable     Rainfall
Lead time    24h
Model run    2026-09-29 00:00 UTC
```

Include a small explanation:

```text
Weights represent the contribution assigned to each available
forecast source for this forecast context.
```

Do not label weights as "accuracy".

Do not state:

```text
AIFS is 35% accurate
```

The number represents contribution/weight, not forecast accuracy.

---

# 13. WeatherMap.tsx

Use **MapLibre GL JS**.

The map should show:

- India
- selected location
- basic weather information
- simple weather visualization

For the prototype, it is acceptable to use a prepared/static map visualization and mock weather points instead of implementing an advanced nationwide weather tile service.

Functional interactions:

- zoom
- pan
- click a weather point
- select location from the map

When a point is clicked, update the selected location.

Add a small map legend.

Example:

```text
Rainfall
Low ───────────── High
```

Do not create a complicated GIS system.

The map should remain visually clean.

---

# 14. Forecast.tsx

Create a dedicated forecast page for deeper inspection.

Layout:

```text
Forecast
│
├── Location selector
├── Variable selector
├── Forecast period selector
│
├── Current forecast summary
│
├── 5-day forecast chart
│
├── Model comparison
│
└── Model contributions
```

Include a forecast timeline.

Example:

```text
Today
Tomorrow
Day 3
Day 4
Day 5
```

Each day should show:

- rainfall
- temperature
- wind
- event probability where available

Allow the user to click a day and update the detailed chart.

---

# 15. About.tsx

Explain the project clearly.

Sections:

## What is Bharat Forecast?

Explain that Bharat Forecast is a prototype for dynamically combining multiple weather forecasting systems.

## Forecast Sources

Show:

```text
NOAA GFS
NOAA GEFS
ECMWF IFS
ECMWF AIFS
```

## How it works

Use a visual flow:

```text
Multiple Models
      ↓
Data Alignment
      ↓
Bias Correction
      ↓
Adaptive Weighting
      ↓
Blended Forecast
      ↓
Verification
```

## Verification Data

Explain that the planned system can use:

```text
IMD observations
NASA IMERG rainfall estimates
```

## Technology

Show:

```text
React
TypeScript
Tailwind CSS
Python / FastAPI
scikit-learn
Xarray
PostgreSQL / PostGIS
Docker
```

Keep the explanation simple and suitable for a project demonstration.

---

# 16. mockForecast.ts

Create realistic structured mock data.

Do NOT scatter hardcoded weather values throughout components.

All demo weather data should come from:

```text
src/data/mockForecast.ts
```

Create TypeScript-safe mock objects.

Support at least these locations:

```text
Kolkata
Delhi
Mumbai
Bengaluru
Bhubaneswar
Guwahati
```

Each location should have:

- latitude
- longitude
- current conditions
- hourly/daily forecast
- GFS values
- GEFS values
- IFS values
- AIFS values
- blended values
- uncertainty
- event probability
- source weights
- run metadata

Use realistic but clearly fictional/demo values.

Add a comment at the top:

```text
DEMO DATA ONLY — replace with API responses when backend integration is enabled.
```

---

# 17. weather.ts

Create strong TypeScript interfaces.

At minimum define:

```ts
Location
WeatherVariable
ForecastPoint
ForecastSummary
ModelForecast
ModelWeight
ForecastUncertainty
ForecastRun
ForecastResponse
ModelComparisonResponse
```

Example conceptual structure:

```ts
export interface Location {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface ForecastPoint {
  time: string;
  rainfall?: number;
  temperature?: number;
  windSpeed?: number;
  windDirection?: number;
}

export interface ModelForecast {
  model: "GFS" | "GEFS" | "IFS" | "AIFS" | "BLEND";
  value: number;
  unit: string;
  initializationTime?: string;
}
```

Keep API-related types centralized.

---

# 18. api.ts

This file is extremely important.

Build the frontend so that mock data and real backend data use the **same interface**.

Use:

```text
VITE_API_BASE_URL
```

Example `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK_DATA=true
```

Production can later become:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_USE_MOCK_DATA=false
```

Create these API functions:

```ts
getLocations()
getForecast()
getModelComparison()
getModelWeights()
getLatestRun()
getOfficialWarnings()
```

For now:

```text
VITE_USE_MOCK_DATA=true
```

returns data from `mockForecast.ts`.

Later:

```text
VITE_USE_MOCK_DATA=false
```

calls FastAPI.

The UI components should NOT know whether data came from mock data or the backend.

---

# 19. Future Backend API Contract

Prepare the frontend around the following endpoints:

```text
GET /api/v1/locations?query=Kolkata

GET /api/v1/forecast?lat=22.5726&lon=88.3639&hours=120

GET /api/v1/models/compare

GET /api/v1/weights

GET /api/v1/official-warnings

GET /api/v1/runs/latest
```

The project architecture defines these as the stable application-facing routes. fileciteturn0file0L426-L439

The frontend should not directly depend on GFS/GEFS/IFS/AIFS provider APIs.

Architecture:

```text
React
  ↓
src/lib/api.ts
  ↓
FastAPI
  ↓
Forecast services / data providers
```

For the current prototype:

```text
React
  ↓
src/lib/api.ts
  ↓
mockForecast.ts
```

This makes backend integration easy later.

---

# 20. Forecast API Response Shape

Design the frontend contract around a response similar to:

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
    "wind_speed": 4.8
  },
  "forecast": [],
  "uncertainty": {},
  "event_probability": {},
  "source_weights": {
    "GFS": 0.20,
    "GEFS": 0.15,
    "IFS": 0.30,
    "AIFS": 0.35
  },
  "models": [],
  "missing_sources": []
}
```

The frontend must be tolerant of missing values.

For example:

```text
GEFS unavailable
```

should be displayed as a data-status issue rather than breaking the page.

The architecture specifically requires forecast metadata, uncertainty/probability information, source weights, source initialization times, missing-source flags and model version to be preserved and exposed. fileciteturn0file0L441-L450

---

# 21. Loading States

Every data-driven component must have a loading state.

Examples:

```text
Loading forecast...
Loading model comparison...
Loading weather map...
```

Prefer skeleton loaders over large spinners.

Avoid layout shifting.

---

# 22. Error States

Create elegant inline error states.

Example:

```text
Unable to load forecast data.

Try again
```

For individual unavailable sources:

```text
GEFS
Currently unavailable
```

Do not crash the entire dashboard because one model is missing.

The architecture explicitly considers missing-source behavior and freshness as part of operational reliability. fileciteturn0file0L469-L475

---

# 23. Empty States

Example:

```text
No forecast available for this location.

Select another location.
```

Use the same visual language as the rest of the application.

---

# 24. Responsive Design

The frontend must work at:

```text
1440px desktop
1280px laptop
1024px tablet
768px tablet
390px mobile
```

Desktop dashboard:

```text
┌──────────────────────┬──────────────────────┐
│ Weather Summary      │ Weather Map          │
│                      │                      │
├──────────────────────┼──────────────────────┤
│ Forecast Chart       │ Model Weights        │
│                      │                      │
├──────────────────────┴──────────────────────┤
│ Model Comparison                              │
└───────────────────────────────────────────────┘
```

Mobile:

```text
Summary
↓
Map
↓
Chart
↓
Model Weights
↓
Model Comparison
```

No horizontal scrolling.

---

# 25. Interaction Requirements

Make the interface actually functional.

### Location

When the user searches/selects a location:

- update all dashboard values
- update coordinates
- update map marker
- update chart
- update model comparison
- update weights

### Variable

Support:

```text
Rainfall
Temperature
Wind
```

Changing the variable should update relevant cards and charts.

### Forecast period

Support:

```text
24 hours
3 days
5 days
```

### Model comparison

Allow toggling individual model visibility where appropriate.

### Map

Clicking a location should update the selected location.

### Refresh

Refresh should simulate a data refresh using the mock/API abstraction and show updated run status.

---

# 26. Data Status Component Behavior

Use the available space in the dashboard to show:

```text
Forecast run
29 Sep 2026, 00:00 UTC

Published
29 Sep 2026, 01:00 UTC

Sources
4 / 4 available
```

If a source is unavailable:

```text
Sources
3 / 4 available
```

Show this with a subtle warning status.

The source architecture emphasizes issue time, freshness and missing-source visibility. fileciteturn0file0L40-L42

---

# 27. Official Warning Presentation

Do not mix official warnings into the AI model comparison.

Create a section on the Forecast/Home page such as:

```text
Official IMD Warnings

No active warning
```

or:

```text
IMD Warning
Heavy rainfall
District: Kolkata
Valid until: ...
```

Clearly label it:

**Official IMD Warning**

The project architecture specifically calls for official IMD warnings to be displayed separately and attributed. fileciteturn0file0L40-L42

For now this can use mock data.

---

# 28. Accessibility

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- aria-labels for icon-only buttons
- sufficient text contrast
- readable font sizes
- chart descriptions/tooltips where useful

Do not rely on color alone to communicate status.

---

# 29. Typography

Use a clean modern sans-serif.

Prefer:

```text
Inter
```

or the system sans-serif stack.

Hierarchy:

```text
Page title
32–40px desktop

Section title
20–24px

Card value
24–32px

Body
14–16px

Metadata
12–13px
```

Do not use giant headline typography that consumes most of the viewport.

---

# 30. Card Design

Cards should be:

- white
- subtle border
- small/medium radius
- minimal shadow
- consistent padding

Example:

```text
┌─────────────────────────────┐
│ Rainfall                icon│
│                             │
│ 29.4 mm                      │
│ Next 24 hours                │
└─────────────────────────────┘
```

Do not give every card a different background color.

---

# 31. Animation

Use only subtle transitions:

- 150–250ms
- hover state
- page transition if useful
- dropdown transition
- mobile menu transition

Do not use:

- bouncing elements
- excessive parallax
- animated backgrounds
- spinning weather icons everywhere

The dashboard should feel stable and professional.

---

# 32. Map Design

Keep the map as a functional data visualization.

Use:

- simple basemap
- selected location marker
- optional mock weather points
- simple legend
- zoom controls

Do not clutter the map with dozens of decorative markers.

---

# 33. Logo

Create `public/logo.svg` as a simple, professional mark.

Concept:

- India-inspired geographic/weather identity
- clean cloud/wind/forecast motif
- no complex illustration
- works at small sizes
- monochrome or restrained blue version

Text beside the logo:

**Bharat Forecast**

Do not make the logo excessively detailed.

---

# 34. App Routing

Implement:

```text
/
  Home

/forecast
  Forecast

/about
  About
```

Use React Router.

Unknown routes should show a simple:

```text
Page not found
Back to dashboard
```

---

# 35. Performance

Keep the site fast.

Requirements:

- lazy load large pages where sensible
- avoid unnecessary dependencies
- memoize expensive chart/map components where needed
- avoid rendering huge datasets
- do not put raw GRIB/NetCDF data into the browser
- fetch only prepared JSON needed by the UI

The architecture explicitly places large GRIB/NetCDF files in the backend and recommends small GeoJSON/map tiles or point-level JSON for frontend requests. fileciteturn0file0L65-L67

---

# 36. Mock Mode

The prototype must work immediately after:

```bash
npm install
npm run dev
```

without requiring a backend.

Set:

```env
VITE_USE_MOCK_DATA=true
```

When mock mode is enabled, every page must function.

No API connection errors should appear just because the backend is not running.

---

# 37. Backend Integration Mode

When:

```env
VITE_USE_MOCK_DATA=false
```

the same frontend should call:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The UI should not be rewritten.

Only `src/lib/api.ts` should decide whether data comes from:

```text
mockForecast.ts
```

or:

```text
FastAPI
```

---

# 38. Error Handling in api.ts

Create a small API abstraction that:

- builds query parameters safely
- handles network failures
- handles non-2xx responses
- parses JSON
- exposes meaningful errors to the UI
- does not leak backend internals into UI messages

Use TypeScript types for API responses.

Do not put fetch calls directly inside every component.

---

# 39. Code Quality

All code should be:

- TypeScript-safe
- componentized
- readable
- consistently formatted
- minimally commented
- free from unused imports
- free from console spam
- free from hardcoded API URLs
- free from duplicated business logic

Prefer simple code over unnecessary abstractions.

---

# 40. Important Scientific/Product Rules

Preserve these principles from the project architecture:

1. The system is a **forecast blending system**, not a new global weather model.

2. GFS, GEFS, ECMWF IFS and ECMWF AIFS are the initial forecast sources. fileciteturn0file0L220-L227

3. AIFS is an AI-generated weather forecast; the project's own AI learns how to combine available forecasts. fileciteturn0file0L155-L159

4. Model weights represent **contribution**, not accuracy.

5. Different variables can require different blending behavior. fileciteturn0file0L205-L216

6. Uncertainty and event probabilities should be shown only when actual values exist.

7. Do not invent a confidence percentage simply from agreement between models. fileciteturn0file0L450-L450

8. Official IMD warnings should remain separate from the AI forecast. fileciteturn0file0L40-L42

9. Model/source metadata such as initialization time and missing-source state should be visible where relevant. fileciteturn0file0L441-L448

10. Open-Meteo may be used later as an easier JSON connection for the first connected dashboard, while the main scientific architecture is based on direct forecast-provider data. fileciteturn0file0L220-L229 fileciteturn0file0L276-L333

---

# 41. Final UX Goal

When a user opens Bharat Forecast, they should immediately understand:

```text
Where am I forecasting?
        ↓
What will the weather be?
        ↓
What do the individual models predict?
        ↓
How did Bharat Forecast combine them?
        ↓
How uncertain is the forecast?
        ↓
Are there any official warnings?
        ↓
When was this forecast generated?
```

The dashboard should feel like a **weather intelligence platform**, not a simple weather app.

---

# 42. Definition of Done

The frontend is complete when all of these work without a backend:

- [ ] Home page loads
- [ ] Forecast page loads
- [ ] About page loads
- [ ] Navigation works
- [ ] Location selection works
- [ ] Variable selection works
- [ ] Forecast-period selection works
- [ ] Weather cards update
- [ ] Forecast chart updates
- [ ] Model comparison updates
- [ ] Model weights update
- [ ] Map works
- [ ] Map location selection works
- [ ] Official warning section works with mock data
- [ ] Data status is displayed
- [ ] Loading states work
- [ ] Error states work
- [ ] Mobile layout works
- [ ] No horizontal overflow
- [ ] No random or excessive colors
- [ ] No console errors
- [ ] Mock/API abstraction works
- [ ] `VITE_API_BASE_URL` is configurable
- [ ] Switching from mock mode to API mode requires no UI rewrite
- [ ] Production build succeeds with `npm run build`

---

# 43. Build Instruction

Generate the frontend completely.

Do not stop at a visual mockup.

Actually implement:

- routing
- components
- state management
- mock data
- chart interactions
- map interactions
- filters
- responsive design
- loading states
- error states
- API abstraction
- environment configuration
- reusable TypeScript interfaces

The project must be runnable immediately with:

```bash
npm install
npm run dev
```

and build successfully with:

```bash
npm run build
```

Use realistic demo data, but clearly indicate that it is **demo/mock data**.

Do not claim that mock values are real forecasts.

Do not implement the backend in this task.

Prepare the frontend so the FastAPI backend can be connected later simply by changing:

```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=<backend-url>
```

The final result should look polished enough for a live project demonstration and remain simple enough to maintain and extend.
