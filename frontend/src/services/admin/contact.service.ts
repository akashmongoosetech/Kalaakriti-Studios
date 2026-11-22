import type {
  ContactRecord,
  ContactStatus,
  CreateContactInput,
  UpdateContactInput,
} from '../../types/contact.types';
import { apiRequest } from '../api/httpClient';
import { emitDataChange } from './storage.util';

interface ContactListPayload {
  items: ContactRecord[];
  counts: { active: number; trash: number };
  facets: { eventTypes: string[]; cities: string[] };
}

const SAMPLE_INQUIRIES: CreateContactInput[] = [
  {
    fullName: 'Raghav & Shruti Deshmukh',
    email: 'raghav.deshmukh@example.in',
    mobile: '+91 98261 44510',
    subject: 'Wedding Photography & 4K Film — Indore',
    eventType: 'Wedding Photography',
    city: 'Indore',
    eventDate: '2027-02-14',
    message:
      'Looking for full candid photography and 4K cinema coverage for our two-day winter wedding in Indore.',
    source: 'admin_demo',
  },
  {
    fullName: 'Niharika & Pranay Tiwari',
    email: 'niharika.tiwari@example.in',
    mobile: '+91 94250 71822',
    subject: 'Maheshwar Pre-Wedding Editorial Shoot',
    eventType: 'Pre-Wedding Shoot',
    city: 'Maheshwar',
    eventDate: '2027-01-22',
    message:
      'We would love a golden-hour pre-wedding photo and teaser film session along the ghats of Maheshwar Fort.',
    source: 'admin_demo',
  },
  {
    fullName: 'Siddhi & Ankur Malhotra',
    email: 'siddhi.malhotra@example.in',
    mobile: '+91 98932 61209',
    subject: 'Haldi & Mehendi Courtyard Coverage — Bhopal',
    eventType: 'Haldi & Mehendi Photography',
    city: 'Bhopal',
    eventDate: '2027-03-08',
    message:
      'Inquiring about natural-light candid coverage for our daytime Haldi and evening Mehendi celebrations in Bhopal.',
    source: 'admin_demo',
  },
];

let sampleCursor = 0;

export const contactService = {
  async getAll(): Promise<ContactRecord[]> {
    const res = await apiRequest<ContactListPayload>('/api/admin/contacts', {
      query: { view: 'active', limit: 100 },
    });
    return res.data?.items || [];
  },

  async getTrash(): Promise<ContactRecord[]> {
    const res = await apiRequest<ContactListPayload>('/api/admin/contacts', {
      query: { view: 'trash', limit: 100 },
    });
    return res.data?.items || [];
  },

  async create(input: CreateContactInput): Promise<ContactRecord> {
    const res = await apiRequest<ContactRecord>('/api/contacts', {
      method: 'POST',
      body: input,
    });
    emitDataChange();
    return res.data;
  },

  async update(id: string, input: UpdateContactInput): Promise<ContactRecord> {
    const res = await apiRequest<ContactRecord>(`/api/admin/contacts/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: input,
    });
    emitDataChange();
    return res.data;
  },

  async updateStatus(id: string, status: ContactStatus): Promise<ContactRecord> {
    const res = await apiRequest<ContactRecord>(
      `/api/admin/contacts/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        body: { status },
      }
    );
    emitDataChange();
    return res.data;
  },

  async softDelete(id: string): Promise<void> {
    await apiRequest(`/api/admin/contacts/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    emitDataChange();
  },

  async restore(id: string): Promise<void> {
    await apiRequest(`/api/admin/contacts/${encodeURIComponent(id)}/restore`, {
      method: 'PATCH',
    });
    emitDataChange();
  },

  async permanentDelete(id: string): Promise<void> {
    await apiRequest(`/api/admin/contacts/${encodeURIComponent(id)}/permanent`, {
      method: 'DELETE',
    });
    emitDataChange();
  },

  async createSampleInquiry(): Promise<ContactRecord> {
    const template = SAMPLE_INQUIRIES[sampleCursor % SAMPLE_INQUIRIES.length];
    sampleCursor += 1;
    return this.create(template);
  },
};
