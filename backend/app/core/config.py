import os
import json
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "AcroVision Smart Farming API")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./acrovision.db")
    AUTO_SEED_METADATA: bool = os.getenv("AUTO_SEED_METADATA", "true").lower() in ("true", "1", "yes")

    # Freshness threshold settings in minutes
    DISCONNECT_THRESHOLD_MINUTES: int = int(os.getenv("DISCONNECT_THRESHOLD_MINUTES", "180"))
    STALE_THRESHOLD_MINUTES: int = int(os.getenv("STALE_THRESHOLD_MINUTES", "60"))
    RECENT_THRESHOLD_MINUTES: int = int(os.getenv("RECENT_THRESHOLD_MINUTES", "15"))

    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw = os.getenv("CORS_ORIGINS", "")
        if not raw:
            return [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8000",
                "http://127.0.0.1:8000",
                "*",
            ]
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                return parsed
        except Exception:
            pass
        return [origin.strip() for origin in raw.split(",") if origin.strip()]


settings = Settings()
