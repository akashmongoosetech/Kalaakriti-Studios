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

function isTrustedCookieMutation(req) {
  if (req.headers['x-requested-with']) {
    return true;
  }

  const origin = req.headers.origin;
  if (!origin) {
    return false;
  }

  if (env.allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const parsedOrigin = new URL(origin);
    const forwardedHost = (req.headers['x-forwarded-host'] || req.headers.host || '')
      .split(',')[0]
      .trim()
      .toLowerCase();
    return Boolean(forwardedHost && parsedOrigin.host.toLowerCase() === forwardedHost);
  } catch {
    return false;
  }
}

async function authenticateAdmin(req, _res, next) {
  try {
    const { token, source } = extractToken(req);
    if (!token) {
      return next(new ApiError(401, 'Authentication required. Please sign in to continue.'));
    }

    // CSRF protection for cookie-authenticated state-changing requests
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());
    if (source === 'cookie' && isMutating && !isTrustedCookieMutation(req)) {
      return next(new ApiError(403, 'Cross-origin request denied.'));
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

    const expectedVersion = Number(admin.tokenVersion || 0);
    const tokenVersion = Number(decoded.tv || 0);
    if (tokenVersion !== expectedVersion) {
      return next(new ApiError(401, 'Session has been revoked after a password update. Please sign in again.'));
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
