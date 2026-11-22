const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const env = require('../config/env');
const { ApiError } = require('../utils/apiResponse');

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      return { token, source: 'header' };
    }
  }

  if (req.cookies && typeof req.cookies[env.cookieName] === 'string' && req.cookies[env.cookieName]) {
    return { token: req.cookies[env.cookieName], source: 'cookie' };
  }

  return { token: null, source: null };
}

async function authenticateAdmin(req, _res, next) {
  try {
    const { token, source } = extractToken(req);
    if (!token) {
      return next(new ApiError(401, 'Authentication required. Please sign in to continue.'));
    }

    // CSRF protection for cookie-authenticated state-changing requests
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());
    if (source === 'cookie' && isMutating) {
      const origin = req.headers.origin;
      if (origin && !env.allowedOrigins.includes(origin)) {
        return next(new ApiError(403, 'Cross-origin request denied.'));
      }
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (_err) {
      return next(new ApiError(401, 'Session expired or invalid token. Please sign in again.'));
    }

    const admin = await Admin.findById(decoded.sub);
    if (!admin) {
      return next(new ApiError(401, 'Administrator account no longer exists.'));
    }

    req.admin = admin;
    req.authToken = token;
    return next();
  } catch (err) {
    return next(err);
  }
}

function authorizeRoles(...allowedRoles) {
  return function roleGuard(req, _res, next) {
    if (!req.admin) {
      return next(new ApiError(401, 'Authentication required.'));
    }
    if (!allowedRoles.includes(req.admin.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action.'));
    }
    return next();
  };
}

module.exports = {
  authenticateAdmin,
  authorizeRoles,
};
