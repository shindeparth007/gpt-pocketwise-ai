import 'dotenv/config';
import { initDb } from './lib/db.js';

async function setup() {
  console.log('Connecting to Neon PostgreSQL database...');
  try {
    await initDb();
    console.log('✅ PostgreSQL Schema initialized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error initializing schema:', err);
    process.exit(1);
  }
}

setup();
