# AcroVision Backend Architecture & ESP32 Integration Guide

## 1. System Architecture

AcroVision implements a strict unidirectional data flow:

```
REAL SENSOR INPUT (ESP32 / IoT Node)
        ↓  HTTP POST /api/v1/telemetry
FASTAPI INGESTION & VALIDATION
        ↓
DATABASE (SQLite / PostgreSQL with Historical Timestamps)
        ↓
SENSOR INTERPRETATION (Canonicalization & Normalization)
        ↓
CROP & GROWTH-STAGE CONTEXT (Phenological & Soil Physics Modifiers)
        ↓
DECISION / RULES ENGINE (Efficiency Scoring & Threshold Triggers)
        ↓
RECOMMENDATION ENGINE (What / Why / When / Confidence)
        ↓
ALERTS & INSIGHTS (Auto-Creation & Auto-Resolution on Optimal Readings)
        ↓
FRONTEND DASHBOARD (Dynamic React Context & Live Visualizations)
```

---

## 2. Quick Start Commands

### A. Start FastAPI Backend
```powershell
# In ./backend directory
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Redoc Documentation: `http://localhost:8000/redoc`

### B. Start React Frontend
```powershell
# In ./frontend directory
cd frontend
npm.cmd run dev
```
- Dashboard: `http://localhost:5173`

### C. Run Backend Automated Test Suite
```powershell
# In ./backend directory
cd backend
.\.venv\Scripts\python.exe -m pytest -v
```

---

## 3. Real ESP32 Telemetry API

### Expected JSON Payload Format
The ESP32 sends a lightweight JSON payload over Wi-Fi HTTP POST:

```json
{
  "device_id": "ESP32_FIELD_01",
  "field_id": "field_01",
  "readings": {
    "soil_moisture": 38.0,
    "temperature": 29.4,
    "humidity": 67.0
  },
  "battery_pct": 94.0,
  "rssi_dbm": -62,
  "timestamp": "2026-09-06T10:00:00Z"
}
```

*(Note: The values above are illustrative examples. Any real changing sensor reading is dynamically accepted and interpreted.)*

### Testing with PowerShell (Simulating ESP32)

#### Test Case 1: Send Low Moisture (Triggers Drought Alert)
```powershell
$body = @{
    device_id = "ESP32_FIELD_01"
    field_id = "field_01"
    readings = @{
        soil_moisture = 22.0
        temperature = 31.5
        humidity = 48.0
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/telemetry" -Method Post -Body $body -ContentType "application/json"
```

#### Test Case 2: Send Optimal Moisture (Auto-Resolves Alert)
```powershell
$body = @{
    device_id = "ESP32_FIELD_01"
    field_id = "field_01"
    readings = @{
        soil_moisture = 65.0
        temperature = 25.0
        humidity = 65.0
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/telemetry" -Method Post -Body $body -ContentType "application/json"
```

### Testing with cURL
```bash
# Ingest reading
curl -X POST "http://localhost:8000/api/v1/telemetry" \
     -H "Content-Type: application/json" \
     -d '{
       "device_id": "ESP32_FIELD_01",
       "field_id": "field_01",
       "readings": {
         "soil_moisture": 58.0,
         "temperature": 26.5
       }
     }'

# Query updated dashboard
curl "http://localhost:8000/api/v1/farms/farm_01/dashboard"
```

---

## 4. Key Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health status & metadata |
| `POST` | `/api/v1/telemetry` | Batch telemetry ingestion (ESP32 friendly) |
| `POST` | `/api/v1/telemetry/reading` | Single reading ingestion |
| `GET` | `/api/v1/farms/{id}/dashboard` | Real-time aggregated farm dashboard |
| `GET` | `/api/v1/fields/{id}/readings` | Historical telemetry records query |
| `GET` | `/api/v1/farms/{id}/alerts` | Active and resolved alert list |
| `PATCH` | `/api/v1/alerts/{id}/resolve` | Mark alert as resolved |
| `GET` | `/api/v1/devices` | All registered IoT nodes & signal status |
| `GET` | `/api/v1/farms/{id}/insights` | Dynamic agronomic insight cards |
| `POST` | `/api/v1/ask` | Contextual agricultural Q&A assistant |
| `GET` | `/api/v1/weather` | Micro-climate weather & spraying conditions |
| `POST` | `/api/v1/crop-health/observation` | Ingest Edge AI camera lesion scans |

---

## 5. PostgreSQL Migration Guide

To switch from SQLite to PostgreSQL for production deployment:
1. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/acrovision_db
   ```
2. Install `asyncpg` or `psycopg2-binary`:
   ```powershell
   pip install psycopg2-binary
   ```
3. Run `init_db()` or use Alembic migrations. All SQLAlchemy models (`Farm`, `Field`, `Crop`, `Device`, `SensorReading`, `Alert`, `Insight`) are strictly typed and Postgres-ready.
