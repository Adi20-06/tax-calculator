import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/apiError';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
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
    await signup(name, email, password);
    showToast('Account created — welcome!', 'success');
    navigate('/');
  } catch (err) {
    const message = getApiErrorMessage(err, 'Signup failed.');
    setError(message);
    showToast(err.response?.status === 429 ? 'Too many attempts — try again later' : 'Signup failed', 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h1 className="page-title">Sign Up</h1>
      <p className="page-subtitle">Create an account to save your calculation history</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password (min 6 characters)</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center', color: 'var(--color-ink-soft)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--color-gold)' }}>Log in</Link>
      </p>
    </div>
  );
}