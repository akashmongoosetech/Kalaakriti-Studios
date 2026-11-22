const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { publicFormRateLimiter } = require('../middleware/rateLimit.middleware');
const {
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
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
adminRouter.get('/:id', bookingController.getAdminBookingById);
adminRouter.put('/:id', validate(updateBookingSchema), bookingController.updateAdminBooking);
adminRouter.patch(
  '/:id/status',
  validate(updateBookingStatusSchema),
  bookingController.patchAdminBookingStatus
);
adminRouter.delete('/:id', bookingController.softDeleteAdminBooking);
adminRouter.patch('/:id/restore', bookingController.restoreAdminBooking);
adminRouter.delete('/:id/permanent', bookingController.permanentDeleteAdminBooking);

module.exports = {
  publicBookingRoutes: publicRouter,
  adminBookingRoutes: adminRouter,
};
