const rateLimit = require('express-rate-limit');

function createLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });
}

const authRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many authentication attempts. Please wait a few minutes and try again.',
});

const publicFormRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: 'Too many submissions from this connection. Please wait a few minutes.',
});

const newsletterRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Too many subscription attempts. Please try again shortly.',
});

const apiGeneralRateLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 600,
  message: 'Rate limit exceeded. Please slow down your requests.',
});

module.exports = {
  authRateLimiter,
  publicFormRateLimiter,
  newsletterRateLimiter,
  apiGeneralRateLimiter,
};
