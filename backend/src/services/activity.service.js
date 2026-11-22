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

module.exports = {
  recordActivity,
  getRecentActivity,
};
