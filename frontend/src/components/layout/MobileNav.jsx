import { NavLink } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import {
  LayoutDashboard,
  Activity,
  ScanEye,
  Bell,
  Sparkles,
  CloudSun,
} from 'lucide-react';

export default function MobileNav() {
  const { unreadAlertsCount } = useData();

  const MOBILE_ITEMS = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/monitoring', label: 'Check', icon: Activity },
    { to: '/weather', label: 'Weather', icon: CloudSun },
    { to: '/crop-health', label: 'Crops', icon: ScanEye },
    { to: '/ai-insights', label: 'Ask AI', icon: Sparkles },
    { to: '/alerts', label: 'Alerts', icon: Bell, count: unreadAlertsCount },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--surface-elevated)',
        borderTop: '1px solid var(--border-strong)',
        zIndex: 100,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.06)',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 4px',
      }}
      aria-label="Mobile Navigation"
    >
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              color: isActive ? 'var(--forest-700)' : 'var(--text-muted)',
              fontSize: '0.68rem',
              fontWeight: isActive ? 800 : 500,
              textDecoration: 'none',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              position: 'relative',
              flex: 1,
            })}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} aria-hidden="true" />
              {item.count > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--status-action-solid)',
                  }}
                />
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      <style>{`
        @media (max-width: 960px) {
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
