import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// GET /api/folders
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = getPool();
  const result = await pool.query('SELECT id, name, parent_id, created_at FROM folders ORDER BY name');

  return NextResponse.json({ data: result.rows });
}

// POST /api/folders
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, parent_id } = await request.json();
  const pool = getPool();
  const result = await pool.query(
    'INSERT INTO folders (user_id, name, parent_id) VALUES ($1, $2, $3) RETURNING id',
    [userId, name, parent_id || null]
  );

  return NextResponse.json({ id: result.rows[0].id });
}
