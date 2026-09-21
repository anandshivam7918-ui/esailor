import { NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  getAdminSessionFromRequest,
  SESSION_COOKIE_NAME,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = getAdminSessionFromRequest(request);
  if (!session.valid) {
    return NextResponse.json({ authenticated: false, error: session.error }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session.user });
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
