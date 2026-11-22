const Booking = require('../models/Booking');
const { ApiError, sendSuccess, asyncHandler } = require('../utils/apiResponse');
const {
  generateBookingReference,
  escapeRegex,
  buildCsv,
} = require('../utils/formatters');
const { recordActivity } = require('../services/activity.service');

function buildBookingFilter(query = {}) {
  const {
    search = '',
    category = 'All',
    status = 'All',
    city = 'All',
    eventDate = '',
    submissionDate = '',
    view = 'active',
  } = query;

  const isTrash = view === 'trash';
  const filter = isTrash ? { deletedAt: { $ne: null } } : { deletedAt: null };

  if (category && category !== 'All') {
    filter.eventCategory = String(category);
  }
  if (status && status !== 'All') {
    filter.status = String(status);
  }
  if (city && city !== 'All') {
    filter.city = String(city);
  }
  if (eventDate && String(eventDate).trim()) {
    filter.eventDate = String(eventDate).trim();
  }
  if (submissionDate && String(submissionDate).trim()) {
    const start = new Date(`${submissionDate}T00:00:00.000Z`);
    const end = new Date(`${submissionDate}T23:59:59.999Z`);
    if (!Number.isNaN(start.getTime())) {
      filter.createdAt = { $gte: start, $lte: end };
    }
  }

  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [
      { referenceId: regex },
      { fullName: regex },
      { email: regex },
      { mobile: regex },
      { whatsapp: regex },
      { eventCategory: regex },
      { eventName: regex },
      { eventLocation: regex },
      { city: regex },
    ];
  }

  return filter;
}

const createPublicBooking = asyncHandler(async (req, res) => {
  const payload = req.body;

  const booking = await Booking.create({
    referenceId: generateBookingReference(),
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    mobile: payload.mobile.trim(),
    whatsapp: (payload.whatsapp || payload.mobile || '').trim(),
    eventCategory: payload.eventCategory.trim(),
    eventName: payload.eventName.trim(),
    eventDate: payload.eventDate.trim(),
    eventDuration: payload.eventDuration.trim(),
    eventLocation: payload.eventLocation.trim(),
    city: payload.city.trim(),
    guestCount: payload.guestCount.trim(),
    coverageMode: payload.coverageMode || 'both',
    addOns: Array.isArray(payload.addOns) ? payload.addOns : [],
    budgetRange: payload.budgetRange.trim(),
    additionalRequirements: (payload.additionalRequirements || '').trim(),
    message: payload.message.trim(),
    status: 'Pending',
    source: payload.source === 'admin_demo' ? 'admin_demo' : 'public_form',
  });

  await recordActivity({
    type: 'booking_submitted',
    title: 'New Booking Request',
    description: `${booking.fullName} requested ${booking.eventCategory} coverage (${booking.referenceId}) in ${booking.city}.`,
    entityType: 'booking',
    entityId: booking._id.toString(),
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Your booking request has been registered. Our studio desk will confirm availability shortly.',
    data: booking.toClientJSON(),
  });
});

const createAdminBooking = asyncHandler(async (req, res) => {
  const payload = req.body;

  const booking = await Booking.create({
    referenceId: generateBookingReference(),
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    mobile: payload.mobile.trim(),
    whatsapp: (payload.whatsapp || payload.mobile || '').trim(),
    eventCategory: payload.eventCategory.trim(),
    eventName: payload.eventName.trim(),
    eventDate: payload.eventDate.trim(),
    eventDuration: payload.eventDuration.trim(),
    eventLocation: payload.eventLocation.trim(),
    city: payload.city.trim(),
    guestCount: payload.guestCount.trim(),
    coverageMode: payload.coverageMode || 'both',
    addOns: Array.isArray(payload.addOns) ? payload.addOns : [],
    budgetRange: payload.budgetRange.trim(),
    additionalRequirements: (payload.additionalRequirements || '').trim(),
    message: payload.message.trim(),
    status: 'Pending',
    source: 'admin_demo',
  });

  await recordActivity({
    type: 'booking_submitted',
    title: 'Booking Logged by Admin',
    description: `${req.admin.firstName} created booking ${booking.referenceId} for ${booking.fullName} (${booking.city}).`,
    entityType: 'booking',
    entityId: booking._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Booking created successfully.',
    data: booking.toClientJSON(),
  });
});

