const app = require('../server/app');
const { initDB } = require('../server/db');

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
  return req.url;
}

module.exports = async (req, res) => {
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
};
