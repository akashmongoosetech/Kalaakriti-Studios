const express = require('express');
const contactController = require('../controllers/contact.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate, validateObjectId } = require('../middleware/validate.middleware');
const { publicFormRateLimiter } = require('../middleware/rateLimit.middleware');
const {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
  bulkUpdateContactStatusSchema,
  bulkDeleteContactsSchema,
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
adminRouter.post('/', validate(createContactSchema), contactController.createAdminContact);
adminRouter.get('/export', contactController.exportAdminContactsCsv);
adminRouter.patch(
  '/bulk-status',
  validate(bulkUpdateContactStatusSchema),
  contactController.bulkUpdateContactStatus
);
adminRouter.post(
  '/bulk-delete',
  validate(bulkDeleteContactsSchema),
  contactController.bulkDeleteContacts
);
adminRouter.get('/:id', validateObjectId('id'), contactController.getAdminContactById);
adminRouter.put(
  '/:id',
  validateObjectId('id'),
  validate(updateContactSchema),
  contactController.updateAdminContact
);
adminRouter.patch(
  '/:id/status',
  validateObjectId('id'),
  validate(updateContactStatusSchema),
  contactController.patchAdminContactStatus
);
adminRouter.delete('/:id', validateObjectId('id'), contactController.softDeleteAdminContact);
adminRouter.patch('/:id/restore', validateObjectId('id'), contactController.restoreAdminContact);
adminRouter.delete(
  '/:id/permanent',
  validateObjectId('id'),
  contactController.permanentDeleteAdminContact
);

module.exports = {
  publicContactRoutes: publicRouter,
  adminContactRoutes: adminRouter,
};
