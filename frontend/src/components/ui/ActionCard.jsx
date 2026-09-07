import StatusBadge from './StatusBadge';
import { Check, Clock, ArrowRight, Droplets, Bug, AlertTriangle, Cpu } from 'lucide-react';

const CATEGORY_ICONS = {
  irrigation: Droplets,
  disease: Bug,
  weather: AlertTriangle,
  hardware: Cpu,
  nutrient: ArrowRight,
};

export default function ActionCard({
  alert,
  onResolve,
  onSnooze,
  onViewDetails,
}) {
  if (!alert) return null;

  const Icon = CATEGORY_ICONS[alert.category] || AlertTriangle;
  const isResolved = alert.isResolved;

  return (
    <div
      className="acro-card"
      style={{
        borderLeft: `4px solid ${
          alert.severity === 'URGENT'
            ? 'var(--status-urgent-solid)'
            : alert.severity === 'ACTION NEEDED'
            ? 'var(--status-action-solid)'
            : 'var(--status-watch-solid)'
        }`,
        opacity: isResolved ? 0.65 : 1,
        transition: 'all var(--transition-normal)',
      }}
    >
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              display: 'flex',
            }}
          >
            <Icon size={16} aria-hidden="true" />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{alert.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {alert.fieldName} • {alert.whenToDo}
            </p>
          </div>
        </div>
        <StatusBadge status={alert.severity} size="sm" />
      </div>

      {/* Why Explanation */}
      <div style={{ margin: 'var(--space-sm) 0' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Why: </strong>
          {alert.description}
        </p>
      </div>

      {/* Recommended Action */}
      <div
        style={{
          backgroundColor: 'var(--forest-50)',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--forest-100)',
          marginTop: 'var(--space-sm)',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--forest-900)', fontWeight: 600 }}>
          👉 What to do: {alert.recommendedAction}
        </p>
      </div>

      {/* Action Buttons */}
      {!isResolved && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: 'var(--space-md)',
            paddingTop: 'var(--space-sm)',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}
        >
          {onSnooze && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onSnooze(alert.id)}
              aria-label={`Snooze reminder for ${alert.title}`}
            >
              <Clock size={13} aria-hidden="true" />
              <span>Snooze</span>
            </button>
          )}

          {onViewDetails && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onViewDetails(alert)}
              aria-label={`View details for ${alert.title}`}
            >
              <span>More details</span>
            </button>
          )}

          {onResolve && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onResolve(alert.id)}
              aria-label={`Mark done for ${alert.title}`}
            >
              <Check size={14} aria-hidden="true" />
              <span>Mark as Done</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
