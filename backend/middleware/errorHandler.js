/**
 * Centralized error handling middleware.
 * Logs errors and sends a JSON response with the error message.
 */
function errorHandler(err, req, res, next) {
  console.error(err.stack || err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}
module.exports = errorHandler;
