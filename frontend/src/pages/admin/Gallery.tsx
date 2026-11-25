import { useCallback, useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  AlertCircle,
  Edit3,
  Eye,
  Film,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  List,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { GalleryMediaPreview } from '../../components/gallery/GalleryMediaPreview';
import { GalleryFormDialog } from '../../components/admin/GalleryFormDialog';
import { GalleryViewDialog } from '../../components/admin/GalleryViewDialog';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { galleryAdminService } from '../../services/admin/gallery.service';
import { useAdminUIStore } from '../../store/adminUI.store';
import { getVideoProviderLabel } from '../../utils/mediaUrl';
import { STUDIO_CONFIG } from '../../data/studio';
import type {
  AdminGalleryStats,
  GalleryItem,
  GalleryMutationInput,
  GalleryStatus,
} from '../../types';

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

export default function AdminGalleryPage() {
  const globalSearch = useAdminUIStore((s) => s.globalSearch);

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [stats, setStats] = useState<AdminGalleryStats>({
    total: 0,
    active: 0,
    inactive: 0,
    images: 0,
    videos: 0,
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters, search, sort & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | GalleryStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'displayOrder' | 'latest' | 'oldest' | 'title'>('displayOrder');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (globalSearch) {
      setSearchQuery(globalSearch);
    }
  }, [globalSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 220);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, mediaTypeFilter, statusFilter, categoryFilter, sortBy, limit]);

  const fetchGallery = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      try {
        const res = await galleryAdminService.listAdmin(
          {
            search: debouncedSearch,
            mediaType: mediaTypeFilter,
            status: statusFilter,
            category: categoryFilter,
            sort: sortBy,
            page,
            limit,
          },
          signal
        );
        if (signal?.aborted) return;
        setItems(res.items);
        setStats(res.stats);
        setCategories(res.categories);
        setTotalFiltered(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        if (signal?.aborted) return;
        setError(err instanceof Error ? err.message : 'Unable to load gallery items.');
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [debouncedSearch, mediaTypeFilter, statusFilter, categoryFilter, sortBy, page, limit]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchGallery(controller.signal);
    return () => controller.abort();
  }, [fetchGallery]);

  const openCreateModal = () => {
    setFormMode('create');
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setFormMode('edit');
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleSaveForm = async (values: GalleryMutationInput) => {
    try {
      if (formMode === 'edit' && editingItem) {
        const updated = await galleryAdminService.update(editingItem.id, values);
        toast.success(`Updated "${updated.title}".`);
        if (viewingItem?.id === updated.id) {
          setViewingItem(updated);
        }
      } else {
        const created = await galleryAdminService.create(values);
        toast.success(`Added "${created.title}" to the studio gallery.`);
      }
      setFormOpen(false);
      setEditingItem(null);
      await fetchGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to save gallery item.');
      throw err;
    }
  };

  const handleToggleStatus = async (item: GalleryItem, nextStatus: GalleryStatus) => {
    if (togglingId === item.id) return;
    setTogglingId(item.id);
    try {
      const updated = await galleryAdminService.updateStatus(item.id, nextStatus);
      toast.success(
        nextStatus === 'active'
          ? `"${updated.title}" is now visible in the public gallery.`
          : `"${updated.title}" has been hidden from the public gallery.`
      );
      if (viewingItem?.id === updated.id) {
        setViewingItem(updated);
      }
      await fetchGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem || deletingBusy) return;
    setDeletingBusy(true);
    try {
      const targetTitle = deletingItem.title;
      await galleryAdminService.remove(deletingItem.id);
      toast.success(`Deleted "${targetTitle}" from the gallery.`);
      if (viewingItem?.id === deletingItem.id) {
        setViewingItem(null);
      }
      setDeletingItem(null);
      await fetchGallery();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to delete gallery item.');
    } finally {
      setDeletingBusy(false);
    }
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    mediaTypeFilter !== 'all' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setMediaTypeFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSortBy('displayOrder');
    setPage(1);
  };

  const startIdx = (page - 1) * limit;

  return (
    <div className="space-y-5">
      <SeoHelmet
        title={`Gallery Management | ${STUDIO_CONFIG.name} Admin`}
        description="Manage public portfolio images and videos via URLs, display order, and active/inactive visibility."
        noIndex
      />

      {/* Top Summary Metrics & Primary Action Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#5C554E] tabular-nums">
          <span>
            <strong className="text-[#171615] font-semibold">{stats.total}</strong> total works
          </span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="text-[#15803D] font-medium">{stats.active} active</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span>{stats.inactive} inactive</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span>{stats.images} images</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span>{stats.videos} videos</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Switch listing layout"
            className="inline-flex rounded-lg bg-[#E8DCCB]/70 p-0.5 border border-[#171615]/10"
          >
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table layout"
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#FFFFFF] text-[#171615] shadow-xs'
                  : 'text-[#5C554E] hover:text-[#171615]'
              }`}
            >
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid layout"
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#FFFFFF] text-[#171615] shadow-xs'
                  : 'text-[#5C554E] hover:text-[#171615]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Grid</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => fetchGallery()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-4 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
            <span>Add Gallery Item</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-4 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Search by Title */}
          <div className="lg:col-span-4 relative">
            <Search
              className="w-4 h-4 text-[#5C554E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gallery by title or category..."
              aria-label="Search gallery items by title"
              className="w-full rounded-lg bg-[#F7F2E9]/50 border border-[#171615]/15 pl-9 pr-8 py-2 text-xs text-[#171615] placeholder:text-[#5C554E]/70 focus:bg-[#FFFFFF] focus:border-[#57252F] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5C554E] hover:text-[#171615] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Media Type Filter */}
          <div
            role="group"
            aria-label="Filter by media type"
            className="lg:col-span-3 inline-flex rounded-lg bg-[#F7F2E9] p-0.5 border border-[#171615]/10"
          >
            {(
              [
                { value: 'all', label: 'All' },
                { value: 'image', label: 'Images' },
                { value: 'video', label: 'Videos' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMediaTypeFilter(opt.value)}
                className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  mediaTypeFilter === opt.value
                    ? 'bg-[#57252F] text-[#F7F2E9]'
                    : 'text-[#5C554E] hover:text-[#171615]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div
            role="group"
            aria-label="Filter by status"
            className="lg:col-span-3 inline-flex rounded-lg bg-[#F7F2E9] p-0.5 border border-[#171615]/10"
          >
            {(
              [
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === opt.value
                    ? 'bg-[#171615] text-[#F7F2E9]'
                    : 'text-[#5C554E] hover:text-[#171615]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            aria-label="Sort gallery items"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="lg:col-span-2 rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3 py-2 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none"
          >
            <option value="displayOrder">Display Order</option>
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>

        {/* Category + Result Count Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#171615]/8 text-xs">
          <div className="flex items-center gap-2">
            <label htmlFor="admin-gallery-cat-filter" className="text-[#5C554E] font-medium">
              Category:
            </label>
            <select
              id="admin-gallery-cat-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-md border border-[#171615]/15 bg-[#FFFFFF] px-2.5 py-1 text-xs text-[#171615] focus:border-[#57252F] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#5C554E] tabular-nums">
              <strong className="text-[#171615]">{totalFiltered}</strong> matching{' '}
              {totalFiltered === 1 ? 'item' : 'items'}
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

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#991B1B]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchGallery()}
            className="rounded-lg bg-[#991B1B] px-3 py-1.5 font-medium text-[#FFFFFF] hover:bg-[#7F1D1D] cursor-pointer self-start sm:self-auto"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="h-14 rounded-lg bg-[#E8DCCB]/45 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 px-6 py-16 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2E9] text-[#57252F]">
            <Images className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="font-editorial text-2xl font-medium text-[#171615]">
            {hasActiveFilters ? 'No Matching Gallery Items' : 'Your Gallery Is Empty'}
          </h3>
          <p className="text-xs sm:text-sm text-[#5C554E] max-w-md mx-auto">
            {hasActiveFilters
              ? 'No images or videos match the current search and filter criteria.'
              : 'Add photography URLs or YouTube, Vimeo, and direct video links to publish work directly to the public portfolio.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-4 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-4 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
              <span>Add Gallery Item</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Table View (Desktop when table mode selected) */}
          {viewMode === 'table' && (
            <div className="hidden md:block rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7F2E9]/85 text-[#5C554E] border-b border-[#171615]/10 whitespace-nowrap">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Preview</th>
                      <th className="px-4 py-3 font-semibold">Title</th>
                      <th className="px-4 py-3 font-semibold">Media Type</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Order</th>
                      <th className="px-4 py-3 font-semibold">Created</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171615]/8">
                    {items.map((item) => {
                      const mediaType = item.mediaType || item.type || 'image';
                      const mediaUrl =
                        item.mediaUrl ||
                        (mediaType === 'video' ? item.videoUrl || item.src : item.src) ||
                        '';
                      const status: GalleryStatus = item.status || 'active';
                      const isActive = status === 'active';
                      const nextStatus: GalleryStatus = isActive ? 'inactive' : 'active';

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-[#F7F2E9]/45 transition-colors align-middle"
                        >
                          <td className="px-4 py-2.5 w-24">
                            <button
                              type="button"
                              onClick={() => setViewingItem(item)}
                              aria-label={`Preview ${item.title}`}
                              className="relative block h-12 w-20 overflow-hidden rounded-lg bg-[#171615] border border-[#171615]/12 cursor-pointer group"
                            >
                              <GalleryMediaPreview
                                mediaType={mediaType}
                                mediaUrl={mediaUrl}
                                embedUrl={item.embedUrl}
                                thumbnail={item.thumbnail}
                                videoProvider={item.videoProvider}
                                title={item.title}
                                mode="thumbnail"
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              {mediaType === 'video' && (
                                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <Play className="w-3.5 h-3.5 text-[#F7F2E9] fill-current" aria-hidden="true" />
                                </span>
                              )}
                            </button>
                          </td>

                          <td className="px-4 py-2.5 max-w-[280px]">
                            <button
                              type="button"
                              onClick={() => setViewingItem(item)}
                              className="text-left font-semibold text-[#171615] hover:text-[#57252F] transition-colors line-clamp-1 cursor-pointer"
                            >
                              {item.title}
                            </button>
                            {item.description && (
                              <p className="text-[11px] text-[#5C554E] line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 text-[#171615] font-medium">
                              {mediaType === 'video' ? (
                                <>
                                  <Film className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
                                  <span>{getVideoProviderLabel(item.videoProvider)}</span>
                                </>
                              ) : (
                                <>
                                  <ImageIcon className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                                  <span>Image</span>
                                </>
                              )}
                            </span>
                          </td>

                          <td className="px-4 py-2.5 text-[#5C554E] whitespace-nowrap">
                            {item.category || 'General'}
                          </td>

                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              disabled={togglingId === item.id}
                              onClick={() => handleToggleStatus(item, nextStatus)}
                              className="inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                              <span
                                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                                  isActive ? 'bg-[#15803D]' : 'bg-[#D1D5DB]'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3.5 w-3.5 rounded-full bg-[#FFFFFF] transition-transform ${
                                    isActive ? 'translate-x-4.5' : 'translate-x-1'
                                  }`}
                                />
                              </span>
                              <span
                                className={`text-xs font-medium ${
                                  isActive ? 'text-[#15803D]' : 'text-[#5C554E]'
                                }`}
                              >
                                {isActive ? 'Active' : 'Inactive'}
                              </span>
                            </button>
                          </td>

                          <td className="px-4 py-2.5 text-right tabular-nums text-[#171615] font-medium">
                            {item.displayOrder ?? 0}
                          </td>

                          <td className="px-4 py-2.5 tabular-nums text-[#5C554E] whitespace-nowrap">
                            {formatShortDate(item.createdAt)}
                          </td>

                          <td className="px-4 py-2.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setViewingItem(item)}
                                title="View item"
                                aria-label={`View ${item.title}`}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#171615] hover:bg-[#57252F] hover:text-[#F7F2E9] hover:border-[#57252F] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(item)}
                                title="Edit item"
                                aria-label={`Edit ${item.title}`}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#57252F] hover:bg-[#F7F2E9] hover:border-[#C5A46D] transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingItem(item)}
                                title="Delete item"
                                aria-label={`Delete ${item.title}`}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#FECACA] text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Responsive Card Grid (always on mobile; also on desktop when grid mode is active) */}
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4'
            }
          >
            {items.map((item) => {
              const mediaType = item.mediaType || item.type || 'image';
              const mediaUrl =
                item.mediaUrl ||
                (mediaType === 'video' ? item.videoUrl || item.src : item.src) ||
                '';
              const status: GalleryStatus = item.status || 'active';
              const isActive = status === 'active';
              const nextStatus: GalleryStatus = isActive ? 'inactive' : 'active';

              return (
                <article
                  key={item.id}
                  className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 overflow-hidden flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setViewingItem(item)}
                    aria-label={`Preview ${item.title}`}
                    className="relative aspect-[16/10] w-full bg-[#171615] overflow-hidden cursor-pointer group"
                  >
                    <GalleryMediaPreview
                      mediaType={mediaType}
                      mediaUrl={mediaUrl}
                      embedUrl={item.embedUrl}
                      thumbnail={item.thumbnail}
                      videoProvider={item.videoProvider}
                      title={item.title}
                      mode="thumbnail"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#57252F]/90 border border-[#C5A46D] text-[#F7F2E9]">
                          <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                        </span>
                      </div>
                    )}
                  </button>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#5C554E] tabular-nums">
                        <span className="truncate">
                          {item.category || 'General'} ·{' '}
                          {mediaType === 'video' ? getVideoProviderLabel(item.videoProvider) : 'Image'}
                        </span>
                        <span className="shrink-0">#{item.displayOrder ?? 0}</span>
                      </div>
                      <h3 className="font-semibold text-sm text-[#171615] line-clamp-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-[#5C554E] line-clamp-2">{item.description}</p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#171615]/8 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        disabled={togglingId === item.id}
                        onClick={() => handleToggleStatus(item, nextStatus)}
                        className="inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span
                          className={`relative inline-flex h-4.5 w-8 shrink-0 items-center rounded-full transition-colors ${
                            isActive ? 'bg-[#15803D]' : 'bg-[#D1D5DB]'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 rounded-full bg-[#FFFFFF] transition-transform ${
                              isActive ? 'translate-x-4' : 'translate-x-1'
                            }`}
                          />
                        </span>
                        <span
                          className={`text-[11px] font-medium ${
                            isActive ? 'text-[#15803D]' : 'text-[#5C554E]'
                          }`}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </button>

                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewingItem(item)}
                          aria-label={`View ${item.title}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#171615] hover:bg-[#57252F] hover:text-[#F7F2E9] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          aria-label={`Edit ${item.title}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#171615]/12 text-[#57252F] hover:bg-[#F7F2E9] cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          aria-label={`Delete ${item.title}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#FECACA] text-[#B91C1C] hover:bg-[#FEF2F2] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Footer */}
          <div className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-[#5C554E] tabular-nums">
              <span>
                Showing{' '}
                <strong className="text-[#171615]">
                  {startIdx + 1}–{Math.min(startIdx + limit, totalFiltered)}
                </strong>{' '}
                of <strong className="text-[#171615]">{totalFiltered}</strong> gallery items
              </span>
              <select
                aria-label="Items per page"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="rounded-md border border-[#171615]/15 bg-[#FFFFFF] px-2 py-1 text-xs text-[#171615]"
              >
                {[8, 12, 24, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-[#171615]/15 px-3 py-1.5 font-medium text-[#171615] hover:bg-[#F7F2E9] disabled:opacity-45 cursor-pointer"
              >
                Previous
              </button>
              <span className="px-2.5 text-[#5C554E] tabular-nums">
                Page <strong className="text-[#171615]">{page}</strong> of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-[#171615]/15 px-3 py-1.5 font-medium text-[#171615] hover:bg-[#F7F2E9] disabled:opacity-45 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      <GalleryFormDialog
        open={formOpen}
        mode={formMode}
        initialItem={editingItem}
        existingCategories={categories}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSaveForm}
      />

      {/* Preview / View Modal */}
      <GalleryViewDialog
        item={viewingItem}
        open={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        onEdit={openEditModal}
        onDelete={(item) => setDeletingItem(item)}
        onToggleStatus={handleToggleStatus}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        loading={deletingBusy}
        title="Delete Gallery Item?"
        description="This item will be permanently removed from the database and will immediately disappear from the public gallery."
        entityLabel={
          deletingItem
            ? `${deletingItem.title} (${deletingItem.category || 'General'} · ${(deletingItem.mediaType || deletingItem.type) === 'video' ? 'Video' : 'Image'})`
            : undefined
        }
        confirmText="Delete Permanently"
        variant="danger"
      />
    </div>
  );
}
