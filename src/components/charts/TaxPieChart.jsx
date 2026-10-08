import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = { takeHome: '#1F7A53', tax: '#A23B2E' };

export default function TaxPieChart({ result }) {
  const data = [
    { name: 'Take-Home', value: result.netTakeHome },
    { name: 'Total Tax', value: result.totalTax },
  ];

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
        >
          <Cell fill={COLORS.takeHome} />
          <Cell fill={COLORS.tax} />
        </Pie>
        <Tooltip formatter={(value) => fmt(value)} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}