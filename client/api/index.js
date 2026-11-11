import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let app = null;
let initDB = null;
let loadError = null;

try {
  app = require('../server/app');
  initDB = require('../server/db').initDB;
} catch (e1) {
  try {
    app = require('../../server/app');
    initDB = require('../../server/db').initDB;
  } catch (e2) {
    loadError = (e1 && e1.stack) || (e1 && e1.message) || String(e1);
    console.error('Failed to load server app:', loadError);
  }
}

let dbInitialized = false;

function normalizeUrl(req) {
  // 1. If query.__path is passed from rewrite (e.g. /api/(.*) -> ?__path=$1)
  if (req.query && req.query.__path) {
    const cleanPath = req.query.__path.startsWith('/') ? req.query.__path : '/' + req.query.__path;
    return cleanPath.startsWith('/api') ? cleanPath : '/api' + cleanPath;
  }

  // 2. If catch-all query.all is passed (e.g. [...all].js -> ['auth', 'login'])
  if (req.query && req.query.all) {
    const sub = Array.isArray(req.query.all) ? req.query.all.join('/') : req.query.all;
    return '/api/' + sub;
  }

  // 3. If x-matched-path header is present from Vercel
  const matched = req.headers && (req.headers['x-matched-path'] || req.headers['x-vercel-matched-path']);
  if (matched && !matched.includes('index.js')) {
    return matched;
  }

  // 4. If x-forwarded-url header is present
  if (req.headers && req.headers['x-forwarded-url']) {
    try {
      const parsed = new URL(req.headers['x-forwarded-url'], 'http://localhost');
      if (parsed.pathname && !parsed.pathname.includes('index.js')) {
        return parsed.pathname + parsed.search;
      }
    } catch (e) {}
  }

  // 5. Default to req.url
  return req.url;
}

export default async function handler(req, res) {
  if (!app) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: 'Backend initialization failed: ' + (loadError || 'Unknown load error')
    });
  }

  if (!dbInitialized && initDB) {
    try {
      await initDB();
      dbInitialized = true;
    } catch (err) {
      console.error('Database initialization error on serverless:', err);
    }
  }

  const resolvedUrl = normalizeUrl(req);
  if (resolvedUrl) {
    req.url = resolvedUrl;
  }

  return app(req, res);
}
