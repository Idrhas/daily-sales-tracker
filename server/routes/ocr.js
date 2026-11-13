const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../middleware/auth');
const { supabase } = require('../supabase');

// Memory storage for fast streaming directly to Supabase
const upload = multer({
  storage: multer.memoryStorage(),
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

// GET /api/upload/:filename - Redirect to Supabase Storage public CDN URL
router.get('/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const { data } = supabase.storage.from('receipts').getPublicUrl(filename);
  if (data && data.publicUrl) {
    return res.redirect(302, data.publicUrl);
  }
  res.status(404).json({ error: 'Proof image not found' });
});

// POST /api/upload - Upload proof/receipt image directly to Supabase cloud storage
router.post('/', requireAuth, uploadProofOrReceipt, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const filename = 'receipt-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;

    // Upload directly to Supabase Storage bucket 'receipts'
    const { data, error } = await supabase.storage.from('receipts').upload(filename, req.file.buffer, {
      contentType: req.file.mimetype || 'image/jpeg',
      upsert: true
    });

    if (error) {
      console.error('Supabase cloud storage upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image to cloud storage: ' + error.message });
    }

    // Retrieve public CDN URL
    const { data: pubData } = supabase.storage.from('receipts').getPublicUrl(filename);
    const fileUrl = pubData.publicUrl;

    res.json({
      success: true,
      fileUrl,
      proofUrl: fileUrl,
      filename,
      ocr: null
    });
  } catch (err) {
    console.error('Upload processing error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

module.exports = router;
