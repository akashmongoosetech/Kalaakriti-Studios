import { useEffect, useState } from 'react';
import { AlertCircle, Film, ImageOff, Play } from 'lucide-react';
import type { MediaType, VideoProvider } from '../../types';
import { getVideoProviderLabel, isTrustedEmbedUrl, parseGalleryMediaUrl } from '../../utils/mediaUrl';

interface GalleryMediaPreviewProps {
  mediaType: MediaType;
  mediaUrl: string;
  embedUrl?: string;
  thumbnail?: string;
  videoProvider?: VideoProvider;
  title: string;
  mode?: 'thumbnail' | 'player';
  className?: string;
  onLoadError?: (hasError: boolean) => void;
}

/**
 * Reusable media preview & playback component for both Admin Dashboard and Public Gallery.
 * - Images: lazy-loaded with no-referrer and graceful burgundy/charcoal broken-URL fallback.
 * - Videos: supports YouTube, YouTube Shorts, Vimeo (strictly sandboxed embed iframes),
 *   and direct MP4/WebM/OGG/MOV HTML5 video playback with graceful unavailable fallback.
 */
export function GalleryMediaPreview({
  mediaType,
  mediaUrl,
  embedUrl,
  thumbnail,
  videoProvider,
  title,
  mode = 'thumbnail',
  className = '',
  onLoadError,
}: GalleryMediaPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setImageError(false);
    setVideoError(false);
  }, [mediaType, mediaUrl, embedUrl, thumbnail]);

  const parsed = parseGalleryMediaUrl(mediaType, mediaUrl, {
    allowRelativeStudioAsset: true,
  });

  const resolvedProvider: VideoProvider =
    videoProvider || parsed.videoProvider || (mediaType === 'video' ? 'direct' : '');
  const resolvedEmbedUrl = embedUrl || parsed.embedUrl || '';
  const resolvedThumbnail = thumbnail || parsed.thumbnailUrl || (mediaType === 'image' ? mediaUrl : '');

  // IMAGE MODE (both thumbnail & player render high-resolution image with broken fallback)
  if (mediaType === 'image') {
    if (!mediaUrl || imageError) {
      return (
        <div
          role="img"
          aria-label={title || 'Unavailable image'}
          className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#242220] via-[#3E1820] to-[#171615] text-[#F7F2E9] p-4 text-center ${className}`}
        >
          <ImageOff className="w-6 h-6 text-[#C5A46D] mb-2 opacity-85" aria-hidden="true" />
          <span className="font-editorial text-sm sm:text-base text-[#F7F2E9]/90 line-clamp-2">
            {title || 'Image unavailable'}
          </span>
          <span className="mt-1 text-[11px] text-[#E8DCCB]/65">
            Unable to load image URL
          </span>
        </div>
      );
    }

    return (
      <img
        src={mediaUrl}
        alt={title}
        loading={mode === 'player' ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onLoad={() => onLoadError?.(false)}
        onError={() => {
          setImageError(true);
          onLoadError?.(true);
        }}
        className={className}
      />
    );
  }

  // VIDEO PLAYER MODE (Admin Live Preview, Admin View Dialog, Lightbox, Story Detail)
  if (mode === 'player') {
    // 1. Trusted YouTube / Vimeo Iframe Embed
    if (
      (resolvedProvider === 'youtube' ||
        resolvedProvider === 'youtube_shorts' ||
        resolvedProvider === 'vimeo') &&
      isTrustedEmbedUrl(resolvedEmbedUrl)
    ) {
      return (
        <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
          <iframe
            src={resolvedEmbedUrl}
            title={title || 'Gallery video player'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            className="h-full w-full border-0"
          />
        </div>
      );
    }

    // 2. Direct Video URL (.mp4, .webm, .ogg, .mov)
    if (resolvedProvider === 'direct' && mediaUrl && !videoError) {
      return (
        <video
          key={mediaUrl}
          src={mediaUrl}
          poster={resolvedThumbnail || undefined}
          controls
          playsInline
          preload="metadata"
          onLoadedData={() => onLoadError?.(false)}
          onError={() => {
            setVideoError(true);
            onLoadError?.(true);
          }}
          className={`h-full w-full bg-black object-contain ${className}`}
        />
      );
    }

    // 3. Fallback when video source cannot be played or is unavailable
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1C1A19] via-[#3B1720] to-[#121110] text-[#F7F2E9] p-6 text-center ${className}`}
      >
        <AlertCircle className="w-7 h-7 text-[#C5A46D] mb-2.5" aria-hidden="true" />
        <p className="font-editorial text-lg text-[#F7F2E9]">{title || 'Video unavailable'}</p>
        <p className="mt-1 text-xs text-[#E8DCCB]/75 max-w-xs">
          This video stream could not be loaded. Verify the URL is publicly accessible.
        </p>
      </div>
    );
  }

  // VIDEO THUMBNAIL MODE (Gallery Cards, Admin Table & Grid)
  if (resolvedThumbnail && !imageError) {
    return (
      <img
        src={resolvedThumbnail}
        alt={title}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={className}
      />
    );
  }

  if (resolvedProvider === 'direct' && mediaUrl && !videoError) {
    return (
      <video
        src={mediaUrl}
        muted
        playsInline
        preload="metadata"
        onError={() => setVideoError(true)}
        className={`object-cover bg-[#171615] pointer-events-none ${className}`}
      />
    );
  }

  // Luxury Cinema Poster Fallback (e.g., Vimeo without explicit thumbnail or unavailable direct video)
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1E1B1A] via-[#461C25] to-[#141312] text-[#F7F2E9] p-4 text-center ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#57252F]/90 border border-[#C5A46D]/70 text-[#F7F2E9] mb-2">
        {resolvedProvider === 'vimeo' || resolvedProvider === 'youtube' ? (
          <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
        ) : (
          <Film className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
        )}
      </div>
      <span className="text-[11px] font-medium tracking-wide text-[#C5A46D]">
        {getVideoProviderLabel(resolvedProvider)}
      </span>
    </div>
  );
}
