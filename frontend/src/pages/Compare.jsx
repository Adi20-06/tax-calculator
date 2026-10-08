import { useState } from 'react';
import RevealCard from '../components/RevealCard';
import { compareRegimes } from '../api/taxApi';
import { getApiErrorMessage } from '../utils/apiError';

export default function Compare() {
  const [salary, setSalary] = useState('');
  const [deductions, setDeductions] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  const handleSubmit = async (e) => {
  e.preventDefault();
  const value = Number(salary);
  if (!salary || isNaN(value) || value <= 0) {
    setError('Please enter a valid annual gross salary.');
    return;
  }
  setError('');
  setLoading(true);
  try {
    const data = await compareRegimes(value, Number(deductions) || 0);
    setResult(data);
  } catch (err) {
    console.error(err);
    setError(getApiErrorMessage(err, 'Failed to compare regimes.'));
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h1 className="page-title">Old vs New Regime</h1>
      <p className="page-subtitle">Compare your tax liability under both regimes side by side</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="salary">Annual Gross Salary (₹)</label>
            <input id="salary" type="number" min="0" placeholder="e.g. 1500000"
              value={salary} onChange={(e) => setSalary(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="deductions">Old Regime Deductions (80C, 80D, HRA exemption etc. — ₹)</label>
            <input id="deductions" type="number" min="0" placeholder="e.g. 150000"
              value={deductions} onChange={(e) => setDeductions(e.target.value)} />
          </div>
          {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Regimes'}
          </button>
        </form>
      </div>

      {result && (
        <RevealCard delay={0.1}>
          <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
            {['newRegime', 'oldRegime'].map((key) => {
              const r = result[key];
              const isBetter = result.betterRegime === (key === 'newRegime' ? 'new' : 'old');
              return (
                <div className="card" key={key} style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3>{key === 'newRegime' ? 'New Regime' : 'Old Regime'}</h3>
                    {isBetter && <span className="badge success">Better</span>}
                  </div>
                  <div className="ledger-row">
                    <span>Taxable Income</span>
                    <span className="amount">{fmt(r.taxableIncome)}</span>
                  </div>
                  <div className="ledger-row">
                    <span>Total Tax</span>
                    <span className="amount tag-alert">{fmt(r.totalTax)}</span>
                  </div>
                  <div className="ledger-row total tag-success">
                    <span>Net Take-Home</span>
                    <span className="amount">{fmt(r.netTakeHome)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ marginTop: 16, textAlign: 'center' }}>
            <p style={{ fontSize: 14 }}>
              The <strong className="tag-gold">{result.betterRegime === 'new' ? 'New' : 'Old'} Regime</strong> saves you{' '}
              <strong className="tag-success">{fmt(result.savings)}</strong> per year in this scenario.
            </p>
          </div>
        </RevealCard>
      )}
    </div>
  );
}