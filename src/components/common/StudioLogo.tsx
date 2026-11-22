import { STUDIO_CONFIG } from '../../data/studio';

interface StudioLogoProps {
  /** 'dark' for light backgrounds (ivory/white), 'light' for dark charcoal/hero backgrounds */
  tone?: 'dark' | 'light';
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * StudioLogo supports an uploaded studio logo file configured in src/data/studio.ts
 * while preserving original aspect ratio and transparency, and renders a refined
 * luxury monogram emblem by default until a custom image file is supplied.
 */
export function StudioLogo({ tone = 'dark', showWordmark = true, size = 'md' }: StudioLogoProps) {
  const customLogo =
    tone === 'light' && STUDIO_CONFIG.logoDarkBgImageUrl
      ? STUDIO_CONFIG.logoDarkBgImageUrl
      : STUDIO_CONFIG.logoImageUrl;

  const heightClass = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-12' : 'h-9';
  const emblemSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 36;

  if (customLogo) {
    return (
      <span className="inline-flex items-center gap-3 whitespace-nowrap shrink-0">
        <img
          src={customLogo}
          alt={STUDIO_CONFIG.name}
          className={`${heightClass} w-auto object-contain select-none`}
          referrerPolicy="no-referrer"
        />
        {showWordmark && (
          <span
            className={`font-editorial text-xl font-semibold tracking-tight ${
              tone === 'light' ? 'text-[#F7F2E9]' : 'text-[#171615]'
            }`}
          >
            {STUDIO_CONFIG.name}
          </span>
        )}
      </span>
    );
  }

  const primaryStroke = tone === 'light' ? '#F7F2E9' : '#57252F';
  const frameStroke = '#C5A46D';
  const fillBg = tone === 'light' ? 'rgba(23, 22, 21, 0.35)' : '#57252F';
  const monogramStroke = '#F7F2E9';

  return (
    <span className="inline-flex items-center gap-3 whitespace-nowrap shrink-0">
      <svg
        width={emblemSize}
        height={emblemSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="2" y="2" width="44" height="44" rx="8" fill={fillBg} stroke={frameStroke} strokeWidth="1.25" />
        <rect x="6" y="6" width="36" height="36" rx="5" stroke={frameStroke} strokeOpacity="0.45" strokeWidth="0.9" />
        {/* Stylized K aperture motif */}
        <path
          d="M17 14V34M17 24L30 14M22 20.5L31.5 34"
          stroke={tone === 'light' ? primaryStroke : monogramStroke}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="33" cy="15.5" r="2" fill={frameStroke} />
      </svg>
      {showWordmark && (
        <span
          className={`font-editorial text-xl md:text-2xl font-semibold tracking-tight leading-none ${
            tone === 'light' ? 'text-[#F7F2E9]' : 'text-[#171615]'
          }`}
        >
          {STUDIO_CONFIG.name}
        </span>
      )}
    </span>
  );
}
