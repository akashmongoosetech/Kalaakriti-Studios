const Testimonial = require('../models/Testimonial');
const { ApiError, sendSuccess, asyncHandler } = require('../utils/apiResponse');

const listTestimonials = asyncHandler(async (_req, res) => {
  const items = await Testimonial.find({ isPublished: true }).sort({
    sortOrder: 1,
    createdAt: -1,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Testimonials retrieved successfully.',
    data: items.map((item) => item.toClientJSON()),
  });
});

const createTestimonial = asyncHandler(async (req, res) => {
  const created = await Testimonial.create(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Testimonial added successfully.',
    data: created.toClientJSON(),
  });
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const deleted = await Testimonial.findByIdAndDelete(req.params.id);
  if (!deleted) {
    throw new ApiError(404, 'Testimonial not found.');
  }
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Testimonial deleted successfully.',
    data: { id: deleted._id.toString() },
  });
});

module.exports = {
  listTestimonials,
  createTestimonial,
  deleteTestimonial,
};
