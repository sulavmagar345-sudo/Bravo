import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQL = fs.readFileSync(path.join(__dirname, 'supabase/migrations/002_storage_setup.sql'), 'utf8');
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'your_access_token_here';
const PROJECT_REF = 'jtmgawwxfbabceksaweg';

async function runMigration() {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: SQL }),
  });
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text.substring(0, 2000));
}

runMigration().catch(console.error);
