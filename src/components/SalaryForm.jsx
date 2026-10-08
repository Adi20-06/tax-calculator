import { useState } from 'react';

export default function SalaryForm({ onCalculate, loading }) {
  const [salary, setSalary] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(salary);
    if (!salary || isNaN(value) || value <= 0) {
      setError('Please enter a valid annual gross salary.');
      return;
    }
    setError('');
    onCalculate(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="salary">Annual Gross Salary (₹)</label>
        <input
          id="salary"
          type="number"
          placeholder="e.g. 1500000"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          min="0"
          step="1000"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate Tax'}
      </button>
    </form>
  );
}