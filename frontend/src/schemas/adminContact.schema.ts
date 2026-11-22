import { z } from 'zod';
import { CONTACT_STATUSES } from '../types/contact.types';

const indianMobileRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const adminContactEditSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must be under 50 characters.'),
  lastName: z
    .string()
    .trim()
    .max(50, 'Last name must be under 50 characters.'),
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  mobile: z
    .string()
    .trim()
    .regex(indianMobileRegex, 'Enter a valid Indian mobile number (e.g., +91 9876543210).'),
  subject: z
    .string()
    .trim()
    .min(2, 'Subject must be at least 2 characters.')
    .max(120, 'Subject must be under 120 characters.'),
  eventType: z.string().min(1, 'Select an event type.'),
  city: z.string().trim().min(2, 'Enter a city name.'),
  eventDate: z.string(),
  message: z
    .string()
    .trim()
    .min(5, 'Message must be at least 5 characters.')
    .max(1500, 'Message must be under 1,500 characters.'),
  status: z.enum(CONTACT_STATUSES),
});

export type AdminContactEditValues = z.infer<typeof adminContactEditSchema>;
