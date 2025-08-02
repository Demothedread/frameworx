/**
 * Authentication middleware utilities.
 * Provides JWT validation and admin-only checks.
 */
const jwt = require('jsonwebtoken');

/**
 * Validate a JWT from the Authorization header.
 * Attaches the decoded user to req.user.
 */
function requireJWT(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr || !hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(hdr.slice(7), process.env.JWT_SECRET || 'devsecret');
    next();
  } catch {
    return res.status(401).json({ error: 'JWT error' });
  }
}

/**
 * Require an admin-level JWT.
 * Returns 403 if the decoded token does not have isAdmin flag.
 */
function requireAdminJWT(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr || !hdr.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(hdr.slice(7), process.env.JWT_SECRET || 'devsecret');
    if (!decoded.isAdmin) return res.status(403).json({ error: 'Admin only' });
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'JWT error' });
  }
}

module.exports = {
  requireJWT,
  requireAdminJWT
};
