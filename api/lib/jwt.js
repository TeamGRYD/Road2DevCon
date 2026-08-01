import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set');
}

/**
 * Create a signed JWT containing quiz session state.
 * @param {object} payload - Session data
 * @param {string} expiresIn - Token expiry (default: 10 minutes)
 * @returns {string} Signed JWT
 */
export function createToken(payload, expiresIn = '10m') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT.
 * @param {string} token - JWT string
 * @returns {object|null} Decoded payload or null if invalid/expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
