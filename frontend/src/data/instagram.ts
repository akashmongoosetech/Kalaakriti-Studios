import { STUDIO_IMAGES } from './media';
import { STUDIO_CONFIG } from './studio';

export type InstagramMediaType = 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO';
export type InstagramAspectRatio = 'portrait' | 'square' | 'landscape';

export interface InstagramPost {
  id: string;
  caption: string;
  media_type: InstagramMediaType;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  location?: string;
  aspectRatio?: InstagramAspectRatio;
}

export const FALLBACK_INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-101',
    caption:
      'Twilight pheras beneath hand-strung mogra and marigold garlands. Every golden ember reflected the quiet devotion of two families uniting in Indore.',
    media_type: 'CAROUSEL_ALBUM',
    media_url: STUDIO_IMAGES.heroWedding,
    thumbnail_url: STUDIO_IMAGES.heroWedding,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-11-18T14:30:00Z',
    location: 'Indore, Madhya Pradesh',
    aspectRatio: 'portrait',
  },
  {
    id: 'ig-102',
    caption:
      'Morning sunlight, brass urulis, and joyful bursts of turmeric and marigold petals during a courtyard Haldi ceremony in Ujjain.',
    media_type: 'IMAGE',
    media_url: STUDIO_IMAGES.haldiRitual,
    thumbnail_url: STUDIO_IMAGES.haldiRitual,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-11-14T09:15:00Z',
    location: 'Ujjain, Madhya Pradesh',
    aspectRatio: 'square',
  },
  {
    id: 'ig-103',
    caption:
      'Golden hour silhouettes along the sandstone arches of Ahilya Fort overlooking the Narmada — a timeless Maheshwar pre-wedding reel.',
    media_type: 'VIDEO',
    media_url: STUDIO_IMAGES.preweddingPalace,
    thumbnail_url: STUDIO_IMAGES.preweddingPalace,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-11-10T17:45:00Z',
    location: 'Maheshwar, Madhya Pradesh',
    aspectRatio: 'landscape',
  },
  {
    id: 'ig-104',
    caption:
      'Intricate bridal henna, heirloom polki bangles, and emerald silk captured in soft window light before the evening Sangeet.',
    media_type: 'CAROUSEL_ALBUM',
    media_url: STUDIO_IMAGES.mehendiBridal,
    thumbnail_url: STUDIO_IMAGES.mehendiBridal,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-11-06T12:20:00Z',
    location: 'Bhopal, Madhya Pradesh',
    aspectRatio: 'portrait',
  },
  {
    id: 'ig-105',
    caption:
      'Warm chandelier glow and joyful applause as rings were exchanged on an autumn evening in Indore.',
    media_type: 'VIDEO',
    media_url: STUDIO_IMAGES.engagementSangeet,
    thumbnail_url: STUDIO_IMAGES.engagementSangeet,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-10-29T18:10:00Z',
    location: 'Indore, Madhya Pradesh',
    aspectRatio: 'landscape',
  },
  {
    id: 'ig-106',
    caption:
      'Fine-art portrait study in handwoven Maheshwari zari silk — sculpted with directional natural light and understated editorial grading.',
    media_type: 'IMAGE',
    media_url: STUDIO_IMAGES.portraitStudio,
    thumbnail_url: STUDIO_IMAGES.portraitStudio,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-10-24T11:00:00Z',
    location: 'Indore Studio',
    aspectRatio: 'portrait',
  },
  {
    id: 'ig-107',
    caption:
      'Sacred vows beside the ceremonial havan fire — documentary restraint preserving every flicker of candlelight and emotion.',
    media_type: 'CAROUSEL_ALBUM',
    media_url: STUDIO_IMAGES.weddingPheras,
    thumbnail_url: STUDIO_IMAGES.weddingPheras,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-10-18T16:40:00Z',
    location: 'Bhopal, Madhya Pradesh',
    aspectRatio: 'landscape',
  },
  {
    id: 'ig-108',
    caption:
      'Quiet anticipation draped in pastel Chanderi silk — an intimate maternity heirloom session overlooking Upper Lake.',
    media_type: 'IMAGE',
    media_url: STUDIO_IMAGES.maternityFamily,
    thumbnail_url: STUDIO_IMAGES.maternityFamily,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-10-11T10:30:00Z',
    location: 'Bhopal, Madhya Pradesh',
    aspectRatio: 'square',
  },
  {
    id: 'ig-109',
    caption:
      'Candlelit laughter, floral backdrops, and three generations celebrating a milestone evening together.',
    media_type: 'IMAGE',
    media_url: STUDIO_IMAGES.birthdayCelebration,
    thumbnail_url: STUDIO_IMAGES.birthdayCelebration,
    permalink: STUDIO_CONFIG.social.instagram,
    timestamp: '2026-10-04T15:05:00Z',
    location: 'Indore, Madhya Pradesh',
    aspectRatio: 'landscape',
  },
];
