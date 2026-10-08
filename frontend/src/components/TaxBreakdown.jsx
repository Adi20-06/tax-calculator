export default function TaxBreakdown({ result }) {
  if (!result) return null;

  const {
    grossSalary, standardDeduction, taxableIncome, breakdown,
    rebateApplied, surcharge, taxBeforeCess, cess, totalTax, netTakeHome,
  } = result;

  const fmt = (num) => `₹${Number(num).toLocaleString('en-IN')}`;

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Tax Breakdown</h2>

      <div className="ledger-row">
        <span>Gross Salary</span>
        <span className="amount">{fmt(grossSalary)}</span>
      </div>
      <div className="ledger-row">
        <span>Standard Deduction</span>
        <span className="amount">− {fmt(standardDeduction)}</span>
      </div>
      <div className="ledger-row total">
        <span>Taxable Income</span>
        <span className="amount">{fmt(taxableIncome)}</span>
      </div>

      <h3 style={{ margin: '24px 0 12px', fontSize: 15 }}>Slab-wise Tax</h3>
      <div className="table-scroll">
  <table className="ledger-table">
        <thead>
          <tr><th>Income Range (₹)</th><th>Rate</th><th>Tax</th></tr>
        </thead>
        <tbody>
          {breakdown.map((slab, i) => (
            <tr key={i}>
              <td>{slab.range}</td>
              <td>{slab.rate}%</td>
              <td>{fmt(slab.taxOnSlab)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div style={{ marginTop: 20 }}>
        {rebateApplied > 0 && (
          <div className="ledger-row">
            <span className="tag-gold">Section 87A Rebate</span>
            <span className="amount tag-gold">− {fmt(rebateApplied)}</span>
          </div>
        )}
        {surcharge > 0 && (
          <div className="ledger-row">
            <span>Surcharge</span>
            <span className="amount">+ {fmt(surcharge)}</span>
          </div>
        )}
        <div className="ledger-row">
          <span>Tax before Cess</span>
          <span className="amount">{fmt(taxBeforeCess)}</span>
        </div>
        <div className="ledger-row">
          <span>Health & Education Cess (4%)</span>
          <span className="amount">+ {fmt(cess)}</span>
        </div>
        <div className="ledger-row total">
          <span>Total Tax Payable</span>
          <span className="amount">{fmt(totalTax)}</span>
        </div>
        <div className="ledger-row total tag-success">
          <span>Net Take-Home (Annual)</span>
          <span className="amount">{fmt(netTakeHome)}</span>
        </div>
        <div className="ledger-row">
          <span>Net Take-Home (Monthly)</span>
          <span className="amount">{fmt(Math.round(netTakeHome / 12))}</span>
        </div>
      </div>
    </div>
  );
}