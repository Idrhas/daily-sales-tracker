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
    const clean = String(req.query.__path).replace(/^\/+/, '');
    const search = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return (clean.startsWith('api/') ? '/' + clean : '/api/' + clean) + search;
  }
  if (req.query && req.query.all) {
    const sub = Array.isArray(req.query.all) ? req.query.all.join('/') : req.query.all;
    const search = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return '/api/' + sub + search;
  }
  const matched = req.headers && (req.headers['x-matched-path'] || req.headers['x-vercel-matched-path']);
  if (matched && !matched.includes('api/index')) {
    const search = req.url && req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    return matched + (matched.includes('?') ? '' : search);
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
