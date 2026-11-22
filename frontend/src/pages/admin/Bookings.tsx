import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  ArrowDownUp,
  CalendarX2,
  Download,
  Edit3,
  Eye,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { BookingViewDialog } from '../../components/admin/BookingViewDialog';
import { BookingEditDialog } from '../../components/admin/BookingEditDialog';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useBookings } from '../../hooks/admin/useBookings';
import { useAdminUIStore } from '../../store/adminUI.store';
import { exportRecordsToCsv } from '../../services/admin/storage.util';
import {
  BOOKING_STATUSES,
  type BookingRecord,
  type BookingStatus,
  type UpdateBookingInput,
} from '../../types/booking.types';
import { PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { STUDIO_CONFIG } from '../../data/studio';

function formatShortDate(iso?: string): string {
  if (!iso) return '—';
  try {
    const parsed = parseISO(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return format(parsed, 'dd MMM yyyy');
  } catch {
    return iso;
  }
}

export default function AdminBookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const globalSearch = useAdminUIStore((s) => s.globalSearch);

  const {
    bookings,
    trashedBookings,
    loading,
    refresh,
    updateBooking,
    updateStatus,
    deleteBooking,
    restoreBooking,
    permanentDeleteBooking,
    addDemoBooking,
  } = useBookings();

  const [viewMode, setViewMode] = useState<'active' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [eventDateFilter, setEventDateFilter] = useState<string>('');
  const [submissionDateFilter, setSubmissionDateFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const [viewingBooking, setViewingBooking] = useState<BookingRecord | null>(null);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<BookingRecord | null>(null);
  const [permanentDeletingBooking, setPermanentDeletingBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    const paramStatus = searchParams.get('status');
    if (paramStatus && BOOKING_STATUSES.includes(paramStatus as BookingStatus)) {
      setStatusFilter(paramStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    if (globalSearch) {
      setSearchQuery(globalSearch);
    }
  }, [globalSearch]);

  const sourceList = viewMode === 'active' ? bookings : trashedBookings;

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    for (const b of bookings) {
      if (b.city) set.add(b.city);
    }
    return Array.from(set).sort();
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sourceList
      .filter((item) => {
        if (q) {
          const hay = [
            item.referenceId,
            item.fullName,
            item.email,
            item.mobile,
            item.eventName,
            item.eventLocation,
            item.city,
          ]
            .join(' ')
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (categoryFilter !== 'All' && item.eventCategory !== categoryFilter) return false;
        if (statusFilter !== 'All' && item.status !== statusFilter) return false;
        if (cityFilter !== 'All' && item.city.toLowerCase() !== cityFilter.toLowerCase()) {
          return false;
        }
        if (eventDateFilter && item.eventDate !== eventDateFilter) return false;
        if (submissionDateFilter && item.createdAt.slice(0, 10) !== submissionDateFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) =>
        sortOrder === 'latest'
          ? b.createdAt.localeCompare(a.createdAt)
          : a.createdAt.localeCompare(b.createdAt)
      );
  }, [
    sourceList,
    searchQuery,
    categoryFilter,
    statusFilter,
    cityFilter,
    eventDateFilter,
    submissionDateFilter,
    sortOrder,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    viewMode,
    searchQuery,
    categoryFilter,
    statusFilter,
    cityFilter,
    eventDateFilter,
    submissionDateFilter,
    sortOrder,
    perPage,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / perPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * perPage;
  const paginated = filteredBookings.slice(startIdx, startIdx + perPage);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    categoryFilter !== 'All' ||
    statusFilter !== 'All' ||
    cityFilter !== 'All' ||
    Boolean(eventDateFilter) ||
    Boolean(submissionDateFilter);

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setCityFilter('All');
    setEventDateFilter('');
    setSubmissionDateFilter('');
    setSortOrder('latest');
    if (searchParams.has('status')) {
      setSearchParams({});
    }
  };

  const handleExportCsv = () => {
    if (filteredBookings.length === 0) {
      toast.error('No matching booking records to export.');
      return;
    }
    exportRecordsToCsv(
      `kalaakriti-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      [
        'Booking Reference',
        'Customer Name',
        'Email',
        'Mobile',
        'WhatsApp',
        'Event Type',
        'Event Title',
        'Event Date',
        'Duration',
        'Event Location',
        'City',
        'Guests',
        'Coverage Format',
        'Selected Services',
        'Budget Range',
        'Status',
        'Submission Date',
      ],
      filteredBookings.map((b) => [
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
        b.addOns.join(' | '),
        b.budgetRange,
        b.status,
        formatShortDate(b.createdAt),
      ])
    );
    toast.success(`Exported ${filteredBookings.length} booking records to CSV.`);
  };

  const handleSaveEdit = async (id: string, input: UpdateBookingInput) => {
    try {
      const updated = await updateBooking(id, input);
      toast.success(`Saved updates for ${updated.referenceId}.`);
      if (viewingBooking?.id === id) setViewingBooking(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to save booking updates.');
    }
  };

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      const updated = await updateStatus(id, status);
      toast.success(`Booking status updated to "${status}".`);
      if (viewingBooking?.id === id) setViewingBooking(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update booking status.');
    }
  };

  const handleConfirmSoftDelete = async () => {
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

  const handleRestore = async (booking: BookingRecord) => {
    try {
      await restoreBooking(booking.id);
      toast.success(`Restored ${booking.referenceId} to active bookings.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to restore booking.');
    }
  };

  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeletingBooking) return;
    try {
      await permanentDeleteBooking(permanentDeletingBooking.id);
      toast.success(`Permanently deleted ${permanentDeletingBooking.referenceId}.`);
      setPermanentDeletingBooking(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to permanently delete booking.');
    }
  };

  const selectClass =
    'rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3 py-2 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none';

  return (
    <div className="space-y-5">
      <SeoHelmet
        title={`Bookings Management | ${STUDIO_CONFIG.name} Admin`}
        description="Manage event photography bookings, coverage deliverables, statuses, and celebration schedules."
        noIndex
      />

      {/* Top Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex rounded-xl bg-[#E8DCCB]/70 p-1 border border-[#171615]/10 self-start">
          <button
            type="button"
            onClick={() => setViewMode('active')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'active'
                ? 'bg-[#57252F] text-[#F7F2E9] shadow-sm'
                : 'text-[#5C554E] hover:text-[#171615]'
            }`}
          >
            Active Bookings <span className="ml-1 tabular-nums opacity-85">({bookings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('trash')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'trash'
                ? 'bg-[#57252F] text-[#F7F2E9] shadow-sm'
                : 'text-[#5C554E] hover:text-[#171615]'
            }`}
          >
            Trash <span className="ml-1 tabular-nums opacity-85">({trashedBookings.length})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refresh(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const created = await addDemoBooking();
                toast.success(`Added sample booking ${created.referenceId}.`);
                setViewMode('active');
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Unable to create booking.');
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-3.5 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
            <span>Add Sample Booking</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-4 space-y-3 shadow-[0_2px_10px_rgba(23,22,21,0.03)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search
              className="w-4 h-4 text-[#5C554E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref, customer, email, mobile, venue..."
              aria-label="Search bookings"
              className="w-full rounded-lg bg-[#F7F2E9]/50 border border-[#171615]/15 pl-9 pr-3 py-2 text-xs text-[#171615] placeholder:text-[#5C554E]/70 focus:bg-[#FFFFFF] focus:border-[#57252F] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            aria-label="Filter by event category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`md:col-span-2 ${selectClass}`}
          >
            <option value="All">All Categories</option>
            {PHOTOGRAPHY_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            aria-label="Filter by booking status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`md:col-span-2 ${selectClass}`}
          >
            <option value="All">All Statuses</option>
            {BOOKING_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* City Filter */}
          <select
            aria-label="Filter by city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className={`md:col-span-2 ${selectClass}`}
          >
            <option value="All">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Sort */}
          <button
            type="button"
            onClick={() => setSortOrder((s) => (s === 'latest' ? 'oldest' : 'latest'))}
            className="md:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
          >
            <ArrowDownUp className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
            <span>{sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}</span>
          </button>
        </div>

        {/* Date Filters + Results Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#171615]/8">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 text-[#5C554E]">
              <span className="font-medium">Event Date:</span>
              <input
                type="date"
                value={eventDateFilter}
                onChange={(e) => setEventDateFilter(e.target.value)}
                className="rounded-md border border-[#171615]/15 px-2.5 py-1 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-[#5C554E]">
              <span className="font-medium">Submitted On:</span>
              <input
                type="date"
                value={submissionDateFilter}
                onChange={(e) => setSubmissionDateFilter(e.target.value)}
                className="rounded-md border border-[#171615]/15 px-2.5 py-1 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none"
              />
            </label>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#5C554E] tabular-nums">
              <strong className="text-[#171615]">{filteredBookings.length}</strong> matching booking
              {filteredBookings.length === 1 ? '' : 's'}
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#57252F] hover:underline cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading / Empty / Data Table */}
      {loading ? (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-10 rounded-lg bg-[#E8DCCB]/45 animate-pulse" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 px-6 py-16 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2E9] text-[#57252F]">
            <CalendarX2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="font-editorial text-2xl font-medium text-[#171615]">
            {viewMode === 'trash' ? 'Booking Trash Is Empty' : 'No Matching Bookings Found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#5C554E] max-w-md mx-auto">
            {viewMode === 'trash'
              ? 'Soft-deleted bookings appear here and can be restored anytime.'
              : 'Refine your filters or create a sample demonstration booking to inspect the workflow.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-4 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Data Table (All 15 Required Columns) */}
          <div className="hidden lg:block rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 shadow-[0_2px_12px_rgba(23,22,21,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F2E9]/85 text-[#5C554E] border-b border-[#171615]/10 whitespace-nowrap">
                  <tr>
                    <th className="px-3 py-3 font-semibold">S.No</th>
                    <th className="px-3 py-3 font-semibold">Booking Ref</th>
                    <th className="px-3 py-3 font-semibold">Customer Name</th>
                    <th className="px-3 py-3 font-semibold">Email</th>
                    <th className="px-3 py-3 font-semibold">Mobile</th>
                    <th className="px-3 py-3 font-semibold">Event Type</th>
                    <th className="px-3 py-3 font-semibold">Event Date</th>
                    <th className="px-3 py-3 font-semibold">Event Location</th>
                    <th className="px-3 py-3 font-semibold">City</th>
                    <th className="px-3 py-3 font-semibold">Guests</th>
                    <th className="px-3 py-3 font-semibold">Selected Services</th>
                    <th className="px-3 py-3 font-semibold">Budget</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Submitted</th>
                    <th className="px-3 py-3 font-semibold text-right sticky right-0 bg-[#F7F2E9]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171615]/8">
                  {paginated.map((booking, idx) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-[#F7F2E9]/45 transition-colors align-middle"
                    >
                      <td className="px-3 py-3 tabular-nums text-[#5C554E]">
                        {startIdx + idx + 1}
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] font-semibold text-[#57252F] tabular-nums whitespace-nowrap">
                        {booking.referenceId}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="font-semibold text-[#171615]">{booking.fullName}</div>
                        <div className="text-[10px] text-[#5C554E] max-w-[160px] truncate">
                          {booking.eventName}
                        </div>
                      </td>
                      <td
                        className="px-3 py-3 text-[#5C554E] max-w-[165px] truncate"
                        title={booking.email}
                      >
                        {booking.email}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-[#171615] whitespace-nowrap">
                        {booking.mobile}
                      </td>
                      <td className="px-3 py-3 text-[#171615] whitespace-nowrap">
                        {booking.eventCategory}
                      </td>
                      <td className="px-3 py-3 tabular-nums font-medium text-[#57252F] whitespace-nowrap">
                        {formatShortDate(booking.eventDate)}
                      </td>
                      <td
                        className="px-3 py-3 text-[#5C554E] max-w-[175px] truncate"
                        title={booking.eventLocation}
                      >
                        {booking.eventLocation}
                      </td>
                      <td className="px-3 py-3 text-[#171615] whitespace-nowrap">{booking.city}</td>
                      <td className="px-3 py-3 text-[#5C554E] whitespace-nowrap">
                        {booking.guestCount.split('(')[0].trim()}
                      </td>
                      <td
                        className="px-3 py-3 text-[#171615] max-w-[190px] truncate"
                        title={booking.addOns.join(', ')}
                      >
                        {booking.addOns.length > 0 ? booking.addOns.join(', ') : 'Standard'}
                      </td>
                      <td
                        className="px-3 py-3 text-[#171615] max-w-[160px] truncate whitespace-nowrap"
                        title={booking.budgetRange}
                      >
                        {booking.budgetRange.split('(')[0].trim()}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusBadge status={booking.status} compact />
                      </td>
                      <td className="px-3 py-3 tabular-nums text-[#5C554E] whitespace-nowrap">
                        {formatShortDate(booking.createdAt)}
                      </td>
                      <td className="px-3 py-3 text-right whitespace-nowrap sticky right-0 bg-[#FFFFFF]">
                        {viewMode === 'active' ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setViewingBooking(booking)}
                              title="View booking details"
                              aria-label={`View ${booking.referenceId}`}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#171615] hover:bg-[#57252F] hover:text-[#F7F2E9] hover:border-[#57252F] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingBooking(booking)}
                              title="Edit booking"
                              aria-label={`Edit ${booking.referenceId}`}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#57252F] hover:bg-[#F7F2E9] hover:border-[#C5A46D] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingBooking(booking)}
                              title="Move to trash"
                              aria-label={`Delete ${booking.referenceId}`}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#FECACA] text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRestore(booking)}
                              className="inline-flex items-center gap-1 rounded-md border border-[#BBF7D0] bg-[#F0FDF4] px-2 py-1 text-[11px] font-medium text-[#15803D] hover:bg-[#DCFCE7] cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" aria-hidden="true" />
                              <span>Restore</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPermanentDeletingBooking(booking)}
                              className="inline-flex items-center gap-1 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-2 py-1 text-[11px] font-medium text-[#B91C1C] hover:bg-[#FEE2E2] cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Responsive Cards */}
          <div className="lg:hidden space-y-3">
            {paginated.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-[#57252F] tabular-nums">
                      {booking.referenceId}
                    </div>
                    <h3 className="font-semibold text-[#171615] text-sm mt-0.5">
                      {booking.eventName}
                    </h3>
                    <div className="text-xs text-[#5C554E]">
                      {booking.fullName} · {booking.mobile}
                    </div>
                  </div>
                  <StatusBadge status={booking.status} compact />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#5C554E] border-t border-[#171615]/8 pt-2.5">
                  <div>
                    <span className="text-[10px] block uppercase tracking-wide">Event Date</span>
                    <strong className="text-[#171615] tabular-nums">
                      {formatShortDate(booking.eventDate)}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] block uppercase tracking-wide">Location</span>
                    <strong className="text-[#171615]">{booking.city}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] block uppercase tracking-wide">
                      Category &amp; Budget
                    </span>
                    <span className="text-[#171615]">
                      {booking.eventCategory} · {booking.budgetRange.split('(')[0].trim()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {viewMode === 'active' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setViewingBooking(booking)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#171615]/15 px-3 py-1.5 text-xs font-medium text-[#171615]"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBooking(booking)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#57252F] px-3 py-1.5 text-xs font-medium text-[#F7F2E9]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingBooking(booking)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1.5 text-xs font-medium text-[#B91C1C]"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRestore(booking)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1.5 text-xs font-medium text-[#15803D]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Restore</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPermanentDeletingBooking(booking)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-1.5 text-xs font-medium text-[#B91C1C]"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Delete Forever</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-[#5C554E] tabular-nums">
              <span>
                Showing{' '}
                <strong className="text-[#171615]">
                  {startIdx + 1}–{Math.min(startIdx + perPage, filteredBookings.length)}
                </strong>{' '}
                of <strong className="text-[#171615]">{filteredBookings.length}</strong> bookings
              </span>
              <select
                aria-label="Records per page"
                value={perPage}
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="rounded-md border border-[#171615]/15 bg-[#FFFFFF] px-2 py-1 text-xs text-[#171615]"
              >
                {[5, 10, 25, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-[#171615]/15 px-3 py-1.5 font-medium text-[#171615] hover:bg-[#F7F2E9] disabled:opacity-45 cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2.5 text-[#5C554E] tabular-nums">
                Page <strong className="text-[#171615]">{safePage}</strong> of {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-[#171615]/15 px-3 py-1.5 font-medium text-[#171615] hover:bg-[#F7F2E9] disabled:opacity-45 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <BookingViewDialog
        booking={viewingBooking}
        open={Boolean(viewingBooking)}
        onClose={() => setViewingBooking(null)}
        onEdit={(b) => {
          setViewingBooking(null);
          setEditingBooking(b);
        }}
        onDelete={(b) => setDeletingBooking(b)}
        onStatusChange={handleStatusChange}
      />

      <BookingEditDialog
        booking={editingBooking}
        open={Boolean(editingBooking)}
        onClose={() => setEditingBooking(null)}
        onSave={handleSaveEdit}
      />

      <ConfirmDialog
        open={Boolean(deletingBooking)}
        onClose={() => setDeletingBooking(null)}
        onConfirm={handleConfirmSoftDelete}
        title="Move Booking to Trash?"
        description="This booking record will be moved to Recoverable Trash and can be restored anytime."
        entityLabel={
          deletingBooking
            ? `${deletingBooking.referenceId} · ${deletingBooking.eventName} (${deletingBooking.fullName})`
            : undefined
        }
        confirmText="Move to Trash"
        variant="danger"
      />

      <ConfirmDialog
        open={Boolean(permanentDeletingBooking)}
        onClose={() => setPermanentDeletingBooking(null)}
        onConfirm={handleConfirmPermanentDelete}
        title="Permanently Delete Booking?"
        description="This action cannot be undone. The booking record will be permanently deleted from MongoDB."
        entityLabel={
          permanentDeletingBooking
            ? `${permanentDeletingBooking.referenceId} · ${permanentDeletingBooking.eventName}`
            : undefined
        }
        confirmText="Delete Permanently"
        variant="danger"
      />
    </div>
  );
}
