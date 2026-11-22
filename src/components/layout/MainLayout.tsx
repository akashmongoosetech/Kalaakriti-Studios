import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../navigation/Header';
import { Footer } from '../footer/Footer';
import { FloatingActions } from '../common/FloatingActions';
import { BookingCTA } from '../common/BookingCTA';
import { ScrollProgress } from '../common/ScrollProgress';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { hash } = useLocation();
  const { scrollTo } = useSmoothScroll();

  // Handle in-page anchor hash navigation cleanly via Lenis
  useEffect(() => {
    if (!hash) return;
    const timer = window.setTimeout(() => {
      scrollTo(hash, { offset: -88, duration: 1.15 });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [hash, scrollTo]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#171615]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#57252F] focus:px-4 focus:py-2 focus:text-sm focus:text-[#F7F2E9]"
      >
        Skip to main content
      </a>

      <ScrollProgress />
      <Header />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer />
      <BookingCTA />
      <FloatingActions />
    </div>
  );
}
