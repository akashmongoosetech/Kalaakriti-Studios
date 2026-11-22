/**
 * CENTRALIZED STUDIO CONFIGURATION
 * Replace placeholder studio details, custom uploaded logo image URL,
 * phone number, address, and social URLs in this single file to personalize
 * the entire website immediately.
 */

export const STUDIO_CONFIG = {
  // Replace with your studio name
  name: 'Kalaakriti Studios',
  devanagariName: 'कलाकृति',
  tagline: 'Capturing Emotions. Creating Timeless Memories.',
  shortIntro:
    'An Indian wedding photography and cinematography house based in Indore, Madhya Pradesh, dedicated to preserving sacred rituals, heartfelt family bonds, and heirloom portraits with editorial grace.',

  /**
   * Optional custom uploaded logo image path (e.g., '/src/assets/logo/studio-logo.png').
   * When set, StudioLogo renders your exact uploaded image preserving transparency
   * and original aspect ratio. Leave empty string '' to display the bespoke crest emblem.
   */
  logoImageUrl: '',
  logoDarkBgImageUrl: '',

  // Editable placeholder studio contact details (clearly marked for replacement)
  city: 'Indore',
  state: 'Madhya Pradesh',
  country: 'India',
  locationLabel: 'Indore, Madhya Pradesh, India',
  phoneDisplay: '+91 98000 00000 (Demo)',
  phoneHref: '+919800000000',
  whatsappNumber: '919800000000',
  email: 'hello@kalaakritistudios.example',
  addressLine1: 'Suite 402, Heritage Arcade, AB Road',
  addressLine2: 'Vijay Nagar, Indore, Madhya Pradesh 452010',
  businessHours: 'Tuesday – Sunday · 10:30 AM – 7:30 PM IST (Monday by appointment)',
  websiteUrl: 'https://kalaakritistudios.example',

  social: {
    instagram: 'https://instagram.com/kalaakritistudios.example',
    instagramHandle: '@kalaakritistudios',
    facebook: 'https://facebook.com/kalaakritistudios.example',
    youtube: 'https://youtube.com/@kalaakritistudios.example',
    pinterest: 'https://pinterest.com/kalaakritistudios.example',
  },

  /**
   * Editable demonstration counters — clearly labeled in UI as sample figures
   * until updated with verified studio metrics.
   */
  demoStats: [
    { value: 500, suffix: '+', label: 'Celebrations Captured', note: 'Sample studio metric' },
    { value: 300, suffix: '+', label: 'Happy Families', note: 'Sample studio metric' },
    { value: 100, suffix: '+', label: 'Wedding Stories', note: 'Sample studio metric' },
    { value: 5, suffix: '+', label: 'Years of Creative Craft', note: 'Sample studio metric' },
  ],
} as const;

export function buildWhatsAppUrl(message: string): string {
  const digitsOnly = STUDIO_CONFIG.whatsappNumber.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}
