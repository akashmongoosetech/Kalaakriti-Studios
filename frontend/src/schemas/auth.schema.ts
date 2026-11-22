import { z } from 'zod';

const indianMobileRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const validNameRegex = /^[A-Za-z\u0900-\u097F\s'.-]+$/;

export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(72, 'Password must be under 72 characters.')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter.')
  .regex(/[0-9]/, 'Password must include at least one number.')
  .regex(/[^A-Za-z0-9]/, 'Password must include at least one special character.');

export function evaluatePasswordStrength(password: string): {
  score: number;
  label: 'Empty' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  checks: {
    length: boolean;
    upper: boolean;
    lower: boolean;
    number: boolean;
    special: boolean;
  };
} {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  if (!password) {
    return { score: 0, label: 'Empty', checks };
  }
  const score = Object.values(checks).filter(Boolean).length;
  const label =
    score <= 2 ? 'Weak' : score === 3 ? 'Fair' : score === 4 ? 'Good' : 'Strong';
  return { score, label, checks };
}

export const adminSignupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must be under 50 characters.')
    .regex(validNameRegex, 'Please enter a valid first name.'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must be under 50 characters.')
    .regex(validNameRegex, 'Please enter a valid last name.'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  mobile: z
    .string()
    .trim()
    .regex(
      indianMobileRegex,
      'Enter a valid Indian mobile number (10 digits or +91 9876543210).'
    ),
  password: strongPasswordSchema,
  profilePicture: z
    .string()
    .min(1, 'Please upload a profile picture (JPG, PNG, or WebP under 5 MB).'),
});

export type AdminSignupValues = z.infer<typeof adminSignupSchema>;

export const adminLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, 'Enter your username, email address, or Indian mobile number.'),
  password: z.string().min(1, 'Please enter your password.'),
  rememberMe: z.boolean(),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export const adminForgotPasswordSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Please enter your registered email address.'),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type AdminForgotPasswordValues = z.infer<typeof adminForgotPasswordSchema>;

export const adminProfileUpdateSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must be at least 2 characters.')
    .max(50, 'First name must be under 50 characters.')
    .regex(validNameRegex, 'Please enter a valid first name.'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must be at least 2 characters.')
    .max(50, 'Last name must be under 50 characters.')
    .regex(validNameRegex, 'Please enter a valid last name.'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  mobile: z
    .string()
    .trim()
    .regex(
      indianMobileRegex,
      'Enter a valid Indian mobile number (10 digits or +91 9876543210).'
    ),
});

export type AdminProfileUpdateValues = z.infer<typeof adminProfileUpdateSchema>;

export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Please enter your current password.'),
    newPassword: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match.',
    path: ['confirmPassword'],
  });

export type AdminChangePasswordValues = z.infer<typeof adminChangePasswordSchema>;
