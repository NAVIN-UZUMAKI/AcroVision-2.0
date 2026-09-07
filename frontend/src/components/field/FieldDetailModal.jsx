import Modal from '../ui/Modal';
import StatusBadge from '../ui/StatusBadge';
import MetricCard from '../ui/MetricCard';
import { useData } from '../../hooks/useData';

export default function FieldDetailModal({ isOpen, onClose, field }) {
  const { sensors } = useData();

  if (!field) return null;

  const fieldSensors = sensors.filter((s) => s.fieldId === field.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Field Plot: ${field.name}`}
      maxWidth="720px"
    >
      <div>
        {/* Plot Overview Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--forest-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
            border: '1px solid var(--forest-100)',
          }}
        >
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--forest-900)' }}>
              {field.crop?.name} ({field.crop?.variety})
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--forest-700)' }}>
              {field.area} {field.areaUnit} • {field.crop?.category} • {field.crop?.growthStage}
            </div>
          </div>
          <StatusBadge status={field.currentStatus} />
        </div>

        {/* Agronomic Attributes Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
          }}
          className="field-modal-attr-grid"
        >
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Soil Classification</div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{field.soilType}</strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Irrigation System</div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{field.irrigationMethod}</strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health Score</div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--forest-700)' }}>{field.healthScore}% Optimal</strong>
          </div>
        </div>

        {/* Summary Advice */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            🌾 Current Field Advisory:
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {field.summaryAdvice}
          </p>
        </div>

        {/* Attached Sensors */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            Active Soil & Climate Telemetry ({fieldSensors.length})
          </h4>

          {fieldSensors.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }} className="field-modal-sensor-grid">
              {fieldSensors.map((s) => (
                <MetricCard key={s.id} sensor={s} showField={false} />
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No sensors currently paired with this field plot.
            </p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .field-modal-attr-grid, .field-modal-sensor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </Modal>
  );
}
