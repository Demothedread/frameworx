/**
 * Simple in-memory rate limiter middleware.
 * Limits each IP to a number of requests per time window.
 */
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // per WINDOW_MS
const ipRequestLog = new Map();

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const timestamps = ipRequestLog.get(ip) || [];
  // Retain only timestamps within the window
  const recent = timestamps.filter(ts => now - ts < WINDOW_MS);
  recent.push(now);
  ipRequestLog.set(ip, recent);
  if (recent.length > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }
  next();
}
module.exports = rateLimiter;
