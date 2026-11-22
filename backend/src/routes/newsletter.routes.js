const express = require('express');
const newsletterController = require('../controllers/newsletter.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { newsletterRateLimiter } = require('../middleware/rateLimit.middleware');
const { subscribeNewsletterSchema } = require('../validators/newsletter.validator');

const publicRouter = express.Router();
publicRouter.post(
  '/subscribe',
  newsletterRateLimiter,
  validate(subscribeNewsletterSchema),
  newsletterController.subscribeNewsletter
);

const adminRouter = express.Router();
adminRouter.use(authenticateAdmin, authorizeRoles('Studio Administrator'));
adminRouter.get('/', newsletterController.listAdminSubscribers);

module.exports = {
  publicNewsletterRoutes: publicRouter,
  adminNewsletterRoutes: adminRouter,
};
