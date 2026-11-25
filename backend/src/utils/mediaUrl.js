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

/**
 * Blocks loopback, private, and link-local hosts to prevent SSRF or unsafe local embeds.
 */
function isBlockedHostname(hostname) {
  const host = String(hostname || '').trim().toLowerCase().replace(/^\[|\]$/g, '');
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

  // IPv4 private / loopback / link-local ranges
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [a, b] = [Number(ipv4Match[1]), Number(ipv4Match[2])];
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }

  return false;
}

function getPathExtension(pathname) {
  const clean = String(pathname || '').split('?')[0].split('#')[0].toLowerCase();
  const lastDot = clean.lastIndexOf('.');
  if (lastDot === -1) return '';
  return clean.slice(lastDot);
}

function isTrustedImageHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  return TRUSTED_IMAGE_HOSTS.some(
    (trusted) => host === trusted || host.endsWith(`.${trusted}`)
  );
}

function hasImageFormatHint(parsedUrl) {
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
  if (auto.includes('format')) {
    return true;
  }
  return false;
}

/**
 * Validates an image URL. Accepts http/https URLs with common image extensions
 * or trusted image CDN hosts (and optionally bundled relative /src/assets/ paths for seeded items).
 */
function validateImageUrl(rawUrl, { allowRelativeStudioAsset = false } = {}) {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Image URL is required.' };
  }

  if (allowRelativeStudioAsset && /^\/src\/assets\/images\/[a-zA-Z0-9._/-]+$/.test(trimmed)) {
    return {
      valid: true,
      normalizedUrl: trimmed,
      thumbnailUrl: trimmed,
      embedUrl: '',
      videoProvider: '',
    };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Please enter a valid HTTP or HTTPS image URL.' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, error: 'Only HTTP and HTTPS image URLs are allowed.' };
  }

  if (isBlockedHostname(parsed.hostname)) {
    return { valid: false, error: 'Local or private network URLs are not permitted.' };
  }

  const ext = getPathExtension(parsed.pathname);
  if (ext === '.svg' || ext === '.html' || ext === '.htm' || ext === '.js') {
    return {
      valid: false,
      error: 'Unsupported file format. Use JPG, JPEG, PNG, WebP, GIF, or AVIF image URLs.',
    };
  }

  const hasValidExt = IMAGE_EXTENSIONS.has(ext);
  const trustedHost = isTrustedImageHost(parsed.hostname);
  const formatHint = hasImageFormatHint(parsed);

  if (!hasValidExt && !trustedHost && !formatHint) {
    return {
      valid: false,
      error:
        'Image URL must point to a JPG, JPEG, PNG, WebP, GIF, or AVIF image, or a supported image hosting provider (e.g., Unsplash, Pexels, Cloudinary, Imgur).',
    };
  }

  return {
    valid: true,
    normalizedUrl: parsed.toString(),
    thumbnailUrl: parsed.toString(),
    embedUrl: '',
    videoProvider: '',
  };
}

/**
 * Parses and validates supported video URLs:
 * - YouTube (watch, youtu.be, embed, live)
 * - YouTube Shorts
 * - Vimeo (vimeo.com/:id, player.vimeo.com/video/:id, channels/groups)
 * - Direct video files (.mp4, .webm, .ogg, .mov, .m4v)
 */
function parseVideoUrl(rawUrl) {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) {
    return { valid: false, error: 'Video URL is required.' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: 'Please enter a valid HTTP or HTTPS video URL.' };
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, error: 'Only HTTP and HTTPS video URLs are allowed.' };
  }

  if (isBlockedHostname(parsed.hostname)) {
    return { valid: false, error: 'Local or private network URLs are not permitted.' };
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  const segments = parsed.pathname.split('/').filter(Boolean);

  // 1. YouTube & YouTube Shorts
  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtube-nocookie.com' ||
    host === 'youtu.be'
  ) {
    let videoId = '';
    let provider = 'youtube';

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
        valid: false,
        error: 'Invalid YouTube URL. Provide a valid YouTube watch, share (youtu.be), or Shorts URL.',
      };
    }

    return {
      valid: true,
      normalizedUrl: parsed.toString(),
      videoProvider: provider,
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 2. Vimeo
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    let videoId = '';
    if (host === 'player.vimeo.com' && segments[0] === 'video' && segments[1]) {
      videoId = segments[1];
    } else {
      // Handle /123456789, /channels/staffpicks/123456789, /groups/name/videos/123456789
      const numericSegment = [...segments].reverse().find((seg) => VIMEO_ID_REGEX.test(seg));
      videoId = numericSegment || '';
    }

    if (!VIMEO_ID_REGEX.test(videoId)) {
      return {
        valid: false,
        error: 'Invalid Vimeo URL. Provide a valid Vimeo video URL (e.g., https://vimeo.com/123456789).',
      };
    }

    return {
      valid: true,
      normalizedUrl: parsed.toString(),
      videoProvider: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1`,
      thumbnailUrl: '',
    };
  }

  // 3. Direct video URLs (.mp4, .webm, .ogg, .mov, .m4v)
  const ext = getPathExtension(parsed.pathname);
  if (DIRECT_VIDEO_EXTENSIONS.has(ext)) {
    return {
      valid: true,
      normalizedUrl: parsed.toString(),
      videoProvider: 'direct',
      videoId: '',
      embedUrl: '',
      thumbnailUrl: '',
    };
  }

  return {
    valid: false,
    error:
      'Unsupported video URL. Use a valid YouTube, YouTube Shorts, Vimeo, or direct video file URL (.mp4, .webm, .ogg, .mov).',
  };
}

function validateMediaUrl(mediaType, rawUrl, opts = {}) {
  if (mediaType === 'video') {
    return parseVideoUrl(rawUrl);
  }
  return validateImageUrl(rawUrl, opts);
}

function slugifyText(input, fallback = 'gallery-item') {
  const slug = String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 96);
  return slug || fallback;
}

module.exports = {
  validateImageUrl,
  parseVideoUrl,
  validateMediaUrl,
  slugifyText,
};
