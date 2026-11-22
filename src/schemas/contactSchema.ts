import { z } from 'zod';

const indianMobileRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const contactFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(80, 'Name must be under 80 characters.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  mobile: z
    .string()
    .trim()
    .regex(indianMobileRegex, 'Enter a valid 10-digit Indian mobile number (e.g., 9876543210 or +91 9876543210).'),
  eventType: z.string().min(1, 'Please choose an event or session type.'),
  eventDate: z
    .string()
    .min(1, 'Please select a tentative date.')
    .refine((val) => {
      const chosen = new Date(val + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !Number.isNaN(chosen.getTime()) && chosen >= today;
    }, 'Please choose today or an upcoming event date.'),
  city: z.string().trim().min(2, 'Please enter your event city.'),
  message: z
    .string()
    .trim()
    .min(12, 'Share a few details about your celebration or vision (at least 12 characters).')
    .max(1200, 'Message must be under 1,200 characters.'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
