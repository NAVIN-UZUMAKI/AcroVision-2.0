import { useMode } from '../../hooks/useMode';
import { Sprout, Sliders } from 'lucide-react';

export default function ModeToggle({ compact = false }) {
  const { isAdvancedMode, toggleMode } = useMode();

  return (
    <button
      type="button"
      className={`btn ${isAdvancedMode ? 'btn-secondary' : 'btn-success'} ${compact ? 'btn-sm' : ''}`}
      onClick={toggleMode}
      title={
        isAdvancedMode
          ? 'Switch to Simple Farmer Mode (Clear action-first summaries)'
          : 'Switch to Advanced Farm Manager Mode (Telemetry, ESP32 nodes, signal strength & raw readings)'
      }
      aria-label={`Current Mode: ${isAdvancedMode ? 'Advanced Manager' : 'Simple Farmer'}. Click to toggle.`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontWeight: 600,
      }}
    >
      {isAdvancedMode ? (
        <>
          <Sliders size={15} className="text-forest-700" aria-hidden="true" />
          <span>Advanced Mode</span>
        </>
      ) : (
        <>
          <Sprout size={15} aria-hidden="true" />
          <span>Farmer Mode</span>
        </>
      )}
    </button>
  );
}
