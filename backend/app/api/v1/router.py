from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    telemetry,
    farms,
    fields,
    sensors,
    devices,
    dashboard,
    alerts,
    insights,
    crop_health,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(telemetry.router, tags=["Telemetry & IoT Ingestion"])
api_router.include_router(farms.router, tags=["Farms"])
api_router.include_router(fields.router, tags=["Fields & Crops"])
api_router.include_router(sensors.router, tags=["Sensors & Telemetry"])
api_router.include_router(devices.router, tags=["Devices & Microcontrollers"])
api_router.include_router(dashboard.router, tags=["Dashboard"])
api_router.include_router(alerts.router, tags=["Alerts & Action Center"])
api_router.include_router(insights.router, tags=["AI Insights & Assistant"])
api_router.include_router(crop_health.router, tags=["Crop Health & Edge AI"])
