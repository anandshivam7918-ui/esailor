import crypto from 'node:crypto';

const SESSION_COOKIE_NAME = 'esailor_admin_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getAdminAuthConfig() {
  return {
    sessionSecret: process.env.SESSION_SECRET || '',
    username: process.env.ADMIN_USER || '',
    password: process.env.ADMIN_PASSWORD || '',
  };
}

export function isAdminAuthConfigured() {
  const config = getAdminAuthConfig();
  return config.sessionSecret.length >= 32 && Boolean(config.username && config.password);
}

function constantTimeEqual(left, right) {
  const leftBytes = Buffer.from(String(left), 'utf8');
  const rightBytes = Buffer.from(String(right), 'utf8');
  return leftBytes.length === rightBytes.length && crypto.timingSafeEqual(leftBytes, rightBytes);
}

export function createAdminSessionToken(username, role = 'admin') {
  const config = getAdminAuthConfig();
  if (!isAdminAuthConfigured()) throw new Error('Admin authentication is not configured.');
  if (role !== 'admin' || !constantTimeEqual(String(username || '').trim(), config.username.trim())) {
    throw new Error('Unable to create an admin session.');
  }

  const now = Date.now();
  const payload = {
    username: config.username,
    role,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(encodedPayload)
    .digest('base64url');
  return encodedPayload + '.' + signature;
}

export function verifyAdminSessionToken(token) {
  if (!isAdminAuthConfigured()) return { valid: false, error: 'Admin authentication is not configured' };
  if (!token || typeof token !== 'string') return { valid: false, error: 'Missing token' };

  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, error: 'Malformed token' };
  }

  const config = getAdminAuthConfig();
  const expectedSignature = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(parts[0])
    .digest('base64url');
  if (!constantTimeEqual(parts[1], expectedSignature)) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (
      !payload ||
      typeof payload !== 'object' ||
      payload.role !== 'admin' ||
      typeof payload.username !== 'string' ||
      !constantTimeEqual(payload.username, config.username) ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= Date.now()
    ) {
      return { valid: false, error: 'Invalid or expired session' };
    }
    return { valid: true, user: payload };
  } catch {
    return { valid: false, error: 'Invalid payload structure' };
  }
}

export function verifyAdminCredentials(username, password) {
  const config = getAdminAuthConfig();
  if (!isAdminAuthConfigured() || typeof username !== 'string' || typeof password !== 'string') return false;
  const usernameMatches = constantTimeEqual(username.trim(), config.username.trim());
  const passwordMatches = constantTimeEqual(password, config.password);
  return usernameMatches && passwordMatches;
}

export function getAdminSessionFromRequest(request) {
  if (!request) return { valid: false, error: 'No request provided' };

  const authHeader = request.headers?.get?.('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return verifyAdminSessionToken(authHeader.slice(7).trim());
  }

  const cookieHeader = request.headers?.get?.('cookie');
  if (cookieHeader) {
    const prefix = SESSION_COOKIE_NAME + '=';
    const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix));
    if (cookie) return verifyAdminSessionToken(cookie.slice(prefix.length));
  }

  return { valid: false, error: 'Unauthenticated: No admin session found' };
}

export function getAdminSession(request) {
  const result = getAdminSessionFromRequest(request);
  return result.valid ? result.user : null;
}

export { SESSION_COOKIE_NAME };
