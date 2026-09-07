import { useNavigate } from 'react-router-dom';
import { useFarm } from '../hooks/useFarm';
import StatusBadge from '../components/ui/StatusBadge';
import {
  MapPin,
  Check,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function FarmsPage() {
  const navigate = useNavigate();
  const { farms, activeFarmId, switchActiveFarm } = useFarm();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Farm Management & Properties</h1>
          <p>
            Switch active farm property or register a new agricultural estate.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/setup')}
        >
          <Plus size={16} />
          <span>Register New Farm</span>
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid-cols-2">
        {farms.map((farm) => {
          const isActive = farm.id === activeFarmId;

          return (
            <div
              key={farm.id}
              className="acro-card"
              style={{
                border: isActive ? '2px solid var(--forest-600)' : '1px solid var(--border-subtle)',
                backgroundColor: 'var(--surface-card)',
                boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header */}
                <div className="card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{farm.name}</h3>
                      {isActive && (
                        <span
                          className="badge badge-good"
                          style={{ fontSize: '0.7rem' }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.825rem',
                        color: 'var(--text-muted)',
                        marginTop: '3px',
                      }}
                    >
                      <MapPin size={13} />
                      <span>{farm.location}</span>
                    </div>
                  </div>

                  <StatusBadge status={farm.overallStatus} size="sm" />
                </div>

                {/* Metadata & Efficiency */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    margin: 'var(--space-md) 0',
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Efficiency
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--forest-800)' }}>
                      {farm.efficiencyScore}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Land Size
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {farm.totalArea} {farm.areaUnit}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Plots / Fields
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {farm.fieldCount}
                    </div>
                  </div>
                </div>

                {/* Farm Type & Primary Crops */}
                <div style={{ margin: 'var(--space-sm) 0' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Farm System: <strong>{farm.farmType}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {farm.primaryCrops?.map((crop) => (
                      <span key={crop} className="badge badge-neutral" style={{ fontSize: '0.725rem' }}>
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  marginTop: 'var(--space-lg)',
                  paddingTop: 'var(--space-sm)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Registered {new Date(farm.createdAt).toLocaleDateString()}
                </span>

                {isActive ? (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => switchActiveFarm(farm.id)}
                  >
                    <Check size={14} />
                    <span>Set Active Farm</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
