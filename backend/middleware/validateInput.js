/**
 * Middleware to validate request body against a simple schema.
 * Schema: { fieldName: { required?: boolean, maxLen?: number } }
 */
function validateInput(schema) {
  return (req, res, next) => {
    try {
      for (const [field, rules] of Object.entries(schema || {})) {
        const value = req.body[field];
        if (rules.required && (value === undefined || value === null || value === '')) {
          return res.status(400).json({ error: `${field} is required` });
        }
        if (rules.maxLen && typeof value === 'string' && value.length > rules.maxLen) {
          return res.status(400).json({ error: `${field} exceeds maximum length of ${rules.maxLen}` });
        }
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
module.exports = validateInput;
