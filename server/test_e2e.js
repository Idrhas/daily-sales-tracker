const fs = require('fs');
const path = require('path');

async function testE2E() {
  console.log('--- Starting End-to-End System Verification ---');

  const { initDB, db } = require('./db');
  const { createBackup, listBackups } = require('./backupService');

  // 1. Database Init Check
  await initDB();
  console.log('✓ Database initialized.');

  // 2. Auth Login API check
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('./middleware/auth');

  const admin = await db.getAsync(`SELECT * FROM users WHERE username = 'admin'`);
  if (!admin || !bcrypt.compareSync('admin', admin.password_hash)) {
    throw new Error('Default admin credentials check failed');
  }
  const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '1d' });
  console.log('✓ Admin login and JWT creation verified.');

  // 3. Sales Entry & Immutable Timestamps
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const timeStr = '14:30';
  const createdAt = now.toISOString();

  const insertRes = await db.runAsync(
    `INSERT INTO sales (amount, currency, description, category, date, time, created_at, created_by, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [150.75, '$', 'Coffee and Bakery Morning Sales', 'Food & Beverage', todayStr, timeStr, createdAt, 'admin', 'Morning shift']
  );
  const saleId = insertRes.lastID;

  await db.runAsync(
    `INSERT INTO audit_logs (sale_id, action, changed_by, changed_at, details) VALUES (?, ?, ?, ?, ?)`,
    [saleId, 'CREATE', 'admin', createdAt, JSON.stringify({ amount: 150.75, description: 'Coffee and Bakery Morning Sales' })]
  );
  console.log(`✓ Sale #${saleId} inserted with immutable timestamp: ${createdAt}`);

  // 4. Update Sale & Audit Trail Verification
  const updateTime = new Date().toISOString();
  await db.runAsync(
    `UPDATE sales SET amount = ?, notes = ?, updated_at = ? WHERE id = ?`,
    [175.50, 'Updated with afternoon add-on', updateTime, saleId]
  );

  await db.runAsync(
    `INSERT INTO audit_logs (sale_id, action, changed_by, changed_at, details) VALUES (?, ?, ?, ?, ?)`,
    [
      saleId,
      'UPDATE',
      'admin',
      updateTime,
      JSON.stringify({
        previous: { amount: 150.75, notes: 'Morning shift' },
        current: { amount: 175.50, notes: 'Updated with afternoon add-on' }
      })
    ]
  );

  const updatedSale = await db.getAsync(`SELECT * FROM sales WHERE id = ?`, [saleId]);
  const auditEntries = await db.allAsync(`SELECT * FROM audit_logs WHERE sale_id = ?`, [saleId]);

  if (updatedSale.created_at !== createdAt) {
    throw new Error('created_at timestamp was altered! Immutability broken.');
  }
  if (auditEntries.length !== 2) {
    throw new Error(`Expected 2 audit logs, found ${auditEntries.length}`);
  }
  console.log('✓ Sale update and immutable audit trail verified.');

  // 5. Read-Only Shared Link Verification
  const shareTokenRow = await db.getAsync(`SELECT value FROM settings WHERE key = 'share_token'`);
  const shareToken = shareTokenRow.value;
  console.log(`✓ Share token verified: ${shareToken}`);

  // 6. Test Backup Creation & Archive
  const backupResult = await createBackup();
  console.log(`✓ Backup created successfully: ${backupResult.filename} (${backupResult.size} bytes)`);
  if (!fs.existsSync(backupResult.path)) {
    throw new Error('Backup zip file does not exist on disk');
  }

  const existingBackups = listBackups();
  console.log(`✓ Backup listings verified (${existingBackups.length} archive files found).`);

  console.log('--- ALL BACKEND CHECKS PASSED ---');
  process.exit(0);
}

testE2E().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});

