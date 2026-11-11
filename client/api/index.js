import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let app = null;
let initDB = null;

try {
  app = require('../server/app');
  initDB = require('../server/db').initDB;
} catch (e) {
  app = require('../../server/app');
  initDB = require('../../server/db').initDB;
}

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
