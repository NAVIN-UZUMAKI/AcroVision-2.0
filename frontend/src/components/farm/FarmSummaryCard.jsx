import { useFarm } from '../../hooks/useFarm';
import { useData } from '../../hooks/useData';
import StatusBadge from '../ui/StatusBadge';
import { Sprout, AlertCircle, ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FarmSummaryCard() {
  const { activeFarm } = useFarm();
  const { activeAlerts } = useData();
  const navigate = useNavigate();

  if (!activeFarm) return null;

  const urgentCount = activeAlerts.filter((a) => a.severity === 'URGENT' || a.severity === 'ACTION NEEDED').length;
  const topActionAlert = activeAlerts[0];

  return (
    <div
      className="acro-card"
      style={{
        background: 'linear-gradient(135deg, var(--forest-900) 0%, var(--forest-800) 100%)',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Decorative background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82, 183, 136, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
            marginBottom: 'var(--space-md)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest-300)', fontSize: '0.85rem' }}>
              <MapPin size={14} aria-hidden="true" />
              <span>{activeFarm.location}</span>
            </div>
            <h2 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>
              {activeFarm.name}
            </h2>
          </div>

          <StatusBadge
            status={activeFarm.overallStatus}
            customLabel={
              activeFarm.overallStatus === 'GOOD'
                ? 'Operating Efficiently'
                : activeFarm.overallStatus === 'WATCH'
                ? 'Watch Recommended'
                : 'Action Needed'
            }
          />
        </div>

        {/* Hero Efficiency & Action Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 'var(--space-xl)',
            alignItems: 'center',
            margin: 'var(--space-lg) 0',
          }}
          className="farm-summary-stats-grid"
        >
          {/* Efficiency Metric */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingRight: 'var(--space-lg)',
              borderRight: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1, color: '#FFFFFF' }}>
              {activeFarm.efficiencyScore}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--forest-300)', fontWeight: 600, marginTop: '4px' }}>
              Farm Health & Efficiency
            </div>
          </div>

          {/* Action Callout */}
          <div>
            {urgentCount > 0 ? (
              <div
                style={{
                  backgroundColor: 'rgba(254, 243, 199, 0.12)',
                  border: '1px solid rgba(252, 211, 77, 0.3)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FDE68A', fontWeight: 700, fontSize: '0.9rem' }}>
                  <AlertCircle size={17} />
                  <span>{urgentCount} action{urgentCount > 1 ? 's' : ''} needed today</span>
                </div>
                {topActionAlert && (
                  <p style={{ color: '#FFFFFF', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    👉 {topActionAlert.title} — {topActionAlert.recommendedAction}
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(216, 243, 220, 0.12)',
                  border: '1px solid rgba(149, 213, 178, 0.3)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B7E4C7', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Sprout size={17} />
                  <span>All fields operating normally</span>
                </div>
                <p style={{ color: 'var(--forest-100)', fontSize: '0.875rem', marginTop: '4px' }}>
                  No urgent interventions required. Continue routine monitoring.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Quick Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-md)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)',
          }}
        >
          <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: '0.825rem', color: 'var(--forest-200)' }}>
            <div>
              <strong>{activeFarm.fieldCount}</strong> Active Fields
            </div>
            <div>
              <strong>{activeFarm.totalArea}</strong> {activeFarm.areaUnit} Total Area
            </div>
            <div>
              <strong>{activeFarm.activeDeviceCount}</strong> Connected Nodes
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm"
            onClick={() => navigate('/alerts')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontWeight: 700,
            }}
          >
            <span>View Action Center</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .farm-summary-stats-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-md) !important;
          }
          .farm-summary-stats-grid > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
            padding-right: 0 !important;
            padding-bottom: var(--space-sm);
          }
        }
      `}</style>
    </div>
  );
}
