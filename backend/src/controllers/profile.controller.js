const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const { ApiError, sendSuccess, asyncHandler } = require('../utils/apiResponse');
const { normalizeIndianMobile, safeDeleteAvatarFile } = require('../utils/formatters');
const { recordActivity } = require('../services/activity.service');
const { signAuthToken, setAuthCookie } = require('./auth.controller');

const BCRYPT_SALT_ROUNDS = 12;

const getProfile = asyncHandler(async (req, res) => {
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Profile fetched successfully.',
    data: req.admin.toSafeJSON(),
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const admin = req.admin;
  const { firstName, lastName, username, email, mobile, removeAvatar } = req.body;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedMobile = normalizeIndianMobile(mobile);

  const newAvatarUrl = req.file ? `/uploads/avatars/${req.file.filename}` : null;

  try {
    const [dupEmail, dupUsername, dupMobile] = await Promise.all([
      Admin.findOne({ email: normalizedEmail, _id: { $ne: admin._id } }),
      Admin.findOne({ username: normalizedUsername, _id: { $ne: admin._id } }),
      Admin.findOne({ mobile: normalizedMobile, _id: { $ne: admin._id } }),
    ]);

    if (dupEmail) {
      throw new ApiError(409, 'Email is already in use by another administrator.', {
        email: 'Email is already in use by another administrator.',
      });
    }
    if (dupUsername) {
      throw new ApiError(409, 'Username is already taken by another administrator.', {
        username: 'Username is already taken by another administrator.',
      });
    }
    if (dupMobile) {
      throw new ApiError(409, 'Mobile number is already linked to another administrator.', {
        mobile: 'Mobile number is already linked to another administrator.',
      });
    }

    const previousAvatar = admin.profilePicture;

    admin.firstName = firstName.trim();
    admin.lastName = lastName.trim();
    admin.username = normalizedUsername;
    admin.email = normalizedEmail;
    admin.mobile = normalizedMobile;

    if (newAvatarUrl) {
      admin.profilePicture = newAvatarUrl;
    } else if (removeAvatar === true) {
      admin.profilePicture = '';
    }

    await admin.save();

    if ((newAvatarUrl || removeAvatar === true) && previousAvatar && previousAvatar !== admin.profilePicture) {
      safeDeleteAvatarFile(previousAvatar);
    }

    await recordActivity({
      type: 'status_changed',
      title: 'Admin Profile Updated',
      description: `${admin.firstName} ${admin.lastName} updated administrator profile details.`,
      entityType: 'profile',
      entityId: admin._id.toString(),
      actorId: admin._id,
    });

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Profile updated successfully.',
      data: admin.toSafeJSON(),
    });
  } catch (err) {
    if (newAvatarUrl) {
      safeDeleteAvatarFile(newAvatarUrl);
    }
    throw err;
  }
});

const deleteAvatar = asyncHandler(async (req, res) => {
  const admin = req.admin;
  const previousAvatar = admin.profilePicture;

  if (previousAvatar) {
    admin.profilePicture = '';
    await admin.save();
    safeDeleteAvatarFile(previousAvatar);

    await recordActivity({
      type: 'status_changed',
      title: 'Admin Profile Photo Removed',
      description: `${admin.firstName} ${admin.lastName} removed their profile avatar.`,
      entityType: 'profile',
      entityId: admin._id.toString(),
      actorId: admin._id,
    });
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Profile picture removed successfully.',
    data: admin.toSafeJSON(),
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id).select('+passwordHash');
  if (!admin) {
    throw new ApiError(404, 'Administrator account not found.');
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!isCurrentValid) {
    throw new ApiError(400, 'Current password is incorrect.', {
      currentPassword: 'Current password is incorrect.',
    });
  }

  const isSameAsOld = await bcrypt.compare(newPassword, admin.passwordHash);
  if (isSameAsOld) {
    throw new ApiError(400, 'New password must be different from your current password.', {
      newPassword: 'New password must be different from your current password.',
    });
  }

  admin.passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  admin.tokenVersion = Number(admin.tokenVersion || 0) + 1;
  await admin.save();

  const refreshedToken = signAuthToken(admin, true);
  setAuthCookie(res, refreshedToken, true, req);

  await recordActivity({
    type: 'status_changed',
    title: 'Admin Password Changed',
    description: `${admin.firstName} ${admin.lastName} updated account password and refreshed active session.`,
    entityType: 'profile',
    entityId: admin._id.toString(),
    actorId: admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Password updated successfully.',
    data: {
      token: refreshedToken,
    },
  });
});

module.exports = {
  getProfile,
  updateProfile,
  deleteAvatar,
  changePassword,
};
