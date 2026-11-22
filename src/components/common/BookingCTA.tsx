import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CalendarCheck2, X } from 'lucide-react';
import { getCategoryBySlug } from '../../data/categories';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Floating BookingCTA bar styled in the studio's Deep Burgundy (#57252F)
 * and Muted Antique Gold (#C5A46D) palette.
 *
 * Appears smoothly after scrolling past the hero fold, hides automatically on /booking,
 * carries category context when browsing individual category pages, and stays safely
 * clear of the bottom-right floating WhatsApp button.
 */
export function BookingCTA() {
  const { pathname } = useLocation();
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isBookingPage = pathname === '/booking';

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 240);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isBookingPage || dismissed) {
    return null;
  }

  // Pass active category into /booking if visitor is viewing a category page
  let bookingHref = '/booking';
  let promptCopy = 'Planning a wedding or milestone celebration?';

  if (pathname.startsWith('/categories/')) {
    const slug = pathname.replace('/categories/', '').split('/')[0];
    const cat = getCategoryBySlug(slug);
    if (cat) {
      bookingHref = `/booking?category=${cat.slug}`;
      promptCopy = `Inquiring for ${cat.name}?`;
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-label="Quick date booking bar"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-4 right-20 sm:right-auto md:left-1/2 md:-translate-x-1/2 z-40 max-w-xl pointer-events-none"
        >
          <div className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-5 rounded-full bg-[#57252F] text-[#F7F2E9] pl-4 pr-2 sm:pl-6 sm:pr-2.5 py-2 border border-[#C5A46D]/55 shadow-[0_14px_38px_rgba(23,22,21,0.38)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <CalendarCheck2
                className="w-4 h-4 text-[#C5A46D] shrink-0 hidden sm:block"
                aria-hidden="true"
              />
              <span className="font-editorial text-base sm:text-lg tracking-wide text-[#F7F2E9] truncate">
                {promptCopy}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                to={bookingHref}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#C5A46D] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-[#171615] hover:bg-[#F7F2E9] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Book Your Date</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss floating booking bar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#E8DCCB]/75 hover:text-[#F7F2E9] hover:bg-[#3E1820] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
