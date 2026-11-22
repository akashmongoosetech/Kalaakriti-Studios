import { format, parseISO } from 'date-fns';
import {
  Camera,
  Check,
  Edit3,
  Film,
  Printer,
  Trash2,
  X as XIcon,
} from 'lucide-react';
import {
  BOOKING_STATUSES,
  type BookingRecord,
  type BookingStatus,
} from '../../types/booking.types';
import { AdminModal } from './AdminModal';
import { StatusBadge } from './StatusBadge';

interface BookingViewDialogProps {
  booking: BookingRecord | null;
  open: boolean;
  onClose: () => void;
  onEdit: (booking: BookingRecord) => void;
  onDelete: (booking: BookingRecord) => void;
  onStatusChange: (id: string, status: BookingStatus) => void;
}

function formatDateSafe(iso?: string, pattern = 'dd MMM yyyy'): string {
  if (!iso) return 'Not specified';
  try {
    const parsed = parseISO(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return format(parsed, pattern);
  } catch {
    return iso;
  }
}

function coverageModeLabel(mode: BookingRecord['coverageMode']): string {
  if (mode === 'both') return 'Photography + 4K Cinematography';
  if (mode === 'cinematography') return '4K Cinematography Only';
  return 'Photography Only';
}

export function BookingViewDialog({
  booking,
  open,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: BookingViewDialogProps) {
  if (!booking) return null;

  const hasAddOn = (keyword: string) =>
    booking.addOns.some((item) => item.toLowerCase().includes(keyword.toLowerCase()));

  const requirementFlags = [
    { label: 'Drone Coverage', included: hasAddOn('drone') },
    {
      label: 'Cinematography',
      included: booking.coverageMode === 'cinematography' || booking.coverageMode === 'both',
    },
    { label: 'Traditional Photography', included: hasAddOn('traditional') },
    { label: 'Candid Photography', included: hasAddOn('candid') },
    { label: 'Heirloom Photo Album', included: hasAddOn('album') },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={booking.eventName}
      description={`Booking Ref: ${booking.referenceId} · Submitted ${formatDateSafe(
        booking.createdAt,
        'dd MMM yyyy, hh:mm a'
      )}`}
      size="xl"
      headerActions={
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-3 py-2 text-xs font-medium text-[#171615] hover:bg-[#F7F2E9] hover:border-[#C5A46D] transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[#57252F]" aria-hidden="true" />
          <span className="hidden sm:inline">Print Booking</span>
        </button>
      }
      footer={
        <div className="w-full flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDelete(booking)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-xs sm:text-sm font-medium text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-4 py-2 text-xs sm:text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onEdit(booking)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2 text-xs sm:text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              <span>Edit Booking</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status & Quick Update Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#F7F2E9] border border-[#C5A46D]/35 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#5C554E]">Booking Status:</span>
            <StatusBadge status={booking.status} />
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <label
              htmlFor="booking-view-status"
              className="text-xs font-medium text-[#5C554E] whitespace-nowrap"
            >
              Update Status:
            </label>
            <select
              id="booking-view-status"
              value={booking.status}
              onChange={(e) => onStatusChange(booking.id, e.target.value as BookingStatus)}
              className="rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3 py-1.5 text-xs font-medium text-[#171615] focus:border-[#57252F] focus:outline-none cursor-pointer"
            >
              {BOOKING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 1 & 2: Customer Info + Event Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="rounded-xl border border-[#171615]/10 bg-[#FFFFFF] p-4 sm:p-5 space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
              1. Customer Information
            </h3>
            <dl className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm">
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">Full Name</dt>
                <dd className="font-medium text-[#171615] text-right">{booking.fullName}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">Email</dt>
                <dd className="font-medium text-[#57252F] text-right break-all">
                  <a href={`mailto:${booking.email}`} className="hover:underline">
                    {booking.email}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">Mobile Number</dt>
                <dd className="font-medium text-[#171615] tabular-nums text-right">
                  {booking.mobile}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">WhatsApp Number</dt>
                <dd className="font-medium text-[#171615] tabular-nums text-right">
                  {booking.whatsapp}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#5C554E]">Reference ID</dt>
                <dd className="font-mono text-xs font-semibold text-[#57252F] tabular-nums text-right">
                  {booking.referenceId}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-[#171615]/10 bg-[#FFFFFF] p-4 sm:p-5 space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
              2. Event Information
            </h3>
            <dl className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm">
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">Event Category</dt>
                <dd className="font-medium text-[#171615] text-right">{booking.eventCategory}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">Event Date</dt>
                <dd className="font-semibold text-[#57252F] tabular-nums text-right">
                  {formatDateSafe(booking.eventDate, 'dd MMM yyyy')}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">Duration</dt>
                <dd className="font-medium text-[#171615] text-right">{booking.eventDuration}</dd>
              </div>
              <div className="flex justify-between gap-3 border-b border-[#171615]/6 pb-2">
                <dt className="text-[#5C554E]">Venue &amp; City</dt>
                <dd className="font-medium text-[#171615] text-right">
                  {booking.eventLocation}, {booking.city}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#5C554E]">Estimated Guests</dt>
                <dd className="font-medium text-[#171615] text-right">{booking.guestCount}</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Section 3: Service Information & Deliverables Breakdown */}
        <section className="rounded-xl border border-[#171615]/10 bg-[#FFFFFF] p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
              3. Service Information &amp; Coverage Scope
            </h3>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#57252F] px-2.5 py-1 text-xs font-medium text-[#F7F2E9]">
              {booking.coverageMode === 'cinematography' ? (
                <Film className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
              )}
              <span>{coverageModeLabel(booking.coverageMode)}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {requirementFlags.map((flag) => (
              <div
                key={flag.label}
                className={`rounded-lg border px-3 py-2.5 text-xs ${
                  flag.included
                    ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                    : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#6B7280]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 font-semibold">
                  <span>{flag.included ? 'Included' : 'Not Selected'}</span>
                  {flag.included ? (
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <XIcon className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-1 text-[11px] font-medium leading-tight">{flag.label}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs font-medium text-[#5C554E] mb-2">All Selected Deliverables</div>
            <div className="flex flex-wrap gap-2">
              {booking.addOns.length > 0 ? (
                booking.addOns.map((service) => (
                  <span
                    key={service}
                    className="rounded-md bg-[#F7F2E9] border border-[#C5A46D]/40 px-2.5 py-1 text-xs font-medium text-[#171615]"
                  >
                    {service}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#5C554E]">Standard base coverage only</span>
              )}
            </div>
          </div>
        </section>

        {/* Section 4: Budget & Additional Info */}
        <section className="rounded-xl border border-[#171615]/10 bg-[#F7F2E9]/55 p-4 sm:p-5 space-y-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
            4. Budget &amp; Additional Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <div className="text-[11px] text-[#5C554E]">Estimated Budget Range</div>
              <div className="font-semibold text-[#171615] mt-0.5">{booking.budgetRange}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#5C554E]">Additional Requirements</div>
              <div className="font-medium text-[#171615] mt-0.5">
                {booking.additionalRequirements || 'None specified'}
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-[#171615]/10">
            <div className="text-[11px] text-[#5C554E] mb-1">Celebration Notes / Message</div>
            <p className="text-sm text-[#171615] leading-relaxed whitespace-pre-wrap">
              {booking.message}
            </p>
          </div>
        </section>
      </div>
    </AdminModal>
  );
}
