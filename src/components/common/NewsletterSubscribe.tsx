import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { newsletterSchema, type NewsletterValues } from '../../schemas/contactSchema';
import { STUDIO_CONFIG } from '../../data/studio';

const SUBSCRIBERS_STORAGE_KEY = 'kalaakriti_newsletter_subscribers';

export interface NewsletterSubscribeProps {
  variant?: 'editorial' | 'compact';
  className?: string;
}

export function NewsletterSubscribe({
  variant = 'editorial',
  className = '',
}: NewsletterSubscribeProps) {
  const inputId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: NewsletterValues) => {
    const normalized = data.email.trim().toLowerCase();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    let exists = false;
    try {
      const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        exists = list.includes(normalized);
        if (!exists) {
          localStorage.setItem(
            SUBSCRIBERS_STORAGE_KEY,
            JSON.stringify([normalized, ...list.slice(0, 19)])
          );
        }
      }
    } catch {
      // Ignore storage quota or private-mode restrictions
    }

    setSubmitting(false);
    setAlreadySubscribed(exists);
    setSubscribedEmail(normalized);
    reset();
  };

  if (variant === 'compact') {
    return (
      <div className={className}>
        <h4 className="font-editorial text-lg text-[#C5A46D] mb-2">
          Wedding Tips &amp; Seasonal Offers
        </h4>
        <p className="text-xs text-[#E8DCCB]/75 mb-4 leading-relaxed">
          Receive curated Indian wedding photography guides, golden-hour timing tips, and early
          muhurat booking offers from {STUDIO_CONFIG.name}.
        </p>

        {subscribedEmail ? (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-lg bg-[#57252F]/55 border border-[#C5A46D]/45 px-4 py-3 text-xs text-[#F7F2E9]"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
              <span className="leading-relaxed">
                {alreadySubscribed ? (
                  <>
                    <strong>{subscribedEmail}</strong> is already on our seasonal studio list.
                  </>
                ) : (
                  <>
                    Welcome to the journal — <strong>{subscribedEmail}</strong> is subscribed for
                    photography tips &amp; seasonal offers.
                  </>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSubscribedEmail(null)}
              className="text-[#C5A46D] hover:text-[#F7F2E9] underline underline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label htmlFor={inputId} className="sr-only">
                  Email address for wedding photography tips and offers
                </label>
                <input
                  id={inputId}
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  {...register('email')}
                  aria-invalid={Boolean(errors.email)}
                  className="w-full bg-transparent border-b border-[#C5A46D]/45 px-1 py-2.5 text-sm text-[#F7F2E9] placeholder:text-[#E8DCCB]/45 focus:border-[#C5A46D] focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#57252F] border border-[#C5A46D]/45 px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#6F323E] hover:border-[#C5A46D] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A46D]" aria-hidden="true" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            {errors.email && (
              <p className="text-xs text-[#F2B8BE]" role="alert">
                {errors.email.message}
              </p>
            )}
          </form>
        )}
      </div>
    );
  }

  return (
    <section
      aria-labelledby={`${inputId}-heading`}
      className={`bg-[#57252F] text-[#F7F2E9] border-y border-[#C5A46D]/30 py-16 md:py-20 ${className}`}
    >
      <div className="studio-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Editorial Copy */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-3 text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D]">
              <span
                style={{ fontFamily: 'var(--font-devanagari)' }}
                className="tracking-normal text-base"
              >
                पत्रिका
              </span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span>The Studio Journal</span>
            </div>
            <h2
              id={`${inputId}-heading`}
              className="font-editorial text-3xl sm:text-4xl font-medium text-[#F7F2E9] text-balance leading-tight"
            >
              Wedding Photography Tips &amp; Seasonal Studio Offers
            </h2>
            <p className="text-sm sm:text-base text-[#E8DCCB]/85 leading-relaxed max-w-xl">
              Join our quiet dispatch for golden-hour ritual planning notes, heritage pre-wedding
              guides across Madhya Pradesh, and early-bird wedding season openings.
            </p>
          </div>

          {/* Minimalist Input & Submit Form */}
          <div className="lg:col-span-6">
            {subscribedEmail ? (
              <div
                role="status"
                className="rounded-xl bg-[#3E1820]/80 border border-[#C5A46D]/45 p-6 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-[#C5A46D] mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="space-y-1">
                    <p className="font-editorial text-xl font-medium text-[#F7F2E9]">
                      {alreadySubscribed
                        ? 'You Are Already Subscribed'
                        : 'Thank You for Joining the Journal'}
                    </p>
                    <p className="text-xs sm:text-sm text-[#E8DCCB]/85 leading-relaxed">
                      {alreadySubscribed ? (
                        <>
                          <strong>{subscribedEmail}</strong> is already registered for our wedding
                          photography tips and seasonal booking dispatches.
                        </>
                      ) : (
                        <>
                          We&apos;ve recorded <strong>{subscribedEmail}</strong> for upcoming
                          wedding planning guides, lighting tips, and seasonal studio offers.
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="pl-8">
                  <button
                    type="button"
                    onClick={() => setSubscribedEmail(null)}
                    className="text-xs font-medium text-[#C5A46D] hover:text-[#F7F2E9] underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    Subscribe another email address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                  <div className="flex-1">
                    <label
                      htmlFor={inputId}
                      className="block text-xs tracking-[0.12em] text-[#C5A46D] mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id={inputId}
                      type="email"
                      autoComplete="email"
                      placeholder="yourname@example.com"
                      {...register('email')}
                      aria-invalid={Boolean(errors.email)}
                      className="w-full bg-transparent border-b border-[#C5A46D]/55 px-1 py-3 text-base text-[#F7F2E9] placeholder:text-[#E8DCCB]/45 focus:border-[#F7F2E9] focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-[#C5A46D] px-7 py-3.5 text-sm font-semibold text-[#171615] hover:bg-[#D4B680] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7F2E9]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>

                {errors.email ? (
                  <p className="text-xs text-[#F7D0D4]" role="alert">
                    {errors.email.message}
                  </p>
                ) : (
                  <p className="text-xs text-[#E8DCCB]/65">
                    Curated seasonal notes only — never spam. Unsubscribe anytime.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
