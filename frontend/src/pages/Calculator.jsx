import { useState, useRef } from 'react';
import SalaryForm from '../components/SalaryForm';
import TaxBreakdown from '../components/TaxBreakdown';
import TaxVisualizer3D from '../components/TaxVisualizer3D';
import TaxCharts from '../components/charts/TaxCharts';
import CountUpNumber from '../components/CountUpNumber';
import RevealCard from '../components/RevealCard';
import ReportActions from '../components/ReportActions';
import { calculateTax } from '../api/taxApi';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../utils/apiError';

export default function Calculator() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chartsRef = useRef(null);
const { showToast } = useToast();

const handleCalculate = async (grossSalary) => {
  setLoading(true);
  setError('');
  try {
    const data = await calculateTax(grossSalary);
    setResult(data);
    showToast('Calculation successful', 'success');
  } catch (err) {
    console.error(err);
    const message = getApiErrorMessage(err, 'Failed to calculate tax.');
    setError(message);
    showToast(err.response?.status === 429 ? 'Rate limit reached' : 'Calculation failed', 'error');
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h1 className="page-title">Tax Calculator</h1>
      <p className="page-subtitle">New Regime · FY 2025-26 </p>
      <h2 className="heading">Enter your annual gross salary:</h2>

      <div className="card">
        <SalaryForm onCalculate={handleCalculate} loading={loading} />
        {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}
      </div>

      {result && (
        <>
          <RevealCard delay={0.1}>
            <div className="quick-stats">
              <div className="stat-card-plain">
                <p className="stat-label">Total Tax</p>
                <p className="stat-value tag-alert">
                  <CountUpNumber value={result.totalTax} />
                </p>
              </div>
              <div className="stat-card-hero">
                <p className="stat-label">Net Take-Home</p>
                <p className="stat-value">
                  <CountUpNumber value={result.netTakeHome} />
                </p>
              </div>
            </div>
            <ReportActions result={result} chartsRef={chartsRef} />
          </RevealCard>

          <RevealCard delay={0.2}>
            <TaxVisualizer3D result={result} />
          </RevealCard>

          <RevealCard delay={0.25}>
            <div ref={chartsRef}>
              <TaxCharts result={result} />
            </div>
          </RevealCard>

          <RevealCard delay={0.3}>
            <TaxBreakdown result={result} />
          </RevealCard>
        </>
      )}
    </div>
  );
}