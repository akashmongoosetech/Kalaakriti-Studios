import type {
  BookingRecord,
  BookingStatus,
  CreateBookingInput,
  UpdateBookingInput,
} from '../../types/booking.types';
import { apiRequest } from '../api/httpClient';
import { emitDataChange } from './storage.util';

interface BookingListPayload {
  items: BookingRecord[];
  counts: { active: number; trash: number };
  facets: { categories: string[]; cities: string[] };
}

const SAMPLE_BOOKINGS: CreateBookingInput[] = [
  {
    fullName: 'Devansh & Kritika Sharma',
    email: 'devansh.sharma@example.in',
    mobile: '9826055432',
    whatsapp: '9826055432',
    eventCategory: 'Wedding Photography',
    eventName: 'Devansh & Kritika Royal Wedding',
    eventDate: '2027-02-19',
    eventDuration: '3 Days (Full Wedding Suite)',
    eventLocation: 'Sayaji Courtyard Lawns, Vijay Nagar',
    city: 'Indore',
    guestCount: 'Grand Celebration (150 – 400 Guests)',
    coverageMode: 'both',
    addOns: ['Candid Photography', 'Traditional Photography', 'Drone Coverage', 'Heirloom Photo Album'],
    budgetRange: '₹2,00,000 – ₹3,75,000 (Multi-Day Heritage Wedding)',
    additionalRequirements: 'Same-week Sangeet teaser edit for family screening.',
    message:
      'We are planning a three-day winter wedding in Indore with Haldi, Sangeet, and twilight pheras.',
    source: 'admin_demo',
  },
  {
    fullName: 'Tanvi & Arpit Patidar',
    email: 'tanvi.patidar@example.in',
    mobile: '9425188320',
    whatsapp: '9425188320',
    eventCategory: 'Pre-Wedding Shoot',
    eventName: 'Tanvi & Arpit Maheshwar Heritage Film',
    eventDate: '2027-01-29',
    eventDuration: '1 Full Day',
    eventLocation: 'Ahilya Fort & Narmada Ghats',
    city: 'Maheshwar',
    guestCount: 'Intimate (Under 50 Guests)',
    coverageMode: 'both',
    addOns: ['Candid Photography', 'Drone Coverage', 'Pre-Wedding Shoot'],
    budgetRange: '₹45,000 – ₹90,000 (Intimate / Single Event)',
    additionalRequirements: 'Sunrise boat portrait session and golden-hour film reel.',
    message:
      'Looking for an editorial pre-wedding film and still portrait shoot celebrating Madhya Pradesh heritage architecture.',
    source: 'admin_demo',
  },
];

let bookingSampleCursor = 0;

export const bookingService = {
  async getAll(): Promise<BookingRecord[]> {
    const res = await apiRequest<BookingListPayload>('/api/admin/bookings', {
      query: { view: 'active', limit: 100 },
    });
    return res.data?.items || [];
  },

  async getTrash(): Promise<BookingRecord[]> {
    const res = await apiRequest<BookingListPayload>('/api/admin/bookings', {
      query: { view: 'trash', limit: 100 },
    });
    return res.data?.items || [];
  },

  async create(input: CreateBookingInput): Promise<BookingRecord> {
    const res = await apiRequest<BookingRecord>('/api/bookings', {
      method: 'POST',
      body: input,
    });
    emitDataChange();
    return res.data;
  },

  async update(id: string, input: UpdateBookingInput): Promise<BookingRecord> {
    const res = await apiRequest<BookingRecord>(`/api/admin/bookings/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: input,
    });
    emitDataChange();
    return res.data;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<BookingRecord> {
    const res = await apiRequest<BookingRecord>(
      `/api/admin/bookings/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        body: { status },
      }
    );
    emitDataChange();
    return res.data;
  },

  async softDelete(id: string): Promise<void> {
    await apiRequest(`/api/admin/bookings/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    emitDataChange();
  },

  async restore(id: string): Promise<void> {
    await apiRequest(`/api/admin/bookings/${encodeURIComponent(id)}/restore`, {
      method: 'PATCH',
    });
    emitDataChange();
  },

  async permanentDelete(id: string): Promise<void> {
    await apiRequest(`/api/admin/bookings/${encodeURIComponent(id)}/permanent`, {
      method: 'DELETE',
    });
    emitDataChange();
  },

  async createSampleBooking(): Promise<BookingRecord> {
    const template = SAMPLE_BOOKINGS[bookingSampleCursor % SAMPLE_BOOKINGS.length];
    bookingSampleCursor += 1;
    return this.create(template);
  },
};
