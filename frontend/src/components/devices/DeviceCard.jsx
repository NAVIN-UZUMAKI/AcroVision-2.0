import { useMode } from '../../hooks/useMode';
import { Cpu, Battery, Signal, Zap } from 'lucide-react';

export default function DeviceCard({ device, onPing }) {
  const { isAdvancedMode } = useMode();

  if (!device) return null;

  const isConnected = device.status === 'CONNECTED';
  const tel = device.telemetry || {};

  return (
    <div className="acro-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isConnected ? 'var(--forest-50)' : 'var(--bg-tertiary)',
                color: isConnected ? 'var(--forest-700)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cpu size={18} aria-hidden="true" />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{device.name}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {device.deviceType} • {device.fieldName}
              </p>
            </div>
          </div>

          <span
            className={`badge ${isConnected ? 'badge-good' : 'badge-neutral'}`}
            style={{ fontSize: '0.7rem' }}
          >
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        {/* Hardware Status Indicators */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            margin: 'var(--space-md) 0',
            padding: '10px 12px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {/* Battery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Battery
              size={15}
              style={{
                color: tel.batteryPercent > 20 ? 'var(--fresh-green)' : 'var(--status-urgent-solid)',
              }}
            />
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Battery</div>
              <strong className={isAdvancedMode ? 'mono' : ''}>
                {tel.batteryPercent}% ({tel.batteryVoltage}V)
              </strong>
            </div>
          </div>

          {/* Signal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={15} style={{ color: 'var(--water-blue-solid)' }} />
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Wireless Signal</div>
              <strong className={isAdvancedMode ? 'mono' : ''}>
                {tel.signalQuality} ({tel.signalDbm} dBm)
              </strong>
            </div>
          </div>
        </div>

        {/* Advanced Technical Specifications */}
        {isAdvancedMode && (
          <div
            className="mono"
            style={{
              fontSize: '0.725rem',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              marginBottom: 'var(--space-md)',
            }}
          >
            <div>Firmware: {tel.firmwareVersion}</div>
            <div>IP: {tel.ipAddress} • MAC: {tel.macAddress}</div>
            <div>Protocol: {tel.transmissionProtocol}</div>
            <div>Uptime: {tel.uptimeHours} hrs</div>
          </div>
        )}

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong>{device.attachedSensorIds.length}</strong> Probes Attached
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          Last seen: {new Date(device.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>

        {onPing && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onPing(device.id)}
            style={{ fontSize: '0.75rem' }}
          >
            <Zap size={13} />
            <span>Ping Node</span>
          </button>
        )}
      </div>
    </div>
  );
}
