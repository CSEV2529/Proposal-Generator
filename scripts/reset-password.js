// NOTE: This script requires DATABASE_URL to use the public Railway hostname, not postgres.railway.internal

/**
 * Reset a user's password in Railway PostgreSQL
 *
 * Usage: node scripts/reset-password.js <email> <new-password>
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node scripts/reset-password.js <email> <new-password>');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length === 0) {
    console.error(`No user found with email: ${email}`);
    await pool.end();
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query('UPDATE users SET password_hash = $1, must_change_password = false WHERE email = $2', [passwordHash, email.toLowerCase()]);

  console.log(`✓ Password updated for ${email}`);
  await pool.end();
}

resetPassword().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
