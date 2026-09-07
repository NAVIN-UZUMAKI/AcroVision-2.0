from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class TelemetryBatchInput(BaseModel):
    device_id: str = Field(..., json_schema_extra={"example": "ESP32_FIELD_01"})
    field_id: Optional[str] = Field(default=None, json_schema_extra={"example": "field_01"})
    readings: Dict[str, float] = Field(
        ...,
        json_schema_extra={"example": {"soil_moisture": 38.0, "temperature": 29.4, "humidity": 67.0}},
    )
    battery_pct: Optional[float] = Field(default=None, ge=0.0, le=100.0, json_schema_extra={"example": 94.0})
    rssi_dbm: Optional[int] = Field(default=None, json_schema_extra={"example": -64})
    timestamp: Optional[datetime] = None


class SingleReadingInput(BaseModel):
    device_id: str = Field(..., json_schema_extra={"example": "ESP32_FIELD_01"})
    field_id: Optional[str] = Field(default=None, json_schema_extra={"example": "field_01"})
    sensor_type: str = Field(..., json_schema_extra={"example": "soil_moisture"})
    value: float = Field(..., json_schema_extra={"example": 38.0})
    unit: Optional[str] = Field(default=None, json_schema_extra={"example": "%"})
    timestamp: Optional[datetime] = None


class SensorReadingResponse(BaseModel):
    id: int
    device_id: str
    field_id: str
    sensor_type: str
    value: float
    unit: str
    timestamp: datetime
    created_at: datetime
    freshness: Optional[str] = None
    freshness_label: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class InterpretedSensorResponse(BaseModel):
    id: str
    sensor_type: str
    name: str
    field_id: str
    field_name: str
    crop_name: str
    value: Optional[float]
    unit: str
    status: str
    status_label: str
    preferred_range: Dict[str, Any]
    explanation: str
    recommendation: Optional[str]
    freshness: str
    freshness_label: str
    is_online: bool
    timestamp: Optional[datetime] = None


class TelemetryIngestResponse(BaseModel):
    success: bool = True
    device_id: str
    field_id: str
    stored_readings: int
    interpretations: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    alerts_created: List[Dict[str, Any]]
    timestamp: datetime
