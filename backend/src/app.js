const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const apiRoutes = require('./routes');
const { sanitizeRequest } = require('./middleware/validate.middleware');
const { apiGeneralRateLimiter } = require('./middleware/rateLimit.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');
const { UPLOADS_ROOT } = require('./utils/formatters');

const app = express();

// Behind reverse proxies (Vite proxy, Render, Railway, Cloud Run, Nginx)
app.set('trust proxy', 1);

// Security headers (crossOriginResourcePolicy: 'cross-origin' allows serving uploaded avatars cleanly)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
    frameguard: false,
  })
);

// Strict CORS configuration (no wildcard with credentials)
app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin requests, curl/health checks, or explicitly whitelisted origins
      if (!origin || env.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(sanitizeRequest);

// Static serving of uploaded profile pictures with safe headers
app.use(
  '/uploads',
  express.static(UPLOADS_ROOT, {
    dotfiles: 'deny',
    index: false,
    maxAge: '7d',
    setHeaders(res) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);

// Apply general API rate limiter
app.use('/api', apiGeneralRateLimiter);

// Mount REST API routes under /api (and /api/v1 alias)
app.use('/api', apiRoutes);
app.use('/api/v1', apiRoutes);

// Optional single-service production static serving for ../frontend/dist
if (env.serveFrontendDist) {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      return res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
