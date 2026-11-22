const express = require('express');
const testimonialController = require('../controllers/testimonial.controller');
const instagramController = require('../controllers/instagram.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');

const testimonialPublicRouter = express.Router();
testimonialPublicRouter.get('/', testimonialController.listTestimonials);

const testimonialAdminRouter = express.Router();
testimonialAdminRouter.use(authenticateAdmin, authorizeRoles('Studio Administrator'));
testimonialAdminRouter.post('/', testimonialController.createTestimonial);
testimonialAdminRouter.delete('/:id', testimonialController.deleteTestimonial);

const instagramRouter = express.Router();
instagramRouter.get('/', instagramController.listInstagramPosts);

module.exports = {
  testimonialPublicRoutes: testimonialPublicRouter,
  testimonialAdminRoutes: testimonialAdminRouter,
  instagramRoutes: instagramRouter,
};
