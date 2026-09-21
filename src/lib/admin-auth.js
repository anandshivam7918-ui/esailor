import crypto from 'node:crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'esailor-super-secret-admin-key-2026';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'esailor2026!';
const SESSION_COOKIE_NAME = 'esailor_admin_session';

/**
 * Creates a signed session token for an authenticated admin user.
 * @param {string} username
 * @param {string} role
 * @returns {string} Signed token
 */
export function createAdminSessionToken(username = 'admin', role = 'admin') {
  const payload = {
    username,
    role,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  const json = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(json)
    .digest('base64url');
  return `${json}.${signature}`;
}

/**
 * Validates and decodes a session token.
 * @param {string} token
 * @returns {{ valid: boolean, user?: Object, error?: string }}
 */
export function verifyAdminSessionToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Missing token' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token' };
  }

  const [json, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(json)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const payload = JSON.parse(Buffer.from(json, 'base64url').toString('utf8'));
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Session expired' };
    }
    if (payload.role !== 'admin') {
      return { valid: false, error: 'Insufficient permissions' };
    }
    return { valid: true, user: payload };
  } catch {
    return { valid: false, error: 'Invalid payload structure' };
  }
}

/**
 * Verifies admin credentials.
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
export function verifyAdminCredentials(username, password) {
  if (!username || !password) return false;
  return username.trim() === ADMIN_USER && password.trim() === ADMIN_PASSWORD;
}

/**
 * Extracts and verifies admin session from an incoming Request.
 * @param {Request} request
 * @returns {{ valid: boolean, user?: Object, error?: string }}
 */
export function getAdminSessionFromRequest(request) {
  if (!request) return { valid: false, error: 'No request provided' };
  
  // Check authorization header first
  const authHeader = request.headers?.get?.('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    return verifyAdminSessionToken(token);
  }

  // Check cookie header
  const cookieHeader = request.headers?.get?.('cookie');
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    const sessionCookie = cookies.find(c => c.startsWith(`${SESSION_COOKIE_NAME}=`));
    if (sessionCookie) {
      const token = sessionCookie.split('=')[1];
      return verifyAdminSessionToken(token);
    }
  }

  return { valid: false, error: 'Unauthenticated: No admin session found' };
}

export { SESSION_COOKIE_NAME, ADMIN_USER, ADMIN_PASSWORD };

