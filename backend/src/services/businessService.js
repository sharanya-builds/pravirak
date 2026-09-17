import { pool } from '../db/index.js';

function rowToBusiness(row) {
  return {
    id: row.id,
    businessIdea: row.business_idea,
    category: row.category,
    locationId: row.location_id,
    locationName: row.location_name,
    ownCapital: row.own_capital === null ? null : Number(row.own_capital),
    status: row.status,
    decision: row.decision,
    snapshot: row.snapshot_json ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listBusinesses(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM businesses WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  );
  return rows.map(rowToBusiness);
}

export async function getBusiness(userId, id) {
  const { rows } = await pool.query(`SELECT * FROM businesses WHERE id = $1 AND user_id = $2`, [id, userId]);
  const row = rows[0];
  if (!row) {
    const err = new Error('Business not found.');
    err.status = 404;
    throw err;
  }
  return rowToBusiness(row);
}

export async function upsertBusiness(userId, payload) {
  const {
    id,
    businessIdea,
    category,
    locationId,
    locationName,
    ownCapital,
    status,
    decision,
    snapshot
  } = payload;

  if (!businessIdea) {
    const err = new Error('businessIdea is required.');
    err.status = 400;
    throw err;
  }

  const snapshotJson = JSON.stringify(snapshot ?? {});

  if (id) {
    const { rows: existingRows } = await pool.query(
      `SELECT id FROM businesses WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (existingRows.length > 0) {
      await pool.query(
        `UPDATE businesses SET business_idea = $1, category = $2, location_id = $3, location_name = $4,
         own_capital = $5, status = $6, decision = $7, snapshot_json = $8::jsonb, updated_at = NOW()
         WHERE id = $9 AND user_id = $10`,
        [
          businessIdea,
          category || null,
          locationId || null,
          locationName || null,
          ownCapital ?? null,
          status || 'Draft',
          decision || null,
          snapshotJson,
          id,
          userId
        ]
      );
      return getBusiness(userId, id);
    }
  }

  const { rows } = await pool.query(
    `INSERT INTO businesses
     (user_id, business_idea, category, location_id, location_name, own_capital, status, decision, snapshot_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
     RETURNING id`,
    [
      userId,
      businessIdea,
      category || null,
      locationId || null,
      locationName || null,
      ownCapital ?? null,
      status || 'Draft',
      decision || null,
      snapshotJson
    ]
  );

  return getBusiness(userId, rows[0].id);
}

export async function deleteBusiness(userId, id) {
  const result = await pool.query(`DELETE FROM businesses WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (result.rowCount === 0) {
    const err = new Error('Business not found.');
    err.status = 404;
    throw err;
  }
  return { deleted: true };
}
