const STANDARD_DEDUCTION_NEW = 75000;
const STANDARD_DEDUCTION_OLD = 50000;
const REBATE_LIMIT_NEW = 1200000;
const REBATE_MAX_NEW = 60000;
const REBATE_LIMIT_OLD = 500000;
const REBATE_MAX_OLD = 12500;

const NEW_SLABS = [
  { upto: 400000, rate: 0 },
  { upto: 800000, rate: 0.05 },
  { upto: 1200000, rate: 0.10 },
  { upto: 1600000, rate: 0.15 },
  { upto: 2000000, rate: 0.20 },
  { upto: 2400000, rate: 0.25 },
  { upto: Infinity, rate: 0.30 },
];

const OLD_SLABS = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 0.05 },
  { upto: 1000000, rate: 0.20 },
  { upto: Infinity, rate: 0.30 },
];

function calculateSlabTax(taxableIncome, slabs) {
  let tax = 0;
  let lastLimit = 0;
  const breakdown = [];

  for (const slab of slabs) {
    if (taxableIncome > lastLimit) {
      const slabIncome = Math.min(taxableIncome, slab.upto) - lastLimit;
      const slabTax = slabIncome * slab.rate;
      if (slabIncome > 0) {
        breakdown.push({
          range: `${lastLimit.toLocaleString('en-IN')} - ${slab.upto === Infinity ? 'above' : slab.upto.toLocaleString('en-IN')}`,
          rate: slab.rate * 100,
          taxableAmount: slabIncome,
          taxOnSlab: Math.round(slabTax),
        });
      }
      tax += slabTax;
      lastLimit = slab.upto;
    } else break;
  }
  return { tax, breakdown };
}

function calculateSurcharge(taxableIncome, taxBeforeSurcharge) {
  let rate = 0;
  if (taxableIncome > 20000000) rate = 0.25;
  else if (taxableIncome > 10000000) rate = 0.15;
  else if (taxableIncome > 5000000) rate = 0.10;
  return Math.round(taxBeforeSurcharge * rate);
}

export function computeTax(grossSalary) {
  const taxableIncome = Math.max(grossSalary - STANDARD_DEDUCTION_NEW, 0);
  const { tax: slabTax, breakdown } = calculateSlabTax(taxableIncome, NEW_SLABS);

  let taxBeforeCess = slabTax;
  let rebateApplied = 0;

  if (taxableIncome <= REBATE_LIMIT_NEW) {
    rebateApplied = Math.min(taxBeforeCess, REBATE_MAX_NEW);
    taxBeforeCess -= rebateApplied;
  } else {
    const excessIncome = taxableIncome - REBATE_LIMIT_NEW;
    if (taxBeforeCess > excessIncome) taxBeforeCess = excessIncome;
  }

  const surcharge = calculateSurcharge(taxableIncome, taxBeforeCess);
  const taxWithSurcharge = taxBeforeCess + surcharge;
  const cess = Math.round(taxWithSurcharge * 0.04);
  const totalTax = Math.round(taxWithSurcharge + cess);
  const netTakeHome = Math.round(grossSalary - totalTax);

  return {
    regime: 'new',
    grossSalary,
    standardDeduction: STANDARD_DEDUCTION_NEW,
    taxableIncome,
    breakdown,
    rebateApplied: Math.round(rebateApplied),
    surcharge,
    taxBeforeCess: Math.round(taxBeforeCess),
    cess,
    totalTax,
    netTakeHome,
  };
}

export function computeOldRegimeTax(grossSalary, deductions = 0) {
  const taxableIncome = Math.max(grossSalary - STANDARD_DEDUCTION_OLD - deductions, 0);
  const { tax: slabTax, breakdown } = calculateSlabTax(taxableIncome, OLD_SLABS);

  let taxBeforeCess = slabTax;
  let rebateApplied = 0;

  if (taxableIncome <= REBATE_LIMIT_OLD) {
    rebateApplied = Math.min(taxBeforeCess, REBATE_MAX_OLD);
    taxBeforeCess -= rebateApplied;
  }

  const surcharge = calculateSurcharge(taxableIncome, taxBeforeCess);
  const taxWithSurcharge = taxBeforeCess + surcharge;
  const cess = Math.round(taxWithSurcharge * 0.04);
  const totalTax = Math.round(taxWithSurcharge + cess);
  const netTakeHome = Math.round(grossSalary - totalTax);

  return {
    regime: 'old',
    grossSalary,
    standardDeduction: STANDARD_DEDUCTION_OLD,
    otherDeductions: deductions,
    taxableIncome,
    breakdown,
    rebateApplied: Math.round(rebateApplied),
    surcharge,
    taxBeforeCess: Math.round(taxBeforeCess),
    cess,
    totalTax,
    netTakeHome,
  };
}

export function compareRegimes(grossSalary, oldRegimeDeductions = 0) {
  const newRegime = computeTax(grossSalary);
  const oldRegime = computeOldRegimeTax(grossSalary, oldRegimeDeductions);
  const betterRegime = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old';
  const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);

  return { newRegime, oldRegime, betterRegime, savings };
}