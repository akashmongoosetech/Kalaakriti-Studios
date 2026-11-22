const Joi = require('joi');
const { normalizeIndianMobile } = require('../utils/formatters');

const indianMobileRule = Joi.string()
  .trim()
  .required()
  .custom((value, helpers) => {
    const normalized = normalizeIndianMobile(value);
    if (!/^[6-9]\d{9}$/.test(normalized)) {
      return helpers.error('any.invalid');
    }
    return normalized;
  }, 'Indian 10-digit mobile validation')
  .messages({
    'any.invalid': 'Enter a valid 10-digit Indian mobile number (starting with 6–9).',
    'string.empty': 'Mobile number is required.',
  });

const strongPasswordRule = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[A-Z]/, 'uppercase letter')
  .pattern(/[a-z]/, 'lowercase letter')
  .pattern(/[0-9]/, 'number')
  .pattern(/[^A-Za-z0-9]/, 'special character')
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters.',
    'string.pattern.name': 'Password must include at least one {#name}.',
    'string.empty': 'Password is required.',
  });

const signupSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(60).required().messages({
    'string.min': 'First name must be at least 2 characters.',
    'string.empty': 'First name is required.',
  }),
  lastName: Joi.string().trim().min(1).max(60).required().messages({
    'string.empty': 'Last name is required.',
  }),
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(40)
    .pattern(/^[a-z0-9._-]+$/)
    .optional()
    .allow(''),
  email: Joi.string().trim().lowercase().email().max(120).required().messages({
    'string.email': 'Enter a valid email address.',
    'string.empty': 'Email address is required.',
  }),
  mobile: indianMobileRule,
  password: strongPasswordRule,
  confirmPassword: Joi.string().valid(Joi.ref('password')).optional().messages({
    'any.only': 'Passwords do not match.',
  }),
  profilePicture: Joi.string().trim().max(500).optional().allow(''),
});

const loginSchema = Joi.object({
  identifier: Joi.string().trim().min(3).max(120).required().messages({
    'string.min': 'Enter your username, email address, or mobile number.',
    'string.empty': 'Enter your username, email address, or mobile number.',
  }),
  password: Joi.string().min(1).max(128).required().messages({
    'string.empty': 'Please enter your password.',
  }),
  rememberMe: Joi.boolean().default(false),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(60).required(),
  lastName: Joi.string().trim().min(1).max(60).required(),
  username: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(40)
    .pattern(/^[a-z0-9._-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Use lowercase letters, numbers, dots, underscores, or hyphens.',
    }),
  email: Joi.string().trim().lowercase().email().max(120).required(),
  mobile: indianMobileRule,
  removeAvatar: Joi.boolean().optional(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).max(128).required().messages({
    'string.empty': 'Enter your current password.',
  }),
  newPassword: strongPasswordRule,
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).optional().messages({
    'any.only': 'New passwords do not match.',
  }),
});

const forgotPasswordSchema = Joi.object({
  identifier: Joi.string().trim().min(3).max(120).required().messages({
    'string.min': 'Enter your registered email address or mobile number.',
    'string.empty': 'Enter your registered email address or mobile number.',
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
};
