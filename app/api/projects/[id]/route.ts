import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// GET /api/projects/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = getPool();
  const result = await pool.query('SELECT * FROM projects WHERE id = $1', [params.id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ data: result.rows[0] });
}

// PUT /api/projects/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const pool = getPool();

  // Build dynamic update
  const sets: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (body.project_data !== undefined) {
    sets.push(`project_data = $${idx++}`);
    values.push(body.project_data);
  }
  if (body.customer_name !== undefined) {
    sets.push(`customer_name = $${idx++}`);
    values.push(body.customer_name);
  }
  if (body.name !== undefined) {
    sets.push(`name = $${idx++}`);
    values.push(body.name);
  }
  if (body.status !== undefined) {
    sets.push(`status = $${idx++}`);
    values.push(body.status);
  }
  if (body.folder_id !== undefined) {
    sets.push(`folder_id = $${idx++}`);
    values.push(body.folder_id);
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
  }

  values.push(params.id);
  await pool.query(`UPDATE projects SET ${sets.join(', ')} WHERE id = $${idx}`, values);

  return NextResponse.json({ ok: true });
}

// DELETE /api/projects/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = getPool();
  await pool.query('DELETE FROM projects WHERE id = $1', [params.id]);

  return NextResponse.json({ ok: true });
}
