const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

// Helper to compute date boundaries for shared view
function getDateBoundaries(filter, customStart, customEnd) {
  const now = new Date();
  let startDate = null;
  let endDate = null;

  if (filter === 'today') {
    startDate = now.toISOString().split('T')[0];
    endDate = startDate;
  } else if (filter === 'week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    startDate = monday.toISOString().split('T')[0];
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    endDate = sunday.toISOString().split('T')[0];
  } else if (filter === 'month') {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    startDate = `${year}-${month}-01`;
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
  } else if (filter === 'custom' && customStart && customEnd) {
    startDate = customStart;
    endDate = customEnd;
  }

  return { startDate, endDate };
}

// GET /api/share/token - Get current share token (Admin only)
router.get('/token', requireAuth, async (req, res) => {
  try {
    const row = await db.getAsync(`SELECT value FROM settings WHERE key = 'share_token'`);
    res.json({ token: row ? row.value : '' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve share token' });
  }
});

// POST /api/share/token/regenerate - Generate a new secret token (Admin only)
router.post('/token/regenerate', requireAuth, async (req, res) => {
  try {
    const newToken = 'view-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
    await db.runAsync(`INSERT OR REPLACE INTO settings (key, value) VALUES ('share_token', ?)`, [newToken]);
    res.json({ token: newToken });
  } catch (err) {
    res.status(500).json({ error: 'Failed to regenerate share token' });
  }
});

// GET /api/share/data - Public read-only sales view using the share token
router.get('/data', async (req, res) => {
  try {
    const { token, filter = 'all', startDate: cStart, endDate: cEnd, search = '', sortBy = 'date', sortOrder = 'DESC' } = req.query;

    if (!token) {
      return res.status(401).json({ error: 'Share token is required to view this dashboard' });
    }

    const currentTokenSetting = await db.getAsync(`SELECT value FROM settings WHERE key = 'share_token'`);
    if (!currentTokenSetting || currentTokenSetting.value !== token) {
      return res.status(403).json({ error: 'Invalid or expired share link' });
    }

    let query = `SELECT id, amount, currency, description, category, date, time, created_at, receipt_url, notes FROM sales WHERE 1=1`;
    const params = [];

    const { startDate, endDate } = getDateBoundaries(filter, cStart, cEnd);
    if (startDate && endDate) {
      query += ` AND date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND date >= ?`;
      params.push(startDate);
    }

    if (search && search.trim()) {
      query += ` AND (description LIKE ? OR category LIKE ? OR notes LIKE ?)`;
      const searchParam = `%${search.trim()}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    const allowedSortColumns = ['date', 'amount', 'created_at', 'description'];
    const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'date';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (validSortBy === 'date') {
      query += ` ORDER BY date ${validSortOrder}, time ${validSortOrder}, id ${validSortOrder}`;
    } else {
      query += ` ORDER BY ${validSortBy} ${validSortOrder}, id DESC`;
    }

    const sales = await db.allAsync(query, params);

    let totalAmount = 0;
    for (const item of sales) {
      totalAmount += Number(item.amount) || 0;
    }
    const count = sales.length;
    const average = count > 0 ? (totalAmount / count) : 0;

    res.json({
      readOnly: true,
      sales,
      stats: {
        totalAmount: Number(totalAmount.toFixed(2)),
        count,
        averageAmount: Number(average.toFixed(2))
      }
    });
  } catch (err) {
    console.error('Fetch shared sales error:', err);
    res.status(500).json({ error: 'Failed to load shared data' });
  }
});

module.exports = router;

