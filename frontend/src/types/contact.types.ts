export const CONTACT_STATUSES = [
  'New',
  'Contacted',
  'In Progress',
  'Converted',
  'Closed',
  'Spam',
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export interface ContactRecord {
  id: string;
  contactId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobile: string;
  subject: string;
  eventType: string;
  city: string;
  eventDate?: string;
  message: string;
  status: ContactStatus;
  submittedAt: string;
  updatedAt: string;
  source: 'public_form' | 'admin_demo';
  deletedAt?: string | null;
}

export interface CreateContactInput {
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  mobile: string;
  subject?: string;
  eventType: string;
  city: string;
  eventDate?: string;
  message: string;
  status?: ContactStatus;
  source?: 'public_form' | 'admin_demo';
}

export interface UpdateContactInput {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  subject: string;
  eventType: string;
  city: string;
  eventDate?: string;
  message: string;
  status: ContactStatus;
}
