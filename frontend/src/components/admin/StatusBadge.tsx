import type { BookingStatus } from '../../types/booking.types';
import type { ContactStatus } from '../../types/contact.types';

type AnyStatus = ContactStatus | BookingStatus;

const STATUS_STYLE_MAP: Record<AnyStatus, { bg: string; text: string; dot: string; border: string }> = {
  // Contact statuses
  New: {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    dot: 'bg-[#2563EB]',
    border: 'border-[#BFDBFE]',
  },
  Contacted: {
    bg: 'bg-[#EEF2FF]',
    text: 'text-[#4338CA]',
    dot: 'bg-[#4F46E5]',
    border: 'border-[#C7D2FE]',
  },
  'In Progress': {
    bg: 'bg-[#F0F9FF]',
    text: 'text-[#0369A1]',
    dot: 'bg-[#0284C7]',
    border: 'border-[#BAE6FD]',
  },
  Converted: {
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#15803D]',
    dot: 'bg-[#16A34A]',
    border: 'border-[#BBF7D0]',
  },
  Closed: {
    bg: 'bg-[#F3F4F6]',
    text: 'text-[#4B5563]',
    dot: 'bg-[#6B7280]',
    border: 'border-[#D1D5DB]',
  },
  Spam: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    dot: 'bg-[#DC2626]',
    border: 'border-[#FECACA]',
  },

  // Additional Booking statuses
  Pending: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    dot: 'bg-[#D97706]',
    border: 'border-[#FDE68A]',
  },
  'Quotation Sent': {
    bg: 'bg-[#F5F3FF]',
    text: 'text-[#6D28D9]',
    dot: 'bg-[#7C3AED]',
    border: 'border-[#DDD6FE]',
  },
  Confirmed: {
    bg: 'bg-[#F0FDF4]',
    text: 'text-[#15803D]',
    dot: 'bg-[#16A34A]',
    border: 'border-[#BBF7D0]',
  },
  Completed: {
    bg: 'bg-[#57252F]/10',
    text: 'text-[#57252F]',
    dot: 'bg-[#57252F]',
    border: 'border-[#57252F]/25',
  },
  Cancelled: {
    bg: 'bg-[#F3F4F6]',
    text: 'text-[#4B5563]',
    dot: 'bg-[#6B7280]',
    border: 'border-[#D1D5DB]',
  },
  Rejected: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    dot: 'bg-[#DC2626]',
    border: 'border-[#FECACA]',
  },
};

interface StatusBadgeProps {
  status: AnyStatus;
  compact?: boolean;
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const style = STATUS_STYLE_MAP[status] ?? STATUS_STYLE_MAP.Closed;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${style.bg} ${style.text} ${style.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${style.dot}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
