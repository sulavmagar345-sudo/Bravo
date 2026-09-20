import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signIn } from '../services/auth';
import { useAdminAuth } from '../hooks/useAdminAuth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const auth = useAdminAuth();

  if (auth.isLoading) return (
    <div className="admin-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>Loading...</span>
    </div>
  );
  
  // If already authenticated AND an admin, redirect to dashboard
  if (auth.isAuthenticated && auth.isAdmin) {
    return <Navigate to="/admin/007/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      // onAuthStateChange hook detects the new session automatically
    } catch (err: any) {
      const msg = (err.message || '').toLowerCase();
      if (msg.includes('invalid') || msg.includes('credentials') || msg.includes('wrong')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-root">
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login__brand">
            <span className="admin-login__brand-name">BRAVO</span>
            <span className="admin-login__brand-tag">Admin Portal · Authorized Access Only</span>
            <div className="admin-login__divider" />
          </div>

          {error && (
            <div className="admin-login__error" style={{ marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}
          {auth.isAuthenticated && !auth.isAdmin && (
            <div className="admin-login__error" style={{ marginBottom: '16px' }}>
              ⚠️ This account does not have admin privileges.
            </div>
          )}

          <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
            <div className="admin-field">
              <label className="admin-label" htmlFor="login-email">Email Address</label>
              <input
                className="admin-input"
                id="login-email"
                type="email"
                required
                placeholder="admin@example.com"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="login-password">Password</label>
              <input
                className="admin-input"
                id="login-password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="admin-login__submit"
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="admin-login__note">
            Return to <a href="/#/" style={{ color: 'var(--admin-gold)' }}>main website</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
