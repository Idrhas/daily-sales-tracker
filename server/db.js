const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { supabase } = require('./supabase');

const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Admin password. Set ADMIN_PASSWORD in the environment to override the built-in default.
const DEFAULT_ADMIN_HASH = '$2b$10$T7ncXSipLVR9j4HKltZOhu7SqG3.I0l99Frl2iZT18IuJspPTi2x6'; // 'sales2024'
function getAdminHash() {
  return process.env.ADMIN_PASSWORD ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10) : DEFAULT_ADMIN_HASH;
}

// Pure-JS in-memory store (used as fallback if Supabase is offline)
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
// UNIFIED DB INTERFACE (Supabase primary + Pure-JS fallback)
// ----------------------------------------------------
const db = {
  async runAsync(sql, params = []) {
    const cleanSql = sql.trim().toUpperCase();

    // 1. SUPABASE (Primary Database)
    if (supabase) {
      try {
        if (cleanSql.startsWith('INSERT INTO USERS')) {
          const { data, error } = await supabase.from('users').insert([{
            username: params[0],
            password_hash: params[1],
            role: params[2] || 'admin',
            created_at: params[3] || new Date().toISOString()
          }]).select();
          if (!error && data && data[0]) return { lastID: data[0].id, changes: 1 };
        }

        if (cleanSql.startsWith('INSERT INTO SALES')) {
          const itemsVal = params[10] ? (typeof params[10] === 'string' ? JSON.parse(params[10]) : params[10]) : null;
          const { data, error } = await supabase.from('sales').insert([{
            amount: Number(params[0]),
            currency: params[1] || '$',
            description: params[2] || '',
            category: params[3] || 'General',
            date: params[4],
            time: params[5],
            created_at: params[6] || new Date().toISOString(),
            receipt_url: params[7] || null,
            proof_url: params[7] || null,
            created_by: params[8] || 'admin',
            notes: params[9] || null,
            items: itemsVal,
            cash_amount: Number(params[11] || 0),
            card_amount: Number(params[12] || 0),
            other_amount: Number(params[13] || 0),
            other_payment_name: params[14] || null,
            payment_method: params[15] || 'Cash'
          }]).select();

          if (!error && data && data[0]) {
            return { lastID: data[0].id, changes: 1 };
          }
          if (error) console.error('Supabase INSERT SALES error:', error);
        }

        if (cleanSql.startsWith('UPDATE SALES')) {
          const saleId = Number(params[params.length - 1]);
          const itemsVal = params[9] !== undefined ? (typeof params[9] === 'string' ? JSON.parse(params[9]) : params[9]) : null;
          const { error } = await supabase.from('sales').update({
            amount: Number(params[0]),
            currency: params[1],
            description: params[2],
            category: params[3],
            date: params[4],
            time: params[5],
            updated_at: params[6] || new Date().toISOString(),
            receipt_url: params[7],
            proof_url: params[7],
            notes: params[8],
            items: itemsVal,
            cash_amount: Number(params[10] || 0),
            card_amount: Number(params[11] || 0),
            other_amount: Number(params[12] || 0),
            other_payment_name: params[13],
            payment_method: params[14]
          }).eq('id', saleId);

          if (!error) return { changes: 1 };
          if (error) console.error('Supabase UPDATE SALES error:', error);
        }

        if (cleanSql.startsWith('DELETE FROM SALES')) {
          const saleId = Number(params[0]);
          const { error } = await supabase.from('sales').delete().eq('id', saleId);
          if (!error) return { changes: 1 };
        }

        if (cleanSql.startsWith('INSERT INTO AUDIT_LOGS')) {
          const detailsVal = params[4] ? (typeof params[4] === 'string' ? JSON.parse(params[4]) : params[4]) : null;
          const { data, error } = await supabase.from('audit_logs').insert([{
            sale_id: Number(params[0]),
            action: params[1],
            changed_by: params[2],
            changed_at: params[3] || new Date().toISOString(),
            details: detailsVal
          }]).select();

          if (!error && data && data[0]) return { lastID: data[0].id, changes: 1 };
        }

        if (cleanSql.startsWith('INSERT OR REPLACE INTO SETTINGS') || cleanSql.startsWith('INSERT INTO SETTINGS')) {
          const { error } = await supabase.from('settings').upsert({ key: params[0], value: String(params[1]) });
          if (!error) return { changes: 1 };
        }

        if (cleanSql.startsWith('UPDATE USERS')) {
          const { error } = await supabase.from('users').update({ password_hash: params[0] }).eq('username', 'admin');
          if (!error) return { changes: 1 };
        }
      } catch (err) {
        console.error('Supabase runAsync exception, using fallback:', err);
      }
    }

    // 2. FALLBACK IN-MEMORY STORE
    const store = loadStore();
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
    return { changes: 1 };
  },

  async getAsync(sql, params = []) {
    const cleanSql = sql.trim().toUpperCase();

    // 1. SUPABASE (Primary Database)
    if (supabase) {
      try {
        if (cleanSql.includes('FROM USERS WHERE USERNAME =')) {
          const { data } = await supabase.from('users').select('*').eq('username', params[0]).maybeSingle();
          if (data) return data;
        }

        if (cleanSql.includes('FROM USERS WHERE ID =')) {
          const { data } = await supabase.from('users').select('*').eq('id', Number(params[0])).maybeSingle();
          if (data) return data;
        }

        if (cleanSql.includes('FROM SALES WHERE ID =')) {
          const { data } = await supabase.from('sales').select('*').eq('id', Number(params[0])).maybeSingle();
          if (data) {
            return {
              ...data,
              amount: Number(data.amount) || 0,
              cash_amount: Number(data.cash_amount || 0),
              card_amount: Number(data.card_amount || 0),
              other_amount: Number(data.other_amount || 0),
              receipt_url: data.receipt_url || data.proof_url || null,
              proof_url: data.proof_url || data.receipt_url || null
            };
          }
        }

        if (cleanSql.includes('FROM SETTINGS WHERE KEY =')) {
          const { data } = await supabase.from('settings').select('*').eq('key', params[0]).maybeSingle();
          if (data) return { key: data.key, value: data.value };
        }
      } catch (err) {
        console.error('Supabase getAsync exception, using fallback:', err);
      }
    }

    // 2. FALLBACK IN-MEMORY STORE
    const store = loadStore();
    if (cleanSql.includes('FROM USERS WHERE USERNAME =')) {
      return store.users.find(u => u.username === params[0]) || null;
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
    const cleanSql = sql.trim().toUpperCase();

    // 1. SUPABASE (Primary Database)
    if (supabase) {
      try {
        if (cleanSql.includes('FROM AUDIT_LOGS WHERE SALE_ID =')) {
          const { data } = await supabase.from('audit_logs').select('*').eq('sale_id', Number(params[0])).order('changed_at', { ascending: false });
          if (data) return data;
        }

        if (cleanSql.includes('FROM SALES')) {
          let q = supabase.from('sales').select('*');

          if (params.length >= 2 && cleanSql.includes('BETWEEN ? AND ?')) {
            q = q.gte('date', params[0]).lte('date', params[1]);
          } else if (params.length >= 1 && cleanSql.includes('DATE >=')) {
            q = q.gte('date', params[0]);
          }

          if (cleanSql.includes('DESCRIPTION LIKE ?')) {
            const searchParam = String(params[params.length - 1] || '').replace(/%/g, '').trim();
            if (searchParam) {
              q = q.or(`description.ilike.%${searchParam}%,category.ilike.%${searchParam}%,notes.ilike.%${searchParam}%`);
            }
          }

          if (cleanSql.includes('ORDER BY AMOUNT DESC')) {
            q = q.order('amount', { ascending: false });
          } else if (cleanSql.includes('ORDER BY AMOUNT ASC')) {
            q = q.order('amount', { ascending: true });
          } else if (cleanSql.includes('ORDER BY DESCRIPTION ASC')) {
            q = q.order('description', { ascending: true });
          } else {
            q = q.order('date', { ascending: false }).order('time', { ascending: false }).order('id', { ascending: false });
          }

          const { data, error } = await q;
          if (!error && Array.isArray(data)) {
            return data.map(item => ({
              ...item,
              amount: Number(item.amount) || 0,
              cash_amount: Number(item.cash_amount || 0),
              card_amount: Number(item.card_amount || 0),
              other_amount: Number(item.other_amount || 0),
              proof_url: item.receipt_url || item.proof_url || null,
              receipt_url: item.receipt_url || item.proof_url || null
            }));
          }
          if (error) console.error('Supabase allAsync query error:', error);
        }
      } catch (err) {
        console.error('Supabase allAsync exception, using fallback:', err);
      }
    }

    // 2. FALLBACK IN-MEMORY STORE
    const store = loadStore();
    if (cleanSql.includes('FROM AUDIT_LOGS WHERE SALE_ID =')) {
      return store.audit_logs.filter(a => a.sale_id === Number(params[0]));
    }
    if (cleanSql.includes('FROM SALES')) {
      return store.sales.map(s => ({
        ...s,
        proof_url: s.receipt_url || s.proof_url || null,
        receipt_url: s.receipt_url || s.proof_url || null
      }));
    }
    return [];
  }
};

async function initDB() {
  if (supabase) {
    console.log('Database initialized successfully (Engine: Supabase PostgreSQL)');
    return;
  }
  loadStore();
  console.log('Database initialized (Engine: In-Memory Fallback)');
}

module.exports = { db, initDB };
