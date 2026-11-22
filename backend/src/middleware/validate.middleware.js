const { ApiError } = require('../utils/apiResponse');

/**
 * Recursively removes MongoDB operator keys ($...) and dotted keys to prevent NoSQL injection.
 */
function sanitizeObject(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }
  if (value && typeof value === 'object') {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      cleaned[key] = sanitizeObject(val);
    }
    return cleaned;
  }
  return value;
}

function sanitizeRequest(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }
  next();
}

function validate(schema, property = 'body') {
  return function validateMiddleware(req, _res, next) {
    const target = req[property] || {};
    const { error, value } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const fieldErrors = {};
      for (const detail of error.details) {
        const key = detail.path.join('.') || 'general';
        if (!fieldErrors[key]) {
          fieldErrors[key] = detail.message.replace(/"/g, '');
        }
      }
      const firstMessage = error.details[0]
        ? error.details[0].message.replace(/"/g, '')
        : 'Validation failed.';
      return next(new ApiError(400, firstMessage, fieldErrors));
    }

    req[property] = value;
    return next();
  };
}

module.exports = {
  sanitizeObject,
  sanitizeRequest,
  validate,
};