const listAdminBookings = asyncHandler(async (req, res) => {
  const { sortBy = 'newest', page = '1', limit = '10' } = req.query;
  const filter = buildBookingFilter(req.query);

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    event_date_asc: { eventDate: 1 },
    event_date_desc: { eventDate: -1 },
    client_asc: { fullName: 1 },
    status_asc: { status: 1, createdAt: -1 },
  };
  const sortObj = sortMap[sortBy] || sortMap.newest;

  const parsedPage = Math.max(1, parseInt(String(page), 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [docs, total, activeCount, trashCount, distinctCategories, distinctCities] =
    await Promise.all([
      Booking.find(filter).sort(sortObj).skip(skip).limit(parsedLimit),
      Booking.countDocuments(filter),
      Booking.countDocuments({ deletedAt: null }),
      Booking.countDocuments({ deletedAt: { $ne: null } }),
      Booking.distinct('eventCategory', { deletedAt: null }),
      Booking.distinct('city', { deletedAt: null }),
    ]);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Bookings retrieved successfully.',
    data: {
      items: docs.map((d) => d.toClientJSON()),
      counts: {
        active: activeCount,
        trash: trashCount,
      },
      facets: {
        categories: distinctCategories.filter(Boolean).sort(),
        cities: distinctCities.filter(Boolean).sort(),
      },
    },
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / parsedLimit)),
    },
  });
});

const getAdminBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking request not found.');
  }
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Booking retrieved successfully.',
    data: booking.toClientJSON(),
  });
});

const updateAdminBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking request not found.');
  }

  const fields = [
    'fullName',
    'email',
    'mobile',
    'whatsapp',
    'eventCategory',
    'eventName',
    'eventDate',
    'eventDuration',
    'eventLocation',
    'city',
    'guestCount',
    'coverageMode',
    'addOns',
    'budgetRange',
    'additionalRequirements',
    'message',
    'status',
  ];

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      booking[field] =
        field === 'email'
          ? String(req.body[field]).trim().toLowerCase()
          : Array.isArray(req.body[field])
          ? req.body[field]
          : String(req.body[field]).trim();
    }
  }

  await booking.save();

  await recordActivity({
    type: 'booking_updated',
    title: 'Booking Request Updated',
    description: `Updated booking ${booking.referenceId} (${booking.fullName}) — Status: ${booking.status}.`,
    entityType: 'booking',
    entityId: booking._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Booking updated successfully.',
    data: booking.toClientJSON(),
  });
});

const patchAdminBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking request not found.');
  }

  const prevStatus = booking.status;
  booking.status = req.body.status;
  await booking.save();

  await recordActivity({
    type: 'status_changed',
    title: 'Booking Status Updated',
    description: `${booking.referenceId} (${booking.fullName}) changed from ${prevStatus} to ${booking.status}.`,
    entityType: 'booking',
    entityId: booking._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: `Booking status updated to ${booking.status}.`,
    data: booking.toClientJSON(),
  });
});

const softDeleteAdminBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking request not found.');
  }

  booking.deletedAt = new Date();
  await booking.save();

  await recordActivity({
    type: 'booking_deleted',
    title: 'Booking Moved to Trash',
    description: `Moved booking ${booking.referenceId} (${booking.fullName}) to Trash.`,
    entityType: 'booking',
    entityId: booking._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Booking moved to Trash.',
    data: booking.toClientJSON(),
  });
});

const restoreAdminBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking request not found.');
  }

  booking.deletedAt = null;
  await booking.save();

  await recordActivity({
    type: 'booking_updated',
    title: 'Booking Restored',
    description: `Restored booking ${booking.referenceId} (${booking.fullName}) from Trash.`,
    entityType: 'booking',
    entityId: booking._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Booking restored successfully.',
    data: booking.toClientJSON(),
  });
});

const permanentDeleteAdminBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) {
    throw new ApiError(404, 'Booking request not found.');
  }

  await recordActivity({
    type: 'booking_deleted',
    title: 'Booking Permanently Deleted',
    description: `Permanently deleted booking ${booking.referenceId} (${booking.fullName}).`,
    entityType: 'booking',
    entityId: booking._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Booking permanently deleted.',
    data: { id: booking._id.toString() },
  });
});

const listUpcomingBookings = asyncHandler(async (req, res) => {
  const parsedLimit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '15'), 10) || 15));
  const todayIso = new Date().toISOString().slice(0, 10);

  const docs = await Booking.find({
    deletedAt: null,
    status: { $nin: ['Cancelled', 'Rejected', 'Completed'] },
    eventDate: { $gte: todayIso },
  })
    .sort({ eventDate: 1 })
    .limit(parsedLimit);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Upcoming shoot schedule retrieved successfully.',
    data: docs.map((d) => d.toClientJSON()),
  });
});

const exportAdminBookingsCsv = asyncHandler(async (req, res) => {
  const filter = buildBookingFilter(req.query);
  const docs = await Booking.find(filter).sort({ createdAt: -1 }).limit(1000);

  const headers = [
    'Reference ID',
    'Client Name',
    'Email',
    'Mobile',
    'WhatsApp',
    'Category',
    'Event Name',
    'Event Date',
    'Duration',
    'Venue',
    'City',
    'Guest Count',
    'Coverage Mode',
    'Add-Ons',
    'Budget Range',
    'Status',
    'Created At',
  ];

  const rows = docs.map((b) => [
    b.referenceId,
    b.fullName,
    b.email,
    b.mobile,
    b.whatsapp,
    b.eventCategory,
    b.eventName,
    b.eventDate,
    b.eventDuration,
    b.eventLocation,
    b.city,
    b.guestCount,
    b.coverageMode,
    Array.isArray(b.addOns) ? b.addOns.join('; ') : '',
    b.budgetRange,
    b.status,
    b.createdAt ? b.createdAt.toISOString() : '',
  ]);

  const csvContent = buildCsv(headers, rows);
  const filename = `kalaakriti-bookings-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csvContent);
});

const bulkUpdateBookingStatus = asyncHandler(async (req, res) => {
  const { ids, status } = req.body;
  const result = await Booking.updateMany(
    { _id: { $in: ids } },
    { $set: { status } }
  );

  await recordActivity({
    type: 'status_changed',
    title: 'Bulk Booking Status Update',
    description: `Updated ${result.modifiedCount} booking requests to status "${status}".`,
    entityType: 'booking',
    entityId: ids.join(','),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: `Updated ${result.modifiedCount} booking record(s) to ${status}.`,
    data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      status,
    },
  });
});

const bulkDeleteBookings = asyncHandler(async (req, res) => {
  const { ids, permanent = false } = req.body;
  let affectedCount = 0;

  if (permanent) {
    const result = await Booking.deleteMany({ _id: { $in: ids } });
    affectedCount = result.deletedCount;
  } else {
    const result = await Booking.updateMany(
      { _id: { $in: ids }, deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );
    affectedCount = result.modifiedCount;
  }

  await recordActivity({
    type: 'booking_deleted',
    title: permanent ? 'Bulk Bookings Permanently Deleted' : 'Bulk Bookings Moved to Trash',
    description: `${permanent ? 'Permanently deleted' : 'Moved to Trash'} ${affectedCount} booking requests.`,
    entityType: 'booking',
    entityId: ids.join(','),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: permanent
      ? `Permanently deleted ${affectedCount} booking(s).`
      : `Moved ${affectedCount} booking(s) to Trash.`,
    data: {
      affectedCount,
      permanent,
    },
  });
});

module.exports = {
  createPublicBooking,
  createAdminBooking,
  listAdminBookings,
  listUpcomingBookings,
  exportAdminBookingsCsv,
  getAdminBookingById,
  updateAdminBooking,
  patchAdminBookingStatus,
  bulkUpdateBookingStatus,
  bulkDeleteBookings,
  softDeleteAdminBooking,
  restoreAdminBooking,
  permanentDeleteAdminBooking,
};
