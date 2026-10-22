import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Ticket, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage Component
 * Route: '/'
 * Required by Task 1 & Task 2 of ITUE301 Set F
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.token, response.data.attendee);
        navigate('/events');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Authentication failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper for quick demonstration during Viva
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Ticket size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: 6 }}>Welcome to EventHub</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ITUE301 Practical Examination · Set F
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. rahul@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: 10 }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <LogIn size={18} />
                Sign In to Account
              </span>
            )}
          </button>
        </form>

        <div className="demo-account-box">
          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: 6 }}>
            Quick Demo Accounts (For Viva / Evaluation):
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 8 }}>
            Click an account below to auto-fill credentials:
          </p>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.76rem' }}
              onClick={() => handleQuickLogin('rahul@example.com', 'password123')}
            >
              Attendee (Rahul)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.76rem' }}
              onClick={() => handleQuickLogin('organizer@eventhub.com', 'password123')}
            >
              Organizer (Dr. Devang)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
