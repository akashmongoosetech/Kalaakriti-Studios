export type MediaType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  slug: string;
  type: MediaType;
  title: string;
  category: string;
  categorySlug: string;
  thumbnail: string;
  src: string;
  /** Optional real MP4 URL when deployed with studio video files; falls back to interactive Cinema Reel player */
  videoUrl?: string;
  reelFrames?: string[];
  duration?: string;
  description: string;
  aspectRatio?: 'portrait' | 'landscape' | 'wide' | 'square';
  location: string;
  year: string;
  coupleOrClient: string;
  isDemoContent?: boolean;
  cameraSpec?: string;
  storyHighlights?: string[];
}

export interface CategoryPackage {
  name: string;
  summary: string;
  coverage: string;
  deliverables: string[];
  note: string;
}

export interface CategoryFAQ {
  question: string;
  answer: string;
}

export interface PhotographyCategory {
  slug: string;
  name: string;
  devanagariLabel: string;
  shortDescription: string;
  longDescription: string;
  introduction: string;
  heroImage: string;
  cardImage: string;
  sampleCount: number;
  featuredImages: { src: string; alt: string; caption: string }[];
  styles: { title: string; detail: string }[];
  relatedServiceSlugs: string[];
  packages: CategoryPackage[];
  faqs: CategoryFAQ[];
  relatedCategories: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface StudioService {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  image: string;
  description: string;
  included: string[];
  benefits: string[];
  styles: string[];
  relatedCategorySlug: string;
  tierAvailability: {
    intimate: boolean;
    signature: boolean;
    royal: boolean;
  };
}

export interface TestimonialItem {
  id: string;
  quote: string;
  clientName: string;
  eventLabel: string;
  city: string;
  portrait: string;
  isSample: boolean;
}

export interface CityCoverage {
  slug: string;
  name: string;
  regionTag: string;
  description: string;
  venuesStyle: string;
  recommendedCategory: string;
}

export interface FAQItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

export interface DemoBookingRecord {
  referenceId: string;
  createdAt: string;
  eventCategory: string;
  eventName: string;
  eventDate: string;
  eventDuration: string;
  eventLocation: string;
  city: string;
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  coverageMode: 'photography' | 'cinematography' | 'both';
  addOns: string[];
  budgetRange: string;
  guestCount: string;
  additionalRequirements: string;
  message: string;
}
