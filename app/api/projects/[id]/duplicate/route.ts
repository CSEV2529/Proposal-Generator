import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const pool = getPool();

  // Get original project
  const original = await pool.query('SELECT * FROM projects WHERE id = $1', [params.id]);
  if (original.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const orig = original.rows[0];
  const result = await pool.query(
    `INSERT INTO projects (user_id, name, customer_name, project_data, status, folder_id)
     VALUES ($1, $2, $3, $4, 'draft', $5) RETURNING id`,
    [
      payload.userId,
      body.name || `${orig.name} (Copy)`,
      orig.customer_name,
      orig.project_data,
      body.folder_id !== undefined ? body.folder_id : orig.folder_id,
    ]
  );

  return NextResponse.json({ id: result.rows[0].id });
}
