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
  // 1. If query.__path is passed from Vercel rewrite
  if (req.query && req.query.__path) {
    const clean = String(req.query.__path).replace(/^\/+/, '');
    const search = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return (clean.startsWith('api/') ? '/' + clean : '/api/' + clean) + search;
  }

  // 2. If catch-all query.all is passed from [...all].js
  if (req.query && req.query.all) {
    const sub = Array.isArray(req.query.all) ? req.query.all.join('/') : req.query.all;
    const search = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return '/api/' + sub + search;
  }

  // 3. If x-matched-path header is present from Vercel
  const matched = req.headers && (req.headers['x-matched-path'] || req.headers['x-vercel-matched-path']);
  if (matched && !matched.includes('api/index')) {
    const search = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return matched + (matched.includes('?') ? '' : search);
  }

  // 4. Default to req.url
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
