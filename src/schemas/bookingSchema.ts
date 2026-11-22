import { z } from 'zod';

const indianMobileRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const bookingFormSchema = z.object({
  // Step 1: Event Details
  eventCategory: z.string().min(1, 'Please select an event category.'),
  eventName: z
    .string()
    .trim()
    .min(2, 'Please provide a brief event title (e.g., Aarav & Meera Wedding).')
    .max(100, 'Keep the event title under 100 characters.'),
  eventDate: z
    .string()
    .min(1, 'Please select your primary event date.')
    .refine((val) => {
      const chosen = new Date(val + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !Number.isNaN(chosen.getTime()) && chosen >= today;
    }, 'Please choose today or a future date.'),
  eventDuration: z.string().min(1, 'Please choose the estimated duration.'),
  eventLocation: z
    .string()
    .trim()
    .min(3, 'Please enter your venue name or locality.')
    .max(140, 'Location must be under 140 characters.'),
  city: z.string().trim().min(2, 'Please select or enter the event city.'),

  // Step 2: Personal Details
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(80),
  email: z.string().trim().email('Please enter a valid email address.'),
  mobile: z
    .string()
    .trim()
    .regex(indianMobileRegex, 'Enter a valid 10-digit Indian mobile number.'),
  whatsapp: z
    .string()
    .trim()
    .regex(indianMobileRegex, 'Enter a valid 10-digit WhatsApp number.'),

  // Step 3: Photography Requirements
  coverageMode: z.enum(['photography', 'cinematography', 'both']),
  addOns: z.array(z.string()),

  // Step 4: Budget & Additional Info
  budgetRange: z.string().min(1, 'Please select an estimated investment range.'),
  guestCount: z.string().min(1, 'Please select the approximate guest count.'),
  additionalRequirements: z.string().trim().max(500),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us briefly about your celebration rituals or aesthetic preferences (10+ characters).')
    .max(1200),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const BOOKING_STEP_FIELDS: Record<number, (keyof BookingFormValues)[]> = {
  1: ['eventCategory', 'eventName', 'eventDate', 'eventDuration', 'eventLocation', 'city'],
  2: ['fullName', 'email', 'mobile', 'whatsapp'],
  3: ['coverageMode', 'addOns'],
  4: ['budgetRange', 'guestCount', 'additionalRequirements', 'message'],
  5: [],
};
