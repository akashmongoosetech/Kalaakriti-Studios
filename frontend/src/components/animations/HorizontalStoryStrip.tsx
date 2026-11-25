import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { GalleryItem } from '../../types';
import { GalleryMediaPreview } from '../gallery/GalleryMediaPreview';

interface HorizontalStoryStripProps {
  items: GalleryItem[];
  onSelectItem?: (item: GalleryItem) => void;
}

/**
 * Immersive horizontal editorial storytelling strip with smooth button navigation
 * and native touch/trackpad scroll snapping (no aggressive scroll hijacking).
 */
export function HorizontalStoryStrip({ items, onSelectItem }: HorizontalStoryStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: 'prev' | 'next') => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.72) * (direction === 'next' ? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs sm:text-sm text-[#E8DCCB]/75">
          Scroll horizontally to experience complete ritual chapters across Madhya Pradesh.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByAmount('prev')}
            aria-label="Scroll stories left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/40 text-[#F7F2E9] hover:bg-[#57252F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount('next')}
            aria-label="Scroll stories right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/40 text-[#F7F2E9] hover:bg-[#57252F] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {items.map((item, idx) => (
          <article
            key={item.id}
            className="snap-start shrink-0 w-[84vw] sm:w-[440px] lg:w-[500px] 2xl:w-[560px] group"
          >
            <div
              onClick={() => onSelectItem?.(item)}
              role={onSelectItem ? 'button' : undefined}
              tabIndex={onSelectItem ? 0 : undefined}
              onKeyDown={(e) => {
                if (onSelectItem && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectItem(item);
                }
              }}
              className="relative aspect-[16/11] overflow-hidden rounded-xl bg-[#242220] border border-[#C5A46D]/20 cursor-pointer"
            >
              <GalleryMediaPreview
                mediaType={item.mediaType || item.type || 'image'}
                mediaUrl={item.mediaUrl || item.videoUrl || item.src}
                embedUrl={item.embedUrl}
                thumbnail={item.thumbnail}
                videoProvider={item.videoProvider}
                title={item.title}
                mode="thumbnail"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/85 via-transparent to-transparent pointer-events-none" />
              {(item.mediaType || item.type) === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#57252F]/90 border border-[#C5A46D] text-[#F7F2E9] shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
                  </span>
                </div>
              )}
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-[#E8DCCB] pointer-events-none">
                <span>
                  {String(idx + 1).padStart(2, '0')} · {item.category || 'General'}
                  {(item.mediaType || item.type) === 'video' && item.duration
                    ? ` · Film ${item.duration}`
                    : ''}
                </span>
                {item.location && <span>{item.location}</span>}
              </div>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-editorial text-2xl text-[#F7F2E9] font-medium">
                  <Link to={`/gallery/${item.slug || item.id}`} className="hover:text-[#C5A46D] transition-colors">
                    {item.title}
                  </Link>
                </h3>
                {item.description && (
                  <p className="mt-1.5 text-sm text-[#E8DCCB]/75 line-clamp-2">{item.description}</p>
                )}
              </div>
              <Link
                to={`/gallery/${item.slug}`}
                className="text-xs font-medium text-[#C5A46D] hover:text-[#F7F2E9] whitespace-nowrap shrink-0 mt-1 underline underline-offset-4"
              >
                View Story
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
