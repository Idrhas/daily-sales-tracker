const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Admin password. Set ADMIN_PASSWORD in the environment to override the built-in default.
const DEFAULT_ADMIN_HASH = '$2b$10$T7ncXSipLVR9j4HKltZOhu7SqG3.I0l99Frl2iZT18IuJspPTi2x6'; // 'sales2024'
function getAdminHash() {
  return process.env.ADMIN_PASSWORD ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10) : DEFAULT_ADMIN_HASH;
}

// Only attempt to load sqlite3 when NOT in a serverless environment
let sqlite3 = null;
if (!isServerless) {
  try {
    sqlite3 = require('sqlite3').verbose();
  } catch (e) {
    console.log('Native sqlite3 module not available. Using pure-JS database engine.');
  }
}

const defaultDbPath = path.join(__dirname, 'sales.db');
let dbPath = defaultDbPath;

// ----------------------------------------------------
// PURE-JS DATABASE ENGINE (100% portable for Serverless)
// ----------------------------------------------------
const jsonStorePath = isServerless ? path.join('/tmp', 'sales_store.json') : path.join(__dirname, 'sales_store.json');

function createPureJsStore() {
  const hash = getAdminHash();
  const now = new Date();
  try {
    const seedPath = path.join(__dirname, 'sales_store.json');
    if (fs.existsSync(seedPath)) {
      const parsed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      if (parsed && Array.isArray(parsed.sales)) {
        return parsed;
      }
    }
  } catch (e) {}

  return {
    users: [
      { id: 1, username: 'admin', password_hash: hash, role: 'admin', created_at: now.toISOString() }
    ],
    settings: {
      share_token: 'public-view-34wran9r',
      backup_interval: 'daily'
    },
    sales: [],
    audit_logs: []
  };
}

let memoryStore = null;

function loadStore() {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(jsonStorePath)) {
      const data = fs.readFileSync(jsonStorePath, 'utf8');
      memoryStore = JSON.parse(data);
    } else {
      const repoSeed = path.join(__dirname, 'sales_store.json');
      if (fs.existsSync(repoSeed)) {
        const data = fs.readFileSync(repoSeed, 'utf8');
        memoryStore = JSON.parse(data);
        saveStore();
      }
    }

    if (memoryStore) {
      const admin = memoryStore.users && memoryStore.users.find(u => u.username === 'admin');
      if (admin) {
        admin.password_hash = getAdminHash();
      }
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
let usePureJs = isServerless || !sqlite3;

if (!isServerless && sqlite3) {
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
        proof_url: params[7] || null,
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
          proof_url: params[7],
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
      const user = store.users.find(u => u.username === 'admin' || u.id === Number(params[1]));
      if (user) {
        user.password_hash = params[0];
        saveStore();
        return { changes: 1 };
      }
      return { changes: 0 };
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
      let result = store.sales.map(s => ({
        ...s,
        proof_url: s.receipt_url || s.proof_url || null,
        receipt_url: s.receipt_url || s.proof_url || null
      }));

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
  if (usePureJs || isServerless || !nativeDb) {
    usePureJs = true;
    loadStore();
    console.log('Database initialized successfully (Engine: Pure-JS)');
    return;
  }

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
    const adminHash = getAdminHash();
    if (!existingAdmin) {
      await db.runAsync(
        `INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)`,
        ['admin', adminHash, 'admin', new Date().toISOString()]
      );
    } else {
      await db.runAsync(`UPDATE users SET password_hash = ? WHERE username = ?`, [adminHash, 'admin']);
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
  console.log('Database initialized successfully (Engine:', usePureJs ? 'Pure-JS' : 'SQLite', ')');
}

module.exports = {
  db,
  initDB
};
