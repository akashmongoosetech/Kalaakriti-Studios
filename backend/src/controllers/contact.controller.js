const Contact = require('../models/Contact');
const { ApiError, sendSuccess, asyncHandler } = require('../utils/apiResponse');
const {
  splitFullName,
  generateContactId,
  escapeRegex,
  buildCsv,
} = require('../utils/formatters');
const { recordActivity } = require('../services/activity.service');

function buildContactFilter(query = {}) {
  const {
    search = '',
    status = 'All',
    eventType = 'All',
    city = 'All',
    dateFrom = '',
    dateTo = '',
    view = 'active',
  } = query;

  const isTrash = view === 'trash';
  const filter = isTrash ? { deletedAt: { $ne: null } } : { deletedAt: null };

  if (status && status !== 'All') {
    filter.status = String(status);
  }
  if (eventType && eventType !== 'All') {
    filter.eventType = String(eventType);
  }
  if (city && city !== 'All') {
    filter.city = String(city);
  }

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) {
      const fromDate = new Date(`${dateFrom}T00:00:00.000Z`);
      if (!Number.isNaN(fromDate.getTime())) {
        filter.createdAt.$gte = fromDate;
      }
    }
    if (dateTo) {
      const toDate = new Date(`${dateTo}T23:59:59.999Z`);
      if (!Number.isNaN(toDate.getTime())) {
        filter.createdAt.$lte = toDate;
      }
    }
    if (Object.keys(filter.createdAt).length === 0) {
      delete filter.createdAt;
    }
  }

  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [
      { contactId: regex },
      { fullName: regex },
      { email: regex },
      { mobile: regex },
      { subject: regex },
      { eventType: regex },
      { city: regex },
      { message: regex },
    ];
  }

  return filter;
}

const createPublicContact = asyncHandler(async (req, res) => {
  const payload = req.body;
  const split = splitFullName(payload.fullName);
  const firstName = (payload.firstName && payload.firstName.trim()) || split.firstName;
  const lastName = (payload.lastName && payload.lastName.trim()) || split.lastName;
  const fullName = `${firstName} ${lastName}`.trim();

  const contact = await Contact.create({
    contactId: generateContactId(),
    firstName,
    lastName,
    fullName,
    email: payload.email.trim().toLowerCase(),
    mobile: (payload.mobile || payload.phone || '').trim(),
    subject:
      (payload.subject && payload.subject.trim()) ||
      `${payload.eventType} Inquiry — ${payload.city}`,
    eventType: payload.eventType.trim(),
    city: payload.city.trim(),
    eventDate: (payload.eventDate || '').trim(),
    message: payload.message.trim(),
    status: 'New',
    source: payload.source === 'admin_demo' ? 'admin_demo' : 'public_form',
  });

  await recordActivity({
    type: 'contact_received',
    title: 'New Contact Inquiry',
    description: `${contact.fullName} inquired about ${contact.eventType} in ${contact.city}.`,
    entityType: 'contact',
    entityId: contact._id.toString(),
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Your inquiry has been received. Our studio team will get back to you shortly.',
    data: contact.toClientJSON(),
  });
});

const createAdminContact = asyncHandler(async (req, res) => {
  const payload = req.body;
  const split = splitFullName(payload.fullName);
  const firstName = (payload.firstName && payload.firstName.trim()) || split.firstName;
  const lastName = (payload.lastName && payload.lastName.trim()) || split.lastName;
  const fullName = `${firstName} ${lastName}`.trim();

  const contact = await Contact.create({
    contactId: generateContactId(),
    firstName,
    lastName,
    fullName,
    email: payload.email.trim().toLowerCase(),
    mobile: (payload.mobile || payload.phone || '').trim(),
    subject:
      (payload.subject && payload.subject.trim()) ||
      `${payload.eventType} Inquiry — ${payload.city}`,
    eventType: payload.eventType.trim(),
    city: payload.city.trim(),
    eventDate: (payload.eventDate || '').trim(),
    message: payload.message.trim(),
    status: 'New',
    source: 'admin_demo',
  });

  await recordActivity({
    type: 'contact_received',
    title: 'Contact Logged by Admin',
    description: `${req.admin.firstName} logged inquiry ${contact.contactId} for ${contact.fullName} (${contact.city}).`,
    entityType: 'contact',
    entityId: contact._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Contact inquiry created successfully.',
    data: contact.toClientJSON(),
  });
});

