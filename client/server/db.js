const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

let sqlite3 = null;
try {
  sqlite3 = require('sqlite3').verbose();
} catch (e) {
  console.log('Native sqlite3 module not available in this environment. Using pure-JS database engine.');
}

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const defaultDbPath = path.join(__dirname, 'sales.db');
let dbPath = defaultDbPath;

if (isServerless) {
  const tmpDbPath = path.join('/tmp', 'sales.db');
  if (!fs.existsSync(tmpDbPath) && fs.existsSync(defaultDbPath)) {
    try {
      fs.copyFileSync(defaultDbPath, tmpDbPath);
    } catch (e) {}
  }
  dbPath = tmpDbPath;
}

// ----------------------------------------------------
// PURE-JS FALLBACK DATABASE ENGINE (100% portable)
// ----------------------------------------------------
const jsonStorePath = isServerless ? path.join('/tmp', 'sales_store.json') : path.join(__dirname, 'sales_store.json');

function createPureJsStore() {
  // Pre-computed hash for 'sales2024' - avoids bcrypt overhead on cold start
  const hash = '$2b$10$T7ncXSipLVR9j4HKltZOhu7SqG3.I0l99Frl2iZT18IuJspPTi2x6';
  const now = new Date();
  const formatD = (d) => d.toISOString().split('T')[0];

  const d0 = new Date(now);
  const d1 = new Date(now); d1.setDate(now.getDate() - 1);
  const d2 = new Date(now); d2.setDate(now.getDate() - 2);

  return {
    users: [
      { id: 1, username: 'admin', password_hash: hash, role: 'admin', created_at: now.toISOString() }
    ],
    settings: {
      share_token: 'public-view-34wran9r',
      backup_interval: 'daily'
    },
    sales: [
      {
        id: 1,
        amount: 245.50,
        currency: '$',
        description: 'Morning Retail Electronics & Accessories',
        category: 'Retail',
        date: formatD(d0),
        time: '09:45',
        created_at: new Date(d0.getTime() - 3600000 * 4).toISOString(),
        updated_at: null,
        receipt_url: null,
        created_by: 'admin',
        notes: 'Customer paid with card and cash',
        items: JSON.stringify([
          { name: 'Wireless Ergonomic Keyboard', category: 'Retail', qty: 2, price: 45.00, total: 90.00 },
          { name: 'USB-C Fast Charging Hub', category: 'Retail', qty: 3, price: 24.50, total: 73.50 },
          { name: 'Desk Mat & Mouse Pad Set', category: 'Retail', qty: 1, price: 18.00, total: 18.00 }
        ]),
        cash_amount: 100.00,
        card_amount: 145.50,
        other_amount: 0,
        other_payment_name: null,
        payment_method: 'Split'
      },
      {
        id: 2,
        amount: 89.00,
        currency: '$',
        description: 'Catering & Beverages - Luncheon order',
        category: 'Food & Beverage',
        date: formatD(d0),
        time: '13:15',
        created_at: new Date(d0.getTime() - 3600000 * 2).toISOString(),
        updated_at: null,
        receipt_url: null,
        created_by: 'admin',
        notes: 'Direct takeaway',
        items: JSON.stringify([
          { name: 'Lunch Sandwich Platters', category: 'Food & Beverage', qty: 4, price: 15.00, total: 60.00 },
          { name: 'Fresh Juice Pitchers', category: 'Food & Beverage', qty: 2, price: 14.50, total: 29.00 }
        ]),
        cash_amount: 89.00,
        card_amount: 0,
        other_amount: 0,
        other_payment_name: null,
        payment_method: 'Cash'
      },
      {
        id: 3,
        amount: 520.00,
        currency: '$',
        description: 'Weekly Wholesale Packaging Supplies',
        category: 'Wholesale',
        date: formatD(d1),
        time: '11:20',
        created_at: new Date(d1.getTime() + 3600000 * 3).toISOString(),
        updated_at: null,
        receipt_url: null,
        created_by: 'admin',
        notes: 'Invoice #1044',
        items: JSON.stringify([
          { name: 'Cardboard Shipping Boxes (Bundle of 100)', category: 'Wholesale', qty: 5, price: 80.00, total: 400.00 },
          { name: 'Heavy Duty Packing Tape Rolls', category: 'Wholesale', qty: 10, price: 12.00, total: 120.00 }
        ]),
        cash_amount: 0,
        card_amount: 520.00,
        other_amount: 0,
        other_payment_name: null,
        payment_method: 'Card'
      }
    ],
    audit_logs: [
      {
        id: 1,
        sale_id: 1,
        action: 'CREATE',
        changed_by: 'admin',
        changed_at: new Date(d0.getTime() - 3600000 * 4).toISOString(),
        details: JSON.stringify({ amount: 245.50, description: 'Morning Retail Electronics & Accessories' })
      }
    ]
  };
}

