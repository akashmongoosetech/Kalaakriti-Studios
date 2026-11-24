import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { motion } from 'motion/react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Eye,
  Inbox,
  MapPin,
  MessageSquarePlus,
  MessageSquareText,
  PlusCircle,
  RefreshCw,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { StatCard } from '../../components/admin/StatCard';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ContactViewDialog } from '../../components/admin/ContactViewDialog';
import { ContactEditDialog } from '../../components/admin/ContactEditDialog';
import { BookingViewDialog } from '../../components/admin/BookingViewDialog';
import { BookingEditDialog } from '../../components/admin/BookingEditDialog';
import { BookingInquiryTrendsChart } from '../../components/admin/BookingInquiryTrendsChart';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useAdminAuth } from '../../hooks/admin/useAdminAuth';
import { useDashboard } from '../../hooks/admin/useDashboard';
import { useContacts } from '../../hooks/admin/useContacts';
import { useBookings } from '../../hooks/admin/useBookings';
import type { ContactRecord, ContactStatus, UpdateContactInput } from '../../types/contact.types';
import type { BookingRecord, BookingStatus, UpdateBookingInput } from '../../types/booking.types';
import { STUDIO_CONFIG } from '../../data/studio';

function safeFormatDate(iso?: string, pattern = 'dd MMM yyyy'): string {
  if (!iso) return '—';
  try {
    const parsed = parseISO(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return format(parsed, pattern);
  } catch {
    return iso;
  }
}

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const {
    kpi,
    monthlyBookings,
    monthlyContacts,
    dailyTrends30d,
    trends30dSummary,
    bookingStatusDistribution,
    eventCategoryDistribution,
    recentBookings,
    recentContacts,
    upcomingEvents,
    recentActivity,
    loading,
    refresh,
  } = useDashboard();

  const {
    updateContact,
    updateStatus: updateContactStatus,
    deleteContact,
    addDemoContact,
  } = useContacts();

  const {
    updateBooking,
    updateStatus: updateBookingStatus,
    deleteBooking,
    addDemoBooking,
  } = useBookings();

  // Modal states so every dashboard row action works directly
  const [viewingContact, setViewingContact] = useState<ContactRecord | null>(null);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  const [deletingContact, setDeletingContact] = useState<ContactRecord | null>(null);

  const [viewingBooking, setViewingBooking] = useState<BookingRecord | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<BookingRecord | null>(null);

  const handleAddDemoContact = async () => {
    try {
      const created = await addDemoContact();
      toast.success(`Added sample inquiry ${created.contactId} from ${created.fullName}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to add sample inquiry.');
    }
  };

  const handleAddDemoBooking = async () => {
    try {
      const created = await addDemoBooking();
      toast.success(`Added sample booking ${created.referenceId} (${created.eventName}).`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to add sample booking.');
    }
  };

  const handleSaveContact = async (id: string, input: UpdateContactInput) => {
    try {
      const updated = await updateContact(id, input);
      toast.success(`Updated contact ${updated.contactId}.`);
      if (viewingContact?.id === id) setViewingContact(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update contact.');
    }
  };

  const handleContactStatus = async (id: string, status: ContactStatus) => {
    try {
      const updated = await updateContactStatus(id, status);
      toast.success(`Contact status updated to "${status}".`);
      setViewingContact(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update status.');
    }
  };

  const handleConfirmDeleteContact = async () => {
    if (!deletingContact) return;
    try {
      await deleteContact(deletingContact.id);
      toast.success(`Moved ${deletingContact.contactId} to Trash.`);
      if (viewingContact?.id === deletingContact.id) setViewingContact(null);
      setDeletingContact(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to move contact to Trash.');
    }
  };

  const handleSaveBooking = async (id: string, input: UpdateBookingInput) => {
    try {
      const updated = await updateBooking(id, input);
      toast.success(`Updated booking ${updated.referenceId}.`);
      if (viewingBooking?.id === id) setViewingBooking(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update booking.');
    }
  };

  const handleBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const updated = await updateBookingStatus(id, status);
      toast.success(`Booking status updated to "${status}".`);
      setViewingBooking(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update booking status.');
    }
  };

  const handleConfirmDeleteBooking = async () => {
    if (!deletingBooking) return;
    try {
      await deleteBooking(deletingBooking.id);
      toast.success(`Moved ${deletingBooking.referenceId} to Trash.`);
      if (viewingBooking?.id === deletingBooking.id) setViewingBooking(null);
      setDeletingBooking(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to move booking to Trash.');
    }
  };

  const statCards = [
    {
      title: 'Total Contacts',
      value: kpi.totalContacts,
      icon: MessageSquareText,
      to: '/admin/contacts',
      subtitle: 'All active studio inquiries',
      momChange: kpi.contactsMoMChange,
      accent: 'burgundy' as const,
    },
    {
      title: 'New Contacts',
      value: kpi.newContacts,
      icon: Inbox,
      to: '/admin/contacts?status=New',
      subtitle: 'Awaiting first response',
      accent: 'amber' as const,
    },
    {
      title: 'Total Bookings',
      value: kpi.totalBookings,
      icon: CalendarCheck2,
      to: '/admin/bookings',
      subtitle: 'All event reservations',
      momChange: kpi.bookingsMoMChange,
      accent: 'gold' as const,
    },
    {
      title: 'Pending Bookings',
      value: kpi.pendingBookings,
      icon: Clock,
      to: '/admin/bookings?status=Pending',
      subtitle: 'Requires consultation',
      accent: 'amber' as const,
    },
    {
      title: 'Confirmed Bookings',
      value: kpi.confirmedBookings,
      icon: UserCheck,
      to: '/admin/bookings?status=Confirmed',
      subtitle: 'Dates locked on calendar',
      accent: 'emerald' as const,
    },
    {
      title: 'Completed Bookings',
      value: kpi.completedBookings,
      icon: CheckCircle2,
      to: '/admin/bookings?status=Completed',
      subtitle: 'Delivered celebrations',
      accent: 'slate' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <SeoHelmet
        title={`Admin Dashboard | ${STUDIO_CONFIG.name}`}
        description="Kalaakriti Studios CRM overview, KPI analytics, bookings, and contact management."
        noIndex
      />

      {/* Welcome Header & Quick Actions */}
      <section className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_14px_rgba(23,22,21,0.03)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57252F]">
            Namaste, {user?.firstName || 'Administrator'}
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#171615] mt-0.5">
            {STUDIO_CONFIG.name} Operations Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#5C554E] mt-1">
            Live snapshot of Madhya Pradesh inquiries, booking pipelines, and upcoming event dates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => refresh(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleAddDemoContact}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#C5A46D]/60 bg-[#F7F2E9] px-3.5 py-2 text-xs font-medium text-[#57252F] hover:bg-[#E8DCCB] transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Demo Contact</span>
          </button>

          <button
            type="button"
            onClick={handleAddDemoBooking}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-4 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
            <span>Add Demo Booking</span>
          </button>
        </div>
      </section>

      {/* 6 KPI Stat Cards */}
      <section aria-label="Key studio metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </section>

      {/* 30-Day Booking Trends & Inquiry Volume Showcase */}
      <BookingInquiryTrendsChart
        data={dailyTrends30d}
        summary={trends30dSummary}
        loading={loading}
        onAddDemoBooking={handleAddDemoBooking}
        onAddDemoContact={handleAddDemoContact}
      />

      {/* Analytics Charts Grid (4 Recharts Visualizations) */}
      <section aria-label="Studio analytics charts" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Monthly Booking Overview */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-[#171615]">
                Monthly Booking Overview
              </h3>
              <p className="text-xs text-[#5C554E]">Last 6 months of submitted bookings</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-medium text-[#57252F] hover:underline inline-flex items-center gap-1"
            >
              <span>All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyBookings} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#57252F" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#57252F" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCCB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5C554E' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C554E' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#C5A46D',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Bookings"
                  stroke="#57252F"
                  strokeWidth={2.5}
                  fill="url(#bookingFill)"
                  activeDot={{ r: 5, fill: '#C5A46D', stroke: '#57252F', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Monthly Contact Submissions */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-[#171615]">
                Monthly Contact Submissions
              </h3>
              <p className="text-xs text-[#5C554E]">Last 6 months of client inquiries</p>
            </div>
            <Link
              to="/admin/contacts"
              className="text-xs font-medium text-[#57252F] hover:underline inline-flex items-center gap-1"
            >
              <span>All Contacts</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyContacts} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DCCB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5C554E' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5C554E' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#F7F2E9' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#C5A46D',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" name="Contacts" fill="#C5A46D" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Booking Status Distribution */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="mb-4">
            <h3 className="font-editorial text-xl font-semibold text-[#171615]">
              Booking Status Distribution
            </h3>
            <p className="text-xs text-[#5C554E]">Current pipeline stage breakdown</p>
          </div>
          {bookingStatusDistribution.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-xs text-[#5C554E]">
              No bookings available to plot yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={3}
                    >
                      {bookingStatusDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#C5A46D',
                        borderRadius: 10,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="sm:col-span-6 space-y-2">
                {bookingStatusDistribution.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-2 text-xs py-1 border-b border-[#171615]/6 last:border-0"
                  >
                    <span className="flex items-center gap-2 text-[#171615] font-medium truncate">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.fill }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-semibold text-[#57252F] tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Event Category Distribution */}
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="mb-4">
            <h3 className="font-editorial text-xl font-semibold text-[#171615]">
              Event Category Distribution
            </h3>
            <p className="text-xs text-[#5C554E]">Most requested photography &amp; film categories</p>
          </div>
          {eventCategoryDistribution.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-xs text-[#5C554E]">
              No booking categories recorded yet.
            </div>
          ) : (
            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventCategoryDistribution}
                  layout="vertical"
                  margin={{ top: 4, right: 18, left: 10, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCCB" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#5C554E' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={108}
                    tick={{ fontSize: 11, fill: '#171615' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#F7F2E9' }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#C5A46D',
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" name="Bookings" radius={[0, 6, 6, 0]} barSize={20}>
                    {eventCategoryDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* Recent Bookings & Recent Contacts */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Recent Bookings */}
        <div className="xl:col-span-7 rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 shadow-[0_2px_12px_rgba(23,22,21,0.03)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#171615]/8 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-[#171615]">
                Recent Bookings
              </h3>
              <p className="text-xs text-[#5C554E]">Latest 5 event reservation requests</p>
            </div>
            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#57252F] hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F2E9]/70 text-[#5C554E] border-b border-[#171615]/8">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Reference / Event</th>
                  <th className="px-4 py-2.5 font-semibold">Client</th>
                  <th className="px-4 py-2.5 font-semibold">Event Date</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171615]/6">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#5C554E]">
                      No bookings recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#F7F2E9]/45 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#171615]">{booking.eventName}</div>
                        <div className="font-mono text-[11px] text-[#57252F] tabular-nums">
                          {booking.referenceId}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#171615]">{booking.fullName}</div>
                        <div className="text-[11px] text-[#5C554E]">{booking.city}</div>
                      </td>
                      <td className="px-4 py-3 tabular-nums text-[#171615] whitespace-nowrap">
                        {safeFormatDate(booking.eventDate)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={booking.status} compact />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setViewingBooking(booking)}
                          className="inline-flex items-center gap-1 rounded-md border border-[#171615]/12 px-2.5 py-1 text-[11px] font-medium text-[#57252F] hover:bg-[#57252F] hover:text-[#F7F2E9] transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" aria-hidden="true" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="xl:col-span-5 rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 shadow-[0_2px_12px_rgba(23,22,21,0.03)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#171615]/8 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-[#171615]">
                Recent Contacts
              </h3>
              <p className="text-xs text-[#5C554E]">Newest incoming studio messages</p>
            </div>
            <Link
              to="/admin/contacts"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#57252F] hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-[#171615]/8">
            {recentContacts.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-[#5C554E]">
                No contact inquiries yet.
              </div>
            ) : (
              recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="px-5 py-3.5 flex items-start justify-between gap-3 hover:bg-[#F7F2E9]/45 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-[#171615] truncate">
                        {contact.fullName}
                      </span>
                      <StatusBadge status={contact.status} compact />
                    </div>
                    <div className="text-xs text-[#5C554E] truncate mt-0.5">
                      {contact.eventType} · {contact.city}
                    </div>
                    <div className="text-[11px] text-[#5C554E]/80 tabular-nums mt-0.5">
                      {contact.contactId} · {safeFormatDate(contact.submittedAt)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewingContact(contact)}
                    className="shrink-0 inline-flex items-center gap-1 rounded-md border border-[#171615]/12 px-2.5 py-1.5 text-[11px] font-medium text-[#57252F] hover:bg-[#57252F] hover:text-[#F7F2E9] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3" aria-hidden="true" />
                    <span>View</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Upcoming Events */}
        <div className="lg:col-span-6 rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-[#171615]">
                Upcoming Events Schedule
              </h3>
              <p className="text-xs text-[#5C554E]">Next active celebrations on the studio calendar</p>
            </div>
            <Calendar className="w-5 h-5 text-[#C5A46D]" aria-hidden="true" />
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5C554E]">
              No upcoming events scheduled yet.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setViewingBooking(ev)}
                  className="w-full text-left flex items-center justify-between gap-4 rounded-xl border border-[#171615]/8 bg-[#F7F2E9]/55 hover:border-[#C5A46D] hover:bg-[#F7F2E9] p-3.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-[#57252F] text-[#F7F2E9] tabular-nums">
                      <span className="text-[10px] uppercase tracking-wider text-[#C5A46D] leading-none">
                        {safeFormatDate(ev.eventDate, 'MMM')}
                      </span>
                      <span className="text-base font-bold leading-tight">
                        {safeFormatDate(ev.eventDate, 'dd')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#171615] truncate">
                        {ev.eventName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#5C554E] truncate mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C5A46D] shrink-0" aria-hidden="true" />
                        <span className="truncate">
                          {ev.eventLocation}, {ev.city}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ev.status} compact />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-6 rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-editorial text-xl font-semibold text-[#171615]">
                Recent Studio Activity
              </h3>
              <p className="text-xs text-[#5C554E]">Real-time log of inquiries, updates, and bookings</p>
            </div>
            <Sparkles className="w-5 h-5 text-[#C5A46D]" aria-hidden="true" />
          </div>

          {recentActivity.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#5C554E]">
              Activity will appear here as you manage contacts and bookings.
            </div>
          ) : (
            <ol className="space-y-3">
              {recentActivity.slice(0, 6).map((item) => {
                let ago = '';
                try {
                  ago = formatDistanceToNow(parseISO(item.timestamp), { addSuffix: true });
                } catch {
                  ago = '';
                }
                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 pb-3 border-b border-[#171615]/6 last:border-0 last:pb-0"
                  >
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-[#57252F] ring-4 ring-[#C5A46D]/25 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#171615]">{item.title}</span>
                        {ago && <span className="text-[10px] text-[#5C554E] shrink-0">{ago}</span>}
                      </div>
                      <p className="text-xs text-[#5C554E] mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {/* Direct CRUD Dialogs */}
      <ContactViewDialog
        contact={viewingContact}
        open={Boolean(viewingContact)}
        onClose={() => setViewingContact(null)}
        onEdit={(c) => {
          setViewingContact(null);
          setEditingContact(c);
        }}
        onDelete={(c) => setDeletingContact(c)}
        onStatusChange={handleContactStatus}
      />

      <ContactEditDialog
        contact={editingContact}
        open={Boolean(editingContact)}
        onClose={() => setEditingContact(null)}
        onSave={handleSaveContact}
      />

      <ConfirmDialog
        open={Boolean(deletingContact)}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleConfirmDeleteContact}
        title="Move Contact to Trash?"
        description="This contact inquiry will be moved to Recoverable Trash in Contacts Management."
        entityLabel={
          deletingContact
            ? `${deletingContact.contactId} · ${deletingContact.fullName} (${deletingContact.email})`
            : undefined
        }
        confirmText="Move to Trash"
        variant="danger"
      />

      <BookingViewDialog
        booking={viewingBooking}
        open={Boolean(viewingBooking)}
        onClose={() => setViewingBooking(null)}
        onEdit={(b) => {
          setViewingBooking(null);
          setEditingBooking(b);
        }}
        onDelete={(b) => setDeletingBooking(b)}
        onStatusChange={handleBookingStatus}
      />

      <BookingEditDialog
        booking={editingBooking}
        open={Boolean(editingBooking)}
        onClose={() => setEditingBooking(null)}
        onSave={handleSaveBooking}
      />

      <ConfirmDialog
        open={Boolean(deletingBooking)}
        onClose={() => setDeletingBooking(null)}
        onConfirm={handleConfirmDeleteBooking}
        title="Move Booking to Trash?"
        description="This booking record will be moved to Recoverable Trash in Bookings Management."
        entityLabel={
          deletingBooking
            ? `${deletingBooking.referenceId} · ${deletingBooking.eventName} (${deletingBooking.fullName})`
            : undefined
        }
        confirmText="Move to Trash"
        variant="danger"
      />
    </div>
  );
}
