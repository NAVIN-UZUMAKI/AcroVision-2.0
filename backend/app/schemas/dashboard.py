from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.farm import FarmResponse
from app.schemas.field import FieldResponse
from app.schemas.device import DeviceResponse
from app.schemas.telemetry import InterpretedSensorResponse
from app.schemas.alert import AlertResponse
from app.schemas.insight import InsightResponse


class DashboardResponse(BaseModel):
    farm: Optional[FarmResponse] = None
    efficiency_score: int
    overall_status: str
    status_label: str
    summary_message: str
    penalties: List[str] = []
    urgent_actions: List[AlertResponse] = []
    recommendations: List[Dict[str, Any]] = []
    fields: List[FieldResponse] = []
    key_sensors: List[InterpretedSensorResponse] = []
    devices: List[DeviceResponse] = []
    insights: List[InsightResponse] = []
    weather: Optional[Dict[str, Any]] = None
    last_sync_time: datetime
