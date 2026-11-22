import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Edit3,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { CITIES_WE_SERVE } from '../../data/cities';
import { STUDIO_CONFIG, buildWhatsAppUrl } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';
import {
  BOOKING_STEP_FIELDS,
  bookingFormSchema,
  type BookingFormValues,
} from '../../schemas/bookingSchema';
import { DemoBookingRecord } from '../../types';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';

const STORAGE_KEY = 'kalaakriti_demo_bookings';

const STEP_LABELS = [
  { num: 1, title: 'Event Details' },
  { num: 2, title: 'Personal Details' },
  { num: 3, title: 'Requirements' },
  { num: 4, title: 'Budget & Notes' },
  { num: 5, title: 'Review & Confirm' },
];

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

function generateDemoReference(): string {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `KS-DEMO-${datePart}-${randomPart}`;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const presetSlug = searchParams.get('category');
  const presetCategory = PHOTOGRAPHY_CATEGORIES.find((c) => c.slug === presetSlug)?.name || 'Wedding Photography';

  const [step, setStep] = useState<number>(1);
  const [confirmedBooking, setConfirmedBooking] = useState<DemoBookingRecord | null>(null);
  const [savedBookings, setSavedBookings] = useState<DemoBookingRecord[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DemoBookingRecord[];
        if (Array.isArray(parsed)) setSavedBookings(parsed);
      }
    } catch {
      // Ignore invalid localStorage payload
    }
  }, []);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onTouched',
    defaultValues: {
      eventCategory: presetCategory,
      eventName: '',
      eventDate: '',
      eventDuration: '2 Days (e.g., Haldi/Sangeet + Wedding)',
      eventLocation: '',
      city: 'Indore',
      fullName: '',
      email: '',
      mobile: '',
      whatsapp: '',
      coverageMode: 'both',
      addOns: ['Candid Photography', 'Traditional Photography'],
      budgetRange: BUDGET_OPTIONS[1],
      guestCount: GUEST_OPTIONS[2],
      additionalRequirements: '',
      message: '',
    },
  });

  const values = watch();
  const todayIso = new Date().toISOString().split('T')[0];

  const handleNext = async () => {
    const fields = BOOKING_STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (valid) {
      setStep((s) => Math.min(5, s + 1));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const toggleAddOn = (option: string) => {
    const current = values.addOns || [];
    const next = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    setValue('addOns', next, { shouldValidate: true });
  };

  const onConfirmBooking = (data: BookingFormValues) => {
    const record: DemoBookingRecord = {
      referenceId: generateDemoReference(),
      createdAt: new Date().toISOString(),
      ...data,
      additionalRequirements: data.additionalRequirements || '',
    };

    const nextList = [record, ...savedBookings].slice(0, 5);
    setSavedBookings(nextList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
    } catch {
      // Ignore storage write errors
    }

    setConfirmedBooking(record);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const inputClass =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-4 py-3 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none';

  return (
    <div>
      <SeoHelmet
        title={
          presetSlug
            ? `Book ${presetCategory} in Indore & Madhya Pradesh | ${STUDIO_CONFIG.name}`
            : `Book Your Celebration — Wedding & Event Photography Inquiry | ${STUDIO_CONFIG.name}`
        }
        description={`Reserve your ${presetCategory.toLowerCase()} and 4K cinematography dates with ${STUDIO_CONFIG.name} across Indore, Bhopal, Ujjain, Maheshwar, and Madhya Pradesh using our 5-step studio inquiry flow.`}
        keywords={[
          `book ${presetCategory.toLowerCase()} Indore`,
          'wedding photography booking Madhya Pradesh',
          'pre-wedding shoot booking Bhopal Ujjain',
          'candid wedding photographer inquiry Indore',
        ]}
        ogImage={STUDIO_IMAGES.weddingPheras}
        ogImageAlt="Reserve Indian wedding photography and cinematography dates in Madhya Pradesh"
        schemaType="ProfessionalService"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Booking', path: '/booking' },
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[48vh] flex items-end pb-12 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <SafeImage
          src={STUDIO_IMAGES.weddingPheras}
          alt="Indian wedding booking consultation"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/60 to-[#171615]/45" />
        <div className="studio-container relative z-10 max-w-4xl">
          <div className="text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-3">
            Interactive 5-Step Inquiry · Frontend Booking Demonstration
          </div>
          <h1 className="hero-headline font-editorial font-medium">
            Reserve Your Celebration Dates.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#E8DCCB]/85 max-w-2xl leading-relaxed">
            Walk through five quick steps to share your event rituals, photography &amp; cinema
            preferences, and estimated scale. Please note this is a frontend booking demonstration—dates
            are formally confirmed only after personal consultation.
          </p>
        </div>
      </section>

      {/* Main Booking Container */}
      <section className="py-14 md:py-20 bg-[#F7F2E9]">
        <div className="studio-container max-w-5xl">
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="rounded-xl bg-[#FFFFFF] border border-[#C5A46D]/50 p-8 sm:p-12 shadow-lg space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#171615]/10">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-10 h-10 text-[#57252F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="text-xs font-semibold tracking-wider text-[#57252F]">
                      Frontend Booking Demonstration Saved
                    </div>
                    <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#171615] mt-1">
                      Inquiry Summary Ready
                    </h2>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-[#5C554E]">Demo Reference ID</div>
                  <div className="font-mono text-base font-semibold text-[#57252F] tabular-nums">
                    {confirmedBooking.referenceId}
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-[#F7F2E9] border border-[#C5A46D]/45 p-4 text-xs sm:text-sm text-[#5C554E] leading-relaxed">
                <strong>Important Notice:</strong> This is a frontend-only demonstration saved
                locally in your browser (<code>localStorage</code>). No live slot has been reserved
                on a remote server. Use the WhatsApp button below to share your reference summary
                directly with the studio desk.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2.5 rounded-lg bg-[#F7F2E9]/70 p-5 border border-[#171615]/8">
                  <h3 className="font-editorial text-xl font-medium text-[#171615]">Event Details</h3>
                  <p><strong>Category:</strong> {confirmedBooking.eventCategory}</p>
                  <p><strong>Event Title:</strong> {confirmedBooking.eventName}</p>
                  <p><strong>Date:</strong> <span className="tabular-nums">{confirmedBooking.eventDate}</span></p>
                  <p><strong>Duration:</strong> {confirmedBooking.eventDuration}</p>
                  <p><strong>Venue &amp; City:</strong> {confirmedBooking.eventLocation}, {confirmedBooking.city}</p>
                </div>

                <div className="space-y-2.5 rounded-lg bg-[#F7F2E9]/70 p-5 border border-[#171615]/8">
                  <h3 className="font-editorial text-xl font-medium text-[#171615]">Client &amp; Scope</h3>
                  <p><strong>Name:</strong> {confirmedBooking.fullName}</p>
                  <p><strong>Email:</strong> {confirmedBooking.email}</p>
                  <p><strong>Mobile / WhatsApp:</strong> {confirmedBooking.mobile} / {confirmedBooking.whatsapp}</p>
                  <p><strong>Coverage:</strong> {confirmedBooking.coverageMode.toUpperCase()}</p>
                  <p><strong>Add-ons:</strong> {confirmedBooking.addOns.join(', ') || 'None selected'}</p>
                  <p><strong>Budget &amp; Guests:</strong> {confirmedBooking.budgetRange} · {confirmedBooking.guestCount}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={buildWhatsAppUrl(
                    `Namaste ${STUDIO_CONFIG.name}! Demo Ref: ${confirmedBooking.referenceId}\n` +
                      `Event: ${confirmedBooking.eventName} (${confirmedBooking.eventCategory})\n` +
                      `Date: ${confirmedBooking.eventDate} (${confirmedBooking.eventDuration})\n` +
                      `City: ${confirmedBooking.city} — ${confirmedBooking.eventLocation}\n` +
                      `Coverage: ${confirmedBooking.coverageMode} | Add-ons: ${confirmedBooking.addOns.join(', ')}\n` +
                      `Guests: ${confirmedBooking.guestCount} | Budget: ${confirmedBooking.budgetRange}\n` +
                      `Contact: ${confirmedBooking.fullName} (${confirmedBooking.mobile})`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-6 py-3.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                  <span>Send Summary via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmedBooking(null);
                    setStep(1);
                    reset();
                  }}
                  className="rounded-lg border border-[#171615]/20 px-6 py-3.5 text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
                >
                  Start New Booking Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Step Wizard */
            <div className="space-y-8">
              {/* Step Progress Bar */}
              <nav aria-label="Booking progress" className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-5 sm:p-6">
                <ol className="grid grid-cols-5 gap-2 sm:gap-4">
                  {STEP_LABELS.map((item) => {
                    const isCompleted = step > item.num;
                    const isCurrent = step === item.num;
                    return (
                      <li key={item.num} className="flex flex-col items-center text-center">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors ${
                            isCurrent
                              ? 'bg-[#57252F] text-[#F7F2E9]'
                              : isCompleted
                                ? 'bg-[#C5A46D] text-[#171615]'
                                : 'bg-[#E8DCCB]/70 text-[#5C554E]'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" aria-hidden="true" /> : item.num}
                        </span>
                        <span
                          className={`mt-2 text-[11px] sm:text-xs font-medium ${
                            isCurrent ? 'text-[#57252F]' : 'text-[#5C554E]'
                          }`}
                        >
                          {item.title}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <form
                onSubmit={handleSubmit(onConfirmBooking)}
                noValidate
                className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-7 sm:p-10 shadow-[0_8px_32px_rgba(23,22,21,0.04)]"
              >
                {/* STEP 1: EVENT DETAILS */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-semibold tracking-wider text-[#57252F]">Step 01 of 05</div>
                      <h2 className="font-editorial text-3xl font-medium text-[#171615] mt-1">
                        Event Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="bk-cat" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Event Category *
                        </label>
                        <select id="bk-cat" {...register('eventCategory')} className={inputClass}>
                          {PHOTOGRAPHY_CATEGORIES.map((c) => (
                            <option key={c.slug} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {errors.eventCategory && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.eventCategory.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bk-name" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Event Name / Couple Title *
                        </label>
                        <input
                          id="bk-name"
                          type="text"
                          placeholder="e.g., Aarav & Meera Wedding"
                          {...register('eventName')}
                          className={inputClass}
                        />
                        {errors.eventName && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.eventName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bk-date" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Primary Event Date *
                        </label>
                        <input
                          id="bk-date"
                          type="date"
                          min={todayIso}
                          {...register('eventDate')}
                          className={inputClass}
                        />
                        {errors.eventDate && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.eventDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bk-duration" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Event Duration *
                        </label>
                        <select id="bk-duration" {...register('eventDuration')} className={inputClass}>
                          {DURATION_OPTIONS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="bk-location" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Venue Name / Locality *
                        </label>
                        <input
                          id="bk-location"
                          type="text"
                          placeholder="e.g., Courtyard Lawns, Bypass Road"
                          {...register('eventLocation')}
                          className={inputClass}
                        />
                        {errors.eventLocation && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.eventLocation.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bk-city" className="block text-xs font-medium text-[#171615] mb-1.5">
                          City *
                        </label>
                        <input
                          id="bk-city"
                          list="mp-city-suggestions"
                          type="text"
                          placeholder="Indore, Bhopal, Ujjain..."
                          {...register('city')}
                          className={inputClass}
                        />
                        <datalist id="mp-city-suggestions">
                          {CITIES_WE_SERVE.map((c) => (
                            <option key={c.slug} value={c.name} />
                          ))}
                        </datalist>
                        {errors.city && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.city.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PERSONAL DETAILS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-semibold tracking-wider text-[#57252F]">Step 02 of 05</div>
                      <h2 className="font-editorial text-3xl font-medium text-[#171615] mt-1">
                        Personal Contact Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="bk-fullname" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Full Name *
                        </label>
                        <input
                          id="bk-fullname"
                          type="text"
                          placeholder="Your full name"
                          {...register('fullName')}
                          className={inputClass}
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.fullName.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bk-email" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Email Address *
                        </label>
                        <input
                          id="bk-email"
                          type="email"
                          placeholder="name@example.com"
                          {...register('email')}
                          className={inputClass}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bk-mobile" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Mobile Number *
                        </label>
                        <input
                          id="bk-mobile"
                          type="tel"
                          placeholder="9876543210"
                          {...register('mobile')}
                          className={inputClass}
                        />
                        {errors.mobile && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.mobile.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bk-whatsapp" className="block text-xs font-medium text-[#171615] mb-1.5">
                          WhatsApp Number *
                        </label>
                        <input
                          id="bk-whatsapp"
                          type="tel"
                          placeholder="Same or alternate 10-digit number"
                          {...register('whatsapp')}
                          className={inputClass}
                        />
                        {errors.whatsapp && (
                          <p className="mt-1 text-xs text-[#9E2A2B]">{errors.whatsapp.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PHOTOGRAPHY REQUIREMENTS */}
                {step === 3 && (
                  <div className="space-y-7">
                    <div>
                      <div className="text-xs font-semibold tracking-wider text-[#57252F]">Step 03 of 05</div>
                      <h2 className="font-editorial text-3xl font-medium text-[#171615] mt-1">
                        Photography &amp; Cinematography Scope
                      </h2>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-[#171615] mb-3">
                        Primary Coverage Format *
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(
                          [
                            { id: 'photography', label: 'Photography Only', sub: 'Candid & traditional stills' },
                            { id: 'cinematography', label: 'Cinematography Only', sub: '4K highlight & ritual films' },
                            { id: 'both', label: 'Photography + Cinema', sub: 'Complete visual suite (Recommended)' },
                          ] as const
                        ).map((opt) => {
                          const selected = values.coverageMode === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setValue('coverageMode', opt.id, { shouldValidate: true })}
                              className={`text-left rounded-xl p-5 border transition-colors cursor-pointer ${
                                selected
                                  ? 'bg-[#57252F] text-[#F7F2E9] border-[#57252F]'
                                  : 'bg-[#F7F2E9]/70 text-[#171615] border-[#171615]/15 hover:border-[#57252F]'
                              }`}
                            >
                              <div className="font-editorial text-xl font-medium">{opt.label}</div>
                              <div
                                className={`text-xs mt-1 ${
                                  selected ? 'text-[#E8DCCB]/85' : 'text-[#5C554E]'
                                }`}
                              >
                                {opt.sub}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-medium text-[#171615] mb-3">
                        Select Additional Services &amp; Deliverables
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {ADD_ON_OPTIONS.map((opt) => {
                          const checked = (values.addOns || []).includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleAddOn(opt)}
                              className={`flex items-center justify-between gap-2 rounded-lg px-4 py-3 text-sm font-medium border transition-colors cursor-pointer ${
                                checked
                                  ? 'bg-[#E8DCCB] border-[#57252F] text-[#57252F]'
                                  : 'bg-[#FFFFFF] border-[#171615]/15 text-[#171615] hover:border-[#57252F]'
                              }`}
                            >
                              <span>{opt}</span>
                              {checked && <Check className="w-4 h-4 shrink-0" aria-hidden="true" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: BUDGET & ADDITIONAL INFORMATION */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-semibold tracking-wider text-[#57252F]">Step 04 of 05</div>
                      <h2 className="font-editorial text-3xl font-medium text-[#171615] mt-1">
                        Budget Range &amp; Celebration Notes
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="bk-budget" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Estimated Budget Range *
                        </label>
                        <select id="bk-budget" {...register('budgetRange')} className={inputClass}>
                          {BUDGET_OPTIONS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="bk-guests" className="block text-xs font-medium text-[#171615] mb-1.5">
                          Approximate Number of Guests *
                        </label>
                        <select id="bk-guests" {...register('guestCount')} className={inputClass}>
                          {GUEST_OPTIONS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bk-extra" className="block text-xs font-medium text-[#171615] mb-1.5">
                        Additional Requirements (Optional)
                      </label>
                      <input
                        id="bk-extra"
                        type="text"
                        placeholder="e.g., Sangeet LED teaser screening, extra parent album, sunrise pheras..."
                        {...register('additionalRequirements')}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="bk-msg" className="block text-xs font-medium text-[#171615] mb-1.5">
                        Tell Us Your Story &amp; Visual Preferences *
                      </label>
                      <textarea
                        id="bk-msg"
                        rows={4}
                        placeholder="Share the rituals you are most excited about, outfits, or special family moments you want us to focus on..."
                        {...register('message')}
                        className={inputClass}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-[#9E2A2B]">{errors.message.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 5: REVIEW & CONFIRM */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-semibold tracking-wider text-[#57252F]">Step 05 of 05</div>
                      <h2 className="font-editorial text-3xl font-medium text-[#171615] mt-1">
                        Review Your Inquiry Before Submitting
                      </h2>
                      <p className="text-xs text-[#5C554E] mt-1">
                        Edit any step below before generating your frontend demonstration booking reference.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                      <div className="rounded-lg bg-[#F7F2E9] p-5 border border-[#171615]/10 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#171615]/10">
                          <span className="font-editorial text-lg font-medium">1. Event Details</span>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#57252F] hover:underline cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <p><strong>Category:</strong> {values.eventCategory}</p>
                        <p><strong>Title:</strong> {values.eventName}</p>
                        <p><strong>Date &amp; Duration:</strong> {values.eventDate} · {values.eventDuration}</p>
                        <p><strong>Venue:</strong> {values.eventLocation}, {values.city}</p>
                      </div>

                      <div className="rounded-lg bg-[#F7F2E9] p-5 border border-[#171615]/10 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#171615]/10">
                          <span className="font-editorial text-lg font-medium">2. Contact Details</span>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#57252F] hover:underline cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <p><strong>Name:</strong> {values.fullName}</p>
                        <p><strong>Email:</strong> {values.email}</p>
                        <p><strong>Mobile:</strong> {values.mobile}</p>
                        <p><strong>WhatsApp:</strong> {values.whatsapp}</p>
                      </div>

                      <div className="rounded-lg bg-[#F7F2E9] p-5 border border-[#171615]/10 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#171615]/10">
                          <span className="font-editorial text-lg font-medium">3. Photography Scope</span>
                          <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#57252F] hover:underline cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <p><strong>Format:</strong> {values.coverageMode.toUpperCase()}</p>
                        <p><strong>Add-ons:</strong> {values.addOns?.join(', ') || 'Standard scope'}</p>
                      </div>

                      <div className="rounded-lg bg-[#F7F2E9] p-5 border border-[#171615]/10 space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-[#171615]/10">
                          <span className="font-editorial text-lg font-medium">4. Budget &amp; Notes</span>
                          <button
                            type="button"
                            onClick={() => setStep(4)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#57252F] hover:underline cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Edit</span>
                          </button>
                        </div>
                        <p><strong>Budget:</strong> {values.budgetRange}</p>
                        <p><strong>Guests:</strong> {values.guestCount}</p>
                        <p className="line-clamp-3"><strong>Message:</strong> {values.message}</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-[#E8DCCB]/60 border border-[#C5A46D]/40 p-4 text-xs text-[#5C554E]">
                      <strong>Frontend Demonstration Reminder:</strong> Submitting generates a local
                      reference ID stored in your browser and prepares a ready-to-send WhatsApp
                      inquiry. No payment is collected and no live calendar slot is locked online.
                    </div>
                  </div>
                )}

                {/* Navigation Footer */}
                <div className="mt-10 pt-6 border-t border-[#171615]/10 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#171615]/20 px-5 py-3 text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <Link to="/services" className="text-xs font-medium text-[#5C554E] hover:text-[#57252F]">
                      Compare Services First
                    </Link>
                  )}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-7 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-7 py-3.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer"
                    >
                      <CalendarCheck2 className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                      <span>Confirm Demo Inquiry</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Locally Saved Recent Demo Bookings (localStorage persistence proof) */}
          {savedBookings.length > 0 && (
            <div className="mt-12 rounded-xl bg-[#E8DCCB]/45 border border-[#171615]/10 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#57252F]" aria-hidden="true" />
                  <h3 className="font-editorial text-2xl font-medium text-[#171615]">
                    Your Recent Saved Demo Inquiries
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    setSavedBookings([]);
                  }}
                  className="text-xs text-[#57252F] hover:underline cursor-pointer"
                >
                  Clear Local History
                </button>
              </div>
              <div className="divide-y divide-[#171615]/10 text-sm">
                {savedBookings.map((rec) => (
                  <div
                    key={rec.referenceId}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#57252F] mr-3">
                        {rec.referenceId}
                      </span>
                      <span className="font-medium text-[#171615]">{rec.eventName}</span>
                      <span className="text-[#5C554E]">
                        {' '}
                        · {rec.eventCategory} · {rec.city} ({rec.eventDate})
                      </span>
                    </div>
                    <span className="text-xs text-[#5C554E] tabular-nums">
                      Saved locally
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
