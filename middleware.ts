import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'auth-token';

// Decode JWT payload without verification (Edge Runtime can't use jsonwebtoken).
// Actual signature verification happens in API routes via lib/auth.ts.
function decodePayload(token: string): { role?: string; mustChangePassword?: boolean } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const path = req.nextUrl.pathname;
  const isLoginPage = path === '/login';
  const isChangePasswordPage = path === '/change-password';
  const isAdminPage = path.startsWith('/admin');

  // Not logged in and not on login page -> redirect to login
  if (!token && !isLoginPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // Logged in and on login page -> redirect to home
  if (token && isLoginPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  if (token) {
    const payload = decodePayload(token);

    // Force password change redirect
    if (payload?.mustChangePassword && !isChangePasswordPage) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/change-password';
      return NextResponse.redirect(redirectUrl);
    }

    // Admin route protection
    if (isAdminPage && payload?.role !== 'admin') {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/projects', '/admin/:path*', '/change-password'],
};
