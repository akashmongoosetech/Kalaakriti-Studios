/**
 * Centralized Indian Photography Studio Media Registry
 * Replace any path below with your own studio photography or video files
 * placed inside src/assets/images/ or src/assets/videos/.
 */

export const STUDIO_IMAGES = {
  heroWedding: '/src/assets/images/hero_indian_wedding_1795336908672.jpg',
  preweddingPalace: '/src/assets/images/cat_prewedding_palace_1795336909284.jpg',
  haldiRitual: '/src/assets/images/cat_haldi_ritual_1795336908439.jpg',
  mehendiBridal: '/src/assets/images/cat_mehendi_bridal_1795336908797.jpg',
  engagementSangeet: '/src/assets/images/cat_engagement_sangeet_1795336908194.jpg',
  weddingPheras: '/src/assets/images/cat_wedding_pheras_1795336909002.jpg',
  maternityFamily: '/src/assets/images/cat_maternity_family_1795336909327.jpg',
  birthdayCelebration: '/src/assets/images/cat_birthday_celebration_1795336909037.jpg',
  corporateEvent: '/src/assets/images/cat_corporate_event_1795336909654.jpg',
  portraitStudio: '/src/assets/images/cat_portrait_studio_1795336909239.jpg',
} as const;

export type StudioImageKey = keyof typeof STUDIO_IMAGES;
