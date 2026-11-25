/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useCallback } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { Toaster } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { PageTransition } from './components/animations/PageTransition';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScrollContext';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

gsap.registerPlugin(ScrollTrigger);

// Public Website Pages
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

// Admin Panel Pages (strictly separated from public website layout)
const AdminSignupPage = lazy(() => import('./pages/admin/Signup'));
const AdminLoginPage = lazy(() => import('./pages/admin/Login'));
const AdminForgotPasswordPage = lazy(() => import('./pages/admin/ForgotPassword'));
const AdminDashboardPage = lazy(() => import('./pages/admin/Dashboard'));
const AdminContactsPage = lazy(() => import('./pages/admin/Contacts'));
const AdminBookingsPage = lazy(() => import('./pages/admin/Bookings'));
const AdminGalleryPage = lazy(() => import('./pages/admin/Gallery'));
const AdminProfilePage = lazy(() => import('./pages/admin/Profile'));

function PageLoader({ label = 'Loading Gallery...' }: { label?: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F2E9] text-[#57252F]">
      <div className="text-center space-y-3">
        <div className="mx-auto h-9 w-9 rounded-full border-2 border-[#C5A46D] border-t-[#57252F] animate-spin" />
        <p className="font-editorial text-lg tracking-wide text-[#5C554E]">{label}</p>
      </div>
    </div>
  );
}

function PublicAnimatedRoutes() {
  const location = useLocation();
  const { scrollTo, lenis } = useSmoothScroll();

  const handleExitComplete = useCallback(() => {
    if (!location.hash) {
      scrollTo(0, { immediate: true });
    } else {
      scrollTo(location.hash, { immediate: true, offset: -88 });
    }
    window.requestAnimationFrame(() => {
      lenis?.resize();
      ScrollTrigger.refresh();
    });
  }, [location.hash, scrollTo, lenis]);

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

function RootRouter() {
  return (
    <Routes>
      {/* Admin Authentication Routes (Standalone Split-Screen Layout) */}
      <Route
        path="/admin/signup"
        element={
          <ErrorBoundary>
            <Suspense fallback={<PageLoader label="Loading Admin Portal..." />}>
              <AdminSignupPage />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path="/admin/login"
        element={
          <ErrorBoundary>
            <Suspense fallback={<PageLoader label="Loading Admin Portal..." />}>
              <AdminLoginPage />
            </Suspense>
          </ErrorBoundary>
        }
      />
      <Route
        path="/admin/forgot-password"
        element={
          <ErrorBoundary>
            <Suspense fallback={<PageLoader label="Loading Admin Portal..." />}>
              <AdminForgotPasswordPage />
            </Suspense>
          </ErrorBoundary>
        }
      />

      {/* Protected Admin Dashboard Routes (CRM Sidebar + Topbar Layout) */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <ErrorBoundary>
              <AdminLayout />
            </ErrorBoundary>
          </AdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<PageLoader label="Loading Dashboard..." />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="contacts"
          element={
            <Suspense fallback={<PageLoader label="Loading Contacts..." />}>
              <AdminContactsPage />
            </Suspense>
          }
        />
        <Route
          path="bookings"
          element={
            <Suspense fallback={<PageLoader label="Loading Bookings..." />}>
              <AdminBookingsPage />
            </Suspense>
          }
        />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<PageLoader label="Loading Gallery Management..." />}>
              <AdminGalleryPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<PageLoader label="Loading Profile..." />}>
              <AdminProfilePage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Public Photography Studio Website Routes */}
      <Route
        path="/*"
        element={
          <MainLayout>
            <PublicAnimatedRoutes />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HelmetProvider>
        <SmoothScrollProvider>
          <BrowserRouter>
            <RootRouter />
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                style: {
                  fontFamily: 'Manrope, sans-serif',
                },
              }}
            />
          </BrowserRouter>
        </SmoothScrollProvider>
      </HelmetProvider>
    </MotionConfig>
  );
}
