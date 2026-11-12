const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');
const { parseReceiptImage } = require('../ocr');

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const uploadsDir = isServerless ? path.join('/tmp', 'uploads') : path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {}
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|bmp/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are allowed'));
    }
  }
});

// Middleware to support either 'receipt' or 'proof' field name
const uploadProofOrReceipt = (req, res, next) => {
  upload.single('receipt')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (req.file) return next();
    upload.single('proof')(req, res, (err2) => {
      if (err2) return res.status(400).json({ error: err2.message });
      next();
    });
  });
};

// GET /api/upload/:filename - Serve single proof image
router.get('/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const possiblePaths = [
    path.join(uploadsDir, filename),
    path.join(__dirname, '..', 'uploads', filename),
    path.join('/tmp', 'uploads', filename)
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  res.status(404).json({ error: 'Proof image not found' });
});

// POST /api/upload - Upload proof/receipt image and optionally scan OCR
router.post('/', requireAuth, uploadProofOrReceipt, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const filePath = req.file.path;
    const fileUrl = `/uploads/${req.file.filename}`;
    const shouldScan = req.body.scan === 'true' || req.query.scan === 'true';

    let ocrResult = null;
    if (shouldScan) {
      console.log('Running OCR on uploaded proof/receipt:', req.file.filename);
      ocrResult = await parseReceiptImage(filePath);
    }

    res.json({
      success: true,
      fileUrl,
      proofUrl: fileUrl,
      filename: req.file.filename,
      ocr: ocrResult ? {
        extracted: ocrResult.extracted,
        rawText: ocrResult.rawText,
        ocrSuccess: ocrResult.success
      } : null
    });
  } catch (err) {
    console.error('Upload / OCR processing error:', err);
    res.status(500).json({ error: 'Failed to process receipt image: ' + err.message });
  }
});

module.exports = router;

