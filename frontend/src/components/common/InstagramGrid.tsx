import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Film,
  Instagram,
  Layers,
  Maximize2,
} from 'lucide-react';
import {
  FALLBACK_INSTAGRAM_POSTS,
  type InstagramAspectRatio,
  type InstagramMediaType,
  type InstagramPost,
} from '../../data/instagram';
import { STUDIO_CONFIG } from '../../data/studio';
import { SectionHeading } from './SectionHeading';
import { SafeImage } from './SafeImage';
import { GalleryLightbox } from '../gallery/GalleryLightbox';
import type { GalleryItem } from '../../types';

type FeedFilter = 'all' | 'stills' | 'reels';

const ASPECT_PATTERNS: InstagramAspectRatio[] = [
  'portrait',
  'square',
  'landscape',
  'portrait',
  'landscape',
  'portrait',
  'landscape',
  'square',
  'landscape',
];

function formatPostDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function normalizePosts(raw: unknown): InstagramPost[] {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as { data?: unknown }).data)
      ? (raw as { data: unknown[] }).data
      : [];

  return list
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
    .map((entry, idx) => {
      const mediaTypeRaw = String(entry.media_type || 'IMAGE').toUpperCase();
      const media_type: InstagramMediaType =
        mediaTypeRaw === 'VIDEO' || mediaTypeRaw === 'CAROUSEL_ALBUM'
          ? (mediaTypeRaw as InstagramMediaType)
          : 'IMAGE';

      const aspectRaw = entry.aspectRatio;
      const aspectRatio: InstagramAspectRatio =
        aspectRaw === 'portrait' || aspectRaw === 'square' || aspectRaw === 'landscape'
          ? aspectRaw
          : ASPECT_PATTERNS[idx % ASPECT_PATTERNS.length];

      const mediaUrl = String(entry.media_url || entry.thumbnail_url || '');
      const thumbnailUrl = String(entry.thumbnail_url || entry.media_url || '');

      return {
        id: String(entry.id || `ig-${idx + 1}`),
        caption: String(entry.caption || ''),
        media_type,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        permalink: String(entry.permalink || STUDIO_CONFIG.social.instagram),
        timestamp: String(entry.timestamp || new Date().toISOString()),
        location: entry.location ? String(entry.location) : STUDIO_CONFIG.locationLabel,
        aspectRatio,
      };
    })
    .filter((post) => Boolean(post.media_url));
}

