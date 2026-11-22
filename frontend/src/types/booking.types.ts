export const BOOKING_STATUSES = [
  'Pending',
  'Contacted',
  'Quotation Sent',
  'Confirmed',
  'In Progress',
  'Completed',
  'Cancelled',
  'Rejected',
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type CoverageMode = 'photography' | 'cinematography' | 'both';

export interface BookingRecord {
  id: string;
  referenceId: string;
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  eventCategory: string;
  eventName: string;
  eventDate: string;
  eventDuration: string;
  eventLocation: string;
  city: string;
  guestCount: string;
  coverageMode: CoverageMode;
  addOns: string[];
  budgetRange: string;
  additionalRequirements: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  source: 'public_form' | 'admin_demo';
  deletedAt?: string | null;
}

export interface CreateBookingInput {
  referenceId?: string;
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  eventCategory: string;
  eventName: string;
  eventDate: string;
  eventDuration: string;
  eventLocation: string;
  city: string;
  guestCount: string;
  coverageMode: CoverageMode;
  addOns: string[];
  budgetRange: string;
  additionalRequirements?: string;
  message: string;
  status?: BookingStatus;
  source?: 'public_form' | 'admin_demo';
}

export interface UpdateBookingInput {
  fullName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  eventCategory: string;
  eventName: string;
  eventDate: string;
  eventDuration: string;
  eventLocation: string;
  city: string;
  guestCount: string;
  coverageMode: CoverageMode;
  addOns: string[];
  budgetRange: string;
  additionalRequirements: string;
  message: string;
  status: BookingStatus;
}
