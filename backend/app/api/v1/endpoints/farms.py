from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from app.services.farm_service import FarmService

router = APIRouter()


@router.get("/farms", response_model=List[FarmResponse], summary="List All Farms")
def list_farms(db: Session = Depends(get_db)):
    return FarmService.get_all(db)


@router.post("/farms", response_model=FarmResponse, status_code=status.HTTP_201_CREATED, summary="Create New Farm")
def create_farm(farm_in: FarmCreate, db: Session = Depends(get_db)):
    return FarmService.create(db, farm_in)


@router.get("/farms/{farm_id}", response_model=FarmResponse, summary="Get Farm By ID")
def get_farm(farm_id: str, db: Session = Depends(get_db)):
    farm = FarmService.get_by_id(db, farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm


@router.put("/farms/{farm_id}", response_model=FarmResponse, summary="Update Farm")
def update_farm(farm_id: str, farm_in: FarmUpdate, db: Session = Depends(get_db)):
    farm = FarmService.update(db, farm_id, farm_in)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm


@router.delete("/farms/{farm_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete Farm")
def delete_farm(farm_id: str, db: Session = Depends(get_db)):
    success = FarmService.delete(db, farm_id)
    if not success:
        raise HTTPException(status_code=404, detail="Farm not found")
    return None
