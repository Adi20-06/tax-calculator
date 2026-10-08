import RevealCard from '../components/RevealCard';
import AnimatedGradientText from '../components/AnimatedGradientText';
import FaqAccordion from '../components/FaqAccordion';

const SLABS = [
  { range: '₹0 – ₹4,00,000', rate: '0%' },
  { range: '₹4,00,000 – ₹8,00,000', rate: '5%' },
  { range: '₹8,00,000 – ₹12,00,000', rate: '10%' },
  { range: '₹12,00,000 – ₹16,00,000', rate: '15%' },
  { range: '₹16,00,000 – ₹20,00,000', rate: '20%' },
  { range: '₹20,00,000 – ₹24,00,000', rate: '25%' },
  { range: 'Above ₹24,00,000', rate: '30%' },
];

const FAQ_ITEMS = [
  {
    question: 'Why is my tax higher than I expected?',
    answer:
      'The most common reason is the surcharge or cess being added on top of slab tax, or crossing the ₹12L threshold where the Section 87A rebate stops applying entirely (not just partially) — this creates a noticeable jump right above that line.',
  },
  {
    question: 'What is cess and why do I pay it?',
    answer:
      'The Health & Education Cess is an additional 4% charged on your total tax (slab tax plus any surcharge) — not on your income. It funds designated health and education schemes and applies to every taxpayer regardless of income level.',
  },
  {
    question: 'Is my salary really tax-free up to ₹12.75 lakh?',
    answer:
      'Effectively yes, for pure salary income. The ₹75,000 standard deduction brings ₹12,75,000 down to exactly ₹12,00,000 taxable income, and the Section 87A rebate then zeroes out tax on income up to that ₹12L mark — but this rebate does not apply to capital gains or certain other income types.',
  },
  {
    question: 'Can I switch between Old and New Regime every year?',
    answer:
      'Salaried individuals (without business income) can choose either regime each financial year when filing returns. If you have business or professional income, switching back to the Old Regime after opting for the New Regime has additional restrictions — check current IT department rules.',
  },
  {
    question: 'Does this calculator account for HRA exemption?',
    answer:
      'Not under the New Regime — HRA exemption, LTA, and most other allowance exemptions are not available there. If you want to see the impact of these exemptions, use the Old vs New comparison page, which lets you enter your total old-regime deductions manually.',
  },
  {
    question: 'What is marginal relief?',
    answer:
      'It is a safeguard so that earning slightly more than a rebate threshold never leaves you worse off than earning slightly less. For income just above ₹12L, the tax is capped so it never exceeds the amount your income exceeds ₹12L by — this calculator applies that automatically.',
  },
];

export default function About() {
  return (
    <div>
      <h1 className="page-title">
        <AnimatedGradientText as="span">About TaxLedger</AnimatedGradientText>
      </h1>
      <p className="page-subtitle">How your tax is calculated, and what to double-check</p>

      <RevealCard delay={0.05}>
        <div className="card">
          <h3 style={{ marginBottom: 10 }}>New Regime Basics — FY 2025-26</h3>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-soft)' }}>
            Salaried individuals get a flat ₹75,000 standard deduction. Remaining income is taxed
            across seven slabs from 0% to 30%. If your net taxable income is ₹12 lakh or below, the
            Section 87A rebate (up to ₹60,000) brings your tax to zero — effectively making salaries
            up to ₹12.75 lakh tax-free.
          </p>
        </div>
      </RevealCard>

      <RevealCard delay={0.1}>
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 14 }}>Slab Rates at a Glance</h3>
          <table className="ledger-table">
            <thead>
              <tr><th>Income Range</th><th>Rate</th></tr>
            </thead>
            <tbody>
              {SLABS.map((s, i) => (
                <tr key={i}>
                  <td>{s.range}</td>
                  <td>{s.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </RevealCard>

      <RevealCard delay={0.15}>
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Old Regime vs New Regime — the short version</h3>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-soft)' }}>
            The Old Regime charges higher slab rates but lets you subtract deductions like 80C
            investments, 80D health insurance, HRA exemption, and home loan interest before tax is
            computed. The New Regime charges lower rates but only allows the flat standard
            deduction. Whichever leaves you with a smaller tax bill for your specific numbers is the
            better choice for that year — use the Old vs New page to check with your own figures.
          </p>
        </div>
      </RevealCard>

      <RevealCard delay={0.2}>
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>What this calculator does not cover</h3>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-soft)' }}>
            This tool estimates tax based on standard salary-income rules. It does not account for
            capital gains, business or professional income, foreign income, or every edge case in
            surcharge marginal relief calculations. For an actual filing, verify figures with a tax
            professional or the official Income Tax Department calculator.
          </p>
        </div>
      </RevealCard>

      <RevealCard delay={0.25}>
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 10 }}>Data & Privacy</h3>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ink-soft)' }}>
            Each calculation is stored so you can view your history if you're logged in. Guest
            calculations aren't tied to any account. No personally identifying information is
            collected beyond what you provide at signup (name and email) — only the salary figures
            you enter are stored against a calculation.
          </p>
        </div>
      </RevealCard>

      <RevealCard delay={0.3}>
        <div className="card" style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 14 }}>Frequently Asked Questions</h3>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </RevealCard>
    </div>
  );
}