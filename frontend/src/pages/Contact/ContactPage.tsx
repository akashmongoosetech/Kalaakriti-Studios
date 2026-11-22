import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { STUDIO_CONFIG, buildWhatsAppUrl } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';
import { CITIES_WE_SERVE } from '../../data/cities';
import { STUDIO_FAQS } from '../../data/faqs';
import { PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { contactFormSchema, type ContactFormValues } from '../../schemas/contactSchema';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';
import { SectionHeading } from '../../components/common/SectionHeading';
import { publicApi } from '../../services/api/public.api';
import type { ContactRecord } from '../../types/contact.types';
import { toast } from 'sonner';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<ContactRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      eventType: 'Wedding Photography',
      city: 'Indore',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await publicApi.submitContact({
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        eventType: data.eventType,
        eventDate: data.eventDate,
        city: data.city,
        subject: `${data.eventType} Inquiry — ${data.city}`,
        message: data.message,
        source: 'public_form',
      });
      setSubmittedRecord(created);
      toast.success(`Inquiry ${created.contactId} submitted successfully.`);
      reset();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Unable to submit your inquiry right now. Please try again.';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const todayIso = new Date().toISOString().split('T')[0];

  const inputBase =
    'w-full rounded-lg bg-[#FFFFFF] border border-[#171615]/15 px-4 py-3 text-sm text-[#171615] placeholder:text-[#5C554E]/60 focus:border-[#57252F] focus:outline-none';

  return (
    <div>
      <SeoHelmet
        title={`Contact ${STUDIO_CONFIG.name} — Wedding & Event Photographers in Indore, Bhopal & Ujjain`}
        description="Get in touch with Kalaakriti Studios in Indore, Madhya Pradesh for wedding photography, pre-wedding shoots, Haldi, Mehendi, portraits, and 4K event cinematography across Bhopal, Ujjain, Dewas, Ratlam, and Gwalior."
        keywords={[
          'contact wedding photographer Indore',
          'photography studio Indore',
          'Bhopal wedding photography inquiry',
          'Ujjain event photographer contact',
          'Madhya Pradesh cinematography studio',
        ]}
        ogImage={STUDIO_IMAGES.preweddingPalace}
        ogImageAlt="Kalaakriti Studios wedding and event photography desk in Indore, Madhya Pradesh"
        schemaType="LocalBusiness"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      {/* 1. CONTACT HERO */}
      <section className="relative min-h-[54vh] flex items-end pb-14 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <SafeImage
          src={STUDIO_IMAGES.preweddingPalace}
          alt="Heritage venue photography in Madhya Pradesh"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/60 to-[#171615]/45" />
        <div className="studio-container relative z-10 max-w-4xl">
          <div className="text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-4">
            Studio Desk · {STUDIO_CONFIG.locationLabel}
          </div>
          <h1 className="hero-headline font-editorial font-medium">
            Begin the Conversation Around Your Celebration.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#E8DCCB]/85 leading-relaxed max-w-2xl">
            Share your dates, venue city, and rituals. We respond warmly with studio availability,
            tailored package proposals, or a consultation slot in Indore or over video call.
          </p>
        </div>
      </section>

      {/* 2, 3, 4. CONTACT INTRO, INFO & FORM */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Information Column */}
          <div className="lg:col-span-5 space-y-8">
            <SectionHeading
              devanagari="संपर्क"
              kicker="Reach Our Studio"
              title="Direct Desk & Consultation Details"
              description="All contact details below are centralized editable studio placeholders ready for personalization."
            />

            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4 pb-5 border-b border-[#171615]/10">
                <Phone className="w-5 h-5 text-[#57252F] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#5C554E]">Telephone &amp; Consultations</div>
                  <a
                    href={`tel:${STUDIO_CONFIG.phoneHref}`}
                    className="font-semibold text-[#171615] hover:text-[#57252F] text-base mt-0.5 block"
                  >
                    {STUDIO_CONFIG.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-5 border-b border-[#171615]/10">
                <Mail className="w-5 h-5 text-[#57252F] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#5C554E]">Email Desk</div>
                  <a
                    href={`mailto:${STUDIO_CONFIG.email}`}
                    className="font-semibold text-[#171615] hover:text-[#57252F] text-base mt-0.5 block break-all"
                  >
                    {STUDIO_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-5 border-b border-[#171615]/10">
                <MapPin className="w-5 h-5 text-[#57252F] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#5C554E]">Studio Address</div>
                  <div className="font-medium text-[#171615] mt-0.5">
                    {STUDIO_CONFIG.addressLine1}
                    <br />
                    {STUDIO_CONFIG.addressLine2}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#57252F] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs text-[#5C554E]">Studio Hours</div>
                  <div className="font-medium text-[#171615] mt-0.5">
                    {STUDIO_CONFIG.businessHours}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl(
                  `Namaste ${STUDIO_CONFIG.name}, I would like to discuss photography & cinematography for my event.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#171615] px-5 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#57252F] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                <span>Message on WhatsApp</span>
              </a>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-lg border border-[#171615]/20 px-5 py-3 text-sm font-medium text-[#171615] hover:border-[#57252F] hover:text-[#57252F] transition-colors"
              >
                <span>Use Multi-Step Booking</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Contact Inquiry Form (React Hook Form + Zod) */}
          <div className="lg:col-span-7 rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-7 sm:p-10 shadow-[0_8px_32px_rgba(23,22,21,0.04)]">
            {submittedRecord ? (
              <div className="space-y-5 py-6">
                <CheckCircle2 className="w-11 h-11 text-[#57252F]" aria-hidden="true" />
                <h2 className="font-editorial text-3xl font-medium text-[#171615]">
                  Inquiry Received Successfully
                </h2>
                <p className="text-sm sm:text-base text-[#5C554E] leading-relaxed">
                  Thank you, <strong>{submittedRecord.fullName}</strong>. Your inquiry (Reference:{' '}
                  <strong className="font-mono text-[#57252F]">{submittedRecord.contactId}</strong>) for{' '}
                  <strong>{submittedRecord.eventType}</strong> in{' '}
                  <strong>{submittedRecord.city}</strong>
                  {submittedRecord.eventDate ? (
                    <>
                      {' '}on <strong className="tabular-nums">{submittedRecord.eventDate}</strong>
                    </>
                  ) : null}{' '}
                  has been saved with our studio desk. Our team will respond within 24 hours.
                </p>
                <div className="rounded-lg bg-[#F7F2E9] border border-[#C5A46D]/40 p-4 text-xs text-[#5C554E] leading-relaxed">
                  <strong>Need an Immediate Response?</strong> Share your inquiry reference{' '}
                  <strong className="font-mono">{submittedRecord.contactId}</strong> directly with
                  our Indore desk on WhatsApp using the button below.
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={buildWhatsAppUrl(
                      `Namaste ${STUDIO_CONFIG.name}, my name is ${submittedRecord.fullName} (Inquiry Ref: ${submittedRecord.contactId}). I am inquiring about ${submittedRecord.eventType} in ${submittedRecord.city} on ${submittedRecord.eventDate || 'TBD'}. Details: ${submittedRecord.message}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                    <span>Continue on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedRecord(null)}
                    className="rounded-lg border border-[#171615]/20 px-5 py-3 text-sm font-medium text-[#171615] hover:bg-[#F7F2E9] cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <div className="border-b border-[#171615]/10 pb-4">
                  <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171615]">
                    Send an Event Inquiry
                  </h2>
                  <p className="text-xs text-[#5C554E] mt-1">
                    Share your celebration date, city, and vision — our studio desk logs every inquiry directly.
                  </p>
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-xs font-medium text-[#B91C1C]"
                  >
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-fullName" className="block text-xs font-medium text-[#171615] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-fullName"
                      type="text"
                      placeholder="e.g., Meera Sharma"
                      {...register('fullName')}
                      className={inputBase}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B]" role="alert">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#171615] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="name@example.com"
                      {...register('email')}
                      className={inputBase}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B]" role="alert">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-mobile" className="block text-xs font-medium text-[#171615] mb-1.5">
                      Mobile Number (India) *
                    </label>
                    <input
                      id="contact-mobile"
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('mobile')}
                      className={inputBase}
                    />
                    {errors.mobile && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B]" role="alert">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-eventType" className="block text-xs font-medium text-[#171615] mb-1.5">
                      Event Type *
                    </label>
                    <select id="contact-eventType" {...register('eventType')} className={inputBase}>
                      {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                        <option key={cat.slug} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B]" role="alert">
                        {errors.eventType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-eventDate" className="block text-xs font-medium text-[#171615] mb-1.5">
                      Tentative Event Date *
                    </label>
                    <input
                      id="contact-eventDate"
                      type="date"
                      min={todayIso}
                      {...register('eventDate')}
                      className={inputBase}
                    />
                    {errors.eventDate && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B]" role="alert">
                        {errors.eventDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-city" className="block text-xs font-medium text-[#171615] mb-1.5">
                      City / Destination *
                    </label>
                    <input
                      id="contact-city"
                      type="text"
                      placeholder="Indore, Bhopal, Ujjain..."
                      {...register('city')}
                      className={inputBase}
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-xs text-[#9E2A2B]" role="alert">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-[#171615] mb-1.5">
                    Tell Us About Your Celebration *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Share your ceremony schedule (Haldi, Sangeet, Wedding), preferred photography/film style, or venue details..."
                    {...register('message')}
                    className={inputBase}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-[#9E2A2B]" role="alert">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#57252F] px-7 py-3.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Event Inquiry</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 5 & 6. STUDIO LOCATION MAP PLACEHOLDER & SOCIAL LINKS */}
      <section className="py-16 md:py-20 bg-[#E8DCCB]/45 border-y border-[#171615]/10">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 rounded-xl overflow-hidden bg-[#171615] text-[#F7F2E9] border border-[#C5A46D]/30 p-8 sm:p-10 flex flex-col justify-between min-h-[280px] relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 25% 35%, #C5A46D 1px, transparent 1px), radial-gradient(circle at 75% 65%, #C5A46D 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />
            <div className="relative z-10">
              <div className="text-xs tracking-[0.16em] text-[#C5A46D] mb-2">
                Google Maps Embed Placeholder
              </div>
              <h2 className="font-editorial text-3xl font-medium">
                {STUDIO_CONFIG.name} · {STUDIO_CONFIG.city} Studio
              </h2>
              <p className="mt-2 text-sm text-[#E8DCCB]/80 max-w-lg">
                {STUDIO_CONFIG.addressLine1}, {STUDIO_CONFIG.addressLine2}. Replace this container
                with your verified Google Maps embed iframe once your studio pin is published.
              </p>
            </div>
            <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4 text-xs text-[#C5A46D]">
              <span>22.7533° N, 75.8937° E (Indore Reference)</span>
              <span aria-hidden="true" className="opacity-45">
                ·
              </span>
              <span>In-person album viewings by appointment</span>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-xl bg-[#F7F2E9] border border-[#171615]/10 p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-editorial text-2xl font-medium text-[#171615] mb-3">
                Connect on Social Channels
              </h3>
              <p className="text-sm text-[#5C554E] leading-relaxed">
                Follow behind-the-scenes wedding frames, full 4K cinema trailers, and seasonal
                moodboards.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-[#57252F]">
                <li>
                  <a href={STUDIO_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Instagram · {STUDIO_CONFIG.social.instagramHandle}
                  </a>
                </li>
                <li>
                  <a href={STUDIO_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    YouTube Wedding Films
                  </a>
                </li>
                <li>
                  <a href={STUDIO_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Facebook Studio Page
                  </a>
                </li>
                <li>
                  <a href={STUDIO_CONFIG.social.pinterest} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Pinterest Inspiration Boards
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7, 8, 9. CITIES WE SERVE + COMPACT FAQ + BOOKING CTA */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="studio-container space-y-16">
          <div>
            <SectionHeading
              kicker="Regional Coverage"
              title="Cities We Travel To Across Madhya Pradesh"
              description="Our Indore crew travels seamlessly for weddings, pre-weddings, and corporate assignments."
            />
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CITIES_WE_SERVE.map((c) => (
                <div key={c.slug} className="rounded-lg bg-[#FFFFFF] border border-[#171615]/10 p-5">
                  <div className="font-editorial text-xl font-medium text-[#171615]">{c.name}</div>
                  <div className="text-xs text-[#5C554E] mt-1">{c.regionTag}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#171615]/10">
            {STUDIO_FAQS.slice(0, 3).map((faq) => (
              <div key={faq.id} className="space-y-2">
                <div className="text-xs font-medium text-[#57252F]">{faq.topic}</div>
                <h3 className="font-editorial text-xl font-medium text-[#171615]">{faq.question}</h3>
                <p className="text-sm text-[#5C554E] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
