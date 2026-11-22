const express = require('express');
const contactController = require('../controllers/contact.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { publicFormRateLimiter } = require('../middleware/rateLimit.middleware');
const {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} = require('../validators/contact.validator');

const publicRouter = express.Router();
publicRouter.post(
  '/',
  publicFormRateLimiter,
  validate(createContactSchema),
  contactController.createPublicContact
);

const adminRouter = express.Router();
adminRouter.use(authenticateAdmin, authorizeRoles('Studio Administrator'));
adminRouter.get('/', contactController.listAdminContacts);
adminRouter.get('/:id', contactController.getAdminContactById);
adminRouter.put('/:id', validate(updateContactSchema), contactController.updateAdminContact);
adminRouter.patch(
  '/:id/status',
  validate(updateContactStatusSchema),
  contactController.patchAdminContactStatus
);
adminRouter.delete('/:id', contactController.softDeleteAdminContact);
adminRouter.patch('/:id/restore', contactController.restoreAdminContact);
adminRouter.delete('/:id/permanent', contactController.permanentDeleteAdminContact);

module.exports = {
  publicContactRoutes: publicRouter,
  adminContactRoutes: adminRouter,
};
