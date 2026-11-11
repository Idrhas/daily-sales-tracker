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

  // 4. Default to req.url
  return req.url;
}

export default async function handler(req, res) {
  if (!dbInitialized) {
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