let memoryStore = null;

function loadStore() {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(jsonStorePath)) {
      const data = fs.readFileSync(jsonStorePath, 'utf8');
      memoryStore = JSON.parse(data);
      return memoryStore;
    }
  } catch (e) {}
  memoryStore = createPureJsStore();
  saveStore();
  return memoryStore;
}

function saveStore() {
  if (!memoryStore) return;
  try {
    fs.writeFileSync(jsonStorePath, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (e) {}
}

// ----------------------------------------------------
// UNIFIED DB INTERFACE
// ----------------------------------------------------
let nativeDb = null;
let usePureJs = !sqlite3;

if (sqlite3) {
  try {
    nativeDb = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.log('SQLite open error, falling back to pure-JS store:', err.message);
        usePureJs = true;
      }
    });
  } catch (e) {
    usePureJs = true;
  }
}

const db = {
  async runAsync(sql, params = []) {
    if (!usePureJs && nativeDb) {
      return new Promise((resolve, reject) => {
        nativeDb.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve(this);
        });
      });
    }

    // Pure JS emulation
    const store = loadStore();
    const cleanSql = sql.trim().toUpperCase();

    if (cleanSql.startsWith('INSERT INTO USERS')) {
      const id = store.users.length ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
      store.users.push({
        id,
        username: params[0],
        password_hash: params[1],
        role: params[2] || 'admin',
        created_at: params[3] || new Date().toISOString()
      });
      saveStore();
      return { lastID: id, changes: 1 };
    }

    if (cleanSql.startsWith('INSERT INTO SALES')) {
      const id = store.sales.length ? Math.max(...store.sales.map(s => s.id)) + 1 : 1;
      store.sales.unshift({
        id,
        amount: Number(params[0]),
        currency: params[1] || '$',
        description: params[2] || '',
        category: params[3] || 'General',
        date: params[4],
        time: params[5],
        created_at: params[6],
        receipt_url: params[7] || null,
        created_by: params[8] || 'admin',
        notes: params[9] || null,
        items: params[10] || null,
        cash_amount: Number(params[11] || 0),
        card_amount: Number(params[12] || 0),
        other_amount: Number(params[13] || 0),
        other_payment_name: params[14] || null,
        payment_method: params[15] || 'Cash',
        updated_at: null
      });
      saveStore();
      return { lastID: id, changes: 1 };
    }

    if (cleanSql.startsWith('UPDATE SALES')) {
      const saleId = Number(params[params.length - 1]);
      const idx = store.sales.findIndex(s => s.id === saleId);
      if (idx !== -1) {
        store.sales[idx] = {
          ...store.sales[idx],
          amount: Number(params[0]),
          currency: params[1],
          description: params[2],
          category: params[3],
          date: params[4],
          time: params[5],
          updated_at: params[6],
          receipt_url: params[7],
          notes: params[8],
          items: params[9],
          cash_amount: Number(params[10] || 0),
          card_amount: Number(params[11] || 0),
          other_amount: Number(params[12] || 0),
          other_payment_name: params[13],
          payment_method: params[14]
        };
        saveStore();
        return { changes: 1 };
      }
      return { changes: 0 };
    }

    if (cleanSql.startsWith('DELETE FROM SALES')) {
      const saleId = Number(params[0]);
      store.sales = store.sales.filter(s => s.id !== saleId);
      saveStore();
      return { changes: 1 };
    }

    if (cleanSql.startsWith('INSERT INTO AUDIT_LOGS')) {
      const id = store.audit_logs.length ? Math.max(...store.audit_logs.map(a => a.id)) + 1 : 1;
      store.audit_logs.unshift({
        id,
        sale_id: Number(params[0]),
        action: params[1],
        changed_by: params[2],
        changed_at: params[3],
        details: params[4]
      });
      saveStore();
      return { lastID: id, changes: 1 };
    }

    if (cleanSql.startsWith('INSERT OR REPLACE INTO SETTINGS') || cleanSql.startsWith('INSERT INTO SETTINGS')) {
      store.settings[params[0]] = params[1];
      saveStore();
      return { changes: 1 };
    }

    if (cleanSql.startsWith('UPDATE USERS')) {
      const userId = Number(params[1]);
      const user = store.users.find(u => u.id === userId);
      if (user) {
        user.password_hash = params[0];
        saveStore();
      }
      return { changes: 1 };
    }

    return { changes: 0 };
  },

  async getAsync(sql, params = []) {
    if (!usePureJs && nativeDb) {
      return new Promise((resolve, reject) => {
        nativeDb.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    }

    const store = loadStore();
    const cleanSql = sql.trim().toUpperCase();

    if (cleanSql.includes('FROM USERS WHERE USERNAME =')) {
      return store.users.find(u => u.username === params[0]) || null;
    }
    if (cleanSql.includes('FROM USERS WHERE ID =')) {
      return store.users.find(u => u.id === Number(params[0])) || null;
    }
    if (cleanSql.includes('FROM SALES WHERE ID =')) {
      return store.sales.find(s => s.id === Number(params[0])) || null;
    }
    if (cleanSql.includes('FROM SETTINGS WHERE KEY =')) {
      const val = store.settings[params[0]];
      return val !== undefined ? { key: params[0], value: val } : null;
    }

    return null;
  },

  async allAsync(sql, params = []) {
    if (!usePureJs && nativeDb) {
      return new Promise((resolve, reject) => {
        nativeDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }

    const store = loadStore();
    const cleanSql = sql.trim().toUpperCase();

    if (cleanSql.includes('FROM AUDIT_LOGS WHERE SALE_ID =')) {
      const saleId = Number(params[0]);
      return store.audit_logs.filter(a => a.sale_id === saleId);
    }

    if (cleanSql.includes('FROM SALES')) {
      let result = [...store.sales];

      // Date filtering
      if (params.length >= 2 && cleanSql.includes('BETWEEN ? AND ?')) {
        const start = params[0];
        const end = params[1];
        result = result.filter(s => s.date >= start && s.date <= end);
      } else if (params.length >= 1 && cleanSql.includes('DATE >=')) {
        result = result.filter(s => s.date >= params[0]);
      }

      // Search filtering
      if (cleanSql.includes('DESCRIPTION LIKE ?')) {
        const searchParam = String(params[params.length - 1] || '').replace(/%/g, '').toLowerCase();
        if (searchParam) {
          result = result.filter(s =>
            (s.description || '').toLowerCase().includes(searchParam) ||
            (s.category || '').toLowerCase().includes(searchParam) ||
            (s.notes || '').toLowerCase().includes(searchParam)
          );
        }
      }

      // Sorting
      if (cleanSql.includes('ORDER BY AMOUNT DESC')) {
        result.sort((a, b) => b.amount - a.amount);
      } else if (cleanSql.includes('ORDER BY AMOUNT ASC')) {
        result.sort((a, b) => a.amount - b.amount);
      } else if (cleanSql.includes('ORDER BY DESCRIPTION ASC')) {
        result.sort((a, b) => (a.description || '').localeCompare(b.description || ''));
      } else {
        // Default: Date DESC
        result.sort((a, b) => {
          if (b.date !== a.date) return b.date.localeCompare(a.date);
          return (b.time || '').localeCompare(a.time || '');
        });
      }

      return result;
    }

    return [];
  }
};

async function initDB() {
  if (!usePureJs && nativeDb) {
    try {
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

      // Seed default admin user
      const existingAdmin = await db.getAsync(`SELECT * FROM users WHERE username = ?`, ['admin']);
      if (!existingAdmin) {
        // Pre-computed hash for 'sales2024'
        const hash = '$2b$10$T7ncXSipLVR9j4HKltZOhu7SqG3.I0l99Frl2iZT18IuJspPTi2x6';
        await db.runAsync(
          `INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)`,
          ['admin', hash, 'admin', new Date().toISOString()]
        );
      } else {
        // Always update hash on seed so the password is current
        const hash = '$2b$10$T7ncXSipLVR9j4HKltZOhu7SqG3.I0l99Frl2iZT18IuJspPTi2x6';
        await db.runAsync(`UPDATE users SET password_hash = ? WHERE username = ?`, [hash, 'admin']);
      }

      // Seed default share token
      const shareToken = await db.getAsync(`SELECT * FROM settings WHERE key = 'share_token'`);
      if (!shareToken) {
        await db.runAsync(`INSERT INTO settings (key, value) VALUES ('share_token', ?)`, ['public-view-34wran9r']);
      }
    } catch (e) {
      console.log('SQLite init failed, activating pure-JS store:', e.message);
      usePureJs = true;
      loadStore();
    }
  } else {
    loadStore();
  }
  console.log('Database initialized successfully (Engine:', usePureJs ? 'Pure-JS' : 'SQLite', ')');
}

module.exports = {
  db,
  initDB
};
