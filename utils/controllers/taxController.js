import pool from '../config/db.js';
import { computeTax, compareRegimes } from '../utils/taxLogic.js';

export async function calculateTax(req, res) {
  try {
    const { grossSalary } = req.body;

    if (grossSalary === undefined || grossSalary === null || isNaN(grossSalary) || grossSalary < 0) {
      return res.status(400).json({ error: 'Please provide a valid grossSalary (positive number).' });
    }

    const result = computeTax(Number(grossSalary));
    const userId = req.user ? req.user.id : null;

    const insertQuery = `
      INSERT INTO calculations
        (gross_salary, standard_deduction, taxable_income, tax_before_cess, cess, total_tax, net_take_home, breakdown, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at;
    `;
    const values = [
      result.grossSalary, result.standardDeduction, result.taxableIncome,
      result.taxBeforeCess, result.cess, result.totalTax, result.netTakeHome,
      JSON.stringify(result.breakdown), userId,
    ];

    const dbResult = await pool.query(insertQuery, values);

    res.json({ id: dbResult.rows[0].id, createdAt: dbResult.rows[0].created_at, ...result });
  } catch (err) {
    console.error('Error calculating tax:', err);
    res.status(500).json({ error: 'Something went wrong while calculating tax.' });
  }
}

export async function getHistory(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM calculations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Something went wrong while fetching history.' });
  }
}

export async function compareRegimesHandler(req, res) {
  try {
    const { grossSalary, oldRegimeDeductions } = req.body;

    if (grossSalary === undefined || isNaN(grossSalary) || grossSalary < 0) {
      return res.status(400).json({ error: 'Please provide a valid grossSalary.' });
    }

    const deductions = Number(oldRegimeDeductions) || 0;
    const result = compareRegimes(Number(grossSalary), deductions);

    res.json(result);
  } catch (err) {
    console.error('Error comparing regimes:', err);
    res.status(500).json({ error: 'Something went wrong while comparing regimes.' });
  }
}

export async function getCalculationById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM calculations WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calculation not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching calculation:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}