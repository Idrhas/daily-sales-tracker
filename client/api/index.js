import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = require('../../server/app');
const { initDB } = require('../../server/db');

let dbInitialized = false;

export default async function handler(req, res) {
  if (!dbInitialized) {
    try {
      await initDB();
      dbInitialized = true;
    } catch (err) {
      console.error('Database initialization error on serverless:', err);
    }
  }
  return app(req, res);
}
