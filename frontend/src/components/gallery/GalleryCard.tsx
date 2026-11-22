import { Link } from 'react-router-dom';
import { ArrowUpRight, Film, Image as ImageIcon, Maximize2, Play } from 'lucide-react';
import { GalleryItem } from '../../types';
import { SafeImage } from '../common/SafeImage';

interface GalleryCardProps {
  item: GalleryItem;
  onOpenLightbox: (item: GalleryItem) => void;
  showStoryLink?: boolean;
}

export function GalleryCard({ item, onOpenLightbox, showStoryLink = true }: GalleryCardProps) {
  const aspectClass =
    item.aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : item.aspectRatio === 'wide'
        ? 'aspect-[16/10]'
        : item.aspectRatio === 'square'
          ? 'aspect-square'
          : 'aspect-[4/3]';

  return (
    <article className="group break-inside-avoid mb-6">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenLightbox(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenLightbox(item);
          }
        }}
        aria-label={`Open ${item.type === 'video' ? 'video film' : 'high-resolution photograph'}: ${item.title}`}
        className={`relative ${aspectClass} w-full overflow-hidden rounded-xl bg-[#171615] cursor-pointer border border-[#171615]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57252F]`}
      >
        <SafeImage
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />

        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/90 via-[#171615]/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

        {/* Subtle Media Type Indicator */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-[#F7F2E9] bg-[#171615]/65 px-2.5 py-1 rounded-md">
          {item.type === 'video' ? (
            <>
              <Film className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
              <span>Film {item.duration ? `· ${item.duration}` : ''}</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
              <span>Photograph</span>
            </>
          )}
        </div>

        {/* Fullscreen Expand Cue on Hover for Photographs */}
        {item.type === 'image' && (
          <div className="absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#57252F]/90 border border-[#C5A46D]/60 text-[#F7F2E9] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none">
            <Maximize2 className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        {/* Center Video Play Button */}
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#57252F]/90 border border-[#C5A46D] text-[#F7F2E9] shadow-xl transition-transform duration-300 group-hover:scale-110">
              <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
            </span>
          </div>
        )}

        {/* Bottom Overlay Copy */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center gap-2 text-xs text-[#C5A46D] mb-1">
            <span>{item.category}</span>
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
            <span className="text-[#E8DCCB]/85 truncate">{item.location}</span>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#F7F2E9] leading-snug">
            {item.title}
          </h3>
        </div>
      </div>

      {showStoryLink && (
        <div className="mt-2.5 flex items-center justify-between gap-3 px-0.5 text-xs text-[#5C554E]">
          <span className="truncate">{item.coupleOrClient}</span>
          <Link
            to={`/gallery/${item.slug}`}
            className="inline-flex items-center gap-1 font-medium text-[#57252F] hover:text-[#171615] transition-colors whitespace-nowrap shrink-0"
          >
            <span>View Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </article>
  );
}
