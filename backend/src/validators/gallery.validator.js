const Joi = require('joi');

const galleryItemSchema = Joi.object({
  slug: Joi.string()
    .trim()
    .lowercase()
    .min(3)
    .max(120)
    .pattern(/^[a-z0-9-]+$/)
    .required(),
  type: Joi.string().valid('image', 'video').default('image'),
  title: Joi.string().trim().min(3).max(180).required(),
  category: Joi.string().trim().min(2).max(80).required(),
  categorySlug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .required(),
  thumbnail: Joi.string().trim().min(1).max(500).required(),
  src: Joi.string().trim().min(1).max(500).required(),
  videoUrl: Joi.string().trim().max(500).optional().allow(''),
  reelFrames: Joi.array().items(Joi.string().trim().max(500)).max(20).optional(),
  duration: Joi.string().trim().max(20).optional().allow(''),
  description: Joi.string().trim().min(10).max(2000).required(),
  aspectRatio: Joi.string().valid('portrait', 'landscape', 'wide', 'square').default('landscape'),
  location: Joi.string().trim().min(2).max(120).required(),
  year: Joi.string().trim().max(10).optional(),
  coupleOrClient: Joi.string().trim().max(120).optional().allow(''),
  cameraSpec: Joi.string().trim().max(120).optional().allow(''),
  storyHighlights: Joi.array().items(Joi.string().trim().max(300)).max(10).optional(),
  isPublished: Joi.boolean().optional().default(true),
  sortOrder: Joi.number().integer().min(0).max(10000).optional(),
});

module.exports = {
  galleryItemSchema,
};
