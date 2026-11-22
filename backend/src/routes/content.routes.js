const express = require('express');
const testimonialController = require('../controllers/testimonial.controller');
const instagramController = require('../controllers/instagram.controller');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');

const testimonialPublicRouter = express.Router();
testimonialPublicRouter.get('/', testimonialController.listTestimonials);

const testimonialAdminRouter = express.Router();
testimonialAdminRouter.use(authenticateAdmin, authorizeRoles('Studio Administrator'));
testimonialAdminRouter.post('/', testimonialController.createTestimonial);
testimonialAdminRouter.delete('/:id', testimonialController.deleteTestimonial);

const instagramRouter = express.Router();
instagramRouter.get('/', instagramController.listInstagramPosts);

const dashboardRouter = express.Router();
dashboardRouter.use(authenticateAdmin, authorizeRoles('Studio Administrator'));
dashboardRouter.get('/', dashboardController.getOverview);

module.exports = {
  testimonialPublicRoutes: testimonialPublicRouter,
  testimonialAdminRoutes: testimonialAdminRouter,
  instagramRoutes: instagramRouter,
  dashboardRoutes: dashboardRouter,
};
