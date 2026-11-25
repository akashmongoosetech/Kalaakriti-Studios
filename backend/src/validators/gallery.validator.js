const Joi = require('joi');
const { validateMediaUrl } = require('../utils/mediaUrl');

function validateMediaUrlPair(value, helpers) {
  const mediaType = value.mediaType || value.type || 'image';
  const mediaUrl = value.mediaUrl;
  if (mediaUrl === undefined) {
    return value;
  }

  const result = validateMediaUrl(mediaType, mediaUrl, {
    allowRelativeStudioAsset: false,
  });

  if (!result.valid) {
    return helpers.message(result.error || 'Please provide a valid media URL.');
  }

  return value;
}

const createGalleryItemSchema = Joi.object({
  title: Joi.string().trim().min(2).max(180).required().messages({
    'string.empty': 'Title is required.',
    'string.min': 'Title must be at least 2 characters.',
    'any.required': 'Title is required.',
  }),
  description: Joi.string().trim().max(2000).optional().allow('').default(''),
  mediaType: Joi.string().valid('image', 'video').required().messages({
    'any.only': 'Media type must be either image or video.',
    'any.required': 'Media type is required.',
  }),
  mediaUrl: Joi.string().trim().min(8).max(1000).required().messages({
    'string.empty': 'Media URL is required.',
    'any.required': 'Media URL is required.',
  }),
  category: Joi.string().trim().max(80).optional().allow('').default('General'),
  displayOrder: Joi.number().integer().min(0).max(100000).optional().default(0),
  status: Joi.string().valid('active', 'inactive').optional().default('active'),

  // Optional editorial fields
  aspectRatio: Joi.string()
    .valid('portrait', 'landscape', 'wide', 'square')
    .optional()
    .default('landscape'),
  location: Joi.string().trim().max(120).optional().allow('').default(''),
  coupleOrClient: Joi.string().trim().max(120).optional().allow('').default(''),
  duration: Joi.string().trim().max(20).optional().allow('').default(''),
  year: Joi.string().trim().max(10).optional().allow(''),
  cameraSpec: Joi.string().trim().max(120).optional().allow('').default(''),
  thumbnail: Joi.string().trim().max(1000).optional().allow(''),
})
  .custom(validateMediaUrlPair, 'media URL validation');

const updateGalleryItemSchema = Joi.object({
  title: Joi.string().trim().min(2).max(180).required().messages({
    'string.empty': 'Title is required.',
    'string.min': 'Title must be at least 2 characters.',
    'any.required': 'Title is required.',
  }),
  description: Joi.string().trim().max(2000).optional().allow('').default(''),
  mediaType: Joi.string().valid('image', 'video').required(),
  mediaUrl: Joi.string().trim().min(1).max(1000).required(),
  category: Joi.string().trim().max(80).optional().allow('').default('General'),
  displayOrder: Joi.number().integer().min(0).max(100000).optional().default(0),
  status: Joi.string().valid('active', 'inactive').optional().default('active'),

  // Optional editorial fields
  aspectRatio: Joi.string().valid('portrait', 'landscape', 'wide', 'square').optional(),
  location: Joi.string().trim().max(120).optional().allow(''),
  coupleOrClient: Joi.string().trim().max(120).optional().allow(''),
  duration: Joi.string().trim().max(20).optional().allow(''),
  year: Joi.string().trim().max(10).optional().allow(''),
  cameraSpec: Joi.string().trim().max(120).optional().allow(''),
  thumbnail: Joi.string().trim().max(1000).optional().allow(''),
}).custom((value, helpers) => {
  // Allow existing seeded studio assets to be edited (e.g. title/category/order) without breaking their stored path
  const isSeededAsset = /^\/src\/assets\/images\/[a-zA-Z0-9._/-]+$/.test(
    String(value.mediaUrl || '').trim()
  );
  if (isSeededAsset) {
    return value;
  }
  return validateMediaUrlPair(value, helpers);
}, 'media URL validation');

const updateGalleryStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required().messages({
    'any.only': 'Status must be either active or inactive.',
    'any.required': 'Status is required.',
  }),
});

module.exports = {
  createGalleryItemSchema,
  updateGalleryItemSchema,
  updateGalleryStatusSchema,
};
