const GalleryItem = require('../models/GalleryItem');
const { ApiError, sendSuccess, asyncHandler } = require('../utils/apiResponse');
const { escapeRegex } = require('../utils/formatters');

const listGalleryItems = asyncHandler(async (req, res) => {
  const { category, categorySlug, type, search, limit } = req.query;

  const filter = { isPublished: true };
  if (category && category !== 'All') {
    filter.category = String(category);
  }
  if (categorySlug && categorySlug !== 'all') {
    filter.categorySlug = String(categorySlug).toLowerCase();
  }
  if (type && ['image', 'video'].includes(String(type))) {
    filter.type = String(type);
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

  let query = GalleryItem.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  if (limit) {
    const parsedLimit = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
    query = query.limit(parsedLimit);
  }

  const items = await query;

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Gallery items retrieved successfully.',
    data: items.map((item) => item.toClientJSON()),
  });
});

const getGalleryItemBySlug = asyncHandler(async (req, res) => {
  const slug = String(req.params.slug || '').trim().toLowerCase();
  const item = await GalleryItem.findOne({ slug, isPublished: true });
  if (!item) {
    throw new ApiError(404, 'Portfolio story not found.');
  }

  const related = await GalleryItem.find({
    isPublished: true,
    _id: { $ne: item._id },
  })
    .sort({ sortOrder: 1 })
    .limit(12);

  const prioritizedRelated = [
    ...related.filter((r) => r.categorySlug === item.categorySlug),
    ...related.filter((r) => r.categorySlug !== item.categorySlug),
  ]
    .slice(0, 4)
    .map((r) => r.toClientJSON());

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Portfolio story retrieved successfully.',
    data: {
      item: item.toClientJSON(),
      related: prioritizedRelated,
    },
  });
});

const createGalleryItem = asyncHandler(async (req, res) => {
  const created = await GalleryItem.create(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Gallery item created successfully.',
    data: created.toClientJSON(),
  });
});

const updateGalleryItem = asyncHandler(async (req, res) => {
  const updated = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    throw new ApiError(404, 'Gallery item not found.');
  }
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Gallery item updated successfully.',
    data: updated.toClientJSON(),
  });
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
  const deleted = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Gallery item not found.');
  }
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Gallery item deleted successfully.',
    data: { id: deleted._id.toString() },
  });
});

module.exports = {
  listGalleryItems,
  getGalleryItemBySlug,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
