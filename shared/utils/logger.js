/**
 * Simple logger used across backend and frontend.
 * Detects environment and falls back to console.
 */
function log(level, ...args) {
  if (typeof console !== 'undefined' && console[level]) {
    console[level](...args);
  }
}

const logger = {
  info: (...a) => log('info', ...a),
  warn: (...a) => log('warn', ...a),
  error: (...a) => log('error', ...a)
};

module.exports = logger;
