from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class DeviceBase(BaseModel):
    device_id: str = Field(..., json_schema_extra={"example": "ESP32_FIELD_01"})
    field_id: Optional[str] = Field(default=None, json_schema_extra={"example": "field_01"})
    device_type: str = Field(default="ESP32_NODE", json_schema_extra={"example": "ESP32_SOIL_NODE"})
    name: str = Field(..., json_schema_extra={"example": "ESP32 Field-01 Node"})


class DeviceCreate(DeviceBase):
    id: Optional[str] = None


class DeviceUpdate(BaseModel):
    field_id: Optional[str] = None
    name: Optional[str] = None
    device_type: Optional[str] = None


class DeviceResponse(DeviceBase):
    id: str
    status: str
    battery_pct: Optional[float] = None
    rssi_dbm: Optional[int] = None
    last_seen_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    freshness: Optional[str] = None
    freshness_label: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
