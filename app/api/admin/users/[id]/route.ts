import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

function getAdmin(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

// PATCH /api/admin/users/[id] — update role or reset password
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = params;

  try {
    const { role, name, resetPassword } = await request.json();
    const pool = getPool();

    // Prevent admin from demoting themselves
    if (role && role !== 'admin' && admin.userId === id) {
      return NextResponse.json({ error: 'Cannot remove your own admin role' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: (string | boolean)[] = [];
    let paramIndex = 1;

    if (role) {
      updates.push(`role = $${paramIndex++}`);
      values.push(role);
    }
    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (resetPassword) {
      const hash = await bcrypt.hash(resetPassword, 12);
      updates.push(`password_hash = $${paramIndex++}`);
      values.push(hash);
      updates.push(`must_change_password = $${paramIndex++}`);
      values.push(true);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, email, name, role`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] — remove a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = params;

  // Prevent self-deletion
  if (admin.userId === id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const pool = getPool();
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
