import { z } from 'zod';
import { BOOKING_STATUSES } from '../types/booking.types';

const indianMobileRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const adminBookingEditSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Customer name must be at least 2 characters.')
    .max(80, 'Customer name must be under 80 characters.'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  mobile: z
    .string()
    .trim()
    .regex(indianMobileRegex, 'Enter a valid Indian mobile number.'),
  whatsapp: z
    .string()
    .trim()
    .regex(indianMobileRegex, 'Enter a valid Indian WhatsApp number.'),
  eventCategory: z.string().min(1, 'Select an event category.'),
  eventName: z
    .string()
    .trim()
    .min(2, 'Enter an event title.')
    .max(120, 'Event title must be under 120 characters.'),
  eventDate: z.string().min(1, 'Select an event date.'),
  eventDuration: z.string().min(1, 'Select an event duration.'),
  eventLocation: z.string().trim().min(2, 'Enter the event venue or locality.'),
  city: z.string().trim().min(2, 'Enter the event city.'),
  guestCount: z.string().min(1, 'Select approximate guest count.'),
  coverageMode: z.enum(['photography', 'cinematography', 'both']),
  addOns: z.array(z.string()),
  budgetRange: z.string().min(1, 'Select a budget range.'),
  additionalRequirements: z.string().trim().max(500),
  message: z
    .string()
    .trim()
    .min(5, 'Enter celebration notes (at least 5 characters).')
    .max(1500, 'Notes must be under 1,500 characters.'),
  status: z.enum(BOOKING_STATUSES),
});

export type AdminBookingEditValues = z.infer<typeof adminBookingEditSchema>;
