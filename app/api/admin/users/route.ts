import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { sendInviteEmail } from '@/lib/email';

function getAdmin(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

// GET /api/admin/users — list all users (admin only)
export async function GET(request: NextRequest) {
  const admin = getAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const pool = getPool();
  const result = await pool.query(
    `SELECT id, email, name, role, must_change_password, created_at
     FROM users ORDER BY created_at DESC`
  );

  return NextResponse.json({ users: result.rows });
}

// POST /api/admin/users — create/invite a user (admin only)
export async function POST(request: NextRequest) {
  const admin = getAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { email, name, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    if (role && !['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Role must be "admin" or "user"' }, { status: 400 });
    }

    const pool = getPool();

    // Check for duplicate email
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, must_change_password)
       VALUES ($1, $2, $3, $4, true) RETURNING id, email, name, role`,
      [email.toLowerCase(), passwordHash, name || null, role || 'user']
    );
    const newUser = result.rows[0];

    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const loginUrl = `${process.env.APP_URL || origin}/login`;
    const emailResult = await sendInviteEmail({
      toEmail: newUser.email,
      name: newUser.name,
      tempPassword: password,
      loginUrl,
    });

    return NextResponse.json(
      { user: newUser, emailSent: emailResult.sent, emailError: emailResult.sent ? null : emailResult.reason },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
