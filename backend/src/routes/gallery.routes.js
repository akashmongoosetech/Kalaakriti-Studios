const express = require('express');
const galleryController = require('../controllers/gallery.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { galleryItemSchema } = require('../validators/gallery.validator');

const publicRouter = express.Router();
publicRouter.get('/', galleryController.listGalleryItems);
publicRouter.get('/:slug', galleryController.getGalleryItemBySlug);

const adminRouter = express.Router();
adminRouter.use(authenticateAdmin, authorizeRoles('Studio Administrator'));
adminRouter.post('/', validate(galleryItemSchema), galleryController.createGalleryItem);
adminRouter.put('/:id', validate(galleryItemSchema), galleryController.updateGalleryItem);
adminRouter.delete('/:id', galleryController.deleteGalleryItem);

module.exports = {
  publicGalleryRoutes: publicRouter,
  adminGalleryRoutes: adminRouter,
};
