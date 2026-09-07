from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class InsightBase(BaseModel):
    farm_id: str = Field(..., json_schema_extra={"example": "farm_01"})
    field_id: Optional[str] = Field(default=None, json_schema_extra={"example": "field_01"})
    category: str = Field(default="IRRIGATION", json_schema_extra={"example": "IRRIGATION"})
    title: str = Field(..., json_schema_extra={"example": "North Tomato Block Irrigation Timing"})
    observation: str = Field(..., json_schema_extra={"example": "Soil moisture is at 38%, below preferred target for flowering stage."})
    explanation: str = Field(..., json_schema_extra={"example": "Soil is drying out under sunny afternoon conditions."})
    recommendation: str = Field(..., json_schema_extra={"example": "Water tomorrow morning at 06:30 AM before peak heat."})
    confidence: float = Field(default=0.92, ge=0.0, le=1.0, json_schema_extra={"example": 0.92})


class InsightCreate(InsightBase):
    id: Optional[str] = None


class InsightResponse(InsightBase):
    id: str
    created_at: datetime
    field_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
