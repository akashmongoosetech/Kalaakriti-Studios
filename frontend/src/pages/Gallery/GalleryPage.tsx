import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Film, Image as ImageIcon, Images, RefreshCw, Search, X } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';
import { GalleryCard } from '../../components/gallery/GalleryCard';
import { GalleryLightbox } from '../../components/gallery/GalleryLightbox';
import { NewsletterSubscribe } from '../../components/common/NewsletterSubscribe';
import { publicApi } from '../../services/api/public.api';
import { GalleryItem } from '../../types';

const PAGE_SIZE = 9;

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadGallery = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const items = await publicApi.getGallery(undefined, signal);
      if (signal?.aborted) return;
      setGalleryItems(items);
    } catch (err) {
      if (signal?.aborted) return;
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load the gallery right now. Please try again.'
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadGallery(controller.signal);
    return () => controller.abort();
  }, [loadGallery]);

  // Dynamically derive available categories from active database items
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    for (const item of galleryItems) {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    }
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [galleryItems]);

  // Reset category filter if a category no longer exists in active items
  useEffect(() => {
    if (selectedCategory !== 'All' && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
  }, [availableCategories, selectedCategory]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return galleryItems.filter((item) => {
      const itemType = item.mediaType || item.type || 'image';
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesType = mediaFilter === 'all' || itemType === mediaFilter;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.location || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.coupleOrClient || '').toLowerCase().includes(q);
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [galleryItems, selectedCategory, mediaFilter, searchQuery]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleOpenLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setMediaFilter('all');
    setSearchQuery('');
    setVisibleCount(PAGE_SIZE);
  };

  const hasActiveFilters =
    selectedCategory !== 'All' || mediaFilter !== 'all' || Boolean(searchQuery.trim());

  const dynamicGalleryTitle =
    selectedCategory === 'All'
      ? `Indian Wedding Photo & Cinema Film Gallery | ${STUDIO_CONFIG.name}`
      : `${selectedCategory} Photography & Film Gallery in Madhya Pradesh | ${STUDIO_CONFIG.name}`;

  return (
    <div>
      <SeoHelmet
        title={dynamicGalleryTitle}
        description="Explore authentic Indian wedding photographs and 4K cinema highlight reels across Indore, Bhopal, Ujjain, Maheshwar, Dewas, and Gwalior."
        keywords={[
          'Indian Wedding Gallery Indore',
          'Wedding Films Madhya Pradesh',
          'Haldi Mehendi Photos Ujjain',
          'Pre-Wedding Gallery Maheshwar',
        ]}
        ogImage={filteredItems[0]?.thumbnail || STUDIO_IMAGES.heroWedding}
        ogImageAlt={`${STUDIO_CONFIG.name} Photography and Cinema Portfolio`}
        schemaType="ImageGallery"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Gallery', path: '/gallery' },
        ]}
      />

      {/* Gallery Hero */}
      <section className="relative min-h-[56vh] flex items-end pb-14 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <SafeImage
          src={STUDIO_IMAGES.heroWedding}
          alt="Kalaakriti Studios photography and cinema portfolio"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/60 to-[#171615]/45" />
        <div className="studio-container relative z-10 max-w-4xl">
          <div className="text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-4">
            Unified Archive · Photographs &amp; Cinema Reels Together
          </div>
          <h1 className="hero-headline font-editorial font-medium">
            The Portfolio &amp; Viewing Room.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#E8DCCB]/85 leading-relaxed max-w-2xl">
            Experience both still photography and highlight films within a single curated gallery.
            Click any card to enter fullscreen viewing with keyboard navigation and live video playback.
          </p>
        </div>
      </section>

      {/* Filter Toolbar + Mixed Masonry Grid */}
      <section className="py-14 md:py-20 bg-[#F7F2E9]">
        <div className="studio-container space-y-8">
          {/* Controls Row: Search + Media Type Segmented Control */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#171615]/12">
            <div className="relative flex-1 max-w-md">
              <Search
                className="w-4 h-4 text-[#5C554E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="gallery-search-input" className="sr-only">
                Search gallery by title, ceremony, or story
              </label>
              <input
                id="gallery-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Search by title, ceremony, or location..."
                className="w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 pl-11 pr-10 py-2.5 text-sm text-[#171615] placeholder:text-[#5C554E]/65 focus:border-[#57252F] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search query"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C554E] hover:text-[#171615] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Filter by media type"
                className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#E8DCCB]/75 border border-[#171615]/10"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMediaFilter('all');
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    mediaFilter === 'all'
                      ? 'bg-[#57252F] text-[#F7F2E9]'
                      : 'text-[#171615]/80 hover:text-[#171615]'
                  }`}
                >
                  All Media
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaFilter('image');
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    mediaFilter === 'image'
                      ? 'bg-[#57252F] text-[#F7F2E9]'
                      : 'text-[#171615]/80 hover:text-[#171615]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Photographs</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaFilter('video');
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    mediaFilter === 'video'
                      ? 'bg-[#57252F] text-[#F7F2E9]'
                      : 'text-[#171615]/80 hover:text-[#171615]'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Videos</span>
                </button>
              </div>

              <span className="text-xs text-[#5C554E] tabular-nums">
                {loading
                  ? 'Loading...'
                  : `${filteredItems.length} ${filteredItems.length === 1 ? 'work' : 'works'}`}
              </span>
            </div>
          </div>

          {/* Dynamic Category Filter Tabs (only shown when categories exist) */}
          {!loading && availableCategories.length > 1 && (
            <div
              role="tablist"
              aria-label="Filter gallery by category"
              className="flex items-center gap-2 overflow-x-auto pb-2"
            >
              {availableCategories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                      active
                        ? 'bg-[#171615] text-[#F7F2E9] border-[#171615]'
                        : 'bg-transparent text-[#171615]/80 border-[#171615]/15 hover:border-[#57252F] hover:text-[#57252F]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="rounded-xl bg-[#FFFFFF] border border-[#FECACA] px-6 py-8 text-center max-w-xl mx-auto space-y-3">
              <AlertCircle className="w-7 h-7 text-[#B91C1C] mx-auto" aria-hidden="true" />
              <h2 className="font-editorial text-2xl font-medium text-[#171615]">
                Unable to Load Portfolio
              </h2>
              <p className="text-sm text-[#5C554E]">{error}</p>
              <button
                type="button"
                onClick={() => loadGallery()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading ? (
            <div
              aria-label="Loading gallery items"
              className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6"
            >
              {[
                'aspect-[4/3]',
                'aspect-[3/4]',
                'aspect-[16/10]',
                'aspect-[3/4]',
                'aspect-[4/3]',
                'aspect-[4/3]',
              ].map((aspect, idx) => (
                <div key={idx} className="break-inside-avoid mb-6 space-y-2.5">
                  <div
                    className={`${aspect} w-full rounded-xl bg-[#E8DCCB]/75 animate-pulse border border-[#171615]/8`}
                  />
                  <div className="h-3.5 w-2/3 rounded bg-[#E8DCCB]/75 animate-pulse" />
                </div>
              ))}
            </div>
          ) : !error && visibleItems.length > 0 ? (
            <>
              <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6">
                {visibleItems.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    onOpenLightbox={handleOpenLightbox}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="pt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-8 py-3.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
                  >
                    <span>
                      Load More Works ({filteredItems.length - visibleItems.length} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : !error ? (
            <div className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 py-16 px-6 text-center max-w-xl mx-auto space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F2E9] text-[#57252F]">
                <Images className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-editorial text-2xl font-medium text-[#171615]">
                {hasActiveFilters
                  ? 'No matching works found'
                  : 'Gallery Collection Coming Soon'}
              </h2>
              <p className="text-sm text-[#5C554E]">
                {hasActiveFilters
                  ? 'Try clearing your search term or selecting another celebration category.'
                  : 'No active photographs or films are currently published in the gallery. Check back soon for new curated works.'}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
                >
                  Reset Gallery Filters
                </button>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <NewsletterSubscribe variant="editorial" />

      <GalleryLightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
      />
    </div>
  );
}
