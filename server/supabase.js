if (typeof WebSocket === 'undefined') {
  global.WebSocket = class WebSocket {};
}
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tutqhxcllmucrvsybwhf.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHFoeGNsbG11Y3J2c3lid2hmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDUzMzQ0OSwiZXhwIjoyMTEwMTA5NDQ5fQ.MS7rhUzSQqXlV9Q6oR9mf_4KWA__rWz3zD0vsWeQa9Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

module.exports = { supabase, SUPABASE_URL };
