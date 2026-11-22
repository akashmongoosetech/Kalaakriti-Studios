import { apiRequest } from './httpClient';
import type { ContactRecord, CreateContactInput } from '../../types/contact.types';
import type { BookingRecord, CreateBookingInput } from '../../types/booking.types';
import type { GalleryItem, TestimonialItem } from '../../types';
import type { InstagramPost } from '../../data/instagram';

export interface NewsletterSubscribeResponse {
  subscriber: {
    id: string;
    email: string;
    status: string;
    subscribedAt: string;
  };
  alreadySubscribed: boolean;
}

export interface GalleryDetailResponse {
  item: GalleryItem;
  related: GalleryItem[];
}

export interface InstagramFeedResponse {
  account: string;
  posts: InstagramPost[];
}

export const publicApi = {
  async submitContact(input: CreateContactInput): Promise<ContactRecord> {
    const res = await apiRequest<ContactRecord>('/api/contacts', {
      method: 'POST',
      body: input,
    });
    return res.data;
  },

  async submitBooking(input: CreateBookingInput): Promise<BookingRecord> {
    const res = await apiRequest<BookingRecord>('/api/bookings', {
      method: 'POST',
      body: input,
    });
    return res.data;
  },

  async subscribeNewsletter(
    email: string,
    source = 'website_newsletter'
  ): Promise<NewsletterSubscribeResponse> {
    const res = await apiRequest<NewsletterSubscribeResponse>('/api/newsletter/subscribe', {
      method: 'POST',
      body: { email, source },
    });
    return res.data;
  },

  async getGallery(
    params?: {
      category?: string;
      categorySlug?: string;
      type?: 'image' | 'video';
      search?: string;
      limit?: number;
    },
    signal?: AbortSignal
  ): Promise<GalleryItem[]> {
    const res = await apiRequest<GalleryItem[]>('/api/gallery', {
      query: params,
      signal,
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  async getGalleryBySlug(
    slug: string,
    signal?: AbortSignal
  ): Promise<GalleryDetailResponse> {
    const res = await apiRequest<GalleryDetailResponse>(
      `/api/gallery/${encodeURIComponent(slug)}`,
      { signal }
    );
    return res.data;
  },

  async getTestimonials(signal?: AbortSignal): Promise<TestimonialItem[]> {
    const res = await apiRequest<TestimonialItem[]>('/api/testimonials', { signal });
    return Array.isArray(res.data) ? res.data : [];
  },

  async getInstagramFeed(limit = 12, signal?: AbortSignal): Promise<InstagramFeedResponse> {
    const res = await apiRequest<InstagramFeedResponse>('/api/instagram', {
      query: { limit },
      signal,
    });
    return res.data;
  },
};
