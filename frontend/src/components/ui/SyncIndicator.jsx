import { useState, useEffect } from 'react';
import { useMode } from '../../hooks/useMode';
import { useData } from '../../hooks/useData';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

function formatRelativeTime(isoString, nowMs) {
  if (!isoString) return 'recently';
  const diffSec = Math.max(0, Math.floor((nowMs - new Date(isoString).getTime()) / 1000));
  if (diffSec < 30) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}h ago`;
}

export default function SyncIndicator({ compact = false }) {
  const { isOffline } = useMode();
  const { isSyncing, lastSyncTime, syncNow } = useData();
  const [relativeTime, setRelativeTime] = useState('recently');

  useEffect(() => {
    const update = () => {
      setRelativeTime(formatRelativeTime(lastSyncTime, Date.now()));
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [lastSyncTime]);

  if (isOffline) {
    return (
      <div
        className="sync-indicator offline"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--status-watch-bg)',
          color: 'var(--status-watch-text)',
          border: '1px solid var(--status-watch-border)',
          fontSize: '0.78rem',
          fontWeight: 600,
        }}
        role="status"
        aria-label="Offline Mode Active"
      >
        <WifiOff size={13} aria-hidden="true" />
        <span>Offline</span>
        {!compact && <span style={{ opacity: 0.8 }}>• Last sync {relativeTime}</span>}
      </div>
    );
  }

  return (
    <div
      className="sync-indicator online"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--forest-50)',
        color: 'var(--forest-800)',
        border: '1px solid var(--forest-200)',
        fontSize: '0.78rem',
        fontWeight: 600,
      }}
    >
      <Wifi size={13} style={{ color: 'var(--fresh-green)' }} aria-hidden="true" />
      <span>{isSyncing ? 'Syncing...' : 'Online'}</span>
      {!compact && (
        <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
          • {relativeTime}
        </span>
      )}
      <button
        type="button"
        onClick={syncNow}
        disabled={isSyncing}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--forest-700)',
        }}
        title="Sync farm telemetry now"
        aria-label="Synchronize data now"
      >
        <RefreshCw size={12} className={isSyncing ? 'spin' : ''} aria-hidden="true" />
      </button>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
