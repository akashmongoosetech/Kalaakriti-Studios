import type {
  ActivityLogItem,
  DashboardKPI,
  DistributionChartDatum,
  MonthlyChartDatum,
} from '../../types/admin.types';
import type { BookingRecord } from '../../types/booking.types';
import type { ContactRecord } from '../../types/contact.types';
import { apiRequest } from '../api/httpClient';

export interface DashboardSnapshot {
  kpi: DashboardKPI;
  monthlyBookings: MonthlyChartDatum[];
  monthlyContacts: MonthlyChartDatum[];
  bookingStatusDistribution: DistributionChartDatum[];
  eventCategoryDistribution: DistributionChartDatum[];
  recentBookings: BookingRecord[];
  recentContacts: ContactRecord[];
  upcomingEvents: BookingRecord[];
  recentActivity: ActivityLogItem[];
}

interface DashboardApiPayload {
  kpis: DashboardKPI;
  bookingsPerMonth: MonthlyChartDatum[];
  contactsPerMonth: MonthlyChartDatum[];
  statusDistribution: DistributionChartDatum[];
  eventCategoryDistribution: DistributionChartDatum[];
  recentBookings: BookingRecord[];
  recentContacts: ContactRecord[];
  upcomingEvents: BookingRecord[];
  recentActivity: ActivityLogItem[];
}

export const EMPTY_DASHBOARD_SNAPSHOT: DashboardSnapshot = {
  kpi: {
    totalContacts: 0,
    newContacts: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    contactsMoMChange: null,
    bookingsMoMChange: null,
  },
  monthlyBookings: [],
  monthlyContacts: [],
  bookingStatusDistribution: [],
  eventCategoryDistribution: [],
  recentBookings: [],
  recentContacts: [],
  upcomingEvents: [],
  recentActivity: [],
};

export const dashboardService = {
  async getSnapshot(): Promise<DashboardSnapshot> {
    const res = await apiRequest<DashboardApiPayload>('/api/admin/dashboard');
    const data = res.data;
    return {
      kpi: data.kpis,
      monthlyBookings: data.bookingsPerMonth || [],
      monthlyContacts: data.contactsPerMonth || [],
      bookingStatusDistribution: data.statusDistribution || [],
      eventCategoryDistribution: data.eventCategoryDistribution || [],
      recentBookings: data.recentBookings || [],
      recentContacts: data.recentContacts || [],
      upcomingEvents: data.upcomingEvents || [],
      recentActivity: data.recentActivity || [],
    };
  },
};
