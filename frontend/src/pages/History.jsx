import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../api/taxApi';

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    getHistory()
      .then(setRecords)
      .catch(() => setError('Failed to load history.'))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
  const fmtDate = (d) => new Date(d).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  if (!authLoading && !user) {
    return (
      <div>
        <h1 className="page-title">Calculation History</h1>
        <p className="page-subtitle">Sign in to view and save your past calculations</p>
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ marginBottom: 20, color: 'var(--color-ink-soft)' }}>
            History is saved per account so it follows you across devices. Create a free account
            to keep every calculation you run.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Sign Up</Link>
            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Log In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Calculation History</h1>
      <p className="page-subtitle">Your last 20 tax calculations</p>

      <div className="card">
        {loading && <p style={{ color: 'var(--color-ink-soft)' }}>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && records.length === 0 && (
          <p style={{ color: 'var(--color-ink-soft)' }}>No calculations yet — try the calculator first.</p>
        )}
        {!loading && records.length > 0 && (
          <div className="table-scroll">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Date</th><th>Gross Salary</th><th>Taxable Income</th><th>Total Tax</th><th>Take-Home</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{fmtDate(r.created_at)}</td>
                  <td>{fmt(r.gross_salary)}</td>
                  <td>{fmt(r.taxable_income)}</td>
                  <td className="tag-alert">{fmt(r.total_tax)}</td>
                  <td className="tag-success">{fmt(r.net_take_home)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}