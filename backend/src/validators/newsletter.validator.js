const Joi = require('joi');

const subscribeNewsletterSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(120).required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Please enter your email address.',
  }),
  source: Joi.string().trim().max(60).optional().default('website_newsletter'),
});

module.exports = {
  subscribeNewsletterSchema,
};
