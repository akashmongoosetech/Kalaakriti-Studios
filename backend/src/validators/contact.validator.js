const Joi = require('joi');
const Contact = require('../models/Contact');

const mobileLooseRule = Joi.string()
  .trim()
  .min(10)
  .max(25)
  .pattern(/^[+\d\s()-]{10,25}$/)
  .required()
  .messages({
    'string.pattern.base': 'Please enter a valid 10-digit Indian phone number.',
    'string.min': 'Please enter a valid 10-digit Indian phone number.',
    'string.empty': 'Phone number is required.',
  });

const createContactSchema = Joi.object({
  firstName: Joi.string().trim().max(80).optional().allow(''),
  lastName: Joi.string().trim().max(80).optional().allow(''),
  fullName: Joi.string().trim().min(2).max(160).required().messages({
    'string.min': 'Please enter your full name (at least 2 characters).',
    'string.empty': 'Full name is required.',
  }),
  email: Joi.string().trim().lowercase().email().max(120).required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email address is required.',
  }),
  mobile: mobileLooseRule,
  phone: Joi.string().trim().max(25).optional().allow(''),
  subject: Joi.string().trim().max(180).optional().allow(''),
  eventType: Joi.string().trim().min(2).max(80).required().messages({
    'string.empty': 'Please select an event or photography type.',
  }),
  city: Joi.string().trim().min(2).max(80).required().messages({
    'string.empty': 'Please select or enter your city.',
  }),
  eventDate: Joi.string().trim().max(30).optional().allow(''),
  message: Joi.string().trim().min(10).max(3000).required().messages({
    'string.min': 'Please share a few details about your event (at least 10 characters).',
    'string.empty': 'Message is required.',
  }),
  source: Joi.string().valid('public_form', 'admin_demo').optional(),
});

const updateContactSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(80).required(),
  lastName: Joi.string().trim().max(80).optional().allow(''),
  email: Joi.string().trim().lowercase().email().max(120).required(),
  mobile: mobileLooseRule,
  subject: Joi.string().trim().min(2).max(180).required(),
  eventType: Joi.string().trim().min(2).max(80).required(),
  city: Joi.string().trim().min(2).max(80).required(),
  eventDate: Joi.string().trim().max(30).optional().allow(''),
  message: Joi.string().trim().min(5).max(3000).required(),
  status: Joi.string()
    .valid(...Contact.CONTACT_STATUSES)
    .required(),
});

const updateContactStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Contact.CONTACT_STATUSES)
    .required(),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
};
