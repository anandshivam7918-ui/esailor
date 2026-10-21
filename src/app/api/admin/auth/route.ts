import { NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  getAdminSessionFromRequest,
  isAdminAuthConfigured,
  SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: 'Admin authentication is not configured. Set ADMIN_USER, ADMIN_PASSWORD, and a SESSION_SECRET of at least 32 characters.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(username, 'admin');
    const response = NextResponse.json({
      success: true,
      user: { username, role: 'admin' },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to process the login request.' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  const user = 'user' in session ? session.user : null;
  if (!session.valid || !user) {
    return NextResponse.json({ authenticated: false, error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
