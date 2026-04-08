import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

function getUserId(request: NextRequest): string | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// GET /api/projects — list all projects, optional ?search=query
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = getPool();
  const search = request.nextUrl.searchParams.get('search');

  let result;
  if (search) {
    result = await pool.query(
      `SELECT id, name, customer_name, status, created_at, updated_at, project_data, folder_id
       FROM projects WHERE customer_name ILIKE $1 ORDER BY updated_at DESC`,
      [`%${search}%`]
    );
  } else {
    result = await pool.query(
      `SELECT id, name, customer_name, status, created_at, updated_at, project_data, folder_id
       FROM projects ORDER BY updated_at DESC`
    );
  }

  return NextResponse.json({ data: result.rows });
}

// POST /api/projects — create a new project
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, customer_name, project_data, status, folder_id } = body;

  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO projects (user_id, name, customer_name, project_data, status, folder_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [userId, name, customer_name || '', project_data, status || 'draft', folder_id || null]
  );

  return NextResponse.json({ id: result.rows[0].id });
}
