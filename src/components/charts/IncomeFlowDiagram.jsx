import { Sankey, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';

const NODE_COLORS = ['#14203D', '#1F7A53', '#A23B2E', '#B8863B', '#5B6478'];

function CustomNode({ x, y, width, height, index, payload }) {
  return (
    <g>
      <Rectangle x={x} y={y} width={width} height={height} fill={NODE_COLORS[index % NODE_COLORS.length]} />
      <text x={x + width + 8} y={y + height / 2} textAnchor="start" fontSize={12} fill="#14203D" dominantBaseline="middle">
        {payload.name}
      </text>
    </g>
  );
}

export default function IncomeFlowDiagram({ result }) {
  const { grossSalary, netTakeHome, totalTax, taxBeforeCess, surcharge, cess } = result;
  const baseTax = taxBeforeCess + surcharge;

  const data = {
    nodes: [
      { name: 'Gross Salary' },
      { name: 'Take-Home' },
      { name: 'Total Tax' },
      { name: 'Base Tax' },
      { name: 'Cess' },
    ],
    links: [
      { source: 0, target: 1, value: Math.max(netTakeHome, 1) },
      { source: 0, target: 2, value: Math.max(totalTax, 1) },
      { source: 2, target: 3, value: Math.max(baseTax, 1) },
      { source: 2, target: 4, value: Math.max(cess, 1) },
    ],
  };

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <Sankey
        data={data}
        node={<CustomNode />}
        nodePadding={40}
        margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
        link={{ stroke: '#D9D4C4', strokeOpacity: 0.6 }}
      >
        <Tooltip formatter={(value) => fmt(value)} />
      </Sankey>
    </ResponsiveContainer>
  );
}