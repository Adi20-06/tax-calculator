import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TaxBreakdown from '../components/TaxBreakdown';
import TaxCharts from '../components/charts/TaxCharts';
import RevealCard from '../components/RevealCard';
import { calculateTax, saveProfile, getProfiles, deleteProfile } from '../api/taxApi';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/apiError';

const TAXABLE_COMPONENTS = [
  { key: 'basic', label: 'Basic Salary' },
  { key: 'hra', label: 'House Rent Allowance (HRA)' },
  { key: 'special', label: 'Special Allowance' },
  { key: 'bonus', label: 'Annual Bonus' },
  { key: 'other', label: 'Other Allowances' },
];

const CTC_ONLY_COMPONENTS = [
  { key: 'employerPf', label: 'Employer PF Contribution' },
  { key: 'gratuity', label: 'Gratuity (accrued annually)' },
];

const STANDARD_DEDUCTION = 75000;

export default function SalaryStructure() {
  const { user } = useAuth();

  const [values, setValues] = useState({
    basic: '', hra: '', special: '', bonus: '', other: '',
    employerPf: '', gratuity: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [profiles, setProfiles] = useState([]);
  const [profileName, setProfileName] = useState('');
  const [profileStatus, setProfileStatus] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      getProfiles().then(setProfiles).catch(() => {});
    } else {
      setProfiles([]);
    }
  }, [user]);

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const num = (key) => Number(values[key]) || 0;

  const grossSalary = useMemo(
    () => TAXABLE_COMPONENTS.reduce((sum, c) => sum + num(c.key), 0),
    [values]
  );

  const employerCosts = useMemo(
    () => CTC_ONLY_COMPONENTS.reduce((sum, c) => sum + num(c.key), 0),
    [values]
  );

  const ctc = grossSalary + employerCosts;
  const estimatedTaxableIncome = Math.max(grossSalary - STANDARD_DEDUCTION, 0);

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (grossSalary <= 0) {
    setError('Enter at least one taxable salary component.');
    return;
  }
  setError('');
  setLoading(true);
  try {
    const data = await calculateTax(grossSalary);
    setResult(data);
  } catch (err) {
    console.error(err);
    setError(getApiErrorMessage(err, 'Failed to calculate tax.'));
  } finally {
    setLoading(false);
  }
};

  const handleSaveProfile = async () => {
  if (!profileName.trim()) {
    showToast('Enter a name for this profile.', 'error');
    return;
  }
  try {
    await saveProfile({
      profileName,
      basic: num('basic'), hra: num('hra'), special: num('special'),
      bonus: num('bonus'), other: num('other'),
      employerPf: num('employerPf'), gratuity: num('gratuity'),
    });
    showToast('Profile saved', 'success');
    setProfileName('');
    getProfiles().then(setProfiles);
  } catch {
    showToast('Failed to save profile.', 'error');
  }
};

  const handleLoadProfile = (profile) => {
    setValues({
      basic: profile.basic,
      hra: profile.hra,
      special: profile.special,
      bonus: profile.bonus,
      other: profile.other,
      employerPf: profile.employer_pf,
      gratuity: profile.gratuity,
    });
  };

  const handleDeleteProfile = async (id) => {
  await deleteProfile(id);
  setProfiles((prev) => prev.filter((p) => p.id !== id));
  showToast('Profile removed', 'info');
};

  return (
    <div>
      <h1 className="page-title">Salary Structure</h1>
      <p className="page-subtitle">Build your CTC from individual components to see Gross, CTC and tax</p>

      <div className="card">
        <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginBottom: 20, lineHeight: 1.6 }}>
          Employer PF and Gratuity are part of your CTC but aren't part of your annual taxable
          salary — they're employer costs / retiral benefits. Under the New Regime, HRA and other
          exemptions don't reduce taxable income; only the flat ₹75,000 standard deduction applies.
        </p>

        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--color-ink-soft)' }}>
            Taxable Components (make up Gross Salary)
          </h3>
          {TAXABLE_COMPONENTS.map((c) => (
            <div className="field" key={c.key}>
              <label htmlFor={c.key}>{c.label} (₹ / year)</label>
              <input
                id={c.key}
                type="number"
                min="0"
                placeholder="0"
                value={values[c.key]}
                onChange={(e) => handleChange(c.key, e.target.value)}
              />
            </div>
          ))}

          <h3 style={{ fontSize: 14, margin: '24px 0 12px', color: 'var(--color-ink-soft)' }}>
            CTC-only Components (not directly taxable as salary)
          </h3>
          {CTC_ONLY_COMPONENTS.map((c) => (
            <div className="field" key={c.key}>
              <label htmlFor={c.key}>{c.label} (₹ / year)</label>
              <input
                id={c.key}
                type="number"
                min="0"
                placeholder="0"
                value={values[c.key]}
                onChange={(e) => handleChange(c.key, e.target.value)}
              />
            </div>
          ))}

          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <div className="ledger-row">
              <span>Gross Salary (taxable)</span>
              <span className="amount">{fmt(grossSalary)}</span>
            </div>
            <div className="ledger-row">
              <span>Employer PF + Gratuity</span>
              <span className="amount">{fmt(employerCosts)}</span>
            </div>
            <div className="ledger-row total">
              <span>Total CTC</span>
              <span className="amount">{fmt(ctc)}</span>
            </div>
            <div className="ledger-row">
              <span>Estimated Taxable Income</span>
              <span className="amount tag-gold">{fmt(estimatedTaxableIncome)}</span>
            </div>
          </div>

          {user ? (
            <div style={{ marginTop: 24, marginBottom: 24, borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
              <h3 style={{ fontSize: 14, marginBottom: 12, color: 'var(--color-ink-soft)' }}>Saved Profiles</h3>

              {profiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {profiles.map((p) => (
                    <div key={p.id} className="ledger-row">
                      <button
                        type="button"
                        onClick={() => handleLoadProfile(p)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-ink)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: 14,
                        }}
                      >
                        📁 {p.profile_name}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProfile(p.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-alert)',
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  placeholder="e.g. Current Job, Offer B"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-ink)',
                  }}
                />
                <button type="button" className="btn-secondary" onClick={handleSaveProfile}>
                  Save as Profile
                </button>
              </div>
              {profileStatus && (
                <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 8 }}>
                  {profileStatus}
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--color-ink-soft)', marginTop: 20, marginBottom: 20 }}>
              <Link to="/login" style={{ color: 'var(--color-gold)' }}>Log in</Link> to save this as a
              reusable profile (e.g. "Current Job" vs "Offer B").
            </p>
          )}

          {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Exact Tax'}
          </button>
        </form>
      </div>

      {result && (
        <RevealCard delay={0.1}>
          <TaxCharts result={result} />
          <TaxBreakdown result={result} />
        </RevealCard>
      )}
    </div>
  );
}