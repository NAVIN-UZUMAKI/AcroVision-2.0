import { useMode } from '../../hooks/useMode';
import StatusBadge from './StatusBadge';
import FreshnessBadge from './FreshnessBadge';
import { Droplets, Thermometer, Sun, CloudRain, FlaskConical, Zap, Leaf } from 'lucide-react';

const ICON_MAP = {
  soil_moisture: Droplets,
  soil_temp: Thermometer,
  air_temp: Sun,
  air_humidity: CloudRain,
  soil_ph: FlaskConical,
  soil_ec: Zap,
  nitrogen: Leaf,
};

const SIMPLE_NAME_MAP = {
  soil_moisture: 'Soil moisture',
  soil_temp: 'Soil temperature',
  air_temp: 'Air temperature',
  air_humidity: 'Air humidity',
  soil_ph: 'Soil pH',
  soil_ec: 'Soil salt level',
  nitrogen: 'Nitrogen level',
};

export default function MetricCard({
  sensor,
  showField = true,
  onClick,
}) {
  const { isAdvancedMode } = useMode();

  if (!sensor) return null;

  const reading = sensor.currentReading || {};
  const {
    value,
    unit,
    status,
    statusLabel,
    preferredRange = {},
    explanation,
    recommendation,
    freshness,
    freshnessLabel,
  } = reading;

  const Icon = ICON_MAP[sensor.type] || Droplets;
  const isOnline = sensor.isOnline !== false;

  // Calculate percentage for progress range bar
  const minVal = preferredRange.min ?? 0;
  const maxVal = preferredRange.max ?? 100;
  const optMin = preferredRange.optimalMin ?? 40;
  const optMax = preferredRange.optimalMax ?? 70;

  const rangeSpan = Math.max(1, maxVal - minVal);
  const optLeftPercent = Math.max(0, Math.min(100, ((optMin - minVal) / rangeSpan) * 100));
  const optWidthPercent = Math.max(0, Math.min(100 - optLeftPercent, ((optMax - optMin) / rangeSpan) * 100));

  const currentMarkerPercent = value !== null
    ? Math.max(0, Math.min(100, ((value - minVal) / rangeSpan) * 100))
    : null;

  return (
    <div
      className={`acro-card ${onClick ? 'interactive' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : 'region'}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${sensor.name}: ${value !== null ? `${value}${unit}` : 'No data'}, Status: ${statusLabel}`}
    >
      {/* Header */}
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--forest-50)',
              color: 'var(--forest-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} aria-hidden="true" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{sensor.name}</h4>
            {showField && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {sensor.fieldName}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={status} customLabel={statusLabel} size="sm" />
      </div>

      {/* Main Metric Value */}
      <div style={{ margin: 'var(--space-md) 0 var(--space-sm) 0' }}>
        {value !== null && isOnline ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span
              className={isAdvancedMode ? 'mono' : ''}
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
              }}
            >
              {value}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {unit}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-light)' }}>
              —
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              No live data
            </span>
          </div>
        )}
      </div>

      {/* Visual Range Indicator Bar */}
      {isOnline && value !== null && (
        <div className="range-bar-container">
          <div className="range-bar-track" aria-hidden="true">
            {/* Preferred Zone */}
            <div
              className="range-bar-preferred"
              style={{
                left: `${optLeftPercent}%`,
                width: `${optWidthPercent}%`,
              }}
              title={`Target Range: ${optMin}–${optMax}${unit}`}
            />
            {/* Current Value Marker */}
            {currentMarkerPercent !== null && (
              <div
                className="range-bar-marker"
                style={{
                  left: `${currentMarkerPercent}%`,
                  backgroundColor:
                    status === 'URGENT'
                      ? 'var(--status-urgent-solid)'
                      : status === 'ACTION NEEDED'
                      ? 'var(--status-action-solid)'
                      : 'var(--forest-800)',
                }}
              />
            )}
          </div>
          <div className="range-bar-legend">
            <span>Min: {minVal}{unit}</span>
            <span style={{ color: 'var(--forest-700)', fontWeight: 600 }}>
              Target: {optMin}–{optMax}{unit}
            </span>
            <span>Max: {maxVal}{unit}</span>
          </div>
        </div>
      )}

            {/* Agronomic Explanation / Recommendation */}
      <div
        style={{
          marginTop: 'var(--space-md)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-secondary)',
          fontSize: '0.825rem',
        }}
      >
        {isAdvancedMode ? (
          <>
            <p style={{ color: 'var(--text-secondary)', marginBottom: recommendation ? '4px' : 0 }}>
              {explanation}
            </p>
            {recommendation && (
              <p style={{ color: 'var(--forest-800)', fontWeight: 600 }}>
                👉 {recommendation}
              </p>
            )}
          </>
        ) : (
          <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 600 }}>
            {value !== null && isOnline
              ? `${SIMPLE_NAME_MAP[sensor.type] || sensor.name} = ${value}${unit} — ${(statusLabel || '').toLowerCase()}`
              : 'No reading right now.'}
          </p>
        )}
      </div>

      {/* Footer / Telemetry Data in Advanced Mode */}
      <div
        style={{
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        <FreshnessBadge freshness={freshness} label={freshnessLabel} isOnline={isOnline} />

        {isAdvancedMode && (
          <span
            className="mono"
            style={{
              fontSize: '0.725rem',
              color: 'var(--text-light)',
            }}
          >
            ID: {sensor.id} • {sensor.depthOrPlacement}
          </span>
        )}
      </div>
    </div>
  );
}
