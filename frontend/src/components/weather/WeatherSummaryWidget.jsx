import { useData } from '../../hooks/useData';
import { Sun, Wind, Droplets, CloudRain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WeatherSummaryWidget({ showForecast = true }) {
  const { weather } = useData();
  const navigate = useNavigate();

  if (!weather) return null;

  return (
    <div className="acro-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div className="card-header">
          <div className="card-title">
            <Sun size={20} style={{ color: '#EAB308' }} aria-hidden="true" />
            <span>Farm Weather & Work Outlook</span>
          </div>
          <span className="badge badge-water" style={{ fontSize: '0.725rem' }}>
            {weather.isDemoData ? 'Simulated Station' : 'Live Sensor'}
          </span>
        </div>

        {/* Hero Current Weather */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 'var(--space-md) 0',
            flexWrap: 'wrap',
            gap: 'var(--space-md)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {weather.temperature}°C
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {weather.condition}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Feels like {weather.feelsLike}°C • {weather.location}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-md)',
              backgroundColor: 'var(--bg-secondary)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Wind size={13} /> Wind
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{weather.windSpeedKmh} km/h</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Droplets size={13} /> Humidity
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{weather.humidity}%</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <CloudRain size={13} /> Rain
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{weather.precipitationMm} mm</div>
            </div>
          </div>
        </div>

        {/* Practical Farmer Meaning */}
        <div
          style={{
            backgroundColor: 'var(--forest-50)',
            border: '1px solid var(--forest-100)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: 'var(--space-md)',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--forest-900)' }}>
            🌾 Farming Advice:
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--forest-800)', marginTop: '2px' }}>
            {weather.farmerSummary}
          </p>
        </div>

        {/* 5-Day Mini Forecast */}
        {showForecast && weather.forecast && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              5-Day Farm Forecast
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px',
                textAlign: 'center',
              }}
            >
              {weather.forecast.map((day) => (
                <div
                  key={day.date}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{day.dayName}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', margin: '3px 0' }}>
                    {day.tempHigh}° / {day.tempLow}°
                  </div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: day.precipChance > 40 ? 'var(--water-blue-solid)' : 'var(--forest-700)',
                      fontWeight: 600,
                    }}
                  >
                    {day.precipChance}% rain
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Link */}
      <div
        style={{
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/weather')}
          style={{ fontWeight: 700, color: 'var(--forest-700)' }}
        >
          <span>Full Spray & Field Outlook</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
