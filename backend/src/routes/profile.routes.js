const express = require('express');
const profileController = require('../controllers/profile.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { uploadAvatar } = require('../middleware/upload.middleware');
const {
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

const router = express.Router();

router.use(authenticateAdmin, authorizeRoles('Studio Administrator'));

router.get('/', profileController.getProfile);

router.put(
  '/',
  uploadAvatar.single('profilePicture'),
  validate(updateProfileSchema),
  profileController.updateProfile
);

router.delete('/avatar', profileController.deleteAvatar);

router.put('/password', validate(changePasswordSchema), profileController.changePassword);

module.exports = router;
