from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.crop import CropResponse


class FieldBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "North Tomato Block"})
    area: float = Field(..., gt=0, json_schema_extra={"example": 5.0})
    area_unit: str = Field(default="acres", json_schema_extra={"example": "acres"})
    soil_type: str = Field(default="Loam", json_schema_extra={"example": "Loam"})
    irrigation_method: str = Field(default="Precision Drip Irrigation", json_schema_extra={"example": "Precision Drip Irrigation"})


class FieldCreate(FieldBase):
    id: Optional[str] = None
    farm_id: str = Field(..., json_schema_extra={"example": "farm_01"})
    # Optional nested crop initialization on creation
    crop_name: Optional[str] = None
    crop_variety: Optional[str] = None
    growth_stage: Optional[str] = None


class FieldUpdate(BaseModel):
    name: Optional[str] = None
    area: Optional[float] = None
    area_unit: Optional[str] = None
    soil_type: Optional[str] = None
    irrigation_method: Optional[str] = None


class FieldResponse(FieldBase):
    id: str
    farm_id: str
    created_at: datetime
    updated_at: datetime
    crop: Optional[CropResponse] = None
    current_status: Optional[str] = None
    health_score: Optional[int] = None
    summary_advice: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
