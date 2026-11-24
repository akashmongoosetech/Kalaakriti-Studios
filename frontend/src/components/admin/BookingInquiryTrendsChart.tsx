import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, CalendarPlus, MessageSquarePlus, TrendingUp } from 'lucide-react';
import type { DailyTrendDatum, TrendsSummary } from '../../types/admin.types';

type RangeWindow = 7 | 14 | 30;
type MetricFilter = 'both' | 'bookings' | 'inquiries';
type ChartVariant = 'composed' | 'area';

interface BookingInquiryTrendsChartProps {
  data: DailyTrendDatum[];
  summary?: TrendsSummary;
  loading?: boolean;
  onAddDemoBooking?: () => void;
  onAddDemoContact?: () => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
    payload?: DailyTrendDatum;
  }>;
}

function formatFullTooltipDate(isoDate: string): string {
  try {
    const parsed = parseISO(isoDate);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return format(parsed, 'EEE, dd MMM yyyy');
  } catch {
    return isoDate;
  }
}

function TrendsTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0]?.payload;
  if (!datum) return null;

  return (
    <div className="rounded-xl border border-[#C5A46D]/60 bg-[#FFFFFF] px-3.5 py-2.5 shadow-[0_8px_24px_rgba(23,22,21,0.1)] text-xs min-w-[176px]">
      <div className="font-semibold text-[#171615] pb-1.5 mb-1.5 border-b border-[#171615]/8">
        {formatFullTooltipDate(datum.date)}
      </div>
      <div className="space-y-1.5 tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[#5C554E]">
            <span className="h-2 w-2 rounded-xs bg-[#57252F] shrink-0" aria-hidden="true" />
            <span>Bookings</span>
          </span>
          <span className="font-semibold text-[#171615]">{datum.bookings}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-[#5C554E]">
            <span className="h-2 w-2 rounded-xs bg-[#C5A46D] shrink-0" aria-hidden="true" />
            <span>Inquiries</span>
          </span>
          <span className="font-semibold text-[#171615]">{datum.inquiries}</span>
        </div>
        <div className="pt-1.5 mt-1 border-t border-[#171615]/8 flex items-center justify-between gap-4">
          <span className="text-[#5C554E] font-medium">Total Activity</span>
          <span className="font-semibold text-[#57252F]">{datum.total}</span>
        </div>
      </div>
    </div>
  );
}

