import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, RotateCw } from 'lucide-react';
import { SafeImage } from '../common/SafeImage';

interface FlipPhotoCardProps {
  frontImage: string;
  alt: string;
  title: string;
  subtitle: string;
  backSummary: string;
  highlights: string[];
  to: string;
  ctaLabel?: string;
}

/**
 * 3D Perspective Flip Photography Card.
 * Flips smoothly on desktop hover or button click/tap for full mobile & keyboard accessibility.
 */
export function FlipPhotoCard({
  frontImage,
  alt,
  title,
  subtitle,
  backSummary,
  highlights,
  to,
  ctaLabel = 'Explore Story',
}: FlipPhotoCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group perspective-1200 h-[420px] sm:h-[450px] w-full"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`relative h-full w-full preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          flipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden overflow-hidden rounded-xl bg-[#171615] border border-[#C5A46D]/25">
          <SafeImage
            src={frontImage}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/90 via-[#171615]/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.12em] text-[#C5A46D] mb-1.5">{subtitle}</p>
              <h3 className="font-editorial text-2xl font-medium text-[#F7F2E9]">{title}</h3>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFlipped((prev) => !prev);
              }}
              aria-label={`Flip ${title} card to read details`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C5A46D]/50 bg-[#171615]/70 text-[#F7F2E9] hover:bg-[#57252F] transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-xl bg-[#57252F] text-[#F7F2E9] p-7 flex flex-col justify-between border border-[#C5A46D]/40">
          <div>
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#C5A46D]/25">
              <span className="text-xs tracking-[0.14em] text-[#C5A46D]">{subtitle}</span>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                aria-label={`Flip ${title} back to photograph`}
                className="text-xs text-[#E8DCCB] hover:text-[#F7F2E9] underline underline-offset-4 cursor-pointer"
              >
                View Photo
              </button>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium mt-5 mb-3 text-[#F7F2E9]">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-[#E8DCCB]/90">{backSummary}</p>
            <ul className="mt-5 space-y-2 text-xs sm:text-sm text-[#F7F2E9]/90">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C5A46D] shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            to={to}
            className="inline-flex items-center justify-between w-full px-4 py-3 rounded-lg bg-[#F7F2E9] text-[#171615] text-sm font-medium hover:bg-[#E8DCCB] transition-colors"
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight className="w-4 h-4 text-[#57252F]" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
