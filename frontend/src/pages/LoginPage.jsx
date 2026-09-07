import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFarm } from '../hooks/useFarm';
import { Leaf, LogIn, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { farms } = useFarm();

  const [email, setEmail] = useState('ramesh.patel@agrovision.farm');
  const [password, setPassword] = useState('farmsecure123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      const res = await login(email, password);
      if (res?.success) {
        if (!farms || farms.length === 0) {
          navigate('/setup');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please check credentials.');
    }
  };

  const handleDemoLogin = async () => {
    setEmail('ramesh.patel@agrovision.farm');
    setPassword('farmsecure123');
    const res = await login('ramesh.patel@agrovision.farm', 'farmsecure123');
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--space-lg)',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--forest-700)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Leaf size={26} aria-hidden="true" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-900)' }}>
              ACROVISION 🌱
            </span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome Back, Farmer</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Sign in to check your active fields, weather advice, and daily actions.
          </p>
        </div>

        {/* Card */}
        <div className="acro-card" style={{ padding: 'var(--space-xl)' }}>
          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-urgent-bg)',
                color: 'var(--status-urgent-text)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: 'var(--space-md)',
                border: '1px solid var(--status-urgent-border)',
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Farmer Email or Mobile
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="ramesh@agrovision.farm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.8rem', color: 'var(--forest-700)', fontWeight: 600 }}
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', marginTop: 'var(--space-sm)', padding: '12px' }}
            >
              <LogIn size={18} />
              <span>{isLoading ? 'Signing In...' : 'Sign In to AcroVision'}</span>
            </button>
          </form>

          {/* Quick Demo Access */}
          <div style={{ margin: 'var(--space-lg) 0', position: 'relative', textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
            <span
              style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--surface-card)',
                padding: '0 10px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              or 1-click preview
            </span>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDemoLogin}
            disabled={isLoading}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
          >
            <Sparkles size={16} style={{ color: 'var(--forest-700)' }} />
            <span>Sign in as Ramesh Patel (Demo Farm)</span>
          </button>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don’t have a farm registered yet?{' '}
          <Link to="/signup" style={{ color: 'var(--forest-700)', fontWeight: 700 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
