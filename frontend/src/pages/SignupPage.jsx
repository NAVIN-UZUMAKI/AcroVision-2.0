import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Leaf, UserPlus, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await signup(formData);
      if (res?.success) {
        // Direct new signups to farm onboarding flow
        navigate('/setup');
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
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
      <div style={{ maxWidth: '480px', width: '100%' }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create Farmer Account</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Start monitoring your fields, soil moisture, and crop health with digital intelligence.
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
              <label className="form-label" htmlFor="signup-name">
                Farmer Full Name *
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh Patel"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Email Address *
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="farmer@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-phone">
                Mobile / WhatsApp Number (Optional)
              </label>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                className="form-input"
                placeholder="+91 98450 12345"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">
                Create Password *
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-confirm-password">
                Confirm Password *
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', marginTop: 'var(--space-md)', padding: '12px' }}
            >
              <UserPlus size={18} />
              <span>{isLoading ? 'Creating Account...' : 'Continue to Farm Setup'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--forest-700)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
