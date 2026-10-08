import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TaxBarChart({ result }) {
  const data = result.breakdown
    .filter((slab) => slab.taxOnSlab > 0)
    .map((slab) => ({
      range: slab.range.replace(/,/g, ''),
      tax: slab.taxOnSlab,
    }));

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#D9D4C4" />
        <XAxis dataKey="range" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
        <Tooltip formatter={(value) => fmt(value)} />
        <Bar dataKey="tax" fill="#B8863B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}