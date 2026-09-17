import { pool } from '../db/index.js';

function rowToReport(row) {
  return {
    id: row.id,
    businessId: row.business_id,
    title: row.title,
    generatedAt: row.generated_at,
    businessIdea: row.business_idea,
    status: row.status,
    decision: row.decision
  };
}

export async function listReports(userId) {
  const { rows } = await pool.query(
    `SELECT r.*, b.business_idea, b.status, b.decision
     FROM reports r JOIN businesses b ON b.id = r.business_id
     WHERE r.user_id = $1 ORDER BY r.generated_at DESC`,
    [userId]
  );
  return rows.map(rowToReport);
}

export async function createReport(userId, { businessId, title }) {
  const { rows: businessRows } = await pool.query(
    `SELECT id FROM businesses WHERE id = $1 AND user_id = $2`,
    [businessId, userId]
  );
  if (businessRows.length === 0) {
    const err = new Error('Business not found.');
    err.status = 404;
    throw err;
  }

  const { rows } = await pool.query(
    `INSERT INTO reports (business_id, user_id, title) VALUES ($1, $2, $3) RETURNING id`,
    [businessId, userId, title || 'Business Project Report']
  );

  const { rows: joined } = await pool.query(
    `SELECT r.*, b.business_idea, b.status, b.decision
     FROM reports r JOIN businesses b ON b.id = r.business_id WHERE r.id = $1`,
    [rows[0].id]
  );

  return rowToReport(joined[0]);
}
