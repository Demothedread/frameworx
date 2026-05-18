/**
 * Middleware to validate request body against a simple schema.
 * Schema: { fieldName: { required?: boolean, maxLen?: number } }
 */

function normalizeValue(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function isMissingRequiredValue(value) {
  return value === undefined || value === null || value === '';
}

function validateField(field, rules = {}, body = {}) {
  const rawValue = body[field];
  const normalizedValue = normalizeValue(rawValue);

  if (rules.required && isMissingRequiredValue(normalizedValue)) {
    return `${field} is required`;
  }

  if (rules.maxLen && typeof rawValue === 'string' && rawValue.length > rules.maxLen) {
    return `${field} exceeds maximum length of ${rules.maxLen}`;
  }

  return null;
}

function validateInput(schema) {
  return (req, res, next) => {
    try {
      const requestBody = req.body || {};
      for (const [field, rules] of Object.entries(schema || {})) {
        const error = validateField(field, rules, requestBody);
        if (error) {
          return res.status(400).json({ error });
        }
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}

module.exports = validateInput;
module.exports._private = {
  isMissingRequiredValue,
  normalizeValue,
  validateField
};
