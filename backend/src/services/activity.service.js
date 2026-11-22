const ActivityLog = require('../models/ActivityLog');

async function recordActivity({
  type,
  title,
  description,
  entityType,
  entityId,
  actorId = null,
}) {
  try {
    await ActivityLog.create({
      type,
      title,
      description,
      entityType,
      entityId: String(entityId),
      actorId,
    });
  } catch (err) {
    // Activity logging should never fail the primary business mutation
    console.warn('[activity] Failed to record activity log:', err.message);
  }
}

async function getRecentActivity(limit = 10) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const items = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(safeLimit);
  return items.map((item) => item.toClientJSON());
}

async function listActivity({ page = 1, limit = 20, entityType = '' } = {}) {
  const parsedPage = Math.max(1, parseInt(String(page), 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {};
  if (entityType && ['contact', 'booking', 'profile', 'newsletter'].includes(String(entityType))) {
    filter.entityType = String(entityType);
  }

  const [docs, total] = await Promise.all([
    ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
    ActivityLog.countDocuments(filter),
  ]);

  return {
    items: docs.map((item) => item.toClientJSON()),
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
    },
  };
}

module.exports = {
  recordActivity,
  getRecentActivity,
  listActivity,
};
