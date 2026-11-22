import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Save } from 'lucide-react';
import {
  BOOKING_STATUSES,
  type BookingRecord,
  type UpdateBookingInput,
} from '../../types/booking.types';
import {
  adminBookingEditSchema,
  type AdminBookingEditValues,
} from '../../schemas/adminBooking.schema';
import { PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { CITIES_WE_SERVE } from '../../data/cities';
import { AdminModal } from './AdminModal';

interface BookingEditDialogProps {
  booking: BookingRecord | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, input: UpdateBookingInput) => void;
}

const ADD_ON_OPTIONS = [
  'Drone Coverage',
  'Traditional Photography',
  'Candid Photography',
  'Heirloom Photo Album',
  'Pre-Wedding Shoot',
  'Same-Week Preview Gallery',
];

const BUDGET_OPTIONS = [
  '₹45,000 – ₹90,000 (Intimate / Single Event)',
  '₹1,00,000 – ₹2,00,000 (Signature Wedding Suite)',
  '₹2,00,000 – ₹3,75,000 (Multi-Day Heritage Wedding)',
  '₹4,00,000+ (Destination Royal Production)',
  'Flexible — Recommend Based on Itinerary',
];

const GUEST_OPTIONS = [
  'Intimate (Under 50 Guests)',
  'Medium Gathering (50 – 150 Guests)',
  'Grand Celebration (150 – 400 Guests)',
  'Royal Wedding (400+ Guests)',
];

const DURATION_OPTIONS = [
  'Half Day (3 – 5 Hours)',
  '1 Full Day',
  '2 Days (e.g., Haldi/Sangeet + Wedding)',
  '3 Days (Full Wedding Suite)',
  '4+ Days (Destination Multi-Ritual)',
];

