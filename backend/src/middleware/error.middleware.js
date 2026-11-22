const multer = require('multer');
const env = require('../config/env');
const { ApiError, sendError } = require('../utils/apiResponse');

function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, _req, res, _next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const mb = Math.round(env.maxUploadSizeBytes / (1024 * 1024));
      return sendError(res, {
        statusCode: 400,
        message: `Uploaded image is too large. Maximum allowed size is ${mb} MB.`,
      });
    }
    return sendError(res, {
      statusCode: 400,
      message: err.message || 'File upload failed.',
    });
  }

  if (err instanceof ApiError) {
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  // Mongoose invalid ObjectId
  if (err && err.name === 'CastError') {
    return sendError(res, {
      statusCode: 400,
      message: 'Invalid identifier provided.',
    });
  }

  // Mongoose duplicate key error
  if (err && err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    const fieldName = fields[0] || 'record';
    return sendError(res, {
      statusCode: 409,
      message: `An entry with this ${fieldName} already exists.`,
      errors: { [fieldName]: `This ${fieldName} is already in use.` },
    });
  }

  // Mongoose schema validation error
  if (err && err.name === 'ValidationError') {
    const errors = {};
    for (const [field, detail] of Object.entries(err.errors || {})) {
      errors[field] = detail.message;
    }
    return sendError(res, {
      statusCode: 400,
      message: 'Validation error. Please verify your submitted details.',
      errors,
    });
  }

  // Malformed JSON syntax error
  if (err && err.type === 'entity.parse.failed') {
    return sendError(res, {
      statusCode: 400,
      message: 'Invalid JSON payload.',
    });
  }

  if (!env.isProduction) {
    console.error('[error]', err);
  } else {
    console.error('[error]', err && err.message ? err.message : 'Unexpected server error');
  }

  return sendError(res, {
    statusCode: 500,
    message: 'An unexpected server error occurred. Please try again later.',
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
