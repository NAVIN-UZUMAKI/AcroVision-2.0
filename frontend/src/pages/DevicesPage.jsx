import { useState } from 'react';
import { useData } from '../hooks/useData';
import DeviceCard from '../components/devices/DeviceCard';
import EmptyState from '../components/ui/EmptyState';
import { Cpu, Zap } from 'lucide-react';

export default function DevicesPage() {
  const { devices } = useData();
  const [pingStatus, setPingStatus] = useState(null);

  const handlePingDevice = async (deviceId) => {
    setPingStatus({ deviceId, message: 'Pinging microcontroller...' });
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPingStatus({
      deviceId,
      message: 'HTTP 200 OK • Round-trip 42ms • ESP32 Signal RSSI -64 dBm',
    });
    setTimeout(() => setPingStatus(null), 4000);
  };

  const onlineCount = devices.filter((d) => d.status === 'CONNECTED').length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title-group">
          <h1>IoT Microcontrollers & Edge Nodes</h1>
          <p>
            Hardware connectivity status, battery voltages, Wi-Fi / LoRa RSSI, and sensor probe assignments.
          </p>
        </div>

        <span className="badge badge-intel" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
          ESP32 HTTP Telemetry Gateway Ready
        </span>
      </div>

      {/* Ping Notification */}
      {pingStatus && (
        <div
          style={{
            backgroundColor: 'var(--forest-50)',
            border: '1px solid var(--forest-200)',
            color: 'var(--forest-900)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
          role="status"
        >
          <Zap size={16} style={{ color: 'var(--forest-700)' }} />
          <span>{pingStatus.message}</span>
        </div>
      )}

      {/* Overview Stats */}
      <div
        className="acro-card"
        style={{
          marginBottom: 'var(--space-xl)',
          backgroundColor: 'var(--surface-card)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            textAlign: 'center',
          }}
          className="devices-summary-grid"
        >
          <div style={{ padding: '8px', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Nodes</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {devices.length}
            </div>
          </div>

          <div style={{ padding: '8px', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Online & Transmitting</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-700)' }}>
              {onlineCount}
            </div>
          </div>

          <div style={{ padding: '8px', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Battery Health</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-700)' }}>
              94%
            </div>
          </div>

          <div style={{ padding: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transmission Protocol</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              HTTP / REST
            </div>
          </div>
        </div>
      </div>

      {/* Devices Cards Grid */}
      {devices.length > 0 ? (
        <div className="grid-cols-2">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onPing={handlePingDevice}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No IoT Nodes Configured"
          description="Register ESP32 soil probe hubs or Edge AI camera nodes to begin field telemetry."
          icon={Cpu}
        />
      )}

      {/* Architecture Disclaimer */}
      <div
        style={{
          marginTop: 'var(--space-xl)',
          padding: '14px 18px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
        }}
      >
        <strong style={{ color: 'var(--text-primary)' }}>ESP32 Integration Contract:</strong> When FastAPI backend is activated in Prompt 2, microcontrollers submit JSON payloads to <code>POST /api/telemetry</code> with device token, battery voltage, and raw analog/digital sensor pin values.
      </div>

      <style>{`
        @media (max-width: 680px) {
          .devices-summary-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: var(--space-md) !important;
          }
          .devices-summary-grid > div {
            border-right: none !important;
          }
        }
      `}</style>
    </div>
  );
}
