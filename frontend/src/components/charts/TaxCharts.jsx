import { useState } from 'react';
import TaxPieChart from './TaxPieChart';
import TaxBarChart from './TaxBarChart';
import IncomeFlowDiagram from './IncomeFlowDiagram';

const VIEWS = [
  { key: 'pie', label: 'Pie Chart' },
  { key: 'bar', label: 'Slab Breakdown' },
  { key: 'flow', label: 'Income Flow' },
];

export default function TaxCharts({ result }) {
  const [view, setView] = useState('pie');

  if (!result) return null;

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="chart-tabs">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            className={`chart-tab${view === v.key ? ' active' : ''}`}
            onClick={() => setView(v.key)}
            type="button"
          >
            {v.label}
          </button>
        ))}
      </div>

      {view === 'pie' && <TaxPieChart result={result} />}
      {view === 'bar' && <TaxBarChart result={result} />}
      {view === 'flow' && <IncomeFlowDiagram result={result} />}
    </div>
  );
}