require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const salesRoutes = require('./routes/sales');
const shareRoutes = require('./routes/share');
const backupsRoutes = require('./routes/backups');
const ocrRoutes = require('./routes/ocr');

const app = express();

// CORS - allow all origins for serverless
app.use(cors({ origin: '*' }));

// Parse JSON and form data
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded receipts statically
const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) {}
}
app.use('/uploads', express.static(uploadsDir));

// -------------------------
// API ROUTES
// -------------------------
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/upload', ocrRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: process.env.VERCEL ? 'serverless' : 'node', serverTime: new Date().toISOString() });
});

// -------------------------
// STATIC FILES + SPA FALLBACK
// -------------------------
// Find the built client assets
const possibleDists = [
  path.join(__dirname, '..', 'dist'),       // client/dist when running in client/server
  path.join(__dirname, '..', '..', 'dist'), // root dist
  path.join(__dirname, '..', '..', 'public')
];
const distPath = possibleDists.find(d => fs.existsSync(d));

if (distPath) {
  // Serve static assets (js, css, images, etc.)
  app.use(express.static(distPath));

  // All non-API routes serve index.html (SPA routing)
  app.use((req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.path}` });
    }
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Frontend build not found. Run npm run build in client/.' });
    }
  });
} else {
  // No static files - return JSON for all unknown routes
  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });
}

module.exports = app;
