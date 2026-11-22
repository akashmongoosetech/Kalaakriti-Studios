import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Quote } from 'lucide-react';
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

/**
 * Luxury Burgundy (#57252F) & Muted Antique Gold (#C5A46D) TestimonialCarousel
 * showcasing reviews from happy couples with smooth animated transitions,
 * touch swipe support, keyboard navigation, and pause-on-hover autoplay.
 */
export function TestimonialCarousel({
  items: propItems,
  autoPlayMs = 6800,
}: TestimonialCarouselProps) {
  const prefersReduced = useReducedMotion();
  const [fetchedItems, setFetchedItems] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    if (propItems && propItems.length > 0) return;
    const controller = new AbortController();
    publicApi
      .getTestimonials(controller.signal)
      .then((data) => {
        if (data.length > 0) {
          setFetchedItems(data);
        }
      })
      .catch(() => {
        // Retain graceful fallback if offline
      });
    return () => controller.abort();
  }, [propItems]);

  const items = propItems && propItems.length > 0 ? propItems : fetchedItems;
  const total = items.length;
  const current = items[activeIndex % Math.max(total, 1)];

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goTo = (index: number) => {
    setDirection(index >= activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  useEffect(() => {
    if (prefersReduced || paused || userPaused || total <= 1) return;
    const timer = window.setInterval(goNext, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [prefersReduced, paused, userPaused, total, autoPlayMs, goNext]);

  if (!current) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Reviews from happy couples"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
      }}
      tabIndex={0}
      className="py-20 md:py-28 bg-[#57252F] text-[#F7F2E9] border-y border-[#C5A46D]/30 outline-none"
    >
      <div className="studio-container">
        {/* Header & Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            devanagari="आशीर्वाद व अनुभव"
            kicker="Words From Happy Couples"
            title="Cherished Stories, Told by the Couples Who Lived Them"
            description="Sample couple reflections highlighting how our burgundy-and-gold studio aesthetic and unhurried documentary approach feel on wedding days."
            tone="light"
          />

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs tracking-[0.14em] tabular-nums text-[#C5A46D] mr-2">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? 'Resume automatic rotation' : 'Pause automatic rotation'}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A46D]/40 bg-[#3E1820]/60 text-[#C5A46D] hover:bg-[#C5A46D] hover:text-[#171615] transition-colors cursor-pointer"
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
              aria-label="Previous couple review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A46D]/45 bg-[#3E1820]/70 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next couple review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C5A46D]/45 bg-[#3E1820]/70 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Main Burgundy & Gold Editorial Stage */}
        <div
          onPointerDown={(e) => {
            pointerStartX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (pointerStartX.current === null) return;
            const delta = e.clientX - pointerStartX.current;
            if (Math.abs(delta) > 48) {
              if (delta < 0) goNext();
              else goPrev();
            }
            pointerStartX.current = null;
          }}
          className="relative overflow-hidden rounded-2xl bg-[#3E1820] border border-[#C5A46D]/40 shadow-[0_24px_60px_rgba(23,22,21,0.35)]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={prefersReduced ? { opacity: 0.01 } : { opacity: 0.01, x: direction * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: direction * -28 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 items-stretch"
            >
              {/* Left Couple Portrait Frame */}
              <div className="lg:col-span-5 relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px] bg-[#171615] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#C5A46D]/30">
                <SafeImage
                  src={current.portrait}
                  alt={`${current.clientName} — ${current.eventLabel}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-[#E8DCCB]">
                  <span>{current.eventLabel}</span>
                  <span className="text-[#C5A46D]">{current.city}</span>
                </div>
              </div>

              {/* Right Couple Review Content */}
              <div className="lg:col-span-7 p-8 sm:p-10 md:p-14 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-7">
                    <Quote className="w-10 h-10 text-[#C5A46D]" aria-hidden="true" />
                    <span className="text-xs tracking-[0.16em] text-[#C5A46D]/90">
                      Couple Story {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <blockquote className="font-editorial text-2xl sm:text-3xl 2xl:text-4xl leading-snug text-[#F7F2E9]">
                    “{current.quote}”
                  </blockquote>
                </div>

                <div className="mt-10 pt-6 border-t border-[#C5A46D]/25 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="font-editorial text-2xl font-medium text-[#C5A46D]">
                      {current.clientName}
                    </div>
                    <div className="text-xs sm:text-sm text-[#E8DCCB]/80 mt-0.5">
                      {current.eventLabel} · {current.city}
                    </div>
                  </div>

                  {current.isSample && (
                    <span className="text-xs text-[#E8DCCB]/60">
                      Sample couple review · Replace with verified client feedback
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Couple Selector Strip */}
        <div
          role="tablist"
          aria-label="Select couple review"
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {items.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => goTo(idx)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? 'bg-[#C5A46D] text-[#171615] border-[#C5A46D]'
                    : 'bg-transparent text-[#E8DCCB]/80 border-[#C5A46D]/30 hover:border-[#C5A46D] hover:text-[#F7F2E9]'
                }`}
              >
                {item.clientName}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
