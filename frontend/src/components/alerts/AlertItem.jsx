import StatusBadge from '../ui/StatusBadge';
import { Check, Clock, Eye, Droplets, Bug, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  irrigation: Droplets,
  disease: Bug,
  weather: AlertTriangle,
  hardware: Cpu,
  nutrient: ArrowRight,
};

export default function AlertItem({
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
        backgroundColor: alert.isRead ? 'var(--surface-card)' : 'var(--forest-50)',
        opacity: isResolved ? 0.6 : 1,
        marginBottom: 'var(--space-md)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '260px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--forest-800)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} aria-hidden="true" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{alert.title}</h4>
              <StatusBadge status={alert.severity} size="sm" />
              {isResolved && (
                <span className="badge badge-good" style={{ fontSize: '0.68rem' }}>
                  RESOLVED
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {alert.fieldName} • {alert.whenToDo} • {new Date(alert.createdAt).toLocaleDateString()}
            </div>

            {/* Why */}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <strong>Why: </strong>
              {alert.description}
            </p>

            {/* Recommended Action */}
            <div
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: 'var(--surface-card)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                color: 'var(--forest-900)',
                fontWeight: 600,
              }}
            >
              👉 Action: {alert.recommendedAction}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {!isResolved && onSnooze && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onSnooze(alert.id)}
              title="Snooze for 2 hours"
              aria-label="Snooze alert"
            >
              <Clock size={14} />
              <span>Snooze</span>
            </button>
          )}

          {onViewDetails && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onViewDetails(alert)}
              aria-label="View alert details"
            >
              <Eye size={14} />
              <span>Details</span>
            </button>
          )}

          {!isResolved && onResolve && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onResolve(alert.id)}
              aria-label="Mark alert as done"
            >
              <Check size={14} />
              <span>Mark as Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
