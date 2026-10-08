import pool from '../config/db.js';

export async function saveProfile(req, res) {
  try {
    const { profileName, basic, hra, special, bonus, other, employerPf, gratuity } = req.body;

    if (!profileName || !profileName.trim()) {
      return res.status(400).json({ error: 'Profile name is required.' });
    }

    const result = await pool.query(
      `INSERT INTO salary_profiles
        (user_id, profile_name, basic, hra, special, bonus, other, employer_pf, gratuity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.id, profileName.trim(), basic || 0, hra || 0, special || 0, bonus || 0, other || 0, employerPf || 0, gratuity || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving profile:', err);
    res.status(500).json({ error: 'Something went wrong while saving the profile.' });
  }
}

export async function getProfiles(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM salary_profiles WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.status(500).json({ error: 'Something went wrong while fetching profiles.' });
  }
}

export async function deleteProfile(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM salary_profiles WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json({ deleted: true });
  } catch (err) {
    console.error('Error deleting profile:', err);
    res.status(500).json({ error: 'Something went wrong while deleting the profile.' });
  }
}