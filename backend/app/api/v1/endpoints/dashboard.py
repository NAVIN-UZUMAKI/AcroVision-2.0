from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get(
    "/farms/{farm_id}/dashboard",
    response_model=DashboardResponse,
    summary="Get Farmer Command Center Dashboard",
    description=(
        "Returns the complete farm command center state structured around primary farmer questions: "
        "1. Farm Status, 2. What needs attention, 3. What to do next, 4. Field & Crop states, 5. Probes & Devices."
    ),
)
def get_farm_dashboard(
    farm_id: str,
    db: Session = Depends(get_db),
):
    data = DashboardService.get_dashboard_data(db, farm_id)
    if not data:
        raise HTTPException(status_code=404, detail="Farm not found")
    return data
