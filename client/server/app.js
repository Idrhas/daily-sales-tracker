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

// Serve uploaded proofs and receipts statically
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsDir = isServerless ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) {}
}
app.use(['/api/uploads', '/uploads'], express.static(uploadsDir));
if (uploadsDir !== path.join(__dirname, 'uploads')) {
  app.use(['/api/uploads', '/uploads'], express.static(path.join(__dirname, 'uploads')));
}

// Explicit fallback handler for proof images
app.get(['/api/uploads/:file', '/uploads/:file'], (req, res) => {
  const fileName = path.basename(req.params.file);
  const candidates = [
    path.join(uploadsDir, fileName),
    path.join(__dirname, 'uploads', fileName),
    path.join(process.cwd(), 'server', 'uploads', fileName),
    path.join(process.cwd(), 'uploads', fileName)
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return res.sendFile(c);
    }
  }
  res.status(404).json({ error: 'Proof image not found' });
});

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
