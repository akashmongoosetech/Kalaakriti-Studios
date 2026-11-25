import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo, type Variants } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../../data/testimonials';
import { TestimonialItem } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SafeImage } from './SafeImage';
import { SectionHeading } from './SectionHeading';
import { publicApi } from '../../services/api/public.api';

interface TestimonialCarouselProps {
  items?: TestimonialItem[];
  autoPlayMs?: number;
}

const SWIPE_CONFIDENCE_THRESHOLD = 8500;
const SWIPE_DISTANCE_THRESHOLD = 55;

function swipePower(offset: number, velocity: number) {
  return Math.abs(offset) * velocity;
}

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.35,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0.35,
  }),
};

const reducedSlideVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Editorial luxury testimonial carousel for the homepage powered by motion/react.
 * Features directional spring-driven sliding transitions, native horizontal drag/swipe,
 * animated antique-gold progress bar, shared-layout chapter selector, keyboard controls,
 * and pause-on-hover/focus autoplay.
 */
export function TestimonialCarousel({
  items: propItems,
  autoPlayMs = 7000,
}: TestimonialCarouselProps) {
  const prefersReduced = useReducedMotion();
  const [fetchedItems, setFetchedItems] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [[activeIndex, direction], setSlideState] = useState<[number, 1 | -1]>([0, 1]);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    if (propItems && propItems.length > 0) return;
    const controller = new AbortController();
    publicApi
      .getTestimonials(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted && data.length > 0) {
          setFetchedItems(data);
        }
      })
      .catch(() => {
        // Retain seeded studio testimonials if API is unreachable
      });
    return () => controller.abort();
  }, [propItems]);

  const items = propItems && propItems.length > 0 ? propItems : fetchedItems;
  const total = items.length;
  const safeIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;
  const current = items[safeIndex];
  const nextItem = total > 1 ? items[(safeIndex + 1) % total] : null;

  const paginate = useCallback(
    (step: 1 | -1) => {
      if (total <= 1) return;
      setSlideState(([prevIndex]) => [(prevIndex + step + total) % total, step]);
    },
    [total]
  );

  const goNext = useCallback(() => paginate(1), [paginate]);
  const goPrev = useCallback(() => paginate(-1), [paginate]);

  const goTo = useCallback(
    (targetIndex: number) => {
      if (total <= 1 || targetIndex === safeIndex) return;
      const dir: 1 | -1 = targetIndex > safeIndex ? 1 : -1;
      setSlideState([targetIndex, dir]);
    },
    [safeIndex, total]
  );

  const isAutoPlayActive = !prefersReduced && !isHoveredOrFocused && !userPaused && total > 1;

  useEffect(() => {
    if (!isAutoPlayActive) return;
    const timer = window.setTimeout(goNext, autoPlayMs);
    return () => window.clearTimeout(timer);
  }, [isAutoPlayActive, safeIndex, autoPlayMs, goNext]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (total <= 1) return;
    const power = swipePower(info.offset.x, info.velocity.x);
    if (power < -SWIPE_CONFIDENCE_THRESHOLD || info.offset.x < -SWIPE_DISTANCE_THRESHOLD) {
      goNext();
    } else if (power > SWIPE_CONFIDENCE_THRESHOLD || info.offset.x > SWIPE_DISTANCE_THRESHOLD) {
      goPrev();
    }
  };

  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Client testimonials and wedding reflections"
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      onFocusCapture={() => setIsHoveredOrFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsHoveredOrFocused(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goPrev();
        }
      }}
      tabIndex={0}
      className="py-20 md:py-28 bg-[#57252F] text-[#F7F2E9] border-y border-[#C5A46D]/30 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C5A46D]"
    >
      <div className="studio-container">
        {/* Header & Architectural Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <SectionHeading
            devanagari="आशीर्वाद व अनुभव"
            kicker="Words From Happy Couples"
            title="Cherished Stories, Told by the Families Who Lived Them"
            description="Reflections from couples and families across Indore, Bhopal, Ujjain, and Madhya Pradesh whose celebrations we documented."
            tone="light"
          />

          <div className="flex items-center gap-2.5 shrink-0">
            <span
              className="text-xs tracking-[0.16em] tabular-nums text-[#C5A46D] mr-2 select-none"
              aria-live="polite"
            >
              {String(safeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setUserPaused((p) => !p)}
                  aria-label={userPaused ? 'Resume automatic rotation' : 'Pause automatic rotation'}
                  aria-pressed={userPaused}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A46D]/35 bg-[#3E1820]/70 text-[#C5A46D] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#57252F]"
                >
                  {userPaused ? (
                    <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
                  ) : (
                    <Pause className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous client review"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A46D]/45 bg-[#3E1820]/80 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#57252F]"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next client review"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A46D]/45 bg-[#3E1820]/80 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#57252F]"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Sliding Editorial Stage */}
        <div className="relative overflow-hidden rounded-2xl bg-[#3B171F] border border-[#C5A46D]/35 shadow-[0_28px_64px_rgba(23,22,21,0.38)]">
          {/* Compositor-only Antique Gold Autoplay Progress Hairline */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 z-20 h-[2px] bg-[#C5A46D]/15 overflow-hidden"
          >
            {isAutoPlayActive ? (
              <motion.div
                key={`progress-${current.id}-${safeIndex}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: autoPlayMs / 1000, ease: 'linear' }}
                className="h-full w-full origin-left bg-[#C5A46D]"
              />
            ) : (
              <div
                className="h-full bg-[#C5A46D]/75 transition-transform duration-300 origin-left"
                style={{ transform: `scaleX(${(safeIndex + 1) / Math.max(total, 1)})` }}
              />
            )}
          </div>

          {/* Sliding Track Container */}
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.article
                key={current.id}
                custom={direction}
                variants={prefersReduced ? reducedSlideVariants : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={
                  prefersReduced
                    ? { duration: 0.2 }
                    : {
                        x: { type: 'spring', stiffness: 220, damping: 30, mass: 0.95 },
                        opacity: { duration: 0.34, ease: [0.16, 1, 0.3, 1] },
                      }
                }
                drag={prefersReduced || total <= 1 ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={handleDragEnd}
                aria-roledescription="slide"
                aria-label={`Review ${safeIndex + 1} of ${total}: ${current.clientName}`}
                className="w-full grid grid-cols-1 lg:grid-cols-12 items-stretch cursor-grab active:cursor-grabbing select-none"
              >
                {/* Left Column: Full-Bleed Couple Portrait Frame */}
                <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:min-h-[460px] bg-[#171615] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#C5A46D]/25">
                  <motion.div
                    initial={prefersReduced ? false : { scale: 1.07 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full"
                  >
                    <SafeImage
                      src={current.portrait}
                      alt={`${current.clientName} — ${current.eventLabel}`}
                      className="h-full w-full object-cover pointer-events-none"
                    />
                  </motion.div>

                  {/* Measured Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/85 via-[#171615]/20 to-transparent pointer-events-none" />

                  {/* Subtle Editorial Corner Frame */}
                  <div
                    aria-hidden="true"
                    className="hidden sm:block pointer-events-none absolute top-5 left-5 w-10 h-10 border-t border-l border-[#C5A46D]/50"
                  />

                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#E8DCCB]">
                    <span className="font-medium tracking-[0.04em]">{current.eventLabel}</span>
                    <span className="text-[#C5A46D]">{current.city}</span>
                  </div>
                </div>

                {/* Right Column: Editorial Review Typography & Attribution */}
                <div className="lg:col-span-7 p-7 sm:p-10 md:p-14 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
                      <div className="flex items-center gap-3">
                        <Quote className="w-8 h-8 text-[#C5A46D]" aria-hidden="true" />
                        <div
                          className="flex items-center gap-1"
                          aria-label="5 out of 5 stars"
                        >
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className="w-3.5 h-3.5 fill-[#C5A46D] text-[#C5A46D]"
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-xs tracking-[0.14em] text-[#E8DCCB]/75 tabular-nums">
                        Story {String(safeIndex + 1).padStart(2, '0')}
                        <span className="mx-2 text-[#C5A46D]/60" aria-hidden="true">
                          ·
                        </span>
                        {current.city}
                      </div>
                    </div>

                    <motion.blockquote
                      initial={prefersReduced ? false : { opacity: 0.01, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="font-editorial text-2xl sm:text-3xl 2xl:text-[2.15rem] leading-[1.35] text-[#F7F2E9] select-text"
                    >
                      “{current.quote}”
                    </motion.blockquote>
                  </div>

                  {/* Attribution Footer & Seamless Next-Story Trigger */}
                  <motion.div
                    initial={prefersReduced ? false : { opacity: 0.01, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-10 pt-6 border-t border-[#C5A46D]/25 flex flex-col sm:flex-row sm:items-end justify-between gap-5"
                  >
                    <div>
                      <div className="font-editorial text-2xl sm:text-[1.65rem] font-medium text-[#C5A46D]">
                        {current.clientName}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#E8DCCB]/80">
                        <span>{current.eventLabel}</span>
                        <span aria-hidden="true" className="text-[#C5A46D]/60">
                          ·
                        </span>
                        <span>{current.city}</span>
                      </div>
                    </div>

                    {nextItem && (
                      <button
                        type="button"
                        onClick={goNext}
                        className="group inline-flex items-center gap-2 text-left text-xs text-[#E8DCCB]/80 hover:text-[#F7F2E9] transition-colors cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:underline"
                      >
                        <span>
                          Next:{' '}
                          <span className="text-[#C5A46D] font-medium group-hover:text-[#F7F2E9] transition-colors">
                            {nextItem.clientName}
                          </span>
                        </span>
                        <ArrowRight
                          className="w-3.5 h-3.5 text-[#C5A46D] transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* Architectural Editorial Chapter Selector Strip (Zero-Pill Design) */}
        {total > 1 && (
          <div
            role="tablist"
            aria-label="Select a couple story"
            className="mt-7 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            {items.map((item, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => goTo(idx)}
                  className={`group relative pt-3.5 pb-2.5 px-2 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] rounded-b-lg ${
                    isSelected ? 'text-[#F7F2E9]' : 'text-[#E8DCCB]/65 hover:text-[#F7F2E9]'
                  }`}
                >
                  {/* Base hairline */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 inset-x-0 h-px bg-[#C5A46D]/25 group-hover:bg-[#C5A46D]/50 transition-colors"
                  />

                  {/* Shared-layout animated gold rule */}
                  {isSelected && (
                    <motion.span
                      layoutId="testimonial-active-rule"
                      transition={
                        prefersReduced
                          ? { duration: 0.15 }
                          : { type: 'spring', stiffness: 360, damping: 32 }
                      }
                      aria-hidden="true"
                      className="absolute top-0 inset-x-0 h-[2px] bg-[#C5A46D]"
                    />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-10 w-10 rounded-lg overflow-hidden shrink-0 border transition-colors ${
                        isSelected
                          ? 'border-[#C5A46D]'
                          : 'border-[#C5A46D]/20 opacity-75 group-hover:opacity-100'
                      }`}
                    >
                      <SafeImage
                        src={item.portrait}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] tabular-nums text-[#C5A46D]">
                        <span>{String(idx + 1).padStart(2, '0')}</span>
                        <span aria-hidden="true" className="opacity-50">
                          ·
                        </span>
                        <span className="truncate text-[#E8DCCB]/75">
                          {item.city.split(',')[0]}
                        </span>
                      </div>
                      <div className="font-editorial text-base sm:text-lg leading-tight truncate mt-0.5">
                        {item.clientName}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
