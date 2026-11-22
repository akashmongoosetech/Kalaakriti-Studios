const {
  getDashboardOverview,
  getDashboardQuickStats,
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
  getActivityFeed,
};
