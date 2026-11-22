class ApiError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function sendSuccess(res, { statusCode = 200, message = 'Success', data = null, pagination = undefined } = {}) {
  const payload = {
    success: true,
    message,
    data,
  };
  if (pagination !== undefined) {
    payload.pagination = pagination;
  }
  return res.status(statusCode).json(payload);
}

function sendError(res, { statusCode = 500, message = 'Internal server error', errors = undefined } = {}) {
  const payload = {
    success: false,
    message,
  };
  if (errors !== undefined) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
}

function asyncHandler(fn) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  ApiError,
  sendSuccess,
  sendError,
  asyncHandler,
};