export function BookingEditDialog({
  booking,
  open,
  onClose,
  onSave,
}: BookingEditDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminBookingEditValues>({
    resolver: zodResolver(adminBookingEditSchema),
    defaultValues: {
      addOns: [],
      coverageMode: 'both',
      status: 'Pending',
    },
  });

  useEffect(() => {
    if (booking && open) {
      reset({
        fullName: booking.fullName,
        email: booking.email,
        mobile: booking.mobile,
        whatsapp: booking.whatsapp,
        eventCategory: booking.eventCategory,
        eventName: booking.eventName,
        eventDate: booking.eventDate,
        eventDuration: booking.eventDuration,
        eventLocation: booking.eventLocation,
        city: booking.city,
        guestCount: booking.guestCount,
        coverageMode: booking.coverageMode,
        addOns: booking.addOns || [],
        budgetRange: booking.budgetRange,
        additionalRequirements: booking.additionalRequirements || '',
        message: booking.message,
        status: booking.status,
      });
    }
  }, [booking, open, reset]);

  if (!booking) return null;

  const selectedAddOns = watch('addOns') || [];

  const toggleAddOn = (option: string) => {
    const next = selectedAddOns.includes(option)
      ? selectedAddOns.filter((item) => item !== option)
      : [...selectedAddOns, option];
    setValue('addOns', next, { shouldValidate: true });
  };

  const inputClass =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-3.5 py-2 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none';

  const submitForm = (values: AdminBookingEditValues) => {
    onSave(booking.id, values);
    onClose();
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Edit Booking Record"
      description={`Updating ${booking.referenceId} · ${booking.eventName}`}
      size="xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#171615]/15 bg-[#FFFFFF] px-4 py-2 text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-booking-form"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            <span>Save Booking Changes</span>
          </button>
        </>
      }
    >
      <form id="edit-booking-form" onSubmit={handleSubmit(submitForm)} noValidate className="space-y-6">
        {/* Customer Details */}
        <div className="space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
            Customer Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="be-fullName" className="block text-xs font-medium text-[#171615] mb-1">
                Customer Name *
              </label>
              <input id="be-fullName" type="text" {...register('fullName')} className={inputClass} />
              {errors.fullName && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="be-email" className="block text-xs font-medium text-[#171615] mb-1">
                Email Address *
              </label>
              <input id="be-email" type="email" {...register('email')} className={inputClass} />
              {errors.email && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="be-mobile" className="block text-xs font-medium text-[#171615] mb-1">
                Mobile Number *
              </label>
              <input id="be-mobile" type="tel" {...register('mobile')} className={inputClass} />
              {errors.mobile && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.mobile.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="be-whatsapp" className="block text-xs font-medium text-[#171615] mb-1">
                WhatsApp Number *
              </label>
              <input id="be-whatsapp" type="tel" {...register('whatsapp')} className={inputClass} />
              {errors.whatsapp && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.whatsapp.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="space-y-3 pt-4 border-t border-[#171615]/10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
            Event Details &amp; Status
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="be-category" className="block text-xs font-medium text-[#171615] mb-1">
                Event Category *
              </label>
              <select id="be-category" {...register('eventCategory')} className={inputClass}>
                {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="be-eventName" className="block text-xs font-medium text-[#171615] mb-1">
                Event Title *
              </label>
              <input id="be-eventName" type="text" {...register('eventName')} className={inputClass} />
              {errors.eventName && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.eventName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="be-status" className="block text-xs font-medium text-[#171615] mb-1">
                Booking Status *
              </label>
              <select id="be-status" {...register('status')} className={inputClass}>
                {BOOKING_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="be-date" className="block text-xs font-medium text-[#171615] mb-1">
                Event Date *
              </label>
              <input id="be-date" type="date" {...register('eventDate')} className={inputClass} />
              {errors.eventDate && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.eventDate.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="be-duration" className="block text-xs font-medium text-[#171615] mb-1">
                Duration *
              </label>
              <select id="be-duration" {...register('eventDuration')} className={inputClass}>
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                {!DURATION_OPTIONS.includes(booking.eventDuration) && (
                  <option value={booking.eventDuration}>{booking.eventDuration}</option>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="be-city" className="block text-xs font-medium text-[#171615] mb-1">
                City *
              </label>
              <input
                id="be-city"
                list="admin-booking-cities"
                type="text"
                {...register('city')}
                className={inputClass}
              />
              <datalist id="admin-booking-cities">
                {CITIES_WE_SERVE.map((c) => (
                  <option key={c.slug} value={c.name} />
                ))}
              </datalist>
              {errors.city && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.city.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="be-location" className="block text-xs font-medium text-[#171615] mb-1">
                Venue / Locality *
              </label>
              <input id="be-location" type="text" {...register('eventLocation')} className={inputClass} />
              {errors.eventLocation && (
                <p className="mt-1 text-xs text-[#B91C1C]">{errors.eventLocation.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="be-guests" className="block text-xs font-medium text-[#171615] mb-1">
                Guest Count *
              </label>
              <select id="be-guests" {...register('guestCount')} className={inputClass}>
                {GUEST_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                {!GUEST_OPTIONS.includes(booking.guestCount) && (
                  <option value={booking.guestCount}>{booking.guestCount}</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Service Requirements & Budget */}
        <div className="space-y-3 pt-4 border-t border-[#171615]/10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#57252F]">
            Coverage Scope &amp; Budget
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="be-coverage" className="block text-xs font-medium text-[#171615] mb-1">
                Coverage Format *
              </label>
              <select id="be-coverage" {...register('coverageMode')} className={inputClass}>
                <option value="both">Photography + 4K Cinematography</option>
                <option value="photography">Photography Only</option>
                <option value="cinematography">Cinematography Only</option>
              </select>
            </div>
            <div>
              <label htmlFor="be-budget" className="block text-xs font-medium text-[#171615] mb-1">
                Budget Range *
              </label>
              <select id="be-budget" {...register('budgetRange')} className={inputClass}>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                {!BUDGET_OPTIONS.includes(booking.budgetRange) && (
                  <option value={booking.budgetRange}>{booking.budgetRange}</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-[#171615] mb-2">Selected Services &amp; Add-Ons</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ADD_ON_OPTIONS.map((opt) => {
                const active = selectedAddOns.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleAddOn(opt)}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#E8DCCB] border-[#57252F] text-[#57252F]'
                        : 'bg-[#FFFFFF] border-[#171615]/15 text-[#171615] hover:border-[#57252F]/50'
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="be-extra" className="block text-xs font-medium text-[#171615] mb-1">
              Additional Requirements
            </label>
            <input
              id="be-extra"
              type="text"
              {...register('additionalRequirements')}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="be-message" className="block text-xs font-medium text-[#171615] mb-1">
              Celebration Notes / Message *
            </label>
            <textarea id="be-message" rows={3} {...register('message')} className={inputClass} />
            {errors.message && (
              <p className="mt-1 text-xs text-[#B91C1C]">{errors.message.message}</p>
            )}
          </div>
        </div>
      </form>
    </AdminModal>
  );
}
