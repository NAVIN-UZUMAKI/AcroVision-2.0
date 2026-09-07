from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.field import FieldCreate, FieldUpdate, FieldResponse
from app.schemas.crop import CropCreate, CropResponse
from app.services.field_service import FieldService

router = APIRouter()


@router.get("/fields", response_model=List[FieldResponse], summary="List All Fields")
def list_fields(farm_id: Optional[str] = None, db: Session = Depends(get_db)):
    return FieldService.get_all(db, farm_id=farm_id)


@router.get("/farms/{farm_id}/fields", response_model=List[FieldResponse], summary="List Fields by Farm")
def list_fields_by_farm(farm_id: str, db: Session = Depends(get_db)):
    return FieldService.get_all(db, farm_id=farm_id)


@router.post("/fields", response_model=FieldResponse, status_code=status.HTTP_201_CREATED, summary="Create New Field")
def create_field(field_in: FieldCreate, db: Session = Depends(get_db)):
    return FieldService.create(db, field_in)


@router.get("/fields/{field_id}", response_model=FieldResponse, summary="Get Field By ID")
def get_field(field_id: str, db: Session = Depends(get_db)):
    field = FieldService.get_by_id(db, field_id)
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field


@router.put("/fields/{field_id}", response_model=FieldResponse, summary="Update Field")
def update_field(field_id: str, field_in: FieldUpdate, db: Session = Depends(get_db)):
    field = FieldService.update(db, field_id, field_in)
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field


@router.delete("/fields/{field_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Field")
def delete_field(field_id: str, db: Session = Depends(get_db)):
    success = FieldService.delete(db, field_id)
    if not success:
        raise HTTPException(status_code=404, detail="Field not found")
    return None


@router.get("/fields/{field_id}/crop", response_model=Optional[CropResponse], summary="Get Crop for Field")
def get_field_crop(field_id: str, db: Session = Depends(get_db)):
    crop = FieldService.get_crop_by_field(db, field_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found for this field")
    return crop


@router.post("/crops", response_model=CropResponse, status_code=status.HTTP_201_CREATED, summary="Set / Update Crop for Field")
def set_field_crop(crop_in: CropCreate, db: Session = Depends(get_db)):
    return FieldService.set_or_update_crop(db, crop_in)
