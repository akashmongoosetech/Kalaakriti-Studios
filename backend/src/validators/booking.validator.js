const Joi = require('joi');
const Booking = require('../models/Booking');

const mobileRule = Joi.string()
  .trim()
  .min(10)
  .max(25)
  .pattern(/^[+\d\s()-]{10,25}$/)
  .required()
  .messages({
    'string.pattern.base': 'Enter a valid 10-digit Indian mobile number.',
    'string.min': 'Enter a valid 10-digit Indian mobile number.',
  });

const createBookingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email().max(120).required(),
  mobile: mobileRule,
  whatsapp: Joi.string().trim().max(25).optional().allow(''),
  eventCategory: Joi.string().trim().min(2).max(80).required(),
  eventName: Joi.string().trim().min(2).max(160).required(),
  eventDate: Joi.string().trim().min(4).max(30).required(),
  eventDuration: Joi.string().trim().min(1).max(80).required(),
  eventLocation: Joi.string().trim().min(2).max(200).required(),
  city: Joi.string().trim().min(2).max(80).required(),
  guestCount: Joi.string().trim().min(1).max(60).required(),
  coverageMode: Joi.string()
    .valid(...Booking.COVERAGE_MODES)
    .default('both'),
  addOns: Joi.array().items(Joi.string().trim().max(120)).max(25).default([]),
  budgetRange: Joi.string().trim().min(2).max(80).required(),
  additionalRequirements: Joi.string().trim().max(2000).optional().allow(''),
  message: Joi.string().trim().min(10).max(3000).required(),
  source: Joi.string().valid('public_form', 'admin_demo').optional(),
});

const updateBookingSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().lowercase().email().max(120).required(),
  mobile: mobileRule,
  whatsapp: Joi.string().trim().max(25).optional().allow(''),
  eventCategory: Joi.string().trim().min(2).max(80).required(),
  eventName: Joi.string().trim().min(2).max(160).required(),
  eventDate: Joi.string().trim().min(4).max(30).required(),
  eventDuration: Joi.string().trim().min(1).max(80).required(),
  eventLocation: Joi.string().trim().min(2).max(200).required(),
  city: Joi.string().trim().min(2).max(80).required(),
  guestCount: Joi.string().trim().min(1).max(60).required(),
  coverageMode: Joi.string()
    .valid(...Booking.COVERAGE_MODES)
    .required(),
  addOns: Joi.array().items(Joi.string().trim().max(120)).max(25).default([]),
  budgetRange: Joi.string().trim().min(2).max(80).required(),
  additionalRequirements: Joi.string().trim().max(2000).optional().allow(''),
  message: Joi.string().trim().min(5).max(3000).required(),
  status: Joi.string()
    .valid(...Booking.BOOKING_STATUSES)
    .required(),
});

const objectIdRule = Joi.string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'Each ID must be a valid 24-character record identifier.',
  });

const updateBookingStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Booking.BOOKING_STATUSES)
    .required(),
});

const bulkUpdateBookingStatusSchema = Joi.object({
  ids: Joi.array().items(objectIdRule).min(1).max(50).unique().required(),
  status: Joi.string()
    .valid(...Booking.BOOKING_STATUSES)
    .required(),
});

const bulkDeleteBookingsSchema = Joi.object({
  ids: Joi.array().items(objectIdRule).min(1).max(50).unique().required(),
  permanent: Joi.boolean().default(false),
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
  bulkUpdateBookingStatusSchema,
  bulkDeleteBookingsSchema,
};
