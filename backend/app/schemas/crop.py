from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CropBase(BaseModel):
    crop_name: str = Field(..., json_schema_extra={"example": "Tomato"})
    variety: Optional[str] = Field(default="Standard Variety", json_schema_extra={"example": "Roma Hybrid"})
    growth_stage: str = Field(default="Vegetative Growth", json_schema_extra={"example": "Flowering"})
    planting_date: Optional[datetime] = None


class CropCreate(CropBase):
    id: Optional[str] = None
    field_id: str = Field(..., json_schema_extra={"example": "field_01"})


class CropUpdate(BaseModel):
    crop_name: Optional[str] = None
    variety: Optional[str] = None
    growth_stage: Optional[str] = None
    planting_date: Optional[datetime] = None


class CropResponse(CropBase):
    id: str
    field_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
