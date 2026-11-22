/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useCallback } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { AnimatePresence, MotionConfig } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PageTransition } from './components/animations/PageTransition';

gsap.registerPlugin(ScrollTrigger);

const HomePage = lazy(() => import('./pages/Home/HomePage'));
const AboutPage = lazy(() => import('./pages/About/AboutPage'));
const ServicesPage = lazy(() => import('./pages/Services/ServicesPage'));
const CategoriesPage = lazy(() => import('./pages/Categories/CategoriesPage'));
const CategoryDetailsPage = lazy(() => import('./pages/CategoryDetails/CategoryDetailsPage'));
const GalleryPage = lazy(() => import('./pages/Gallery/GalleryPage'));
const GalleryDetailsPage = lazy(() => import('./pages/GalleryDetails/GalleryDetailsPage'));
const ContactPage = lazy(() => import('./pages/Contact/ContactPage'));
const BookingPage = lazy(() => import('./pages/Booking/BookingPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/Legal/PrivacyPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/Legal/TermsConditionsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFound/NotFoundPage'));

function PageLoader() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F2E9] text-[#57252F]">
      <div className="text-center space-y-3">
        <div className="mx-auto h-9 w-9 rounded-full border-2 border-[#C5A46D] border-t-[#57252F] animate-spin" />
        <p className="font-editorial text-lg tracking-wide text-[#5C554E]">Loading Gallery...</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  const handleExitComplete = useCallback(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'auto' });
      }
    }
    window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, [location.hash]);

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={handleExitComplete}>
      <PageTransition key={location.pathname}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:categorySlug" element={<CategoryDetailsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/gallery/:slug" element={<GalleryDetailsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsConditionsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </PageTransition>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HelmetProvider>
        <BrowserRouter>
          <MainLayout>
            <AnimatedRoutes />
          </MainLayout>
        </BrowserRouter>
      </HelmetProvider>
    </MotionConfig>
  );
}
