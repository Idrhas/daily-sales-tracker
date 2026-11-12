const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { requireAuth } = require('../middleware/auth');

// Helper to compute date boundaries
function getDateBoundaries(filter, customStart, customEnd) {
  const now = new Date();
  let startDate = null;
  let endDate = null;

  if (filter === 'today') {
    startDate = now.toISOString().split('T')[0];
    endDate = startDate;
  } else if (filter === 'week') {
    // Current week (Monday to Sunday)
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(now.setDate(diff));
    startDate = monday.toISOString().split('T')[0];
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    endDate = sunday.toISOString().split('T')[0];
  } else if (filter === 'month') {
    // Current month
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    startDate = `${year}-${month}-01`;
    // Last day of month
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
    endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
  } else if (filter === 'custom' && customStart && customEnd) {
    startDate = customStart;
    endDate = customEnd;
  }

  return { startDate, endDate };
}

// GET /api/sales/public - Public read-only sales list for regular visitors (no auth required)
router.get('/public', async (req, res) => {
  try {
    const { filter = 'all', startDate: cStart, endDate: cEnd, search = '', sortBy = 'date', sortOrder = 'DESC' } = req.query;

    let query = `SELECT id, amount, currency, description, category, date, time, created_at, receipt_url, notes, items, cash_amount, card_amount, other_amount, other_payment_name, payment_method FROM sales WHERE 1=1`;
    const params = [];

    const { startDate, endDate } = getDateBoundaries(filter, cStart, cEnd);
    if (startDate && endDate) {
      query += ` AND date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND date >= ?`;
      params.push(startDate);
    }

    if (search.trim()) {
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

    const rawSales = await db.allAsync(query, params);
    const sales = rawSales.map(item => ({
      ...item,
      proof_url: item.receipt_url || item.proof_url || null,
      receipt_url: item.receipt_url || item.proof_url || null
    }));

    let totalAmount = 0;
    let totalCash = 0;
    let totalCard = 0;
    let totalOther = 0;
    for (const item of sales) {
      totalAmount += Number(item.amount) || 0;
      totalCash += Number(item.cash_amount) || 0;
      totalCard += Number(item.card_amount) || 0;
      totalOther += Number(item.other_amount) || 0;
    }
    const count = sales.length;
    const average = count > 0 ? (totalAmount / count) : 0;

    res.json({
      readOnly: true,
      sales,
      stats: {
        totalAmount: Number(totalAmount.toFixed(2)),
        totalCash: Number(totalCash.toFixed(2)),
        totalCard: Number(totalCard.toFixed(2)),
        totalOther: Number(totalOther.toFixed(2)),
        count,
        averageAmount: Number(average.toFixed(2))
      }
    });
  } catch (err) {
    console.error('Fetch public sales error:', err);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// GET /api/sales - List sales with filters, sorting, search (Admin authenticated)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { filter = 'all', startDate: cStart, endDate: cEnd, search = '', sortBy = 'date', sortOrder = 'DESC' } = req.query;

    let query = `SELECT * FROM sales WHERE 1=1`;
    const params = [];

    const { startDate, endDate } = getDateBoundaries(filter, cStart, cEnd);
    if (startDate && endDate) {
      query += ` AND date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND date >= ?`;
      params.push(startDate);
    }

    if (search.trim()) {
      query += ` AND (description LIKE ? OR category LIKE ? OR notes LIKE ?)`;
      const searchParam = `%${search.trim()}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    // Allowed sort columns
    const allowedSortColumns = ['date', 'amount', 'created_at', 'description'];
    const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'date';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (validSortBy === 'date') {
      query += ` ORDER BY date ${validSortOrder}, time ${validSortOrder}, id ${validSortOrder}`;
    } else {
      query += ` ORDER BY ${validSortBy} ${validSortOrder}, id DESC`;
    }

    const rawSales = await db.allAsync(query, params);
    const sales = rawSales.map(item => ({
      ...item,
      proof_url: item.receipt_url || item.proof_url || null,
      receipt_url: item.receipt_url || item.proof_url || null
    }));

    // Calculate aggregated statistics
    let totalAmount = 0;
    let totalCash = 0;
    let totalCard = 0;
    let totalOther = 0;
    for (const item of sales) {
      totalAmount += Number(item.amount) || 0;
      totalCash += Number(item.cash_amount) || 0;
      totalCard += Number(item.card_amount) || 0;
      totalOther += Number(item.other_amount) || 0;
    }
    const count = sales.length;
    const average = count > 0 ? (totalAmount / count) : 0;

    res.json({
      sales,
      stats: {
        totalAmount: Number(totalAmount.toFixed(2)),
        totalCash: Number(totalCash.toFixed(2)),
        totalCard: Number(totalCard.toFixed(2)),
        totalOther: Number(totalOther.toFixed(2)),
        count,
        averageAmount: Number(average.toFixed(2))
      }
    });
  } catch (err) {
    console.error('Fetch sales error:', err);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// POST /api/sales - Record a new sale
router.post('/', requireAuth, async (req, res) => {
  try {
    const { 
      amount, 
      currency = '$', 
      description, 
      category = 'General', 
      date, 
      time, 
      receipt_url, 
      proof_url,
      notes, 
      items,
      cash_amount,
      card_amount,
      other_amount,
      other_payment_name,
      payment_method
    } = req.body;

    const itemsJson = items ? (typeof items === 'string' ? items : JSON.stringify(items)) : null;
    const finalProofUrl = proof_url || receipt_url || null;
    let finalAmount = amount;
    let finalDesc = description;

    // If items list provided, calculate amount from items if not given
    if ((finalAmount === undefined || finalAmount === null || finalAmount === '') && Array.isArray(items) && items.length > 0) {
      finalAmount = items.reduce((sum, it) => sum + (Number(it.total) || (Number(it.qty || 1) * Number(it.price || 0))), 0);
    }

    if (!finalDesc && Array.isArray(items) && items.length > 0) {
      finalDesc = items[0].name || items[0].description || 'Sales Order';
      if (items.length > 1) {
        finalDesc += ` (+${items.length - 1} more items)`;
      }
    }

    if (finalAmount === undefined || finalAmount === null || !finalDesc) {
      return res.status(400).json({ error: 'Amount and description (or items list) are required' });
    }

    // Determine payment amounts
    let cash = cash_amount !== undefined ? Number(cash_amount) : 0;
    let card = card_amount !== undefined ? Number(card_amount) : 0;
    let other = other_amount !== undefined ? Number(other_amount) : 0;
    let pMethod = payment_method;

    if (cash === 0 && card === 0 && other === 0) {
      cash = Number(finalAmount);
      pMethod = 'Cash';
    } else if (!pMethod) {
      if (cash > 0 && (card > 0 || other > 0)) pMethod = 'Split';
      else if (card > 0) pMethod = 'Card';
      else if (other > 0) pMethod = other_payment_name || 'Other';
      else pMethod = 'Cash';
    }

    const now = new Date();
    const finalDate = date || now.toISOString().split('T')[0];
    const finalTime = time || now.toTimeString().split(' ')[0].substring(0, 5);
    // Server enforced immutable timestamp
    const createdAt = now.toISOString();

    const result = await db.runAsync(
      `INSERT INTO sales (amount, currency, description, category, date, time, created_at, receipt_url, created_by, notes, items, cash_amount, card_amount, other_amount, other_payment_name, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Number(finalAmount), currency, finalDesc.trim(), category || 'General', finalDate, finalTime, createdAt, finalProofUrl, req.user.username, notes || null, itemsJson, cash, card, other, other_payment_name || null, pMethod]
    );

    const saleId = result.lastID;

    // Record in Audit Trail
    await db.runAsync(
      `INSERT INTO audit_logs (sale_id, action, changed_by, changed_at, details)
       VALUES (?, ?, ?, ?, ?)`,
      [
        saleId,
        'CREATE',
        req.user.username,
        createdAt,
        JSON.stringify({
          amount: Number(finalAmount),
          description: finalDesc.trim(),
          date: finalDate,
          time: finalTime,
          payment: { cash, card, other, method: pMethod }
        })
      ]
    );

    const newSale = await db.getAsync(`SELECT * FROM sales WHERE id = ?`, [saleId]);
    res.status(201).json({
      sale: {
        ...newSale,
        proof_url: newSale.receipt_url,
        receipt_url: newSale.receipt_url
      }
    });
  } catch (err) {
    console.error('Create sale error:', err);
    res.status(500).json({ error: 'Failed to record sale' });
  }
});

// PUT /api/sales/:id - Update sale with full audit tracking
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      amount, 
      currency, 
      description, 
      category, 
      date, 
      time, 
      receipt_url, 
      proof_url,
      notes, 
      items,
      cash_amount,
      card_amount,
      other_amount,
      other_payment_name,
      payment_method
    } = req.body;

    const existing = await db.getAsync(`SELECT * FROM sales WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Sale record not found' });
    }

    const updatedAt = new Date().toISOString();
    const itemsJson = items !== undefined ? (typeof items === 'string' ? items : JSON.stringify(items)) : existing.items;

    const updatedAmount = amount !== undefined ? Number(amount) : existing.amount;
    const updatedCurrency = currency || existing.currency;
    const updatedDesc = description !== undefined ? description.trim() : existing.description;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedDate = date || existing.date;
    const updatedTime = time || existing.time;
    const incomingProof = proof_url !== undefined ? proof_url : receipt_url;
    const updatedReceipt = incomingProof !== undefined ? incomingProof : existing.receipt_url;
    const updatedNotes = notes !== undefined ? notes : existing.notes;
    const updatedCash = cash_amount !== undefined ? Number(cash_amount) : (existing.cash_amount || 0);
    const updatedCard = card_amount !== undefined ? Number(card_amount) : (existing.card_amount || 0);
    const updatedOther = other_amount !== undefined ? Number(other_amount) : (existing.other_amount || 0);
    const updatedOtherName = other_payment_name !== undefined ? other_payment_name : existing.other_payment_name;
    const updatedMethod = payment_method !== undefined ? payment_method : existing.payment_method;

    await db.runAsync(
      `UPDATE sales
       SET amount = ?, currency = ?, description = ?, category = ?, date = ?, time = ?, updated_at = ?, receipt_url = ?, notes = ?, items = ?,
           cash_amount = ?, card_amount = ?, other_amount = ?, other_payment_name = ?, payment_method = ?
       WHERE id = ?`,
      [updatedAmount, updatedCurrency, updatedDesc, updatedCategory, updatedDate, updatedTime, updatedAt, updatedReceipt, updatedNotes, itemsJson,
       updatedCash, updatedCard, updatedOther, updatedOtherName, updatedMethod, id]
    );

    const changes = {
      previous: {
        amount: existing.amount,
        description: existing.description,
        payment: { cash: existing.cash_amount, card: existing.card_amount, other: existing.other_amount, method: existing.payment_method }
      },
      current: {
        amount: updatedAmount,
        description: updatedDesc,
        payment: { cash: updatedCash, card: updatedCard, other: updatedOther, method: updatedMethod }
      }
    };

    await db.runAsync(
      `INSERT INTO audit_logs (sale_id, action, changed_by, changed_at, details)
       VALUES (?, ?, ?, ?, ?)`,
      [id, 'UPDATE', req.user.username, updatedAt, JSON.stringify(changes)]
    );

    const updatedSale = await db.getAsync(`SELECT * FROM sales WHERE id = ?`, [id]);
    res.json({
      sale: {
        ...updatedSale,
        proof_url: updatedSale.receipt_url,
        receipt_url: updatedSale.receipt_url
      }
    });
  } catch (err) {
    console.error('Update sale error:', err);
    res.status(500).json({ error: 'Failed to update sale' });
  }
});

// DELETE /api/sales/:id - Delete sale with audit log
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getAsync(`SELECT * FROM sales WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Sale record not found' });
    }

    const deletedAt = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO audit_logs (sale_id, action, changed_by, changed_at, details)
       VALUES (?, ?, ?, ?, ?)`,
      [id, 'DELETE', req.user.username, deletedAt, JSON.stringify(existing)]
    );

    await db.runAsync(`DELETE FROM sales WHERE id = ?`, [id]);

    res.json({ message: 'Sale record deleted and logged in audit trail' });
  } catch (err) {
    console.error('Delete sale error:', err);
    res.status(500).json({ error: 'Failed to delete sale' });
  }
});

// GET /api/sales/:id/audit - View audit history for a sale
router.get('/:id/audit', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const history = await db.allAsync(
      `SELECT * FROM audit_logs WHERE sale_id = ? ORDER BY changed_at DESC`,
      [id]
    );
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit history' });
  }
});

// GET /api/sales/export/csv - Download CSV
router.get('/export/csv', requireAuth, async (req, res) => {
  try {
    const sales = await db.allAsync(`SELECT * FROM sales ORDER BY date DESC, time DESC`);
    let csv = 'ID,Date,Time,Amount,Currency,Category,Description,ReceiptURL,UploadedAt,UpdatedAt,CreatedBy,Notes\r\n';
    for (const s of sales) {
      const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
      csv += `${s.id},${escape(s.date)},${escape(s.time)},${s.amount},${escape(s.currency)},${escape(s.category)},${escape(s.description)},${escape(s.receipt_url)},${escape(s.created_at)},${escape(s.updated_at)},${escape(s.created_by)},${escape(s.notes)}\r\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="sales-export-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate CSV export' });
  }
});

module.exports = router;

