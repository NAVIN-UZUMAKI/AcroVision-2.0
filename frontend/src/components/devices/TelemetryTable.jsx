import StatusBadge from '../ui/StatusBadge';
import FreshnessBadge from '../ui/FreshnessBadge';

export default function TelemetryTable({ sensors = [] }) {
  if (!sensors.length) {
    return (
      <div style={{ padding: 'var(--space-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
        No sensor telemetry feeds available.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.825rem',
          textAlign: 'left',
          backgroundColor: 'var(--surface-card)',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-strong)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <th style={{ padding: '10px 14px' }}>Sensor Node / Type</th>
            <th style={{ padding: '10px 14px' }}>Field Plot</th>
            <th style={{ padding: '10px 14px' }}>Raw Reading</th>
            <th style={{ padding: '10px 14px' }}>Preferred Range</th>
            <th style={{ padding: '10px 14px' }}>Status</th>
            <th style={{ padding: '10px 14px' }}>Data Freshness</th>
            <th style={{ padding: '10px 14px' }}>Depth / Placement</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((s) => {
            const r = s.currentReading || {};
            const opt = r.preferredRange || {};

            return (
              <tr
                key={s.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.15s',
                }}
              >
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>
                    ID: {s.id}
                  </div>
                </td>

                <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                  {s.fieldName}
                </td>

                <td style={{ padding: '12px 14px' }}>
                  {r.value !== null && s.isOnline !== false ? (
                    <span className="mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {r.value} {r.unit}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-light)' }}>— Disconnected</span>
                  )}
                </td>

                <td style={{ padding: '12px 14px' }}>
                  <span className="mono" style={{ color: 'var(--forest-700)', fontWeight: 600 }}>
                    {opt.optimalMin}–{opt.optimalMax} {opt.unit}
                  </span>
                </td>

                <td style={{ padding: '12px 14px' }}>
                  <StatusBadge status={r.status} customLabel={r.statusLabel} size="sm" />
                </td>

                <td style={{ padding: '12px 14px' }}>
                  <FreshnessBadge
                    freshness={r.freshness}
                    label={r.freshnessLabel}
                    isOnline={s.isOnline}
                  />
                </td>

                <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {s.depthOrPlacement}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
