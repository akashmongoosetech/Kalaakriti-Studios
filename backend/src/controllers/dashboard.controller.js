const { getDashboardOverview } = require('../services/dashboard.service');
const { sendSuccess, asyncHandler } = require('../utils/apiResponse');

const getOverview = asyncHandler(async (_req, res) => {
  const overview = await getDashboardOverview();
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Dashboard analytics retrieved successfully.',
    data: overview,
  });
});

module.exports = {
  getOverview,
};
