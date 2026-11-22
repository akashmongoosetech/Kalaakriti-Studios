const InstagramPost = require('../models/InstagramPost');
const { sendSuccess, asyncHandler } = require('../utils/apiResponse');

const listInstagramPosts = asyncHandler(async (req, res) => {
  const limit = Math.min(24, Math.max(1, parseInt(String(req.query.limit || '12'), 10) || 12));
  const posts = await InstagramPost.find({ isPublished: true })
    .sort({ timestamp: -1 })
    .limit(limit);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Instagram showcase retrieved successfully.',
    data: {
      account: '@kalaakritistudios',
      posts: posts.map((post) => post.toClientJSON()),
    },
  });
});

module.exports = {
  listInstagramPosts,
};
