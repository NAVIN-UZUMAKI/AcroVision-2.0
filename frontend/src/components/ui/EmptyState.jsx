import { Sprout, Plus } from 'lucide-react';

export default function EmptyState({
  title = 'No information available',
  description = 'Everything is clear or no data has been received yet.',
  actionLabel,
  onAction,
  icon: Icon = Sprout,
}) {
  return (
    <div
      style={{
        padding: 'var(--space-2xl) var(--space-lg)',
        textAlign: 'center',
        backgroundColor: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-strong)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-md)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--forest-50)',
          color: 'var(--forest-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={28} aria-hidden="true" />
      </div>

      <div style={{ maxWidth: '420px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>{title}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{description}</p>
      </div>

      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
          <Plus size={15} aria-hidden="true" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
