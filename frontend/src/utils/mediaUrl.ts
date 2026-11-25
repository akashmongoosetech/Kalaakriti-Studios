import type { MediaType, VideoProvider } from '../types';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const DIRECT_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.ogg', '.ogv', '.mov', '.m4v']);

const TRUSTED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'plus.unsplash.com',
  'images.pexels.com',
  'res.cloudinary.com',
  'cdn.pixabay.com',
  'pixabay.com',
  'i.imgur.com',
  'lh3.googleusercontent.com',
  'storage.googleapis.com',
  'firebasestorage.googleapis.com',
  'ik.imagekit.io',
  'images.ctfassets.net',
  'cdn.shopify.com',
  'picsum.photos',
  'fastly.picsum.photos',
  'media.istockphoto.com',
  'i.ytimg.com',
  'img.youtube.com',
  'i.vimeocdn.com',
  'm.media-amazon.com',
  'upload.wikimedia.org',
];

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;
const VIMEO_ID_REGEX = /^\d{6,12}$/;

export interface ParsedMediaUrl {
  valid: boolean;
  mediaType: MediaType;
  normalizedUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  videoProvider: VideoProvider;
  providerLabel: string;
  error?: string;
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.trim().toLowerCase().replace(/^\[|\]$/g, '');
  if (!host) return true;
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost')
  ) {
    return true;
  }

  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }

  return false;
}

function getPathExtension(pathname: string): string {
  const clean = pathname.split('?')[0].split('#')[0].toLowerCase();
  const lastDot = clean.lastIndexOf('.');
  return lastDot === -1 ? '' : clean.slice(lastDot);
}

function isTrustedImageHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return TRUSTED_IMAGE_HOSTS.some(
    (trusted) => host === trusted || host.endsWith(`.${trusted}`)
  );
}

function hasImageFormatHint(parsedUrl: URL): boolean {
  const fm = (
    parsedUrl.searchParams.get('fm') ||
    parsedUrl.searchParams.get('format') ||
    parsedUrl.searchParams.get('ext') ||
    ''
  ).toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(fm)) {
    return true;
  }
  const auto = (parsedUrl.searchParams.get('auto') || '').toLowerCase();
  return auto.includes('format');
}

export function isTrustedEmbedUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      (host === 'www.youtube-nocookie.com' || host === 'www.youtube.com') &&
      parsed.pathname.startsWith('/embed/')
    ) {
      const id = parsed.pathname.split('/')[2] || '';
      return YOUTUBE_ID_REGEX.test(id);
    }
    if (host === 'player.vimeo.com' && parsed.pathname.startsWith('/video/')) {
      const id = parsed.pathname.split('/')[2] || '';
      return VIMEO_ID_REGEX.test(id);
    }
    return false;
  } catch {
    return false;
  }
}

