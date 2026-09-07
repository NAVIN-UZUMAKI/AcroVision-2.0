import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFarm } from '../../hooks/useFarm';
import { useMode } from '../../hooks/useMode';
import ModeToggle from '../ui/ModeToggle';
import SyncIndicator from '../ui/SyncIndicator';
import {
  ChevronDown,
  Moon,
  Sun,
  LogOut,
  Settings,
  Plus,
  Building2,
  Check,
} from 'lucide-react';

export default function AppHeader() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { farms, activeFarm, switchActiveFarm } = useFarm();
  const { theme, toggleTheme } = useMode();

  const [isFarmMenuOpen, setIsFarmMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'var(--surface-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-xl)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Left: Active Farm Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {/* Farm Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setIsFarmMenuOpen(!isFarmMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              padding: '6px 12px',
            }}
            aria-expanded={isFarmMenuOpen}
            aria-haspopup="true"
            aria-label="Select Active Farm"
          >
            <Building2 size={16} style={{ color: 'var(--forest-700)' }} aria-hidden="true" />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeFarm ? activeFarm.name : 'Select Farm'}
            </span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>

          {isFarmMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '260px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: '6px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                }}
              >
                Your Farms
              </div>
              {farms.map((f) => {
                const isActive = activeFarm?.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      switchActiveFarm(f.id);
                      setIsFarmMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--forest-50)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: isActive ? 'var(--forest-900)' : 'var(--text-primary)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <div>
                      <div>{f.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {f.totalArea} {f.areaUnit} • {f.location}
                      </div>
                    </div>
                    {isActive && <Check size={16} style={{ color: 'var(--forest-700)' }} />}
                  </button>
                );
              })}

              <div style={{ margin: '4px 0', borderTop: '1px solid var(--border-subtle)' }} />

              <button
                type="button"
                onClick={() => {
                  setIsFarmMenuOpen(false);
                  navigate('/setup');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--forest-700)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <Plus size={15} />
                <span>Add / Setup New Farm</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {/* Sync Indicator */}
        <SyncIndicator />

        {/* Farmer / Advanced Mode Switch */}
        <ModeToggle compact />

        {/* Theme Switcher */}
        <button
          type="button"
          className="btn btn-ghost btn-icon-only"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Warm Cream Day' : 'Switch to Dark Farm Night'}
          aria-label="Toggle visual theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              cursor: 'pointer',
            }}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
            aria-label="User account menu"
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--forest-700)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'F'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'none' }} className="user-name-desktop">
              {currentUser?.name || 'Farmer'}
            </span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {isUserMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '200px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.email}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate('/settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                }}
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--status-urgent-solid)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <LogOut size={15} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
