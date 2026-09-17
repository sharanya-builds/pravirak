import 'dotenv/config';
import { createApp } from './app.js';
import { initSchema, pool } from './db/index.js';

const port = process.env.PORT || 4000;

async function start() {
  try {
    await initSchema();
  } catch (err) {
    console.warn('\n⚠️ Warning: PostgreSQL not connected. Running in offline/stateless mode.');
    console.warn(`Reason: ${err.message}`);
    console.warn('Geocoding, AI Advisor, and Schemes will function normally. User login/saving requires PostgreSQL.\n');
  }

  const app = createApp();
  app.listen(port, '0.0.0.0', () => {
    console.log(`PRAVIRAK backend listening on 0.0.0.0:${port}`);
  });
}

start();

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
