/**
 * Create a user in Railway PostgreSQL
 *
 * Usage: node scripts/create-user.js <email> <password> [name]
 *
 * Examples:
 *   node scripts/create-user.js alex@chargesmartev.com MyPassword123 "Alex Smith"
 *   node scripts/create-user.js john@chargesmartev.com TempPass456 "John Doe"
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL;

async function createUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || null;

  if (!email || !password) {
    console.error('Usage: node scripts/create-user.js <email> <password> [name]');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/create-user.js alex@chargesmartev.com MyPass123 "Alex Smith"');
    console.error('  node scripts/create-user.js john@chargesmartev.com TempPass456 "John Doe"');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: DATABASE_URL });

  // Check if user already exists
  const existing = await pool.query('SELECT id, email FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    console.error(`User ${email} already exists (ID: ${existing.rows[0].id})`);
    await pool.end();
    process.exit(1);
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email',
    [email.toLowerCase(), passwordHash, name]
  );

  const user = result.rows[0];
  console.log(`✓ User created successfully`);
  console.log(`  ID:    ${user.id}`);
  console.log(`  Email: ${user.email}`);
  if (name) console.log(`  Name:  ${name}`);

  await pool.end();
}

createUser().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
