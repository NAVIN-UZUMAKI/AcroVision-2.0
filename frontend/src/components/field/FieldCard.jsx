import StatusBadge from '../ui/StatusBadge';
import { Sprout, Layers, Droplet, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FieldCard({ field, onClick, isSelected = false }) {
  if (!field) return null;

  return (
    <div
      className={`acro-card interactive ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick && onClick(field)}
      style={{
        border: isSelected ? '2px solid var(--forest-600)' : undefined,
        backgroundColor: isSelected ? 'var(--forest-50)' : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
      role="button"
      tabIndex={0}
      aria-label={`Field: ${field.name}, Crop: ${field.crop?.name}, Status: ${field.currentStatus}`}
    >
      <div>
        {/* Header */}
        <div className="card-header">
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{field.name}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {field.area} {field.areaUnit} • {field.crop?.variety}
            </span>
          </div>
          <StatusBadge status={field.currentStatus} size="sm" />
        </div>

        {/* Crop & Growth Stage Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 'var(--space-sm) 0',
            flexWrap: 'wrap',
          }}
        >
          <span
            className="badge badge-water"
            style={{ fontSize: '0.75rem', textTransform: 'none', fontWeight: 700 }}
          >
            <Sprout size={13} aria-hidden="true" />
            <span>{field.crop?.name}</span>
          </span>

          <span
            className="badge badge-neutral"
            style={{ fontSize: '0.725rem', textTransform: 'none', fontWeight: 600 }}
          >
            {field.crop?.growthStage}
          </span>
        </div>

        {/* Soil & Irrigation Info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            margin: 'var(--space-md) 0',
            padding: '8px 10px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.775rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Layers size={13} style={{ color: 'var(--earth-warm)' }} aria-hidden="true" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {field.soilType}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Droplet size={13} style={{ color: 'var(--water-blue-solid)' }} aria-hidden="true" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {field.irrigationMethod}
            </span>
          </div>
        </div>

        {/* Practical Summary Advice */}
        <div style={{ margin: 'var(--space-sm) 0' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {field.summaryAdvice}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--forest-700)', fontWeight: 700 }}>
          <ShieldCheck size={15} aria-hidden="true" />
          <span>Health Score: {field.healthScore}%</span>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--forest-700)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          Inspect <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}
