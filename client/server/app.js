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

// Enable CORS
app.use(cors());

// Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded receipts statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {}
}
app.use(['/api/uploads', '/uploads'], express.static(uploadsDir));

// API Routes (supports both /api/xxx and direct /xxx on serverless)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/sales', salesRoutes);
app.use('/sales', salesRoutes);

app.use('/api/share', shareRoutes);
app.use('/share', shareRoutes);

app.use('/api/backups', backupsRoutes);
app.use('/backups', backupsRoutes);

app.use('/api/upload', ocrRoutes);
app.use('/upload', ocrRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// JSON 404 for any unmatched API calls
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/sales') || req.path.startsWith('/share') || req.path.startsWith('/backups') || req.path.startsWith('/upload')) {
    return res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.originalUrl || req.url}` });
  }
  next();
});

// Serve frontend build if public or client/dist exists
const publicDist = path.join(__dirname, '..', 'public');
const clientDist = path.join(__dirname, '..', 'client', 'dist');
const distPath = fs.existsSync(publicDist) ? publicDist : clientDist;

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

module.exports = app;
