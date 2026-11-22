const Contact = require('../models/Contact');
const Booking = require('../models/Booking');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const { getRecentActivity } = require('./activity.service');

const STATUS_COLORS = {
  Pending: '#C5A46D',
  Contacted: '#8A5A44',
  'Quotation Sent': '#9C6B3B',
  Confirmed: '#2E6F40',
  'In Progress': '#57252F',
  Completed: '#1E5631',
  Cancelled: '#7A7269',
  Rejected: '#9E2A2B',
};

const CATEGORY_COLORS = [
  '#57252F',
  '#C5A46D',
  '#7D3B47',
  '#9C7A47',
  '#3D1A21',
  '#B08B55',
  '#6E4C4B',
  '#4A3832',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function computeMoMChange(currentCount, previousCount) {
  if (previousCount === 0) return null;
  return Math.round(((currentCount - previousCount) / previousCount) * 100);
}

function buildLastSixMonths() {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth() + 1;
    months.push({
      key: `${year}-${String(month).padStart(2, '0')}`,
      label: `${MONTH_SHORT[month - 1]} ${String(year).slice(-2)}`,
    });
  }
  return months;
}

async function getDashboardOverview() {
  const now = new Date();
  const currentMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const prevMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const sixMonthsStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
  const todayIso = now.toISOString().slice(0, 10);

  const [
    totalContacts,
    newContacts,
    contactsThisMonth,
    contactsPrevMonth,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    bookingsThisMonth,
    bookingsPrevMonth,
    totalNewsletterSubscribers,
    monthlyBookingAgg,
    monthlyContactAgg,
    statusDistAgg,
    categoryDistAgg,
    recentBookingDocs,
    recentContactDocs,
    upcomingBookingDocs,
    recentActivity,
  ] = await Promise.all([
    Contact.countDocuments({ deletedAt: null }),
    Contact.countDocuments({ deletedAt: null, status: 'New' }),
    Contact.countDocuments({ deletedAt: null, createdAt: { $gte: currentMonthStart } }),
    Contact.countDocuments({
      deletedAt: null,
      createdAt: { $gte: prevMonthStart, $lt: currentMonthStart },
    }),
    Booking.countDocuments({ deletedAt: null }),
    Booking.countDocuments({ deletedAt: null, status: 'Pending' }),
    Booking.countDocuments({ deletedAt: null, status: 'Confirmed' }),
    Booking.countDocuments({ deletedAt: null, status: 'Completed' }),
    Booking.countDocuments({ deletedAt: null, createdAt: { $gte: currentMonthStart } }),
    Booking.countDocuments({
      deletedAt: null,
      createdAt: { $gte: prevMonthStart, $lt: currentMonthStart },
    }),
    NewsletterSubscriber.countDocuments({ status: 'active' }),
    Booking.aggregate([
      { $match: { deletedAt: null, createdAt: { $gte: sixMonthsStart } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]),
    Contact.aggregate([
      { $match: { deletedAt: null, createdAt: { $gte: sixMonthsStart } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]),
    Booking.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Booking.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$eventCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Booking.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(5),
    Contact.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(5),
    Booking.find({
      deletedAt: null,
      status: { $nin: ['Cancelled', 'Rejected', 'Completed'] },
      eventDate: { $gte: todayIso },
    })
      .sort({ eventDate: 1 })
      .limit(5),
    getRecentActivity(10),
  ]);

  const months = buildLastSixMonths();
  const bookingMap = new Map(
    monthlyBookingAgg.map((entry) => [
      `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`,
      entry.count,
    ])
  );
  const contactMap = new Map(
    monthlyContactAgg.map((entry) => [
      `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`,
      entry.count,
    ])
  );

  const bookingsPerMonth = months.map((m) => ({
    month: m.label,
    count: bookingMap.get(m.key) || 0,
  }));

  const contactsPerMonth = months.map((m) => ({
    month: m.label,
    count: contactMap.get(m.key) || 0,
  }));

  const statusDistribution = statusDistAgg.map((entry) => ({
    name: entry._id || 'Unknown',
    value: entry.count,
    fill: STATUS_COLORS[entry._id] || '#57252F',
  }));

  const eventCategoryDistribution = categoryDistAgg.map((entry, idx) => ({
    name: entry._id || 'Other',
    value: entry.count,
    fill: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));

  return {
    kpis: {
      totalContacts,
      newContacts,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      contactsMoMChange: computeMoMChange(contactsThisMonth, contactsPrevMonth),
      bookingsMoMChange: computeMoMChange(bookingsThisMonth, bookingsPrevMonth),
      totalNewsletterSubscribers,
    },
    bookingsPerMonth,
    contactsPerMonth,
    statusDistribution,
    eventCategoryDistribution,
    recentBookings: recentBookingDocs.map((doc) => doc.toClientJSON()),
    recentContacts: recentContactDocs.map((doc) => doc.toClientJSON()),
    upcomingEvents: upcomingBookingDocs.map((doc) => doc.toClientJSON()),
    recentActivity,
  };
}

module.exports = {
  getDashboardOverview,
};
