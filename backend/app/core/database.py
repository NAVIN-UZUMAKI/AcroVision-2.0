import os
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

is_sqlite = settings.DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all database tables and seed minimal metadata if empty."""
    # Import all models to ensure they are registered on Base.metadata
    from app.models.farm import Farm
    from app.models.field import Field
    from app.models.crop import Crop
    from app.models.device import Device
    from app.models.sensor_reading import SensorReading
    from app.models.alert import Alert
    from app.models.insight import Insight

    Base.metadata.create_all(bind=engine)

    if settings.AUTO_SEED_METADATA:
        seed_initial_metadata()


def seed_initial_metadata():
    """
    Seed initial structural metadata (Farm, Field, Crop, Device) ONLY if empty.
    IMPORTANT: We do NOT insert fake sensor telemetry readings.
    The system starts in a clean 'No live telemetry yet' state until real readings arrive.
    """
    from app.models.farm import Farm
    from app.models.field import Field
    from app.models.crop import Crop
    from app.models.device import Device

    db: Session = SessionLocal()
    try:
        if db.query(Farm).count() == 0:
            now = datetime.now(timezone.utc)
            demo_farm = Farm(
                id="farm_01",
                name="Green Valley Organic Farm",
                location="Coimbatore, Tamil Nadu, India",
                area=15.0,
                area_unit="acres",
                farm_type="Organic Crop Farm",
                owner_name="Ramesh Patel",
                created_at=now,
                updated_at=now,
            )
            db.add(demo_farm)

            field_1 = Field(
                id="field_01",
                farm_id="farm_01",
                name="North Tomato Block",
                area=5.0,
                area_unit="acres",
                soil_type="Loam",
                irrigation_method="Precision Drip Irrigation",
                created_at=now,
                updated_at=now,
            )
            field_2 = Field(
                id="field_02",
                farm_id="farm_01",
                name="South Berry Greenhouse",
                area=3.5,
                area_unit="acres",
                soil_type="Sandy Loam",
                irrigation_method="Micro-Sprinkler",
                created_at=now,
                updated_at=now,
            )
            db.add_all([field_1, field_2])

            crop_1 = Crop(
                id="crop_01",
                field_id="field_01",
                crop_name="Tomato",
                variety="Roma Hybrid",
                growth_stage="Flowering",
                planting_date=now,
                created_at=now,
                updated_at=now,
            )
            crop_2 = Crop(
                id="crop_02",
                field_id="field_02",
                crop_name="Strawberry",
                variety="Albion Day-Neutral",
                growth_stage="Fruiting",
                planting_date=now,
                created_at=now,
                updated_at=now,
            )
            db.add_all([crop_1, crop_2])

            device_1 = Device(
                id="dev_01",
                device_id="ESP32_FIELD_01",
                field_id="field_01",
                device_type="ESP32_SOIL_NODE",
                name="ESP32 Field-01 Gateway Node",
                status="NO_DATA",
                battery_pct=None,
                rssi_dbm=None,
                last_seen_at=None,
                created_at=now,
                updated_at=now,
            )
            device_2 = Device(
                id="dev_02",
                device_id="ESP32_FIELD_02",
                field_id="field_02",
                device_type="ESP32_GREENHOUSE_NODE",
                name="ESP32 Greenhouse-02 Node",
                status="NO_DATA",
                battery_pct=None,
                rssi_dbm=None,
                last_seen_at=None,
                created_at=now,
                updated_at=now,
            )
            db.add_all([device_1, device_2])

            db.commit()
    except Exception as e:
        db.rollback()
        print(f"[init_db] Seed metadata warning: {e}")
    finally:
        db.close()