const listAdminContacts = asyncHandler(async (req, res) => {
  const { sortBy = 'newest', page = '1', limit = '10' } = req.query;
  const filter = buildContactFilter(req.query);

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name_asc: { fullName: 1 },
    name_desc: { fullName: -1 },
    status_asc: { status: 1, createdAt: -1 },
  };
  const sortObj = sortMap[sortBy] || sortMap.newest;

  const parsedPage = Math.max(1, parseInt(String(page), 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [docs, total, activeCount, trashCount, distinctEventTypes, distinctCities] =
    await Promise.all([
      Contact.find(filter).sort(sortObj).skip(skip).limit(parsedLimit),
      Contact.countDocuments(filter),
      Contact.countDocuments({ deletedAt: null }),
      Contact.countDocuments({ deletedAt: { $ne: null } }),
      Contact.distinct('eventType', { deletedAt: null }),
      Contact.distinct('city', { deletedAt: null }),
    ]);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Contacts retrieved successfully.',
    data: {
      items: docs.map((d) => d.toClientJSON()),
      counts: {
        active: activeCount,
        trash: trashCount,
      },
      facets: {
        eventTypes: distinctEventTypes.filter(Boolean).sort(),
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

const getAdminContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new ApiError(404, 'Contact inquiry not found.');
  }
  return sendSuccess(res, {
    statusCode: 200,
    message: 'Contact retrieved successfully.',
    data: contact.toClientJSON(),
  });
});

const updateAdminContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new ApiError(404, 'Contact inquiry not found.');
  }

  const {
    firstName,
    lastName = '',
    email,
    mobile,
    subject,
    eventType,
    city,
    eventDate = '',
    message,
    status,
  } = req.body;

  contact.firstName = firstName.trim();
  contact.lastName = lastName.trim();
  contact.fullName = `${contact.firstName} ${contact.lastName}`.trim();
  contact.email = email.trim().toLowerCase();
  contact.mobile = mobile.trim();
  contact.subject = subject.trim();
  contact.eventType = eventType.trim();
  contact.city = city.trim();
  contact.eventDate = eventDate.trim();
  contact.message = message.trim();
  contact.status = status;

  await contact.save();

  await recordActivity({
    type: 'contact_updated',
    title: 'Contact Inquiry Updated',
    description: `Updated inquiry ${contact.contactId} (${contact.fullName}) — Status: ${contact.status}.`,
    entityType: 'contact',
    entityId: contact._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Contact inquiry updated successfully.',
    data: contact.toClientJSON(),
  });
});

const patchAdminContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new ApiError(404, 'Contact inquiry not found.');
  }

  const prevStatus = contact.status;
  contact.status = req.body.status;
  await contact.save();

  await recordActivity({
    type: 'status_changed',
    title: 'Contact Status Updated',
    description: `${contact.contactId} (${contact.fullName}) changed from ${prevStatus} to ${contact.status}.`,
    entityType: 'contact',
    entityId: contact._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: `Status updated to ${contact.status}.`,
    data: contact.toClientJSON(),
  });
});

const softDeleteAdminContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new ApiError(404, 'Contact inquiry not found.');
  }

  contact.deletedAt = new Date();
  await contact.save();

  await recordActivity({
    type: 'contact_deleted',
    title: 'Contact Moved to Trash',
    description: `Moved inquiry ${contact.contactId} (${contact.fullName}) to Trash.`,
    entityType: 'contact',
    entityId: contact._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Contact moved to Trash.',
    data: contact.toClientJSON(),
  });
});

const restoreAdminContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    throw new ApiError(404, 'Contact inquiry not found.');
  }

  contact.deletedAt = null;
  await contact.save();

  await recordActivity({
    type: 'contact_updated',
    title: 'Contact Restored',
    description: `Restored inquiry ${contact.contactId} (${contact.fullName}) from Trash.`,
    entityType: 'contact',
    entityId: contact._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Contact restored successfully.',
    data: contact.toClientJSON(),
  });
});

const permanentDeleteAdminContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    throw new ApiError(404, 'Contact inquiry not found.');
  }

  await recordActivity({
    type: 'contact_deleted',
    title: 'Contact Permanently Deleted',
    description: `Permanently removed inquiry ${contact.contactId} (${contact.fullName}).`,
    entityType: 'contact',
    entityId: contact._id.toString(),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Contact permanently deleted.',
    data: { id: contact._id.toString() },
  });
});

const exportAdminContactsCsv = asyncHandler(async (req, res) => {
  const filter = buildContactFilter(req.query);
  const docs = await Contact.find(filter).sort({ createdAt: -1 }).limit(1000);

  const headers = [
    'Contact ID',
    'Full Name',
    'Email',
    'Mobile',
    'Event Type',
    'City',
    'Event Date',
    'Subject',
    'Status',
    'Submitted At',
    'Message',
  ];

  const rows = docs.map((c) => [
    c.contactId,
    c.fullName,
    c.email,
    c.mobile,
    c.eventType,
    c.city,
    c.eventDate || '',
    c.subject,
    c.status,
    c.createdAt ? c.createdAt.toISOString() : '',
    c.message,
  ]);

  const csvContent = buildCsv(headers, rows);
  const filename = `kalaakriti-contacts-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  return res.status(200).send(csvContent);
});

const bulkUpdateContactStatus = asyncHandler(async (req, res) => {
  const { ids, status } = req.body;
  const result = await Contact.updateMany(
    { _id: { $in: ids } },
    { $set: { status } }
  );

  await recordActivity({
    type: 'status_changed',
    title: 'Bulk Contact Status Update',
    description: `Updated ${result.modifiedCount} contact inquiries to status "${status}".`,
    entityType: 'contact',
    entityId: ids.join(','),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: `Updated ${result.modifiedCount} contact inquiry record(s) to ${status}.`,
    data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      status,
    },
  });
});

const bulkDeleteContacts = asyncHandler(async (req, res) => {
  const { ids, permanent = false } = req.body;
  let affectedCount = 0;

  if (permanent) {
    const result = await Contact.deleteMany({ _id: { $in: ids } });
    affectedCount = result.deletedCount;
  } else {
    const result = await Contact.updateMany(
      { _id: { $in: ids }, deletedAt: null },
      { $set: { deletedAt: new Date() } }
    );
    affectedCount = result.modifiedCount;
  }

  await recordActivity({
    type: 'contact_deleted',
    title: permanent ? 'Bulk Contacts Permanently Deleted' : 'Bulk Contacts Moved to Trash',
    description: `${permanent ? 'Permanently deleted' : 'Moved to Trash'} ${affectedCount} contact inquiries.`,
    entityType: 'contact',
    entityId: ids.join(','),
    actorId: req.admin._id,
  });

  return sendSuccess(res, {
    statusCode: 200,
    message: permanent
      ? `Permanently deleted ${affectedCount} contact(s).`
      : `Moved ${affectedCount} contact(s) to Trash.`,
    data: {
      affectedCount,
      permanent,
    },
  });
});

module.exports = {
  createPublicContact,
  createAdminContact,
  listAdminContacts,
  exportAdminContactsCsv,
  getAdminContactById,
  updateAdminContact,
  patchAdminContactStatus,
  bulkUpdateContactStatus,
  bulkDeleteContacts,
  softDeleteAdminContact,
  restoreAdminContact,
  permanentDeleteAdminContact,
};
