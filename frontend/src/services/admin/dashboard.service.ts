import type {
  ActivityLogItem,
  DailyTrendDatum,
  DashboardKPI,
  DistributionChartDatum,
  MonthlyChartDatum,
  TrendsSummary,
} from '../../types/admin.types';
import type { BookingRecord } from '../../types/booking.types';
import type { ContactRecord } from '../../types/contact.types';
import { apiRequest } from '../api/httpClient';

export interface DashboardSnapshot {
  kpi: DashboardKPI;
  monthlyBookings: MonthlyChartDatum[];
  monthlyContacts: MonthlyChartDatum[];
  dailyTrends30d: DailyTrendDatum[];
  trends30dSummary: TrendsSummary;
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
  dailyTrends30d?: DailyTrendDatum[];
  trends30dSummary?: TrendsSummary;
  statusDistribution: DistributionChartDatum[];
  eventCategoryDistribution: DistributionChartDatum[];
  recentBookings: BookingRecord[];
  recentContacts: ContactRecord[];
  upcomingEvents: BookingRecord[];
  recentActivity: ActivityLogItem[];
}

export const EMPTY_TRENDS_SUMMARY: TrendsSummary = {
  totalBookings: 0,
  totalInquiries: 0,
  bookingsChangePct: null,
  inquiriesChangePct: null,
  peakDayLabel: null,
  peakDayTotal: 0,
  dailyAverage: 0,
};

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
  dailyTrends30d: [],
  trends30dSummary: EMPTY_TRENDS_SUMMARY,
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
      dailyTrends30d: data.dailyTrends30d || [],
      trends30dSummary: data.trends30dSummary || EMPTY_TRENDS_SUMMARY,
      bookingStatusDistribution: data.statusDistribution || [],
      eventCategoryDistribution: data.eventCategoryDistribution || [],
      recentBookings: data.recentBookings || [],
      recentContacts: data.recentContacts || [],
      upcomingEvents: data.upcomingEvents || [],
      recentActivity: data.recentActivity || [],
    };
  },

  async getDailyTrends(days = 30): Promise<{
    days: number;
    series: DailyTrendDatum[];
    summary: TrendsSummary;
  }> {
    const res = await apiRequest<{
      days: number;
      series: DailyTrendDatum[];
      summary: TrendsSummary;
    }>('/api/admin/dashboard/trends', { query: { days } });
    return res.data;
  },
};
