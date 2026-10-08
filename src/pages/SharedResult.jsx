import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaxBreakdown from '../components/TaxBreakdown';
import { getCalculationById } from '../api/taxApi';

// The DB stores snake_case columns — adapt to the camelCase shape TaxBreakdown expects
function adaptRecord(record) {
  return {
    grossSalary: Number(record.gross_salary),
    standardDeduction: Number(record.standard_deduction),
    taxableIncome: Number(record.taxable_income),
    breakdown: record.breakdown,
    rebateApplied: 0,
    surcharge: 0,
    taxBeforeCess: Number(record.tax_before_cess),
    cess: Number(record.cess),
    totalTax: Number(record.total_tax),
    netTakeHome: Number(record.net_take_home),
  };
}

export default function SharedResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getCalculationById(id)
      .then((record) => setResult(adaptRecord(record)))
      .catch(() => setError('This calculation could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <h1 className="page-title">Shared Tax Calculation</h1>
      <p className="page-subtitle">Read-only view of a shared TaxLedger calculation</p>

      {loading && <p style={{ color: 'var(--color-ink-soft)' }}>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {result && <TaxBreakdown result={result} />}
    </div>
  );
}