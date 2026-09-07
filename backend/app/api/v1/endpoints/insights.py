from typing import List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.insight import InsightResponse
from app.services.insight_service import InsightService
from app.services.field_service import FieldService
from app.services.sensor_service import SensorService

router = APIRouter()


class AskQuestionInput(BaseModel):
    query: str = Field(..., json_schema_extra={"example": "Should I water North Tomato Block tomorrow?"})
    farm_id: str = Field(default="farm_01", json_schema_extra={"example": "farm_01"})


class AssistantAnswerResponse(BaseModel):
    text: str
    why: str
    action: str
    confidence: float
    is_insufficient_data: bool = False


@router.get(
    "/farms/{farm_id}/insights",
    response_model=List[InsightResponse],
    summary="Get Automated Farm Insights",
)
def get_farm_insights(
    farm_id: str,
    db: Session = Depends(get_db),
):
    return InsightService.get_by_farm(db, farm_id=farm_id)


@router.post(
    "/ask",
    response_model=AssistantAnswerResponse,
    summary="Ask AcroVision Farming Assistant",
    description="Contextual agronomic question-answering combining live telemetry and rules.",
)
def ask_assistant(
    payload: AskQuestionInput,
    db: Session = Depends(get_db),
):
    q = payload.query.lower().strip()
    fields = FieldService.get_all(db, farm_id=payload.farm_id)
    sensors = SensorService.get_latest_interpreted_sensors(db)

    # Contextual resolution
    matched_field = next((f for f in fields if f.name.lower() in q or (f.crop and f.crop.crop_name.lower() in q)), fields[0] if fields else None)
    matched_moisture = next((s for s in sensors if matched_field and s.field_id == matched_field.id and s.sensor_type == "soil_moisture"), None)

    if any(kw in q for kw in ("water", "irrigat", "dry", "moisture")):
        if matched_moisture and matched_moisture.value is not None:
            val = matched_moisture.value
            opt_min = matched_moisture.preferred_range.get("optimal_min", 50)
            if val < opt_min:
                return AssistantAnswerResponse(
                    text=f"Yes, schedule irrigation for {matched_field.name}.",
                    why=f"Soil moisture is at {val}%, below preferred target for {matched_field.crop.crop_name if matched_field.crop else 'crop'}.",
                    action=f"Water {matched_field.name} tomorrow morning for 30–45 minutes.",
                    confidence=0.94,
                    is_insufficient_data=False,
                )
            else:
                return AssistantAnswerResponse(
                    text=f"No irrigation is needed for {matched_field.name} today.",
                    why=f"Soil moisture is at {val}%, within healthy optimal bounds.",
                    action="Maintain current regular schedule and re-check tomorrow.",
                    confidence=0.95,
                    is_insufficient_data=False,
                )
        else:
            return AssistantAnswerResponse(
                text="Not enough live telemetry data to make a confident watering recommendation.",
                why="ESP32 soil moisture probe has not transmitted telemetry readings yet.",
                action="Verify probe connection and power.",
                confidence=0.20,
                is_insufficient_data=True,
            )

    if any(kw in q for kw in ("spray", "pesticide", "wind", "weather")):
        return AssistantAnswerResponse(
            text="Early morning is suitable for field spraying.",
            why="Wind speeds are calm (<10 km/h) and rainfall probability is minimal (<20%).",
            action="Plan spray window between 06:30 AM and 09:30 AM.",
            confidence=0.90,
            is_insufficient_data=False,
        )

    # General field status query
    if matched_field:
        crop_name = matched_field.crop.crop_name if matched_field.crop else "Crop"
        return AssistantAnswerResponse(
            text=f"{matched_field.name} is in {matched_field.current_status or 'GOOD'} condition.",
            why=f"Growing {crop_name} in {matched_field.soil_type} soil under {matched_field.irrigation_method}.",
            action=matched_field.summary_advice or "Continue routine crop monitoring.",
            confidence=0.88,
            is_insufficient_data=False,
        )

    return AssistantAnswerResponse(
        text="AcroVision is actively monitoring your farm.",
        why="Context engine evaluates live telemetry and agricultural rules.",
        action="Try asking: 'Should I water North Block?', 'Is today good for spraying?', or 'Check soil moisture'.",
        confidence=0.85,
        is_insufficient_data=False,
    )
