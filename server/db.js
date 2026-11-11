const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const defaultDbPath = path.join(__dirname, 'sales.db');
let dbPath = defaultDbPath;

if (isServerless) {
  const tmpDbPath = path.join('/tmp', 'sales.db');
  if (!fs.existsSync(tmpDbPath) && fs.existsSync(defaultDbPath)) {
    try {
      fs.copyFileSync(defaultDbPath, tmpDbPath);
    } catch (e) {
      console.error('Failed to copy database to /tmp:', e);
    }
  }
  dbPath = tmpDbPath;
}

const db = new sqlite3.Database(dbPath);

// Helper for promise-based queries
db.runAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

db.allAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

db.getAsync = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

async function initDB() {
  // Ensure tables exist
  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT '$',
      description TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      receipt_url TEXT,
      created_by TEXT DEFAULT 'user',
      notes TEXT,
      items TEXT,
      cash_amount REAL DEFAULT 0,
      card_amount REAL DEFAULT 0,
      other_amount REAL DEFAULT 0,
      other_payment_name TEXT,
      payment_method TEXT DEFAULT 'Cash'
    )
  `);

  const cols = [
    'ALTER TABLE sales ADD COLUMN items TEXT',
    'ALTER TABLE sales ADD COLUMN cash_amount REAL DEFAULT 0',
    'ALTER TABLE sales ADD COLUMN card_amount REAL DEFAULT 0',
    'ALTER TABLE sales ADD COLUMN other_amount REAL DEFAULT 0',
    'ALTER TABLE sales ADD COLUMN other_payment_name TEXT',
    'ALTER TABLE sales ADD COLUMN payment_method TEXT DEFAULT "Cash"'
  ];
  for (const c of cols) {
    try {
      await db.runAsync(c);
    } catch (e) {
      // Column already exists
    }
  }

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      action TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      details TEXT
    )
  `);

  await db.runAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default admin user if not exists
  const existingAdmin = await db.getAsync(`SELECT * FROM users WHERE username = ?`, ['admin']);
  if (!existingAdmin) {
    const defaultPassword = 'admin'; // User can change in UI
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(defaultPassword, salt);
    await db.runAsync(
      `INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)`,
      ['admin', hash, 'admin', new Date().toISOString()]
    );
    console.log('Default admin account created: admin / admin');
  }

  // Seed default public share token if not exists
  const shareToken = await db.getAsync(`SELECT * FROM settings WHERE key = 'share_token'`);
  if (!shareToken) {
    const token = 'public-view-' + Math.random().toString(36).substring(2, 10);
    await db.runAsync(`INSERT INTO settings (key, value) VALUES ('share_token', ?)`, [token]);
  }

  // Seed backup interval setting if not exists
  const backupInterval = await db.getAsync(`SELECT * FROM settings WHERE key = 'backup_interval'`);
  if (!backupInterval) {
    await db.runAsync(`INSERT INTO settings (key, value) VALUES ('backup_interval', 'daily')`);
  }

  console.log('Database initialized successfully at:', dbPath);
}

module.exports = {
  db,
  initDB
};

