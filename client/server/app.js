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
app.use(['/api/uploads', '/uploads'], express.static(uploadsDir));

// -------------------------
// API ROUTES (dual mount)
// -------------------------
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/sales', '/sales'], salesRoutes);
app.use(['/api/share', '/share'], shareRoutes);
app.use(['/api/backups', '/backups'], backupsRoutes);
app.use(['/api/upload', '/upload'], ocrRoutes);

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', engine: process.env.VERCEL ? 'serverless' : 'node', serverTime: new Date().toISOString() });
});

// JSON 404 for unmatched API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/sales') || req.path.startsWith('/share') || req.path.startsWith('/backups') || req.path.startsWith('/upload')) {
    return res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl || req.url}` });
  }
  next();
});

// -------------------------
// STATIC FILES + SPA FALLBACK
// -------------------------
const possibleDists = [
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', '..', 'dist'),
  path.join(__dirname, '..', '..', 'public')
];
const distPath = possibleDists.find(d => fs.existsSync(d));

if (distPath) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'Frontend build not found.' });
    }
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });
}

module.exports = app;