export function BookingInquiryTrendsChart({
  data,
  summary,
  loading = false,
  onAddDemoBooking,
  onAddDemoContact,
}: BookingInquiryTrendsChartProps) {
  const [rangeDays, setRangeDays] = useState<RangeWindow>(30);
  const [metricFilter, setMetricFilter] = useState<MetricFilter>('both');
  const [chartVariant, setChartVariant] = useState<ChartVariant>('composed');

  const visibleData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.slice(-rangeDays);
  }, [data, rangeDays]);

  const computedStats = useMemo(() => {
    const totalBookings = visibleData.reduce((acc, item) => acc + item.bookings, 0);
    const totalInquiries = visibleData.reduce((acc, item) => acc + item.inquiries, 0);
    const combinedTotal = totalBookings + totalInquiries;

    let peakLabel: string | null = null;
    let peakCount = 0;

    for (const item of visibleData) {
      const value =
        metricFilter === 'bookings'
          ? item.bookings
          : metricFilter === 'inquiries'
          ? item.inquiries
          : item.total;
      if (value > peakCount) {
        peakCount = value;
        peakLabel = item.label;
      }
    }

    const activeTotal =
      metricFilter === 'bookings'
        ? totalBookings
        : metricFilter === 'inquiries'
        ? totalInquiries
        : combinedTotal;

    const avgPerDay =
      visibleData.length > 0 ? Number((activeTotal / visibleData.length).toFixed(1)) : 0;

    return {
      totalBookings,
      totalInquiries,
      combinedTotal,
      peakLabel,
      peakCount,
      avgPerDay,
    };
  }, [visibleData, metricFilter]);

  const showBookings = metricFilter === 'both' || metricFilter === 'bookings';
  const showInquiries = metricFilter === 'both' || metricFilter === 'inquiries';
  const hasAnyActivity = computedStats.combinedTotal > 0;
  const xAxisInterval = rangeDays === 30 ? 4 : rangeDays === 14 ? 1 : 0;

  return (
    <section
      aria-label="Booking trends and inquiry volume over the last 30 days"
      className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6 shadow-[0_2px_12px_rgba(23,22,21,0.03)]"
    >
      {/* Header Row: Title + Interactive Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-5 border-b border-[#171615]/8">
        <div>
          <h3 className="font-editorial text-2xl font-semibold text-[#171615]">
            Booking Trends &amp; Inquiry Volume
          </h3>
          <p className="text-xs sm:text-sm text-[#5C554E] mt-0.5">
            Daily studio booking conversions alongside client inquiry volume over the last{' '}
            {rangeDays} days
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Range Window Segmented Control */}
          <div
            role="group"
            aria-label="Time range"
            className="inline-flex items-center rounded-lg bg-[#F7F2E9] p-1 border border-[#171615]/8"
          >
            {([7, 14, 30] as RangeWindow[]).map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  rangeDays === days
                    ? 'bg-[#57252F] text-[#F7F2E9]'
                    : 'text-[#5C554E] hover:text-[#171615]'
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>

          {/* Series Filter Segmented Control */}
          <div
            role="group"
            aria-label="Visible series"
            className="inline-flex items-center rounded-lg bg-[#F7F2E9] p-1 border border-[#171615]/8"
          >
            {(
              [
                { id: 'both', label: 'Both' },
                { id: 'bookings', label: 'Bookings' },
                { id: 'inquiries', label: 'Inquiries' },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setMetricFilter(option.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  metricFilter === option.id
                    ? 'bg-[#FFFFFF] text-[#171615] shadow-xs'
                    : 'text-[#5C554E] hover:text-[#171615]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Chart Style Toggle */}
          <div
            role="group"
            aria-label="Chart display mode"
            className="inline-flex items-center rounded-lg bg-[#F7F2E9] p-1 border border-[#171615]/8"
          >
            <button
              type="button"
              onClick={() => setChartVariant('composed')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartVariant === 'composed'
                  ? 'bg-[#FFFFFF] text-[#171615] shadow-xs'
                  : 'text-[#5C554E] hover:text-[#171615]'
              }`}
              title="Bookings trend line with inquiry volume bars"
            >
              <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Combined</span>
            </button>
            <button
              type="button"
              onClick={() => setChartVariant('area')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartVariant === 'area'
                  ? 'bg-[#FFFFFF] text-[#171615] shadow-xs'
                  : 'text-[#5C554E] hover:text-[#171615]'
              }`}
              title="Dual area comparison"
            >
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Area</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unboxed Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-b border-[#171615]/8">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#5C554E]">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#57252F] shrink-0" aria-hidden="true" />
            <span>Bookings ({rangeDays}d)</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold text-[#171615]">
              {computedStats.totalBookings}
            </span>
            {rangeDays === 30 &&
              summary?.bookingsChangePct !== null &&
              summary?.bookingsChangePct !== undefined && (
                <span
                  className={`text-xs font-medium ${
                    summary.bookingsChangePct >= 0 ? 'text-[#2E6F40]' : 'text-[#9E2A2B]'
                  }`}
                >
                  {summary.bookingsChangePct >= 0 ? '+' : ''}
                  {summary.bookingsChangePct}% vs prior 30d
                </span>
              )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs text-[#5C554E]">
            <span className="h-2.5 w-2.5 rounded-xs bg-[#C5A46D] shrink-0" aria-hidden="true" />
            <span>Inquiries ({rangeDays}d)</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold text-[#171615]">
              {computedStats.totalInquiries}
            </span>
            {rangeDays === 30 &&
              summary?.inquiriesChangePct !== null &&
              summary?.inquiriesChangePct !== undefined && (
                <span
                  className={`text-xs font-medium ${
                    summary.inquiriesChangePct >= 0 ? 'text-[#2E6F40]' : 'text-[#9E2A2B]'
                  }`}
                >
                  {summary.inquiriesChangePct >= 0 ? '+' : ''}
                  {summary.inquiriesChangePct}% vs prior 30d
                </span>
              )}
          </div>
        </div>

        <div>
          <div className="text-xs text-[#5C554E]">Peak Activity Day</div>
          <div className="mt-1 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold text-[#171615]">
              {computedStats.peakCount > 0 ? computedStats.peakCount : '—'}
            </span>
            <span className="text-xs text-[#5C554E]">
              {computedStats.peakLabel ? `on ${computedStats.peakLabel}` : 'No activity yet'}
            </span>
          </div>
        </div>

        <div>
          <div className="text-xs text-[#5C554E]">Daily Average</div>
          <div className="mt-1 flex items-baseline gap-2 tabular-nums">
            <span className="text-2xl font-semibold text-[#171615]">
              {computedStats.avgPerDay.toFixed(1)}
            </span>
            <span className="text-xs text-[#5C554E]">per day</span>
          </div>
        </div>
      </div>

      {/* Main Chart Viewport */}
      <div className="pt-5">
        {loading && visibleData.length === 0 ? (
          <div
            aria-label="Loading 30-day trends chart"
            className="h-[300px] w-full rounded-xl bg-[#F7F2E9]/60 animate-pulse flex flex-col justify-between p-5"
          >
            <div className="h-3 w-40 rounded bg-[#E8DCCB]" />
            <div className="flex items-end gap-2 h-44">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-[#E8DCCB]/80"
                  style={{ height: `${25 + ((i * 19) % 65)}%` }}
                />
              ))}
            </div>
            <div className="h-3 w-full rounded bg-[#E8DCCB]/70" />
          </div>
        ) : !hasAnyActivity ? (
          <div className="h-[300px] w-full rounded-xl border border-dashed border-[#C5A46D]/50 bg-[#F7F2E9]/35 flex flex-col items-center justify-center text-center px-6">
            <p className="font-editorial text-xl font-semibold text-[#171615]">
              No bookings or inquiries recorded in the last {rangeDays} days
            </p>
            <p className="text-xs text-[#5C554E] mt-1 max-w-md">
              As couples submit contact inquiries or shoot booking requests, daily volume and
              conversion trends will plot automatically here.
            </p>
            {(onAddDemoBooking || onAddDemoContact) && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                {onAddDemoContact && (
                  <button
                    type="button"
                    onClick={onAddDemoContact}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#C5A46D]/60 bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium text-[#57252F] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Add Sample Inquiry</span>
                  </button>
                )}
                {onAddDemoBooking && (
                  <button
                    type="button"
                    onClick={onAddDemoBooking}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#57252F] px-3.5 py-2 text-xs font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                    <span>Add Sample Booking</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartVariant === 'composed' ? (
                <ComposedChart
                  data={visibleData}
                  margin={{ top: 12, right: 12, left: -18, bottom: 2 }}
                >
                  <defs>
                    <linearGradient id="studioBookingsTrendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#57252F" stopOpacity={0.26} />
                      <stop offset="95%" stopColor="#57252F" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCCB" vertical={false} />
                  <XAxis
                    dataKey="label"
                    interval={xAxisInterval}
                    tick={{ fontSize: 11, fill: '#5C554E' }}
                    axisLine={false}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#5C554E' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<TrendsTooltip />}
                    cursor={{ fill: '#F7F2E9', fillOpacity: 0.7 }}
                  />
                  {computedStats.avgPerDay > 0 && (
                    <ReferenceLine
                      y={computedStats.avgPerDay}
                      stroke="#8A7E72"
                      strokeDasharray="4 4"
                      strokeOpacity={0.65}
                    />
                  )}
                  {showInquiries && (
                    <Bar
                      dataKey="inquiries"
                      name="Inquiry Volume"
                      fill="#C5A46D"
                      fillOpacity={0.85}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={rangeDays === 30 ? 14 : 26}
                    />
                  )}
                  {showBookings && (
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      name="Booking Trend"
                      stroke="#57252F"
                      strokeWidth={2.5}
                      fill="url(#studioBookingsTrendFill)"
                      activeDot={{ r: 5, fill: '#57252F', stroke: '#F7F2E9', strokeWidth: 2 }}
                    />
                  )}
                </ComposedChart>
              ) : (
                <AreaChart
                  data={visibleData}
                  margin={{ top: 12, right: 12, left: -18, bottom: 2 }}
                >
                  <defs>
                    <linearGradient id="studioBookingsAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#57252F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#57252F" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="studioInquiriesAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A46D" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#C5A46D" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DCCB" vertical={false} />
                  <XAxis
                    dataKey="label"
                    interval={xAxisInterval}
                    tick={{ fontSize: 11, fill: '#5C554E' }}
                    axisLine={false}
                    tickLine={false}
                    dy={6}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#5C554E' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<TrendsTooltip />} />
                  {showInquiries && (
                    <Area
                      type="monotone"
                      dataKey="inquiries"
                      name="Inquiry Volume"
                      stroke="#C5A46D"
                      strokeWidth={2.25}
                      fill="url(#studioInquiriesAreaFill)"
                      activeDot={{ r: 4.5, fill: '#C5A46D', stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  )}
                  {showBookings && (
                    <Area
                      type="monotone"
                      dataKey="bookings"
                      name="Booking Trend"
                      stroke="#57252F"
                      strokeWidth={2.5}
                      fill="url(#studioBookingsAreaFill)"
                      activeDot={{ r: 5, fill: '#57252F', stroke: '#F7F2E9', strokeWidth: 2 }}
                    />
                  )}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Quiet Inline Legend Footer */}
        <div className="mt-3 pt-3 border-t border-[#171615]/6 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C554E]">
          <div className="flex flex-wrap items-center gap-4">
            {showBookings && (
              <span className="inline-flex items-center gap-2">
                <span className="h-0.5 w-4 bg-[#57252F] inline-block" aria-hidden="true" />
                <span>Bookings (Trend)</span>
              </span>
            )}
            {showInquiries && (
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-xs bg-[#C5A46D] inline-block" aria-hidden="true" />
                <span>Inquiries (Volume)</span>
              </span>
            )}
            {chartVariant === 'composed' && computedStats.avgPerDay > 0 && (
              <span className="inline-flex items-center gap-2">
                <span
                  className="w-4 border-t border-dashed border-[#8A7E72] inline-block"
                  aria-hidden="true"
                />
                <span>Daily Avg ({computedStats.avgPerDay.toFixed(1)})</span>
              </span>
            )}
          </div>
          <span className="tabular-nums text-[11px] text-[#5C554E]/80">
            {visibleData.length > 0
              ? `${visibleData[0].label} – ${visibleData[visibleData.length - 1].label}`
              : 'Last 30 days'}
          </span>
        </div>
      </div>
    </section>
  );
}
