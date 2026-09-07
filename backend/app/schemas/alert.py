from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class AlertBase(BaseModel):
    farm_id: str = Field(..., json_schema_extra={"example": "farm_01"})
    field_id: Optional[str] = Field(default=None, json_schema_extra={"example": "field_01"})
    sensor_type: Optional[str] = Field(default=None, json_schema_extra={"example": "soil_moisture"})
    severity: str = Field(default="ACTION_NEEDED", json_schema_extra={"example": "ACTION_NEEDED"})
    title: str = Field(..., json_schema_extra={"example": "North Tomato Block is getting dry"})
    message: str = Field(..., json_schema_extra={"example": "Soil moisture is at 38%, dipping below optimal target (55–75%)."})
    recommendation: Optional[str] = Field(default=None, json_schema_extra={"example": "Schedule irrigation tomorrow morning before peak solar hours."})


class AlertCreate(AlertBase):
    id: Optional[str] = None


class AlertUpdate(BaseModel):
    status: Optional[str] = None
    resolved_at: Optional[datetime] = None


class AlertResponse(AlertBase):
    id: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    field_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
