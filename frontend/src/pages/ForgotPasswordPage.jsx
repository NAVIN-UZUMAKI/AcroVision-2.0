import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Leaf, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSubmitted(true);
    } finally {
      setIsLoading(false);
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
              }}
            >
              <Leaf size={26} aria-hidden="true" />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--forest-900)' }}>
              ACROVISION 🌱
            </span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Reset Farm Password</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Enter your registered email address to receive password recovery instructions.
          </p>
        </div>

        {/* Card */}
        <div className="acro-card" style={{ padding: 'var(--space-xl)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-md) 0' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--forest-100)',
                  color: 'var(--forest-800)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <CheckCircle2 size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
                Recovery Link Sent
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                We sent password reset steps to <strong>{email}</strong>. Check your inbox and spam folder.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">
                  Farmer Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  className="form-input"
                  placeholder="farmer@agrovision.farm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
                style={{ width: '100%', marginTop: 'var(--space-sm)', padding: '12px' }}
              >
                <Mail size={18} />
                <span>{isLoading ? 'Sending Link...' : 'Send Recovery Instructions'}</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.875rem',
                    color: 'var(--forest-700)',
                    fontWeight: 700,
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
