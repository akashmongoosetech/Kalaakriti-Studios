const {
  getDashboardOverview,
  getDashboardQuickStats,
  getDailyTrends,
} = require('../services/dashboard.service');
const { listActivity } = require('../services/activity.service');
const { sendSuccess, asyncHandler } = require('../utils/apiResponse');

const getOverview = asyncHandler(async (_req, res) => {
  const overview = await getDashboardOverview();
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Dashboard analytics retrieved successfully.',
    data: overview,
  });
});

const getQuickStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardQuickStats();
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Dashboard KPI statistics retrieved successfully.',
    data: stats,
  });
});

const getTrends = asyncHandler(async (req, res) => {
  const days = Math.min(90, Math.max(7, parseInt(String(req.query.days || '30'), 10) || 30));
  const trends = await getDailyTrends(days);
  return sendSuccess(res, {
    statusCode: 200,
    message: `Last ${trends.days} days booking and inquiry trends retrieved successfully.`,
    data: trends,
  });
});

const getActivityFeed = asyncHandler(async (req, res) => {
  const { page = '1', limit = '20', entityType = '' } = req.query;
  const result = await listActivity({ page, limit, entityType });
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Studio activity feed retrieved successfully.',
    data: result.items,
    pagination: result.pagination,
  });
});

module.exports = {
  getOverview,
  getQuickStats,
  getTrends,
  getActivityFeed,
};
