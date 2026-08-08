import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/apiError';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  try {
    await login(email, password);
    showToast('Logged in successfully', 'success');
    navigate('/');
  } catch (err) {
    const message = getApiErrorMessage(err, 'Login failed.');
    setError(message);
    showToast(err.response?.status === 429 ? 'Too many attempts — try again later' : 'Login failed', 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1 className="page-title">Log In</h1>
      <p className="page-subtitle">Access your saved calculation history</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center', color: 'var(--color-ink-soft)' }}>
        Don't have an account? <Link to="/signup" style={{ color: 'var(--color-gold)' }}>Sign up</Link>
      </p>
    </div>
  );
}