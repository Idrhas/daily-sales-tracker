if (typeof WebSocket === 'undefined') {
  global.WebSocket = class WebSocket {};
}

let createClient = null;
const possiblePaths = [
  '@supabase/supabase-js',
  require('path').join(__dirname, '..', 'node_modules', '@supabase', 'supabase-js'),
  require('path').join(__dirname, '..', '..', 'node_modules', '@supabase', 'supabase-js'),
  require('path').join(process.cwd(), 'node_modules', '@supabase', 'supabase-js'),
  require('path').join(process.cwd(), 'client', 'node_modules', '@supabase', 'supabase-js')
];

for (const p of possiblePaths) {
  try {
    const mod = require(p);
    if (mod && mod.createClient) {
      createClient = mod.createClient;
      break;
    }
  } catch (e) {}
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tutqhxcllmucrvsybwhf.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHFoeGNsbG11Y3J2c3lid2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDUzMzQ0OSwiZXhwIjoyMTEwMTA5NDQ5fQ.MS7rhUzSQqXlV9Q6oR9mf_4KWA__rWz3zD0vsWeQa9Q';

let supabase = null;
if (createClient) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
} else {
  console.error('Warning: @supabase/supabase-js module could not be found.');
}

module.exports = { supabase, SUPABASE_URL };
