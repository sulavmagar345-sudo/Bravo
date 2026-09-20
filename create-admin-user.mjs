// create-admin-user.mjs
// Run: node create-admin-user.mjs
// This creates a Supabase auth user + inserts them into admin_users table.

const SUPABASE_URL = 'https://jtmgawwxfbabceksaweg.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key_here';

// Admin credentials to create
const ADMIN_EMAIL = 'admin@bravobarista.com';
const ADMIN_PASSWORD = 'BravoAdmin2024!';

async function createAdminUser() {
  console.log('Creating admin auth user...');
  
  // Step 1: Create user via Admin API
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // Auto-confirm, no email verification needed
    }),
  });

  const createData = await createRes.json();
  
  if (!createRes.ok) {
    // Check if user already exists
    if (createData.message?.includes('already') || createData.msg?.includes('already')) {
      console.log('User already exists, looking up their ID...');
      
      // List users to find existing user
      const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, {
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
        },
      });
      const listData = await listRes.json();
      const existing = (listData.users || []).find(u => u.email === ADMIN_EMAIL);
      
      if (existing) {
        console.log(`Found user: ${existing.id}`);
        await insertAdminUser(existing.id);
      } else {
        console.error('Could not find existing user.');
        console.log('Response:', JSON.stringify(createData, null, 2));
      }
      return;
    }
    
    console.error('Failed to create user:', JSON.stringify(createData, null, 2));
    return;
  }

  const userId = createData.id;
  console.log(`✅ Auth user created: ${userId} (${ADMIN_EMAIL})`);
  
  await insertAdminUser(userId);
}

async function insertAdminUser(userId) {
  console.log(`Inserting into admin_users table for user: ${userId}`);
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/admin_users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      user_id: userId,
      email: ADMIN_EMAIL,
      role: 'admin',
    }),
  });

  if (res.ok || res.status === 201 || res.status === 200) {
    console.log('\n✅ SUCCESS! Admin user fully set up.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Go to: http://localhost:5173/#/admin/007');
  } else {
    const data = await res.json().catch(() => res.text());
    console.error('Failed to insert into admin_users:', JSON.stringify(data, null, 2));
  }
}

createAdminUser().catch(console.error);
