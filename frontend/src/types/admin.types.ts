export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  profilePicture: string;
  role: 'Studio Administrator';
  createdAt: string;
  updatedAt: string;
}

/**
 * Stored account record for the frontend-only demonstration auth adapter.
 * Plaintext passwords are NEVER persisted; only a salted SHA-256 digest is stored.
 */
export interface StoredAdminAccount extends AdminUser {
  passwordSalt: string;
  passwordHash: string;
}

export interface AdminSession {
  userId: string;
  username: string;
  email: string;
  rememberMe: boolean;
  loggedInAt: string;
}

export type ActivityType =
  | 'contact_received'
  | 'contact_updated'
  | 'contact_deleted'
  | 'booking_submitted'
  | 'booking_updated'
  | 'booking_deleted'
  | 'status_changed';

export interface ActivityLogItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  entityType: 'contact' | 'booking' | 'profile';
  entityId: string;
  timestamp: string;
}

export interface MonthlyChartDatum {
  month: string;
  count: number;
}

export interface DailyTrendDatum {
  date: string;
  label: string;
  bookings: number;
  inquiries: number;
  total: number;
}

export interface TrendsSummary {
  totalBookings: number;
  totalInquiries: number;
  bookingsChangePct: number | null;
  inquiriesChangePct: number | null;
  peakDayLabel: string | null;
  peakDayTotal: number;
  dailyAverage: number;
}

export interface DistributionChartDatum {
  name: string;
  value: number;
  fill: string;
}

export interface DashboardKPI {
  totalContacts: number;
  newContacts: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  contactsMoMChange: number | null;
  bookingsMoMChange: number | null;
}
