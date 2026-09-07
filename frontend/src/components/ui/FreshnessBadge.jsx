import { Clock, AlertTriangle, WifiOff, Check } from 'lucide-react';

export default function FreshnessBadge({ freshness, label, isOnline = true }) {
  const norm = (freshness || '').toUpperCase();

  if (!isOnline || norm === 'DISCONNECTED') {
    return (
      <span className="freshness-pill disconnected" title="Sensor node is disconnected">
        <WifiOff size={11} aria-hidden="true" />
        <span>{label || 'Sensor disconnected'}</span>
      </span>
    );
  }

  if (norm === 'STALE' || norm === 'OUTDATED') {
    return (
      <span className="freshness-pill stale" title="Data may be outdated">
        <AlertTriangle size={11} aria-hidden="true" />
        <span>{label || 'Updated hours ago — Data may be outdated'}</span>
      </span>
    );
  }

  if (norm === 'NO_DATA') {
    return (
      <span className="freshness-pill disconnected">
        <AlertTriangle size={11} aria-hidden="true" />
        <span>{label || 'No recent data'}</span>
      </span>
    );
  }

  return (
    <span className="freshness-pill current" title="Live telemetry synced">
      {norm === 'CURRENT' ? <Check size={11} aria-hidden="true" /> : <Clock size={11} aria-hidden="true" />}
      <span>{label || 'Live data'}</span>
    </span>
  );
}
