const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { sendSuccess, asyncHandler } = require('../utils/apiResponse');

const subscribeNewsletter = asyncHandler(async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const source = req.body.source || 'website_newsletter';

  const existing = await NewsletterSubscriber.findOne({ email });
  if (existing) {
    if (existing.status === 'unsubscribed') {
      existing.status = 'active';
      await existing.save();
      return sendSuccess(res, {
        statusCode: 200,
        message: 'Welcome back! Your newsletter subscription has been reactivated.',
        data: {
          subscriber: existing.toClientJSON(),
          alreadySubscribed: false,
        },
      });
    }

    return sendSuccess(res, {
      statusCode: 200,
      message: 'This email is already subscribed to the Kalaakriti journal.',
      data: {
        subscriber: existing.toClientJSON(),
        alreadySubscribed: true,
      },
    });
  }

  const subscriber = await NewsletterSubscriber.create({
    email,
    status: 'active',
    source,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Thank you for joining the Kalaakriti journal. Wedding photography guides and seasonal offers will arrive soon.',
    data: {
      subscriber: subscriber.toClientJSON(),
      alreadySubscribed: false,
    },
  });
});

const listAdminSubscribers = asyncHandler(async (req, res) => {
  const parsedPage = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || '20'), 10) || 20));
  const skip = (parsedPage - 1) * parsedLimit;

  const [items, total] = await Promise.all([
    NewsletterSubscriber.find().sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
    NewsletterSubscriber.countDocuments(),
  ]);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Newsletter subscribers retrieved successfully.',
    data: items.map((item) => item.toClientJSON()),
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
    },
  });
});

module.exports = {
  subscribeNewsletter,
  listAdminSubscribers,
};
