import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load the Express app - try client/server first, then fall back to root server
let app = null;
let initDB = null;
let loadError = null;

try {
  app = require('../server/app');
  initDB = require('../server/db').initDB;
  console.log('[api] Loaded from ../server/app');
} catch (e1) {
  try {
    app = require('../../server/app');
    initDB = require('../../server/db').initDB;
    console.log('[api] Loaded from ../../server/app');
  } catch (e2) {
    loadError = e1.stack || e1.message || String(e1);
    console.error('[api] Failed to load server app. Error 1:', e1.message, 'Error 2:', e2.message);
  }
}

let dbInitialized = false;

export default async function handler(req, res) {
  // If the app failed to load, return a JSON error
  if (!app) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: 'Server initialization failed',
      detail: loadError || 'Unknown error'
    });
  }

  // Initialize the database once per cold start
  if (!dbInitialized && initDB) {
    try {
      await initDB();
      dbInitialized = true;
    } catch (err) {
      console.error('[api] Database init error:', err.message);
    }
  }

  // On Vercel, when ALL routes rewrite to /api/index, req.url is the ORIGINAL path
  // e.g. a request to /api/auth/login arrives with req.url = '/api/auth/login'
  // Express will match /api/auth correctly since routes are mounted at /api/auth
  return app(req, res);
}
