/**
 * Migration script: Supabase → Railway PostgreSQL
 *
 * Connects directly to both Postgres databases (no Supabase Auth needed).
 * Fetches projects and folders one-by-one to handle large JSONB blobs.
 *
 * Usage:
 *   1. Get your Supabase direct connection string from:
 *      Dashboard → Project Settings → Database → Connection string (URI)
 *   2. Run: node scripts/migrate-from-supabase.js "postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
 *
 * The Railway DATABASE_URL is read from .env.local
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const RAILWAY_URL = process.env.DATABASE_URL;
const SUPABASE_URL = process.argv[2] || process.env.SUPABASE_DB_URL || '';

// Railway user ID to assign migrated data to
const RAILWAY_USER_ID = 'd9c552c0-08bd-402e-a3c3-435c3a0b3e77'; // alex@chargesmartev.com

async function migrate() {
  if (!SUPABASE_URL) {
    console.error('Usage: node scripts/migrate-from-supabase.js <supabase-direct-connection-string>');
    console.error('');
    console.error('Find it in: Supabase Dashboard → Project Settings → Database → Connection string (URI)');
    console.error('It looks like: postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres');
    process.exit(1);
  }

  if (!RAILWAY_URL) {
    console.error('Missing DATABASE_URL in .env.local');
    process.exit(1);
  }

  // Connect to both databases
  console.log('Connecting to Supabase Postgres...');
  const supaPool = new Pool({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  console.log('Connecting to Railway Postgres...');
  const railPool = new Pool({ connectionString: RAILWAY_URL });

  // Test connections
  try {
    await supaPool.query('SELECT 1');
    console.log('  ✓ Supabase connected');
  } catch (err) {
    console.error('Failed to connect to Supabase:', err.message);
    process.exit(1);
  }

  try {
    await railPool.query('SELECT 1');
    console.log('  ✓ Railway connected');
  } catch (err) {
    console.error('Failed to connect to Railway:', err.message);
    process.exit(1);
  }

  // Check for existing data in Railway to avoid duplicates
  const existingProjects = await railPool.query('SELECT COUNT(*) FROM projects');
  const existingCount = parseInt(existingProjects.rows[0].count);
  if (existingCount > 0) {
    console.log(`\n⚠ Railway already has ${existingCount} projects.`);
    console.log('  To avoid duplicates, clear them first or skip this migration.');
    console.log('  To clear: run "DELETE FROM projects;" and "DELETE FROM folders;" on Railway.');
    process.exit(1);
  }

  // --- Migrate folders ---
  console.log('\nFetching folders from Supabase...');
  let folders = [];
  try {
    const fResult = await supaPool.query('SELECT * FROM folders ORDER BY created_at');
    folders = fResult.rows;
    console.log(`  Found ${folders.length} folders.`);
  } catch (err) {
    console.log('  No folders table or error:', err.message);
  }

  const folderIdMap = {};

  if (folders.length > 0) {
    console.log('Migrating folders...');
    for (const folder of folders) {
      const result = await railPool.query(
        'INSERT INTO folders (user_id, name, parent_id, created_at) VALUES ($1, $2, $3, $4) RETURNING id',
        [RAILWAY_USER_ID, folder.name, null, folder.created_at]
      );
      folderIdMap[folder.id] = result.rows[0].id;
      console.log(`  ✓ Folder: ${folder.name}`);
    }

    // Fix parent_id references
    for (const folder of folders) {
      if (folder.parent_id && folderIdMap[folder.parent_id]) {
        await railPool.query('UPDATE folders SET parent_id = $1 WHERE id = $2', [
          folderIdMap[folder.parent_id],
          folderIdMap[folder.id],
        ]);
      }
    }
    console.log('  Folder hierarchy restored.');
  }

  // --- Migrate projects one at a time ---
  console.log('\nCounting projects in Supabase...');
  const countResult = await supaPool.query('SELECT COUNT(*) FROM projects');
  const totalProjects = parseInt(countResult.rows[0].count);
  console.log(`  Found ${totalProjects} projects.`);

  console.log('Migrating projects (one at a time to handle large data)...');
  let migrated = 0;
  let failed = 0;
  const BATCH_SIZE = 10;
  let offset = 0;

  while (offset < totalProjects) {
    // Fetch a small batch of project IDs
    const idBatch = await supaPool.query(
      'SELECT id FROM projects ORDER BY created_at LIMIT $1 OFFSET $2',
      [BATCH_SIZE, offset]
    );

    for (const row of idBatch.rows) {
      try {
        // Fetch full project data one at a time
        const projectResult = await supaPool.query('SELECT * FROM projects WHERE id = $1', [row.id]);
        const project = projectResult.rows[0];

        const newFolderId = project.folder_id ? (folderIdMap[project.folder_id] || null) : null;

        await railPool.query(
          `INSERT INTO projects (user_id, name, customer_name, project_data, status, folder_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            RAILWAY_USER_ID,
            project.name,
            project.customer_name || '',
            JSON.stringify(project.project_data),
            project.status || 'draft',
            newFolderId,
            project.created_at,
            project.updated_at,
          ]
        );

        migrated++;
        const pct = Math.round((migrated / totalProjects) * 100);
        console.log(`  [${pct}%] ${migrated}/${totalProjects} — ${project.name || project.customer_name || project.id}`);
      } catch (err) {
        failed++;
        console.error(`  ✗ Failed project ${row.id}: ${err.message}`);
      }
    }

    offset += BATCH_SIZE;
  }

  console.log('\n=== Migration complete ===');
  console.log(`  Folders: ${folders.length}`);
  console.log(`  Projects migrated: ${migrated}`);
  if (failed > 0) console.log(`  Projects failed: ${failed}`);

  await supaPool.end();
  await railPool.end();
}

migrate().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
