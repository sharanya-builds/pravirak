import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function buildPoolConfig() {
  if (process.env.DATABASE_URL) {
    const isLocalhost =
      process.env.DATABASE_URL.includes('localhost') ||
      process.env.DATABASE_URL.includes('127.0.0.1');

    const requiresSsl =
      process.env.PGSSL === 'require' ||
      (!isLocalhost && (process.env.NODE_ENV === 'production' || process.env.DATABASE_URL.includes('render.com')));

    return {
      connectionString: process.env.DATABASE_URL,
      ssl: requiresSsl ? { rejectUnauthorized: false } : undefined
    };
  }
  return {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT) || 5432,
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'pravirak'
  };
}

export const pool = new Pool(buildPoolConfig());

pool.on('error', (err) => {
  // Errors on idle clients (e.g. connection dropped by the server) should
  // not crash the whole process.
  // eslint-disable-next-line no-console
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

export async function initSchema() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  await pool.query(schema);
}

export async function query(text, params) {
  return pool.query(text, params);
}
