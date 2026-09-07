import { NavLink } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { useMode } from '../../hooks/useMode';
import {
  LayoutDashboard,
  Building2,
  Activity,
  CloudSun,
  ScanEye,
  Sparkles,
  Bell,
  Cpu,
  Settings,
  Leaf,
} from 'lucide-react';

export default function Sidebar() {
  const { unreadAlertsCount } = useData();
  const { isAdvancedMode } = useMode();

  const NAV_ITEMS = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      farmerLabel: 'Farm Overview',
    },
    {
      to: '/farms',
      label: 'Farms',
      icon: Building2,
      farmerLabel: 'My Farms',
    },
    {
      to: '/monitoring',
      label: isAdvancedMode ? 'Field Telemetry' : 'Monitoring',
      icon: Activity,
      farmerLabel: 'Field Check',
    },
    {
      to: '/weather',
      label: 'Weather & Spray',
      icon: CloudSun,
      farmerLabel: 'Weather',
    },
    {
      to: '/crop-health',
      label: isAdvancedMode ? 'Edge AI Vision' : 'Crop Health',
      icon: ScanEye,
      farmerLabel: 'Crop Health',
    },
    {
      to: '/ai-insights',
      label: 'Ask AcroVision',
      icon: Sparkles,
      farmerLabel: 'Ask AcroVision',
      badge: 'AI',
    },
    {
      to: '/alerts',
      label: 'Action Center',
      icon: Bell,
      farmerLabel: 'Alerts',
      badgeCount: unreadAlertsCount,
    },
    {
      to: '/devices',
      label: isAdvancedMode ? 'ESP32 & Sensors' : 'Devices',
      icon: Cpu,
      farmerLabel: 'Devices',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
      farmerLabel: 'Settings',
    },
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'var(--forest-900)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: 'var(--shadow-md)',
      }}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 var(--space-lg)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--forest-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          <Leaf size={22} aria-hidden="true" />
        </div>
        <div>
          <div
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ACROVISION
            <span style={{ fontSize: '0.8rem', color: 'var(--forest-400)' }}>🌱</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--forest-300)', fontWeight: 600 }}>
            Intelligent Farming Assistant
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav
        style={{
          flex: 1,
          padding: 'var(--space-md) var(--space-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflowY: 'auto',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const displayLabel = isAdvancedMode ? item.label : item.farmerLabel;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#FFFFFF' : 'var(--forest-300)',
                backgroundColor: isActive ? 'var(--forest-700)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.925rem',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={19} aria-hidden="true" />
                <span>{displayLabel}</span>
              </div>

              {/* Badges */}
              {item.badge && (
                <span
                  style={{
                    backgroundColor: 'var(--intel-teal-solid)',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {item.badge}
                </span>
              )}

              {item.badgeCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--status-action-solid)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {item.badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Farmer Mode Indicator */}
      <div
        style={{
          padding: 'var(--space-md)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.775rem',
          color: 'var(--forest-300)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Mode:</span>
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>
            {isAdvancedMode ? 'Advanced Manager' : 'Simple Farmer'}
          </span>
        </div>
      </div>
    </aside>
  );
}
