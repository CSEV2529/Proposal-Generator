import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// PUT /api/folders/[id] — rename
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await request.json();
  const pool = getPool();
  await pool.query('UPDATE folders SET name = $1 WHERE id = $2', [name, params.id]);

  return NextResponse.json({ ok: true });
}

// DELETE /api/folders/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = getPool();

  // Move projects to root
  await pool.query('UPDATE projects SET folder_id = NULL WHERE folder_id = $1', [params.id]);

  // Move subfolders to parent
  const folder = await pool.query('SELECT parent_id FROM folders WHERE id = $1', [params.id]);
  const parentId = folder.rows[0]?.parent_id || null;
  await pool.query('UPDATE folders SET parent_id = $1 WHERE parent_id = $2', [parentId, params.id]);

  // Delete folder
  await pool.query('DELETE FROM folders WHERE id = $1', [params.id]);

  return NextResponse.json({ ok: true });
}
