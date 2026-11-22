const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const env = require('../config/env');
const { AVATARS_DIR } = require('../utils/formatters');
const { ApiError } = require('../utils/apiResponse');

fs.mkdirSync(AVATARS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/jpg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, AVATARS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = ALLOWED_MIME_TYPES.get(file.mimetype) || '.jpg';
    const uniqueName = `avatar-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

function avatarFileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(
      new ApiError(400, 'Only JPG, JPEG, PNG, and WebP profile images are allowed.')
    );
  }
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (ext && !['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return cb(
      new ApiError(400, 'Invalid image file extension. Use JPG, PNG, or WebP.')
    );
  }
  return cb(null, true);
}

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: {
    fileSize: env.maxUploadSizeBytes,
    files: 1,
  },
});

module.exports = {
  uploadAvatar,
};