export function InstagramGrid() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const customFeedUrl = (import.meta.env.VITE_INSTAGRAM_FEED_URL as string | undefined)?.trim();
    const apiBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') || '';
    const feedEndpoint = customFeedUrl || `${apiBase}/api/instagram`;

    async function loadInstagramFeed() {
      setLoading(true);
      try {
        const response = await fetch(feedEndpoint, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Feed request failed with HTTP ${response.status}`);
        }
        const payload = await response.json();
        const rawList =
          payload && typeof payload === 'object' && payload.data && Array.isArray(payload.data.posts)
            ? payload.data.posts
            : payload;
        const normalized = normalizePosts(rawList);
        setPosts(normalized.length > 0 ? normalized : FALLBACK_INSTAGRAM_POSTS);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setPosts(FALLBACK_INSTAGRAM_POSTS);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadInstagramFeed();
    return () => controller.abort();
  }, []);

  const filteredPosts = useMemo(() => {
    if (filter === 'stills') {
      return posts.filter((p) => p.media_type === 'IMAGE');
    }
    if (filter === 'reels') {
      return posts.filter((p) => p.media_type === 'VIDEO' || p.media_type === 'CAROUSEL_ALBUM');
    }
    return posts;
  }, [posts, filter]);

  // Adapt posts cleanly into GalleryItem shape for high-res full-screen lightbox viewing
  const lightboxItems: GalleryItem[] = useMemo(
    () =>
      filteredPosts.map((post) => ({
        id: post.id,
        slug: 'royal-indore-palace-wedding',
        title: post.location || STUDIO_CONFIG.social.instagramHandle,
        category:
          post.media_type === 'VIDEO'
            ? 'Instagram Reel'
            : post.media_type === 'CAROUSEL_ALBUM'
              ? 'Instagram Series'
              : 'Instagram Editorial',
        categorySlug: 'wedding',
        type: 'image',
        src: post.media_url,
        thumbnail: post.thumbnail_url || post.media_url,
        location: post.location || STUDIO_CONFIG.locationLabel,
        year: formatPostDate(post.timestamp),
        coupleOrClient: STUDIO_CONFIG.social.instagramHandle,
        description: post.caption,
        aspectRatio: post.aspectRatio || 'portrait',
      })),
    [filteredPosts]
  );

  return (
    <section
      aria-labelledby="instagram-journal-heading"
      className="py-20 md:py-28 bg-[#F7F2E9] border-t border-[#171615]/8"
    >
      <div className="studio-container">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div id="instagram-journal-heading">
            <SectionHeading
              devanagari="झलकियाँ"
              kicker={`Instagram Journal · ${STUDIO_CONFIG.social.instagramHandle}`}
              title="Latest Dispatches From Our Studio Feed"
              description="Recent wedding frames, ritual stories, and behind-the-scenes reels curated from celebrations across Indore, Bhopal, Ujjain, and Maheshwar."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Functional Media Filter Bar */}
            <div
              role="group"
              aria-label="Filter Instagram posts"
              className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#E8DCCB]/75 border border-[#171615]/10"
            >
              {(
                [
                  { id: 'all', label: 'All Posts' },
                  { id: 'stills', label: 'Stills' },
                  { id: 'reels', label: 'Reels & Series' },
                ] as const
              ).map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#57252F] text-[#F7F2E9]'
                        : 'text-[#171615]/80 hover:text-[#171615]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <a
              href={STUDIO_CONFIG.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] border border-[#C5A46D]/45 px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors whitespace-nowrap shrink-0"
            >
              <Instagram className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              <span>Follow {STUDIO_CONFIG.social.instagramHandle}</span>
            </a>
          </div>
        </div>

        {/* Luxury Masonry Feed */}
        {loading ? (
          <div
            aria-label="Loading latest studio Instagram posts"
            className="columns-1 sm:columns-2 lg:columns-3 gap-6"
          >
            {ASPECT_PATTERNS.slice(0, 6).map((ratio, idx) => (
              <div
                key={idx}
                className={`break-inside-avoid mb-6 rounded-xl bg-[#E8DCCB]/70 border border-[#171615]/8 animate-pulse ${
                  ratio === 'portrait'
                    ? 'aspect-[3/4]'
                    : ratio === 'square'
                      ? 'aspect-square'
                      : 'aspect-[4/3]'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {filteredPosts.map((post, idx) => {
              const aspectClass =
                post.aspectRatio === 'portrait'
                  ? 'aspect-[3/4]'
                  : post.aspectRatio === 'square'
                    ? 'aspect-square'
                    : 'aspect-[4/3]';
              const formattedDate = formatPostDate(post.timestamp);

              return (
                <article
                  key={post.id}
                  className="group break-inside-avoid mb-6 overflow-hidden rounded-xl bg-[#171615] border border-[#171615]/10 hover:border-[#C5A46D]/70 transition-colors"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setLightboxIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setLightboxIndex(idx);
                      }
                    }}
                    aria-label={`Inspect Instagram post from ${post.location || STUDIO_CONFIG.name}`}
                    className={`relative ${aspectClass} w-full overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]`}
                  >
                    <SafeImage
                      src={post.thumbnail_url || post.media_url}
                      alt={post.caption || `Studio post from ${STUDIO_CONFIG.social.instagramHandle}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />

                    {/* Subtle Editorial Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/92 via-[#171615]/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                    {/* Top-Right Media Format / Expand Affordance */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-2 pointer-events-none">
                      {post.media_type === 'VIDEO' && (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171615]/75 border border-[#C5A46D]/50 text-[#C5A46D]">
                          <Film className="w-4 h-4" aria-hidden="true" />
                        </span>
                      )}
                      {post.media_type === 'CAROUSEL_ALBUM' && (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171615]/75 border border-[#C5A46D]/50 text-[#C5A46D]">
                          <Layers className="w-4 h-4" aria-hidden="true" />
                        </span>
                      )}
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#57252F]/90 border border-[#C5A46D]/65 text-[#F7F2E9] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Maximize2 className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>

                    {/* Editorial Caption Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-5 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#C5A46D]">
                        <span>{post.location}</span>
                        {formattedDate && (
                          <>
                            <span aria-hidden="true" className="opacity-45">
                              ·
                            </span>
                            <span className="text-[#E8DCCB]/80 tabular-nums">{formattedDate}</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-[#F7F2E9]/92 leading-relaxed line-clamp-3">
                        {post.caption}
                      </p>
                    </div>
                  </div>

                  {/* Quiet Footer Bar */}
                  <div className="px-5 py-3 bg-[#FFFFFF] flex items-center justify-between gap-3 text-xs border-t border-[#171615]/8">
                    <span className="text-[#5C554E] truncate">
                      {STUDIO_CONFIG.social.instagramHandle}
                      {' · '}
                      {post.media_type === 'VIDEO'
                        ? 'Reel'
                        : post.media_type === 'CAROUSEL_ALBUM'
                          ? 'Carousel'
                          : 'Editorial Still'}
                    </span>
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-[#57252F] hover:text-[#171615] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>View Post</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <GalleryLightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
      />
    </section>
  );
}
