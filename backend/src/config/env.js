const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// Never hardcode a predictable secret. Read JWT_SECRET from the environment,
// and fall back to an ephemeral cryptographically strong in-memory secret if unset
// so zero-config deployments (such as Cloud Run) boot cleanly without crashing.
let jwtSecret = process.env.JWT_SECRET && process.env.JWT_SECRET.trim();
if (!jwtSecret) {
  jwtSecret = crypto.randomBytes(48).toString('hex');
  console.warn(
    `[env] JWT_SECRET is not set (${nodeEnv}) — using an ephemeral in-memory secret. Set JWT_SECRET in your environment to keep admin sessions valid across restarts.`
  );
}

const rawCorsOrigins = [
  process.env.CORS_ORIGIN ||
    'http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173',
  process.env.APP_URL || '',
]
  .filter(Boolean)
  .join(',');

const allowedOrigins = Array.from(
  new Set(
    rawCorsOrigins
      .split(',')
      .map((origin) => origin.trim().replace(/\/+$/, ''))
      .filter((origin) => origin && origin !== '*')
  )
);

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
