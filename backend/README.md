# AcroVision FastAPI Backend

Please see [`../BACKEND.md`](../BACKEND.md) for full architectural documentation, ESP32 payload formats, and testing commands.

## Quick Run:
```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Run Tests:
```powershell
.\.venv\Scripts\python.exe -m pytest -v
```
