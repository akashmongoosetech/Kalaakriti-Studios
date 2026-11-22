import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { StudioLogo } from '../common/StudioLogo';
import { SafeImage } from '../common/SafeImage';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';

interface AuthSplitLayoutProps {
  headline: string;
  subheadline: string;
  formTitle: string;
  formDescription: string;
  children: ReactNode;
  footerSlot?: ReactNode;
  photoSrc?: string;
}

export function AuthSplitLayout({
  headline,
  subheadline,
  formTitle,
  formDescription,
  children,
  footerSlot,
  photoSrc = STUDIO_IMAGES.heroWedding,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7F2E9] text-[#171615] flex flex-col lg:flex-row">
      {/* Left Luxury Branding & Wedding Photography Column (Desktop) */}
      <aside className="relative hidden lg:flex lg:w-[46%] xl:w-[48%] flex-col justify-between bg-[#171615] text-[#F7F2E9] p-12 xl:p-16 overflow-hidden">
        <SafeImage
          src={photoSrc}
          alt="Indian royal wedding photography by Kalaakriti Studios"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#3E1820]/60 to-[#171615]/75" />

        {/* Subtle Gold Architectural Corner Frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-6 border border-[#C5A46D]/30 rounded-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-6 left-6 h-8 w-8 border-t-2 border-l-2 border-[#C5A46D] rounded-tl-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b-2 border-r-2 border-[#C5A46D] rounded-br-2xl"
        />

        {/* Top Studio Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" aria-label={`Back to ${STUDIO_CONFIG.name} Website`}>
            <StudioLogo tone="light" size="lg" />
          </Link>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A46D] font-medium">
            Studio CRM
          </span>
        </div>

        {/* Center Editorial Headline & Brand Story */}
        <div className="relative z-10 max-w-lg space-y-5 my-auto py-12">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#C5A46D]">
            <span>{STUDIO_CONFIG.devanagariName}</span>
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
            <span>{STUDIO_CONFIG.city}, Madhya Pradesh</span>
          </div>
          <h1 className="font-editorial text-4xl xl:text-5xl font-medium leading-[1.08] text-[#F7F2E9]">
            {headline}
          </h1>
          <p className="text-sm xl:text-base text-[#E8DCCB]/85 leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* Bottom Studio Note */}
        <div className="relative z-10 flex items-center justify-between gap-4 border-t border-[#C5A46D]/25 pt-5 text-xs text-[#E8DCCB]/75">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
            <span>Frontend Demonstration Portal · Local Session Persistence</span>
          </div>
          <span className="whitespace-nowrap text-[#C5A46D]">{STUDIO_CONFIG.city} · Bhopal · Ujjain</span>
        </div>
      </aside>

      {/* Right Authentication Form Panel */}
      <main className="flex-1 flex flex-col justify-between px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="lg:hidden">
            <Link to="/" aria-label={STUDIO_CONFIG.name}>
              <StudioLogo tone="dark" size="sm" />
            </Link>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C554E] hover:text-[#57252F] transition-colors ml-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Public Website</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[500px] mx-auto my-8">
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#171615]/10 shadow-[0_12px_40px_rgba(23,22,21,0.06)] p-6 sm:p-8 lg:p-9">
            <div className="mb-6 pb-5 border-b border-[#171615]/8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57252F]">
                {STUDIO_CONFIG.name} · Admin Access
              </div>
              <h2 className="font-editorial text-3xl sm:text-[34px] font-medium text-[#171615] mt-1 leading-tight">
                {formTitle}
              </h2>
              <p className="text-xs sm:text-sm text-[#5C554E] mt-1.5 leading-relaxed">
                {formDescription}
              </p>
            </div>

            {children}

            {footerSlot && (
              <div className="mt-6 pt-5 border-t border-[#171615]/10 text-center text-xs sm:text-sm text-[#5C554E]">
                {footerSlot}
              </div>
            )}
          </div>
        </div>

        {/* Footer Legal Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C554E] pt-2">
          <span>© {new Date().getFullYear()} {STUDIO_CONFIG.name}</span>
          <div className="flex items-center gap-4">
            <Link to="/terms-and-conditions" className="hover:text-[#57252F] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/privacy-policy" className="hover:text-[#57252F] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
