const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate, validateObjectId } = require('../middleware/validate.middleware');
const { publicFormRateLimiter } = require('../middleware/rateLimit.middleware');
const {
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
  bulkUpdateBookingStatusSchema,
  bulkDeleteBookingsSchema,
} = require('../validators/booking.validator');

const publicRouter = express.Router();
publicRouter.post(
  '/',
  publicFormRateLimiter,
  validate(createBookingSchema),
  bookingController.createPublicBooking
);

const adminRouter = express.Router();
adminRouter.use(authenticateAdmin, authorizeRoles('Studio Administrator'));
adminRouter.get('/', bookingController.listAdminBookings);
adminRouter.post('/', validate(createBookingSchema), bookingController.createAdminBooking);
adminRouter.get('/upcoming', bookingController.listUpcomingBookings);
adminRouter.get('/export', bookingController.exportAdminBookingsCsv);
adminRouter.patch(
  '/bulk-status',
  validate(bulkUpdateBookingStatusSchema),
  bookingController.bulkUpdateBookingStatus
);
adminRouter.post(
  '/bulk-delete',
  validate(bulkDeleteBookingsSchema),
  bookingController.bulkDeleteBookings
);
adminRouter.get('/:id', validateObjectId('id'), bookingController.getAdminBookingById);
adminRouter.put(
  '/:id',
  validateObjectId('id'),
  validate(updateBookingSchema),
  bookingController.updateAdminBooking
);
adminRouter.patch(
  '/:id/status',
  validateObjectId('id'),
  validate(updateBookingStatusSchema),
  bookingController.patchAdminBookingStatus
);
adminRouter.delete('/:id', validateObjectId('id'), bookingController.softDeleteAdminBooking);
adminRouter.patch('/:id/restore', validateObjectId('id'), bookingController.restoreAdminBooking);
adminRouter.delete(
  '/:id/permanent',
  validateObjectId('id'),
  bookingController.permanentDeleteAdminBooking
);

module.exports = {
  publicBookingRoutes: publicRouter,
  adminBookingRoutes: adminRouter,
};
