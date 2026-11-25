const crypto = require('crypto');
const mongoose = require('mongoose');
const GalleryItem = require('../models/GalleryItem');
const { ApiError, sendSuccess, asyncHandler } = require('../utils/apiResponse');
const { escapeRegex } = require('../utils/formatters');
const { validateMediaUrl, slugifyText } = require('../utils/mediaUrl');
const { recordActivity } = require('../services/activity.service');

async function generateUniqueSlug(title, excludeId = null) {
  const base = slugifyText(title, 'gallery-work');
  let candidate = base;
  let attempts = 0;

  while (attempts < 10) {
    const existing = await GalleryItem.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .select('_id')
      .lean();

    if (!existing) {
      return candidate;
    }

    attempts += 1;
    const suffix = crypto.randomBytes(2).toString('hex');
    candidate = `${base}-${suffix}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}

function buildNormalizedPayload(body, existingItem = null) {
  const mediaType = body.mediaType || existingItem?.mediaType || 'image';
  const rawMediaUrl = String(body.mediaUrl || '').trim();

  const isExistingSeededReel =
    Boolean(existingItem) &&
    mediaType === 'video' &&
    existingItem.videoProvider === 'reel' &&
    /^\/src\/assets\/images\/[a-zA-Z0-9._/-]+$/.test(rawMediaUrl);

  // Allow keeping existing seeded studio relative image paths when editing seeded records
  const allowRelativeStudioAsset =
    Boolean(existingItem) &&
    mediaType === 'image' &&
    /^\/src\/assets\/images\/[a-zA-Z0-9._/-]+$/.test(rawMediaUrl);

  const parsedMedia = isExistingSeededReel
    ? {
        valid: true,
        normalizedUrl: rawMediaUrl,
        embedUrl: '',
        videoProvider: 'reel',
        thumbnailUrl: existingItem.thumbnail || rawMediaUrl,
      }
    : validateMediaUrl(mediaType, rawMediaUrl, {
        allowRelativeStudioAsset,
      });

  if (!parsedMedia.valid) {
    throw new ApiError(400, parsedMedia.error || 'Invalid media URL.');
  }

  const category = String(body.category || '').trim() || 'General';
  const categorySlug = slugifyText(category, 'general');
  const status = body.status === 'inactive' ? 'inactive' : 'active';
  const displayOrder =
    body.displayOrder !== undefined && body.displayOrder !== null && body.displayOrder !== ''
      ? Math.max(0, Math.min(100000, parseInt(String(body.displayOrder), 10) || 0))
      : existingItem?.displayOrder ?? 0;

  const thumbnail =
    (body.thumbnail && String(body.thumbnail).trim()) ||
    parsedMedia.thumbnailUrl ||
    (mediaType === 'image' ? parsedMedia.normalizedUrl : existingItem?.thumbnail || '');

  return {
    title: String(body.title).trim(),
    description: String(body.description || '').trim(),
    mediaType,
    type: mediaType,
    mediaUrl: parsedMedia.normalizedUrl,
    embedUrl: parsedMedia.embedUrl || '',
    videoProvider: parsedMedia.videoProvider || '',
    category,
    categorySlug,
    displayOrder,
    sortOrder: displayOrder,
    status,
    isPublished: status === 'active',
    thumbnail,
    src: mediaType === 'image' ? parsedMedia.normalizedUrl : thumbnail || parsedMedia.normalizedUrl,
    videoUrl:
      mediaType === 'video' && parsedMedia.videoProvider === 'direct'
        ? parsedMedia.normalizedUrl
        : '',
    // Clear legacy reelFrames when switching to an external URL-backed video or image
    ...(mediaType === 'video' && parsedMedia.videoProvider && parsedMedia.videoProvider !== 'reel'
      ? { reelFrames: [] }
      : {}),
    aspectRatio: body.aspectRatio || existingItem?.aspectRatio || 'landscape',
    location:
      body.location !== undefined
        ? String(body.location).trim()
        : existingItem?.location || '',
    coupleOrClient:
      body.coupleOrClient !== undefined
        ? String(body.coupleOrClient).trim()
        : existingItem?.coupleOrClient || '',
    duration:
      body.duration !== undefined
        ? String(body.duration).trim()
        : existingItem?.duration || '',
    year:
      body.year !== undefined && String(body.year).trim()
        ? String(body.year).trim()
        : existingItem?.year || String(new Date().getFullYear()),
    cameraSpec:
      body.cameraSpec !== undefined
        ? String(body.cameraSpec).trim()
        : existingItem?.cameraSpec || '',
  };
}

/**
 * GET /api/gallery
 * Public endpoint: returns ONLY active gallery items sorted by displayOrder asc, createdAt desc.
 */
const listGalleryItems = asyncHandler(async (req, res) => {
  const { category, categorySlug, type, mediaType, search, page, limit } = req.query;

  const filter = { status: 'active' };

  if (category && String(category) !== 'All') {
    filter.category = String(category);
  }
  if (categorySlug && String(categorySlug) !== 'all') {
    filter.categorySlug = String(categorySlug).toLowerCase();
  }
  const requestedType = mediaType || type;
  if (requestedType && ['image', 'video'].includes(String(requestedType))) {
    filter.mediaType = String(requestedType);
  }
  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [
      { title: regex },
      { category: regex },
      { location: regex },
      { description: regex },
    ];
  }

  const total = await GalleryItem.countDocuments(filter);

  let query = GalleryItem.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  let paginationMeta = null;

  if (page || limit) {
    const parsedLimit = Math.min(100, Math.max(1, parseInt(String(limit || 50), 10) || 50));
    const parsedPage = Math.max(1, parseInt(String(page || 1), 10) || 1);
    const skip = (parsedPage - 1) * parsedLimit;
    query = query.skip(skip).limit(parsedLimit);
    paginationMeta = {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
    };
  }

  const [items, activeCategories] = await Promise.all([
    query,
    GalleryItem.distinct('category', { status: 'active' }),
  ]);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Active gallery items retrieved successfully.',
    data: items.map((item) => item.toClientJSON()),
    meta: {
      total,
      categories: activeCategories.filter(Boolean).sort((a, b) => a.localeCompare(b)),
      ...(paginationMeta ? { pagination: paginationMeta } : {}),
    },
  });
});

/**
 * GET /api/gallery/admin (and /api/admin/gallery)
 * Protected admin endpoint: returns all gallery items (active + inactive) with search, filters, sorting, pagination & stats.
 */
const listAdminGalleryItems = asyncHandler(async (req, res) => {
  const {
    search = '',
    mediaType = 'all',
    status = 'all',
    category = 'all',
    sort = 'displayOrder',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  if (mediaType && ['image', 'video'].includes(String(mediaType))) {
    filter.mediaType = String(mediaType);
  }
  if (status && ['active', 'inactive'].includes(String(status))) {
    filter.status = String(status);
  }
  if (category && String(category).toLowerCase() !== 'all') {
    filter.category = String(category);
  }
  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [
      { title: regex },
      { description: regex },
      { category: regex },
      { location: regex },
    ];
  }

  let sortSpec = { displayOrder: 1, createdAt: -1 };
  if (sort === 'latest') sortSpec = { createdAt: -1 };
  else if (sort === 'oldest') sortSpec = { createdAt: 1 };
  else if (sort === 'title') sortSpec = { title: 1 };

  const parsedPage = Math.max(1, parseInt(String(page), 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 12));
  const skip = (parsedPage - 1) * parsedLimit;

  const [items, filteredTotal, totalAll, activeCount, inactiveCount, imageCount, videoCount, categories] =
    await Promise.all([
      GalleryItem.find(filter).sort(sortSpec).skip(skip).limit(parsedLimit),
      GalleryItem.countDocuments(filter),
      GalleryItem.countDocuments({}),
      GalleryItem.countDocuments({ status: 'active' }),
      GalleryItem.countDocuments({ status: 'inactive' }),
      GalleryItem.countDocuments({ mediaType: 'image' }),
      GalleryItem.countDocuments({ mediaType: 'video' }),
      GalleryItem.distinct('category'),
    ]);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Admin gallery items retrieved successfully.',
    data: {
      items: items.map((item) => item.toClientJSON()),
      stats: {
        total: totalAll,
        active: activeCount,
        inactive: inactiveCount,
        images: imageCount,
        videos: videoCount,
      },
      categories: categories.filter(Boolean).sort((a, b) => a.localeCompare(b)),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total: filteredTotal,
        totalPages: Math.max(1, Math.ceil(filteredTotal / parsedLimit)),
      },
    },
  });
});

/**
 * GET /api/gallery/admin/:id
 * Protected admin endpoint: retrieves any gallery item by MongoDB ObjectId (including inactive).
 */
const getAdminGalleryItemById = asyncHandler(async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Gallery item not found.');
  }

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Gallery item retrieved successfully.',
    data: item.toClientJSON(),
  });
});

/**
 * GET /api/gallery/:id
 * Public endpoint: retrieves an active gallery item by either MongoDB ObjectId or slug.
 */
const getGalleryItemDetail = asyncHandler(async (req, res) => {
  const rawIdentifier = String(req.params.id || req.params.slug || '').trim();
  if (!rawIdentifier) {
    throw new ApiError(400, 'Gallery item identifier is required.');
  }

  let item = null;
  if (mongoose.Types.ObjectId.isValid(rawIdentifier) && /^[a-fA-F0-9]{24}$/.test(rawIdentifier)) {
    item = await GalleryItem.findOne({ _id: rawIdentifier, status: 'active' });
  }
  if (!item) {
    item = await GalleryItem.findOne({
      slug: rawIdentifier.toLowerCase(),
      status: 'active',
    });
  }

  if (!item) {
    throw new ApiError(404, 'Gallery item not found.');
  }

  const related = await GalleryItem.find({
    status: 'active',
    _id: { $ne: item._id },
  })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(12);

  const prioritizedRelated = [
    ...related.filter((r) => r.categorySlug === item.categorySlug),
    ...related.filter((r) => r.categorySlug !== item.categorySlug),
  ]
    .slice(0, 4)
    .map((r) => r.toClientJSON());

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Gallery item retrieved successfully.',
    data: {
      item: item.toClientJSON(),
      related: prioritizedRelated,
    },
  });
});

/**
 * POST /api/gallery (and /api/admin/gallery)
 * Protected admin endpoint: creates a new URL-based image or video gallery item.
 */
const createGalleryItem = asyncHandler(async (req, res) => {
  const payload = buildNormalizedPayload(req.body);

  // Prevent accidental duplicate submissions with identical title + mediaUrl
  const duplicate = await GalleryItem.findOne({
    title: { $regex: new RegExp(`^${escapeRegex(payload.title)}$`, 'i') },
    mediaUrl: payload.mediaUrl,
  })
    .select('_id')
    .lean();

  if (duplicate) {
    throw new ApiError(
      409,
      'A gallery item with this exact title and media URL already exists.'
    );
  }

  payload.slug = await generateUniqueSlug(payload.title);
  payload.isDemoContent = false;

  const created = await GalleryItem.create(payload);

  await recordActivity({
    type: 'gallery_created',
    title: `Gallery ${created.mediaType === 'video' ? 'video' : 'image'} added`,
    description: `"${created.title}" (${created.category}) added as ${created.status}.`,
    entityType: 'gallery',
    entityId: created._id.toString(),
    actorId: req.admin?._id || null,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Gallery item created successfully.',
    data: created.toClientJSON(),
  });
});

/**
 * PUT /api/gallery/:id (and /api/admin/gallery/:id)
 * Protected admin endpoint: updates an existing gallery item in-place without duplication.
 */
const updateGalleryItem = asyncHandler(async (req, res) => {
  const existing = await GalleryItem.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Gallery item not found.');
  }

  const payload = buildNormalizedPayload(req.body, existing);

  // Check for duplicate against other records only
  const duplicate = await GalleryItem.findOne({
    _id: { $ne: existing._id },
    title: { $regex: new RegExp(`^${escapeRegex(payload.title)}$`, 'i') },
    mediaUrl: payload.mediaUrl,
  })
    .select('_id')
    .lean();

  if (duplicate) {
    throw new ApiError(
      409,
      'Another gallery item with this exact title and media URL already exists.'
    );
  }

  Object.assign(existing, payload);
  await existing.save();

  await recordActivity({
    type: 'gallery_updated',
    title: 'Gallery item updated',
    description: `Updated "${existing.title}" (${existing.mediaType}, ${existing.status}).`,
    entityType: 'gallery',
    entityId: existing._id.toString(),
    actorId: req.admin?._id || null,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Gallery item updated successfully.',
    data: existing.toClientJSON(),
  });
});

/**
 * PATCH /api/gallery/:id/status (and /api/admin/gallery/:id/status)
 * Protected admin endpoint: toggles active / inactive status.
 */
const updateGalleryItemStatus = asyncHandler(async (req, res) => {
  const existing = await GalleryItem.findById(req.params.id);
  if (!existing) {
    throw new ApiError(404, 'Gallery item not found.');
  }

  const nextStatus = req.body.status === 'inactive' ? 'inactive' : 'active';
  existing.status = nextStatus;
  existing.isPublished = nextStatus === 'active';
  await existing.save();

  await recordActivity({
    type: 'gallery_status_changed',
    title: `Gallery item ${nextStatus === 'active' ? 'activated' : 'deactivated'}`,
    description: `"${existing.title}" is now ${nextStatus} on the public website.`,
    entityType: 'gallery',
    entityId: existing._id.toString(),
    actorId: req.admin?._id || null,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: `Gallery item marked as ${nextStatus}.`,
    data: existing.toClientJSON(),
  });
});

/**
 * DELETE /api/gallery/:id (and /api/admin/gallery/:id)
 * Protected admin endpoint: permanently removes a gallery item from MongoDB.
 */
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const deleted = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Gallery item not found.');
  }

  await recordActivity({
    type: 'gallery_deleted',
    title: 'Gallery item deleted',
    description: `Removed "${deleted.title}" (${deleted.mediaType}) from gallery.`,
    entityType: 'gallery',
    entityId: deleted._id.toString(),
    actorId: req.admin?._id || null,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Gallery item deleted successfully.',
    data: { id: deleted._id.toString() },
  });
});

module.exports = {
  listGalleryItems,
  listAdminGalleryItems,
  getAdminGalleryItemById,
  getGalleryItemDetail,
  createGalleryItem,
  updateGalleryItem,
  updateGalleryItemStatus,
  deleteGalleryItem,
};
