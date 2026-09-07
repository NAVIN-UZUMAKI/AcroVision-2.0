import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFarm } from '../hooks/useFarm';
import { useMode } from '../hooks/useMode';
import {
  User,
  Building2,
  Sliders,
  Moon,
  Sun,
  Globe,
  WifiOff,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { activeFarm } = useFarm();
  const {
    isAdvancedMode,
    setMode,
    theme,
    toggleTheme,
    units,
    setUnits,
    isOffline,
    toggleOffline,
  } = useMode();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Farm Settings & Preferences</h1>
          <p>
            Configure farmer profile, view modes, measurement units, and offline simulation.
          </p>
        </div>

        {savedSuccess && (
          <div
            style={{
              backgroundColor: 'var(--forest-50)',
              border: '1px solid var(--forest-200)',
              color: 'var(--forest-900)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={16} style={{ color: 'var(--forest-700)' }} />
            <span>Preferences saved successfully</span>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }} className="settings-grid">
        {/* Left Column: Profile & Farm */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {/* Farmer Profile */}
          <div className="acro-card">
            <div className="card-header">
              <div className="card-title">
                <User size={18} style={{ color: 'var(--forest-700)' }} />
                <span>Farmer Profile</span>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label" htmlFor="set-name">
                  Full Name
                </label>
                <input
                  id="set-name"
                  type="text"
                  className="form-input"
                  defaultValue={currentUser?.name || 'Ramesh Patel'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set-email">
                  Email Address
                </label>
                <input
                  id="set-email"
                  type="email"
                  className="form-input"
                  defaultValue={currentUser?.email || 'ramesh.patel@agrovision.farm'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set-role">
                  Agricultural Role
                </label>
                <input
                  id="set-role"
                  type="text"
                  className="form-input"
                  defaultValue={currentUser?.role || 'Farm Owner & Operator'}
                  disabled
                />
              </div>

              <button type="submit" className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-sm)' }}>
                <span>Update Profile</span>
              </button>
            </form>
          </div>

          {/* Active Farm Info */}
          <div className="acro-card">
            <div className="card-header">
              <div className="card-title">
                <Building2 size={18} style={{ color: 'var(--forest-700)' }} />
                <span>Active Farm Property</span>
              </div>
            </div>

            {activeFarm && (
              <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Name: </span>
                  <strong>{activeFarm.name}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                  <strong>{activeFarm.location}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Cultivated Area: </span>
                  <strong>{activeFarm.totalArea} {activeFarm.areaUnit}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Primary Farming System: </span>
                  <strong>{activeFarm.farmType}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mode, Theme, Units, Offline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {/* Application Mode */}
          <div className="acro-card">
            <div className="card-header">
              <div className="card-title">
                <Sliders size={18} style={{ color: 'var(--forest-700)' }} />
                <span>Application View Mode</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              Choose your default interaction level across all pages:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: !isAdvancedMode ? 'var(--forest-50)' : 'var(--bg-secondary)',
                  border: !isAdvancedMode ? '1px solid var(--forest-300)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="app-mode"
                  checked={!isAdvancedMode}
                  onChange={() => setMode('farmer')}
                  style={{ marginTop: '3px', accentColor: 'var(--forest-700)' }}
                />
                <div>
                  <strong style={{ color: 'var(--forest-900)' }}>Simple Farmer Mode (Default)</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Plain English, 5-second action summaries, clear status icons, zero technical jargon.
                  </p>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isAdvancedMode ? 'var(--forest-50)' : 'var(--bg-secondary)',
                  border: isAdvancedMode ? '1px solid var(--forest-300)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="app-mode"
                  checked={isAdvancedMode}
                  onChange={() => setMode('advanced')}
                  style={{ marginTop: '3px', accentColor: 'var(--forest-700)' }}
                />
                <div>
                  <strong style={{ color: 'var(--forest-900)' }}>Advanced Farm Manager Mode</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Reveals ESP32 node IDs, battery %, signal dBm, timestamps, and raw telemetry tables.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Theme & Units */}
          <div className="acro-card">
            <div className="card-header">
              <div className="card-title">
                <Globe size={18} style={{ color: 'var(--forest-700)' }} />
                <span>Theme & Measurement Units</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {/* Theme Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Visual Theme</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Warm Cream Day or Dark Farm Night
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                  <span>{theme === 'dark' ? 'Night Farm (Active)' : 'Warm Cream (Active)'}</span>
                </button>
              </div>

              {/* Units Selection */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Units of Measurement</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Temperature, area, rainfall
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${units === 'metric' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setUnits('metric')}
                  >
                    Metric (°C, mm)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${units === 'imperial' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setUnits('imperial')}
                  >
                    Imperial (°F, in)
                  </button>
                </div>
              </div>

              {/* Offline Simulation Switch */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 'var(--space-sm)',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <WifiOff size={15} style={{ color: isOffline ? 'var(--status-action-solid)' : 'var(--text-muted)' }} />
                    <span>Offline Simulation Mode</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Simulate disconnected rural network & stale telemetry
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn btn-sm ${isOffline ? 'btn-action' : 'btn-secondary'}`}
                  onClick={toggleOffline}
                >
                  {isOffline ? 'Offline Simulated' : 'Normal (Online)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
