import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  ArrowDownUp,
  Download,
  Edit3,
  Eye,
  Inbox,
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
import { ContactViewDialog } from '../../components/admin/ContactViewDialog';
import { ContactEditDialog } from '../../components/admin/ContactEditDialog';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { useContacts } from '../../hooks/admin/useContacts';
import { useAdminUIStore } from '../../store/adminUI.store';
import { exportRecordsToCsv } from '../../services/admin/storage.util';
import {
  CONTACT_STATUSES,
  type ContactRecord,
  type ContactStatus,
  type UpdateContactInput,
} from '../../types/contact.types';
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

export default function AdminContactsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const globalSearch = useAdminUIStore((s) => s.globalSearch);

  const {
    contacts,
    trashedContacts,
    loading,
    refresh,
    updateContact,
    updateStatus,
    deleteContact,
    restoreContact,
    permanentDeleteContact,
    addDemoContact,
  } = useContacts();

  const [viewMode, setViewMode] = useState<'active' | 'trash'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'All');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  const [viewingContact, setViewingContact] = useState<ContactRecord | null>(null);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  const [deletingContact, setDeletingContact] = useState<ContactRecord | null>(null);
  const [permanentDeletingContact, setPermanentDeletingContact] = useState<ContactRecord | null>(null);

  useEffect(() => {
    const paramStatus = searchParams.get('status');
    if (paramStatus && CONTACT_STATUSES.includes(paramStatus as ContactStatus)) {
      setStatusFilter(paramStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    if (globalSearch) {
      setSearchQuery(globalSearch);
    }
  }, [globalSearch]);

  const sourceList = viewMode === 'active' ? contacts : trashedContacts;

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    for (const c of contacts) {
      if (c.city) set.add(c.city);
    }
    return Array.from(set).sort();
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sourceList
      .filter((item) => {
        if (q) {
          const hay = [
            item.contactId,
            item.fullName,
            item.email,
            item.mobile,
            item.subject,
            item.city,
          ]
            .join(' ')
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (statusFilter !== 'All' && item.status !== statusFilter) return false;
        if (eventTypeFilter !== 'All' && item.eventType !== eventTypeFilter) return false;
        if (cityFilter !== 'All' && item.city.toLowerCase() !== cityFilter.toLowerCase()) {
          return false;
        }
        if (dateFrom) {
          const itemDay = item.submittedAt.slice(0, 10);
          if (itemDay < dateFrom) return false;
        }
        if (dateTo) {
          const itemDay = item.submittedAt.slice(0, 10);
          if (itemDay > dateTo) return false;
        }
        return true;
      })
      .sort((a, b) =>
        sortOrder === 'latest'
          ? b.submittedAt.localeCompare(a.submittedAt)
          : a.submittedAt.localeCompare(b.submittedAt)
      );
  }, [sourceList, searchQuery, statusFilter, eventTypeFilter, cityFilter, dateFrom, dateTo, sortOrder]);

  useEffect(() => {
    setPage(1);
  }, [viewMode, searchQuery, statusFilter, eventTypeFilter, cityFilter, dateFrom, dateTo, sortOrder, perPage]);

  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / perPage));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * perPage;
  const paginated = filteredContacts.slice(startIdx, startIdx + perPage);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    statusFilter !== 'All' ||
    eventTypeFilter !== 'All' ||
    cityFilter !== 'All' ||
    Boolean(dateFrom) ||
    Boolean(dateTo);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setEventTypeFilter('All');
    setCityFilter('All');
    setDateFrom('');
    setDateTo('');
    setSortOrder('latest');
    if (searchParams.has('status')) {
      setSearchParams({});
    }
  };

  const handleExportCsv = () => {
    if (filteredContacts.length === 0) {
      toast.error('No matching contact records to export.');
      return;
    }
    exportRecordsToCsv(
      `kalaakriti-contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      [
        'Contact ID',
        'Full Name',
        'Email',
        'Mobile',
        'Subject',
        'Event Type',
        'City',
        'Tentative Event Date',
        'Status',
        'Submission Date',
        'Message',
      ],
      filteredContacts.map((c) => [
        c.contactId,
        c.fullName,
        c.email,
        c.mobile,
        c.subject,
        c.eventType,
        c.city,
        c.eventDate || '',
        c.status,
        formatShortDate(c.submittedAt),
        c.message,
      ])
    );
    toast.success(`Exported ${filteredContacts.length} contact records to CSV.`);
  };

  const handleSaveEdit = async (id: string, input: UpdateContactInput) => {
    try {
      const updated = await updateContact(id, input);
      toast.success(`Saved updates for ${updated.contactId}.`);
      if (viewingContact?.id === id) setViewingContact(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to save contact updates.');
    }
  };

  const handleStatusChange = async (id: string, status: ContactStatus) => {
    try {
      const updated = await updateStatus(id, status);
      toast.success(`Status changed to "${status}".`);
      if (viewingContact?.id === id) setViewingContact(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update status.');
    }
  };

  const handleConfirmSoftDelete = async () => {
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

  const handleRestore = async (contact: ContactRecord) => {
    try {
      await restoreContact(contact.id);
      toast.success(`Restored ${contact.contactId} to active contacts.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to restore contact.');
    }
  };

  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeletingContact) return;
    try {
      await permanentDeleteContact(permanentDeletingContact.id);
      toast.success(`Permanently deleted ${permanentDeletingContact.contactId}.`);
      setPermanentDeletingContact(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to permanently delete contact.');
    }
  };

  const selectClass =
    'rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3 py-2 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none';

  return (
    <div className="space-y-5">
      <SeoHelmet
        title={`Contacts Management | ${STUDIO_CONFIG.name} Admin`}
        description="Manage incoming studio inquiries, filter by city or status, and update client records."
        noIndex
      />

      {/* Top Action Bar & Active/Trash Tabs */}
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
            Active Inquiries <span className="ml-1 tabular-nums opacity-85">({contacts.length})</span>
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
            Trash <span className="ml-1 tabular-nums opacity-85">({trashedContacts.length})</span>
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
                const created = await addDemoContact();
                toast.success(`Added sample contact ${created.contactId}.`);
                setViewMode('active');
              } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Unable to create contact.');
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-3.5 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
            <span>Add Sample Contact</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-4 space-y-3 shadow-[0_2px_10px_rgba(23,22,21,0.03)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search
              className="w-4 h-4 text-[#5C554E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, mobile, or ID..."
              aria-label="Search contacts"
              className="w-full rounded-lg bg-[#F7F2E9]/50 border border-[#171615]/15 pl-9 pr-3 py-2 text-xs text-[#171615] placeholder:text-[#5C554E]/70 focus:bg-[#FFFFFF] focus:border-[#57252F] focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`md:col-span-2 ${selectClass}`}
          >
            <option value="All">All Statuses</option>
            {CONTACT_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Event Type Filter */}
          <select
            aria-label="Filter by event type"
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className={`md:col-span-2 ${selectClass}`}
          >
            <option value="All">All Event Types</option>
            {PHOTOGRAPHY_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
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

          {/* Sort Order */}
          <button
            type="button"
            onClick={() => setSortOrder((s) => (s === 'latest' ? 'oldest' : 'latest'))}
            className="md:col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
          >
            <ArrowDownUp className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
            <span>{sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}</span>
          </button>
        </div>

        {/* Date Range + Clear Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#171615]/8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#5C554E] font-medium">Submitted Range:</span>
            <input
              type="date"
              aria-label="Submitted from date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-md border border-[#171615]/15 px-2.5 py-1 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none"
            />
            <span className="text-[#5C554E]">to</span>
            <input
              type="date"
              aria-label="Submitted to date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-md border border-[#171615]/15 px-2.5 py-1 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#5C554E] tabular-nums">
              <strong className="text-[#171615]">{filteredContacts.length}</strong> matching record
              {filteredContacts.length === 1 ? '' : 's'}
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

      {/* Loading Skeleton */}
      {loading ? (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-10 rounded-lg bg-[#E8DCCB]/45 animate-pulse" />
          ))}
        </div>
      ) : filteredContacts.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 px-6 py-16 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2E9] text-[#57252F]">
            <Inbox className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="font-editorial text-2xl font-medium text-[#171615]">
            {viewMode === 'trash' ? 'Trash Is Empty' : 'No Matching Contacts Found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#5C554E] max-w-md mx-auto">
            {viewMode === 'trash'
              ? 'Deleted contact records appear here so you can restore them anytime.'
              : 'Try adjusting your search or filter criteria, or add a sample demonstration inquiry.'}
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
          {/* Desktop Data Table (11 Required Columns) */}
          <div className="hidden md:block rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 shadow-[0_2px_12px_rgba(23,22,21,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F2E9]/85 text-[#5C554E] border-b border-[#171615]/10 whitespace-nowrap">
                  <tr>
                    <th className="px-3.5 py-3 font-semibold">S.No</th>
                    <th className="px-3.5 py-3 font-semibold">Contact ID</th>
                    <th className="px-3.5 py-3 font-semibold">Full Name</th>
                    <th className="px-3.5 py-3 font-semibold">Email</th>
                    <th className="px-3.5 py-3 font-semibold">Mobile</th>
                    <th className="px-3.5 py-3 font-semibold">Subject</th>
                    <th className="px-3.5 py-3 font-semibold">Event Type</th>
                    <th className="px-3.5 py-3 font-semibold">City</th>
                    <th className="px-3.5 py-3 font-semibold">Submitted</th>
                    <th className="px-3.5 py-3 font-semibold">Status</th>
                    <th className="px-3.5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171615]/8">
                  {paginated.map((contact, idx) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-[#F7F2E9]/45 transition-colors align-middle"
                    >
                      <td className="px-3.5 py-3 tabular-nums text-[#5C554E]">
                        {startIdx + idx + 1}
                      </td>
                      <td className="px-3.5 py-3 font-mono text-[11px] font-semibold text-[#57252F] tabular-nums whitespace-nowrap">
                        {contact.contactId}
                      </td>
                      <td className="px-3.5 py-3 font-semibold text-[#171615] whitespace-nowrap">
                        {contact.fullName}
                      </td>
                      <td className="px-3.5 py-3 text-[#5C554E] max-w-[180px] truncate" title={contact.email}>
                        {contact.email}
                      </td>
                      <td className="px-3.5 py-3 tabular-nums text-[#171615] whitespace-nowrap">
                        {contact.mobile}
                      </td>
                      <td className="px-3.5 py-3 text-[#171615] max-w-[190px] truncate" title={contact.subject}>
                        {contact.subject}
                      </td>
                      <td className="px-3.5 py-3 text-[#5C554E] whitespace-nowrap">
                        {contact.eventType}
                      </td>
                      <td className="px-3.5 py-3 text-[#171615] whitespace-nowrap">
                        {contact.city}
                      </td>
                      <td className="px-3.5 py-3 tabular-nums text-[#5C554E] whitespace-nowrap">
                        {formatShortDate(contact.submittedAt)}
                      </td>
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <StatusBadge status={contact.status} compact />
                      </td>
                      <td className="px-3.5 py-3 text-right whitespace-nowrap">
                        {viewMode === 'active' ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setViewingContact(contact)}
                              title="View contact details"
                              aria-label={`View ${contact.fullName}`}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#171615] hover:bg-[#57252F] hover:text-[#F7F2E9] hover:border-[#57252F] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingContact(contact)}
                              title="Edit contact"
                              aria-label={`Edit ${contact.fullName}`}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#57252F] hover:bg-[#F7F2E9] hover:border-[#C5A46D] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingContact(contact)}
                              title="Move to trash"
                              aria-label={`Delete ${contact.fullName}`}
                              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#FECACA] text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRestore(contact)}
                              className="inline-flex items-center gap-1 rounded-md border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-1 text-[11px] font-medium text-[#15803D] hover:bg-[#DCFCE7] cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" aria-hidden="true" />
                              <span>Restore</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPermanentDeletingContact(contact)}
                              className="inline-flex items-center gap-1 rounded-md border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1 text-[11px] font-medium text-[#B91C1C] hover:bg-[#FEE2E2] cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" aria-hidden="true" />
                              <span>Delete Forever</span>
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

          {/* Mobile Responsive Card View */}
          <div className="md:hidden space-y-3">
            {paginated.map((contact) => (
              <div
                key={contact.id}
                className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-4 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-mono text-[11px] font-semibold text-[#57252F] tabular-nums">
                      {contact.contactId}
                    </div>
                    <h3 className="font-semibold text-[#171615] text-sm mt-0.5">
                      {contact.fullName}
                    </h3>
                  </div>
                  <StatusBadge status={contact.status} compact />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#5C554E]">
                  <div className="truncate">{contact.email}</div>
                  <div className="tabular-nums text-right">{contact.mobile}</div>
                  <div>{contact.eventType}</div>
                  <div className="text-right">
                    {contact.city} · {formatShortDate(contact.submittedAt)}
                  </div>
                </div>

                <div className="text-xs text-[#171615] font-medium truncate border-t border-[#171615]/8 pt-2">
                  {contact.subject}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {viewMode === 'active' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setViewingContact(contact)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#171615]/15 px-3 py-1.5 text-xs font-medium text-[#171615]"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingContact(contact)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#57252F] px-3 py-1.5 text-xs font-medium text-[#F7F2E9]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingContact(contact)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1.5 text-xs font-medium text-[#B91C1C]"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRestore(contact)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1.5 text-xs font-medium text-[#15803D]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Restore</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPermanentDeletingContact(contact)}
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

          {/* Pagination Footer */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-[#5C554E] tabular-nums">
              <span>
                Showing{' '}
                <strong className="text-[#171615]">
                  {startIdx + 1}–{Math.min(startIdx + perPage, filteredContacts.length)}
                </strong>{' '}
                of <strong className="text-[#171615]">{filteredContacts.length}</strong> contacts
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
      <ContactViewDialog
        contact={viewingContact}
        open={Boolean(viewingContact)}
        onClose={() => setViewingContact(null)}
        onEdit={(c) => {
          setViewingContact(null);
          setEditingContact(c);
        }}
        onDelete={(c) => setDeletingContact(c)}
        onStatusChange={handleStatusChange}
      />

      <ContactEditDialog
        contact={editingContact}
        open={Boolean(editingContact)}
        onClose={() => setEditingContact(null)}
        onSave={handleSaveEdit}
      />

      <ConfirmDialog
        open={Boolean(deletingContact)}
        onClose={() => setDeletingContact(null)}
        onConfirm={handleConfirmSoftDelete}
        title="Move Contact to Trash?"
        description="This inquiry will be removed from the active list and placed in Recoverable Trash."
        entityLabel={
          deletingContact
            ? `${deletingContact.contactId} · ${deletingContact.fullName} (${deletingContact.email})`
            : undefined
        }
        confirmText="Move to Trash"
        variant="danger"
      />

      <ConfirmDialog
        open={Boolean(permanentDeletingContact)}
        onClose={() => setPermanentDeletingContact(null)}
        onConfirm={handleConfirmPermanentDelete}
        title="Permanently Delete Contact?"
        description="This action cannot be undone. The contact record will be permanently deleted from MongoDB."
        entityLabel={
          permanentDeletingContact
            ? `${permanentDeletingContact.contactId} · ${permanentDeletingContact.fullName}`
            : undefined
        }
        confirmText="Delete Permanently"
        variant="danger"
      />
    </div>
  );
}
