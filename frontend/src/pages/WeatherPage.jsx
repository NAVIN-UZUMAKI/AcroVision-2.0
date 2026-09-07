import { useData } from '../hooks/useData';
import {
  Sun,
  Wind,
  Droplets,
  CloudRain,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function WeatherPage() {
  const { weather } = useData();

  if (!weather) return null;

  const spray = weather.sprayAdvisory || {};

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Agricultural Weather & Spray Guide</h1>
          <p>
            Micro-climate tracking, rainfall windows, and field operation advisories for {weather.location}.
          </p>
        </div>

        <span className="badge badge-water" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
          {weather.isDemoData ? 'Simulated Local Weather Feed' : 'Live Station'}
        </span>
      </div>

      {/* Top 2 Columns: Current Conditions & Spray Advisory */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
        }}
        className="weather-top-grid"
      >
        {/* Current Weather Card */}
        <div className="acro-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <div className="card-title">
                <Sun size={20} style={{ color: '#EAB308' }} />
                <span>Today's Farm Climate</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {new Date(weather.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                margin: 'var(--space-md) 0',
              }}
            >
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {weather.temperature}°C
              </span>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{weather.condition}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Feels like {weather.feelsLike}°C • {weather.conditionDescription}
                </div>
              </div>
            </div>

            {/* Climate Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                padding: '12px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                margin: 'var(--space-md) 0',
              }}
            >
              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <Wind size={12} /> Wind
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>
                  {weather.windSpeedKmh} <span style={{ fontSize: '0.75rem' }}>km/h</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{weather.windDirection}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <Droplets size={12} /> Humidity
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>
                  {weather.humidity}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Relative</div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <CloudRain size={12} /> Rain
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>
                  {weather.precipitationMm} <span style={{ fontSize: '0.75rem' }}>mm</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Today</div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  <Sun size={12} /> UV Index
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '2px' }}>
                  {weather.uvIndex}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Moderate</div>
              </div>
            </div>
          </div>

          {/* Practical Meaning Box */}
          <div
            style={{
              backgroundColor: 'var(--forest-50)',
              border: '1px solid var(--forest-200)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--forest-900)' }}>
              🌾 Practical Field Meaning:
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--forest-800)', marginTop: '4px' }}>
              {weather.farmerSummary}
            </p>
          </div>
        </div>

        {/* Spray Advisory Card */}
        <div
          className="acro-card"
          style={{
            borderLeft: `4px solid ${
              spray.isSuitable ? 'var(--forest-600)' : 'var(--status-watch-solid)'
            }`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="card-header">
              <div className="card-title">
                {spray.isSuitable ? (
                  <CheckCircle2 size={20} style={{ color: 'var(--forest-700)' }} />
                ) : (
                  <AlertTriangle size={20} style={{ color: 'var(--status-watch-solid)' }} />
                )}
                <span>Crop Spraying Suitability</span>
              </div>
              <span
                className={`badge ${spray.isSuitable ? 'badge-good' : 'badge-watch'}`}
                style={{ fontSize: '0.725rem' }}
              >
                {spray.isSuitable ? 'SUITABLE' : 'UNFAVORABLE'}
              </span>
            </div>

            <div style={{ margin: 'var(--space-md) 0' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {spray.summary}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
                {spray.reason}
              </p>
            </div>

            {/* Optimal Window */}
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Recommended Spraying Window
              </div>
              <strong style={{ color: 'var(--forest-800)', fontSize: '0.925rem', marginTop: '2px', display: 'block' }}>
                {spray.bestWindow}
              </strong>
            </div>
          </div>

          {/* Irrigation Advisory Note */}
          <div
            style={{
              marginTop: 'var(--space-md)',
              padding: '10px 14px',
              backgroundColor: 'var(--water-blue-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--water-blue-border)',
              fontSize: '0.825rem',
              color: 'var(--water-blue-text)',
            }}
          >
            <strong>💧 Irrigation Outlook: </strong>
            {weather.irrigationGuidance}
          </div>
        </div>
      </div>

      {/* 5-Day Detailed Agricultural Forecast */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={20} style={{ color: 'var(--forest-700)' }} />
          <span>5-Day Farm Operations Forecast</span>
        </h2>

        <div className="grid-cols-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-md)' }}>
          {weather.forecast?.map((day) => (
            <div
              key={day.date}
              className="acro-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{day.dayName}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{day.date.slice(5)}</span>
                </div>

                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--forest-900)', margin: '6px 0' }}>
                  {day.tempHigh}° <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {day.tempLow}°C</span>
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {day.condition}
                </div>

                <div style={{ display: 'flex', gap: '8px', margin: '8px 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>💧 {day.precipChance}%</span>
                  <span>💨 {day.windSpeedKmh} km/h</span>
                </div>
              </div>

              <div
                style={{
                  marginTop: 'var(--space-sm)',
                  padding: '8px 10px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--forest-900)',
                  fontWeight: 600,
                  lineHeight: 1.3,
                }}
              >
                👉 {day.farmingAdvice}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 960px) {
          .weather-top-grid {
            grid-template-columns: 1fr !important;
          }
          .grid-cols-5 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .grid-cols-5 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
