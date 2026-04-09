/**
 * Run database migration: add role, must_change_password, created_at to users table
 * Usage: node scripts/run-migration.js [admin-email]
 *
 * If admin-email is provided, that user will be promoted to admin.
 * Example: node scripts/run-migration.js alex@chargesmartev.com
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log('Running migration: add admin columns...');

  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`);

  console.log('Migration complete.');

  const adminEmail = process.argv[2];
  if (adminEmail) {
    const result = await pool.query(
      `UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, email`,
      [adminEmail.toLowerCase()]
    );
    if (result.rows.length > 0) {
      console.log(`Promoted ${result.rows[0].email} to admin.`);
    } else {
      console.error(`No user found with email: ${adminEmail}`);
    }
  }

  // Show all users
  const users = await pool.query('SELECT id, email, name, role FROM users ORDER BY created_at');
  console.log('\nCurrent users:');
  users.rows.forEach(u => console.log(`  ${u.email} (${u.role})${u.name ? ' - ' + u.name : ''}`));

  await pool.end();
}

migrate().catch(err => { console.error('Migration failed:', err.message); process.exit(1); });
