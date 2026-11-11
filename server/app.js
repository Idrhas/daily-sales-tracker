require('dotenv').config();
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

// CORS
app.use(cors());

// Parse JSON and form data
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded receipts statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) {}
}
app.use(['/api/uploads', '/uploads'], express.static(uploadsDir));

// API Routes (dual mount)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/sales', '/sales'], salesRoutes);
app.use(['/api/share', '/share'], shareRoutes);
app.use(['/api/backups', '/backups'], backupsRoutes);
app.use(['/api/upload', '/upload'], ocrRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// JSON 404 for unmatched API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/sales') || req.path.startsWith('/share') || req.path.startsWith('/backups') || req.path.startsWith('/upload')) {
    return res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl || req.url}` });
  }
  next();
});

// Serve frontend build
const publicDist = path.join(__dirname, '..', 'public');
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const distPath = fs.existsSync(publicDist) ? publicDist : (fs.existsSync(clientDist) ? clientDist : null);

if (distPath) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });
}

module.exports = app;
