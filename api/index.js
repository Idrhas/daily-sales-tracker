let app = null;
let initDB = null;
let loadError = null;

try {
  app = require('../server/app');
  initDB = require('../server/db').initDB;
} catch (e) {
  loadError = e.stack || e.message || String(e);
  console.error('Root API failed to load server app:', loadError);
}

let dbInitialized = false;

function normalizeUrl(req) {
  if (req.query && req.query.__path) {
    const cleanPath = req.query.__path.startsWith('/') ? req.query.__path : '/' + req.query.__path;
    return cleanPath.startsWith('/api') ? cleanPath : '/api' + cleanPath;
  }
  if (req.query && req.query.all) {
    const sub = Array.isArray(req.query.all) ? req.query.all.join('/') : req.query.all;
    return '/api/' + sub;
  }
  const matched = req.headers && (req.headers['x-matched-path'] || req.headers['x-vercel-matched-path']);
  if (matched && !matched.includes('index.js')) {
    return matched;
  }
  if (req.headers && req.headers['x-forwarded-url']) {
    try {
      const parsed = new URL(req.headers['x-forwarded-url'], 'http://localhost');
      if (parsed.pathname && !parsed.pathname.includes('index.js')) {
        return parsed.pathname + parsed.search;
      }
    } catch (e) {}
  }
  return req.url;
}

module.exports = async (req, res) => {
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
};
