const express = require('express');
const galleryController = require('../controllers/gallery.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate, validateObjectId } = require('../middleware/validate.middleware');
const {
  createGalleryItemSchema,
  updateGalleryItemSchema,
  updateGalleryStatusSchema,
} = require('../validators/gallery.validator');

const requireAdmin = [authenticateAdmin, authorizeRoles('Studio Administrator')];

/**
 * Mounted at /api/gallery
 * Supports all canonical gallery endpoints:
 *   GET    /api/gallery              (Public - active items only)
 *   GET    /api/gallery/admin        (Protected Admin - all items)
 *   GET    /api/gallery/admin/:id    (Protected Admin - item details)
 *   POST   /api/gallery              (Protected Admin - create item)
 *   GET    /api/gallery/:id          (Public - active item by ObjectId or slug)
 *   PUT    /api/gallery/:id          (Protected Admin - update item)
 *   PATCH  /api/gallery/:id/status   (Protected Admin - toggle active/inactive)
 *   DELETE /api/gallery/:id          (Protected Admin - delete item)
 */
const publicRouter = express.Router();

publicRouter.get('/', galleryController.listGalleryItems);
publicRouter.get('/admin', ...requireAdmin, galleryController.listAdminGalleryItems);
publicRouter.get(
  '/admin/:id',
  ...requireAdmin,
  validateObjectId('id'),
  galleryController.getAdminGalleryItemById
);
publicRouter.post(
  '/',
  ...requireAdmin,
  validate(createGalleryItemSchema),
  galleryController.createGalleryItem
);
publicRouter.get('/:id', galleryController.getGalleryItemDetail);
publicRouter.put(
  '/:id',
  ...requireAdmin,
  validateObjectId('id'),
  validate(updateGalleryItemSchema),
  galleryController.updateGalleryItem
);
publicRouter.patch(
  '/:id/status',
  ...requireAdmin,
  validateObjectId('id'),
  validate(updateGalleryStatusSchema),
  galleryController.updateGalleryItemStatus
);
publicRouter.delete(
  '/:id',
  ...requireAdmin,
  validateObjectId('id'),
  galleryController.deleteGalleryItem
);

/**
 * Mounted at /api/admin/gallery (consistent alias with existing /api/admin/* endpoints)
 */
const adminRouter = express.Router();
adminRouter.use(...requireAdmin);
adminRouter.get('/', galleryController.listAdminGalleryItems);
adminRouter.get('/:id', validateObjectId('id'), galleryController.getAdminGalleryItemById);
adminRouter.post('/', validate(createGalleryItemSchema), galleryController.createGalleryItem);
adminRouter.put(
  '/:id',
  validateObjectId('id'),
  validate(updateGalleryItemSchema),
  galleryController.updateGalleryItem
);
adminRouter.patch(
  '/:id/status',
  validateObjectId('id'),
  validate(updateGalleryStatusSchema),
  galleryController.updateGalleryItemStatus
);
adminRouter.delete('/:id', validateObjectId('id'), galleryController.deleteGalleryItem);

module.exports = {
  publicGalleryRoutes: publicRouter,
  adminGalleryRoutes: adminRouter,
};
