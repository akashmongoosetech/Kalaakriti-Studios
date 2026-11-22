const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// Never hardcode a predictable secret. In production require JWT_SECRET;
// in local development generate an ephemeral cryptographically strong secret if unset.
let jwtSecret = process.env.JWT_SECRET && process.env.JWT_SECRET.trim();
if (!jwtSecret) {
  if (isProduction) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable must be set in production.'
    );
  }
  jwtSecret = crypto.randomBytes(48).toString('hex');
  console.warn(
    '[env] JWT_SECRET is not set in .env — using an ephemeral random secret for this development session.'
  );
}

const rawCorsOrigins =
  process.env.CORS_ORIGIN ||
  'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173';

const allowedOrigins = rawCorsOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin && origin !== '*');

const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongodbUri: (process.env.MONGODB_URI || '').trim(),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtRememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN || '30d',
  cookieName: process.env.COOKIE_NAME || 'kalaakriti_admin_token',
  allowedOrigins,
  maxUploadSizeBytes: (Number(process.env.MAX_UPLOAD_SIZE_MB) || 5) * 1024 * 1024,
  serveFrontendDist: process.env.SERVE_FRONTEND_DIST === 'true',
};

module.exports = env;
