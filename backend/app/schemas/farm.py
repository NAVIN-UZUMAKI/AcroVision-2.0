from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class FarmBase(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Green Valley Organic Farm"})
    location: str = Field(..., json_schema_extra={"example": "Coimbatore, Tamil Nadu, India"})
    area: float = Field(..., gt=0, json_schema_extra={"example": 15.0})
    area_unit: str = Field(default="acres", json_schema_extra={"example": "acres"})
    farm_type: str = Field(default="Organic Crop Farm", json_schema_extra={"example": "Organic Crop Farm"})
    owner_name: Optional[str] = Field(default="Farmer", json_schema_extra={"example": "Ramesh Patel"})


class FarmCreate(FarmBase):
    id: Optional[str] = Field(default=None, json_schema_extra={"example": "farm_01"})


class FarmUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    area: Optional[float] = None
    area_unit: Optional[str] = None
    farm_type: Optional[str] = None
    owner_name: Optional[str] = None


class FarmResponse(FarmBase):
    id: str
    created_at: datetime
    updated_at: datetime
    efficiency_score: Optional[int] = None
    overall_status: Optional[str] = None
    field_count: Optional[int] = None
    active_device_count: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
