const express = require('express');
const { getDatabaseStatus } = require('../config/db');
const { sendSuccess } = require('../utils/apiResponse');

const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const dashboardRoutes = require('./dashboard.routes');
const { publicContactRoutes, adminContactRoutes } = require('./contact.routes');
const { publicBookingRoutes, adminBookingRoutes } = require('./booking.routes');
const { publicNewsletterRoutes, adminNewsletterRoutes } = require('./newsletter.routes');
const { publicGalleryRoutes, adminGalleryRoutes } = require('./gallery.routes');
const {
  testimonialPublicRoutes,
  testimonialAdminRoutes,
  instagramRoutes,
} = require('./content.routes');

const router = express.Router();

router.get('/health', (_req, res) => {
  const dbStatus = getDatabaseStatus();
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Kalaakriti Studios API is healthy.',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
  });
});

// Public Website APIs
router.use('/contacts', publicContactRoutes);
router.use('/bookings', publicBookingRoutes);
router.use('/newsletter', publicNewsletterRoutes);
router.use('/gallery', publicGalleryRoutes);
router.use('/testimonials', testimonialPublicRoutes);
router.use('/instagram', instagramRoutes);

// Admin Portal APIs
router.use('/admin/auth', authRoutes);
router.use('/admin/profile', profileRoutes);
router.use('/admin/dashboard', dashboardRoutes);
router.use('/admin/contacts', adminContactRoutes);
router.use('/admin/bookings', adminBookingRoutes);
router.use('/admin/newsletter', adminNewsletterRoutes);
router.use('/admin/gallery', adminGalleryRoutes);
router.use('/admin/testimonials', testimonialAdminRoutes);

module.exports = router;
