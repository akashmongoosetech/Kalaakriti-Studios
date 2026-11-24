const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticateAdmin, authorizeRoles } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticateAdmin, authorizeRoles('Studio Administrator'));

router.get('/', dashboardController.getOverview);
router.get('/overview', dashboardController.getOverview);
router.get('/stats', dashboardController.getQuickStats);
router.get('/trends', dashboardController.getTrends);
router.get('/activity', dashboardController.getActivityFeed);

module.exports = router;
