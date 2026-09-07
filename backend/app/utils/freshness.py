from datetime import datetime, timezone
from typing import Optional, Tuple, Dict, Any
from app.core.config import settings


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


def determine_freshness(
    timestamp: Optional[datetime],
    is_online: bool = True,
    current_time: Optional[datetime] = None,
) -> Tuple[str, str]:
    """
    Determine freshness code and human-readable label based on telemetry timestamp.
    
    Freshness codes:
    - CURRENT: reading within RECENT_THRESHOLD_MINUTES (15m)
    - RECENT: reading within STALE_THRESHOLD_MINUTES (60m)
    - STALE: reading within DISCONNECT_THRESHOLD_MINUTES (180m)
    - DISCONNECTED: older than 180m or explicitly offline
    - NO_DATA: no timestamp available
    """
    if timestamp is None:
        return "NO_DATA", "No live telemetry yet"

    if not is_online:
        return "DISCONNECTED", "Sensor node disconnected"

    now = current_time or get_utc_now()

    # Ensure timestamp has timezone awareness
    if timestamp.tzinfo is None:
        ts_utc = timestamp.replace(tzinfo=timezone.utc)
    else:
        ts_utc = timestamp

    diff_seconds = max(0.0, (now - ts_utc).total_seconds())
    diff_minutes = int(diff_seconds // 60)

    if diff_minutes < settings.RECENT_THRESHOLD_MINUTES:
        code = "CURRENT"
        if diff_minutes == 0:
            label = "Updated just now"
        else:
            label = f"Updated {diff_minutes} min ago"
    elif diff_minutes < settings.STALE_THRESHOLD_MINUTES:
        code = "RECENT"
        label = f"Updated {diff_minutes} min ago"
    elif diff_minutes < settings.DISCONNECT_THRESHOLD_MINUTES:
        code = "STALE"
        hours = diff_minutes // 60
        label = f"Updated {hours}h ago (Data may be outdated)"
    else:
        code = "DISCONNECTED"
        label = "No recent data (>3h)"

    return code, label


def get_data_freshness_info(timestamp: Optional[datetime], is_online: bool = True) -> Dict[str, Any]:
    code, label = determine_freshness(timestamp, is_online=is_online)
    return {
        "freshness": code,
        "freshness_label": label,
        "is_fresh": code in ("CURRENT", "RECENT"),
        "timestamp": timestamp.isoformat() if timestamp else None,
    }
