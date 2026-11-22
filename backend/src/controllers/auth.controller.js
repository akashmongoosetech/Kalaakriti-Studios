const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const env = require('../config/env');
const { ApiError, sendSuccess, asyncHandler } = require('../utils/apiResponse');
const {
  normalizeIndianMobile,
  deriveUsername,
  safeDeleteAvatarFile,
} = require('../utils/formatters');

const BCRYPT_SALT_ROUNDS = 12;

function isHttpsRequest(req) {
  if (!req) return env.isProduction;
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '')
    .split(',')[0]
    .trim()
    .toLowerCase();
  return Boolean(env.isProduction || req.secure || forwardedProto === 'https');
}

function signAuthToken(admin, rememberMe = false) {
  const expiresIn = rememberMe ? env.jwtRememberExpiresIn : env.jwtExpiresIn;
  return jwt.sign(
    {
      sub: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      role: admin.role,
      tv: Number(admin.tokenVersion || 0),
    },
    env.jwtSecret,
    { expiresIn }
  );
}

function setAuthCookie(res, token, rememberMe = false, req = null) {
  const maxAgeMs = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000;
  const useSecureCookie = isHttpsRequest(req);

  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: useSecureCookie,
    sameSite: useSecureCookie ? 'none' : 'lax',
    ...(useSecureCookie ? { partitioned: true } : {}),
    maxAge: maxAgeMs,
    path: '/',
  });
}

function clearAuthCookie(res, req = null) {
  const useSecureCookie = isHttpsRequest(req);
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: useSecureCookie,
    sameSite: useSecureCookie ? 'none' : 'lax',
    ...(useSecureCookie ? { partitioned: true } : {}),
    path: '/',
  });
}

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = normalizeIndianMobile(mobile);

  let uploadedAvatarUrl = '';
  if (req.file) {
    uploadedAvatarUrl = `/uploads/avatars/${req.file.filename}`;
  } else if (typeof req.body.profilePicture === 'string' && req.body.profilePicture.startsWith('/uploads/avatars/')) {
    uploadedAvatarUrl = req.body.profilePicture;
  }

  try {
    const existingByEmail = await Admin.findOne({ email: normalizedEmail });
    if (existingByEmail) {
      throw new ApiError(409, 'An administrator account with this email already exists.', {
        email: 'An administrator account with this email already exists.',
      });
    }

    const existingByMobile = await Admin.findOne({ mobile: normalizedMobile });
    if (existingByMobile) {
      throw new ApiError(409, 'This mobile number is already registered to an admin account.', {
        mobile: 'This mobile number is already registered to an admin account.',
      });
    }

    let username =
      req.body.username && req.body.username.trim()
        ? req.body.username.trim().toLowerCase()
        : deriveUsername(firstName, lastName, normalizedEmail);

    const existingUsername = await Admin.findOne({ username });
    if (existingUsername) {
      if (req.body.username && req.body.username.trim()) {
        throw new ApiError(409, 'This username is already taken.', {
          username: 'This username is already taken.',
        });
      }
      let suffix = 2;
      while (await Admin.findOne({ username: `${username}${suffix}` })) {
        suffix += 1;
      }
      username = `${username}${suffix}`;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const admin = await Admin.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username,
      email: normalizedEmail,
      mobile: normalizedMobile,
      passwordHash,
      profilePicture: uploadedAvatarUrl,
      role: 'Studio Administrator',
      lastLoginAt: new Date(),
    });

    const token = signAuthToken(admin, true);
    setAuthCookie(res, token, true, req);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Admin account created successfully.',
      data: {
        user: admin.toSafeJSON(),
        token,
      },
    });
  } catch (err) {
    if (uploadedAvatarUrl && req.file) {
      safeDeleteAvatarFile(uploadedAvatarUrl);
    }
    throw err;
  }
});

const login = asyncHandler(async (req, res) => {
  const { identifier, password, rememberMe } = req.body;
  const trimmed = identifier.trim();
  const lowered = trimmed.toLowerCase();
  const normalizedMobile = normalizeIndianMobile(trimmed);

  const queryOr = [{ email: lowered }, { username: lowered }];
  if (/^[6-9]\d{9}$/.test(normalizedMobile)) {
    queryOr.push({ mobile: normalizedMobile });
  }

  const admin = await Admin.findOne({ $or: queryOr }).select('+passwordHash');
  if (!admin) {
    throw new ApiError(401, 'Invalid credentials. Please check your login ID and password.');
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials. Please check your login ID and password.');
  }

  admin.lastLoginAt = new Date();
  await admin.save();

  const token = signAuthToken(admin, Boolean(rememberMe));
  setAuthCookie(res, token, Boolean(rememberMe), req);

  return sendSuccess(res, {
    statusCode: 200,
    message: `Welcome back, ${admin.firstName}.`,
    data: {
      user: admin.toSafeJSON(),
      token,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Authenticated administrator session active.',
    data: {
      user: req.admin.toSafeJSON(),
      token: req.authToken,
    },
  });
});

const refreshSession = asyncHandler(async (req, res) => {
  const token = signAuthToken(req.admin, true);
  setAuthCookie(res, token, true, req);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Administrator session refreshed.',
    data: {
      user: req.admin.toSafeJSON(),
      token,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res, req);
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Signed out successfully.',
    data: null,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  // Always return a uniform non-enumerating response for security.
  // In production, connect your transactional email / SMS provider here to dispatch a signed reset link.
  const { identifier } = req.body;
  const trimmed = identifier.trim();

  return sendSuccess(res, {
    statusCode: 200,
    message:
      'If an administrator account matches the provided email or mobile number, password recovery instructions have been queued.',
    data: {
      identifier: trimmed,
      deliveryConfigured: Boolean(process.env.SMTP_HOST),
    },
  });
});

module.exports = {
  signup,
  login,
  me,
  refreshSession,
  logout,
  forgotPassword,
  signAuthToken,
  setAuthCookie,
  clearAuthCookie,
};
