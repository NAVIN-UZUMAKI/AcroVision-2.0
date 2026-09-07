from datetime import datetime, timezone
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1. Import Base and ALL models explicitly first so metadata has all table definitions
from app.core.database import Base, get_db
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop
from app.models.device import Device
from app.models.sensor_reading import SensorReading
from app.models.alert import Alert
from app.models.insight import Insight

from main import app

from sqlalchemy.pool import StaticPool

# Test SQLite in-memory database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    # Create all tables on the in-memory engine
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed structural test metadata
    now = datetime.now(timezone.utc)
    farm = Farm(
        id="farm_01",
        name="Test Valley Farm",
        location="Test Region",
        area=10.0,
        area_unit="acres",
        farm_type="Organic Crop Farm",
        owner_name="Test Farmer",
        created_at=now,
        updated_at=now,
    )
    db.add(farm)

    field = Field(
        id="field_01",
        farm_id="farm_01",
        name="Test Tomato Plot",
        area=4.0,
        area_unit="acres",
        soil_type="Loam",
        irrigation_method="Precision Drip",
        created_at=now,
        updated_at=now,
    )
    db.add(field)

    crop = Crop(
        id="crop_01",
        field_id="field_01",
        crop_name="Tomato",
        variety="Roma Hybrid",
        growth_stage="Flowering",
        planting_date=now,
        created_at=now,
        updated_at=now,
    )
    db.add(crop)

    device = Device(
        id="dev_01",
        device_id="ESP32_FIELD_01",
        field_id="field_01",
        device_type="ESP32_NODE",
        name="ESP32 Test Node",
        status="NO_DATA",
        created_at=now,
        updated_at=now,
    )
    db.add(device)
    db.commit()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