export function parseGalleryMediaUrl(
  mediaType: MediaType,
  rawUrl: string,
  options?: { allowRelativeStudioAsset?: boolean }
): ParsedMediaUrl {
  const trimmed = (rawUrl || '').trim();
  const baseInvalid: ParsedMediaUrl = {
    valid: false,
    mediaType,
    normalizedUrl: trimmed,
    embedUrl: '',
    thumbnailUrl: '',
    videoProvider: '',
    providerLabel: mediaType === 'video' ? 'Video' : 'Image',
  };

  if (!trimmed) {
    return {
      ...baseInvalid,
      error: mediaType === 'video' ? 'Video URL is required.' : 'Image URL is required.',
    };
  }

  if (
    options?.allowRelativeStudioAsset &&
    /^\/src\/assets\/images\/[a-zA-Z0-9._/-]+$/.test(trimmed)
  ) {
    return {
      valid: true,
      mediaType,
      normalizedUrl: trimmed,
      embedUrl: '',
      thumbnailUrl: trimmed,
      videoProvider: mediaType === 'video' ? 'reel' : '',
      providerLabel: mediaType === 'video' ? 'Studio Cinema Reel' : 'Studio Photograph',
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      ...baseInvalid,
      error: `Please enter a valid HTTP or HTTPS ${mediaType} URL.`,
    };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return {
      ...baseInvalid,
      error: 'Only HTTP and HTTPS URLs are allowed.',
    };
  }

  if (isBlockedHostname(parsed.hostname)) {
    return {
      ...baseInvalid,
      error: 'Local or private network URLs are not permitted.',
    };
  }

  if (mediaType === 'image') {
    const ext = getPathExtension(parsed.pathname);
    if (ext === '.svg' || ext === '.html' || ext === '.htm' || ext === '.js') {
      return {
        ...baseInvalid,
        error: 'Unsupported format. Use JPG, JPEG, PNG, WebP, GIF, or AVIF image URLs.',
      };
    }

    if (!IMAGE_EXTENSIONS.has(ext) && !isTrustedImageHost(parsed.hostname) && !hasImageFormatHint(parsed)) {
      return {
        ...baseInvalid,
        error:
          'Use a direct JPG, PNG, WebP, GIF, or AVIF image URL, or a supported image host (Unsplash, Pexels, Cloudinary, Imgur).',
      };
    }

    return {
      valid: true,
      mediaType: 'image',
      normalizedUrl: parsed.toString(),
      embedUrl: '',
      thumbnailUrl: parsed.toString(),
      videoProvider: '',
      providerLabel: 'Image URL',
    };
  }

  // Video URL parsing
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const segments = parsed.pathname.split('/').filter(Boolean);

  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtube-nocookie.com' ||
    host === 'youtu.be'
  ) {
    let videoId = '';
    let provider: VideoProvider = 'youtube';

    if (host === 'youtu.be') {
      videoId = segments[0] || '';
    } else if (segments[0] === 'shorts' && segments[1]) {
      videoId = segments[1];
      provider = 'youtube_shorts';
    } else if (segments[0] === 'embed' && segments[1]) {
      videoId = segments[1];
    } else if (segments[0] === 'live' && segments[1]) {
      videoId = segments[1];
    } else if (segments[0] === 'watch' || parsed.searchParams.has('v')) {
      videoId = parsed.searchParams.get('v') || '';
    }

    if (!YOUTUBE_ID_REGEX.test(videoId)) {
      return {
        ...baseInvalid,
        error: 'Invalid YouTube URL. Enter a valid YouTube watch, youtu.be, or Shorts link.',
      };
    }

    return {
      valid: true,
      mediaType: 'video',
      normalizedUrl: parsed.toString(),
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      videoProvider: provider,
      providerLabel: provider === 'youtube_shorts' ? 'YouTube Shorts' : 'YouTube Video',
    };
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    let videoId = '';
    if (host === 'player.vimeo.com' && segments[0] === 'video' && segments[1]) {
      videoId = segments[1];
    } else {
      const numericSegment = [...segments].reverse().find((seg) => VIMEO_ID_REGEX.test(seg));
      videoId = numericSegment || '';
    }

    if (!VIMEO_ID_REGEX.test(videoId)) {
      return {
        ...baseInvalid,
        error: 'Invalid Vimeo URL. Example: https://vimeo.com/123456789',
      };
    }

    return {
      valid: true,
      mediaType: 'video',
      normalizedUrl: parsed.toString(),
      embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1`,
      thumbnailUrl: '',
      videoProvider: 'vimeo',
      providerLabel: 'Vimeo Film',
    };
  }

  const ext = getPathExtension(parsed.pathname);
  if (DIRECT_VIDEO_EXTENSIONS.has(ext)) {
    return {
      valid: true,
      mediaType: 'video',
      normalizedUrl: parsed.toString(),
      embedUrl: '',
      thumbnailUrl: '',
      videoProvider: 'direct',
      providerLabel: `Direct ${ext.slice(1).toUpperCase()} Video`,
    };
  }

  return {
    ...baseInvalid,
    error:
      'Unsupported video source. Enter a YouTube, YouTube Shorts, Vimeo, or direct MP4/WebM/OGG/MOV video URL.',
  };
}

export function getVideoProviderLabel(provider?: VideoProvider): string {
  switch (provider) {
    case 'youtube':
      return 'YouTube';
    case 'youtube_shorts':
      return 'YouTube Shorts';
    case 'vimeo':
      return 'Vimeo';
    case 'direct':
      return 'Direct Video';
    case 'reel':
      return 'Cinema Reel';
    default:
      return 'Video';
  }
}
