const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { uploadAvatar } = require('../middleware/upload.middleware');
const { authRateLimiter } = require('../middleware/rateLimit.middleware');
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
} = require('../validators/auth.validator');

const router = express.Router();

router.post(
  '/signup',
  authRateLimiter,
  uploadAvatar.single('profilePicture'),
  validate(signupSchema),
  authController.signup
);

router.post('/login', authRateLimiter, validate(loginSchema), authController.login);

router.post(
  '/forgot-password',
  authRateLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

router.get(
  '/me',
  authenticateAdmin,
  authorizeRoles('Studio Administrator'),
  authController.me
);

router.post(
  '/refresh',
  authenticateAdmin,
  authorizeRoles('Studio Administrator'),
  authController.refreshSession
);

router.post('/logout', authController.logout);

module.exports = router;
