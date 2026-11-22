import { Link } from 'react-router-dom';
import {
  ArrowUp,
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from 'lucide-react';
import { StudioLogo } from '../common/StudioLogo';
import { NewsletterSubscribe } from '../common/NewsletterSubscribe';
import { buildWhatsAppUrl, STUDIO_CONFIG } from '../../data/studio';
import { CITIES_WE_SERVE } from '../../data/cities';
import { useSmoothScroll } from '../../context/SmoothScrollContext';

const REGIONAL_DESKS = [
  {
    city: 'Indore',
    role: 'Primary Studio Base',
    detail: `${STUDIO_CONFIG.addressLine1}, ${STUDIO_CONFIG.addressLine2}`,
  },
  {
    city: 'Bhopal',
    role: 'On-Location Bookings',
    detail: 'Lakefront royal weddings, heritage portraits & pre-wedding shoots across Bhopal.',
  },
  {
    city: 'Ujjain',
    role: 'On-Location Bookings',
    detail: 'Sacred temple rituals, traditional wedding suites & family celebrations across Ujjain.',
  },
];

const SITE_MAP_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Studio', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio & Gallery', to: '/gallery' },
  { label: 'All Categories', to: '/categories' },
  { label: 'Book a Session', to: '/booking' },
  { label: 'Contact Studio', to: '/contact' },
];

const COLLECTION_LINKS = [
  { label: 'Wedding Photography', to: '/categories/wedding' },
  { label: 'Pre-Wedding Editorials', to: '/categories/pre-wedding' },
  { label: 'Engagement', to: '/categories/engagement' },
  { label: 'Haldi Ceremony', to: '/categories/haldi' },
  { label: 'Mehendi Celebration', to: '/categories/mehendi' },
  { label: 'Birthday Celebrations', to: '/categories/birthday' },
  { label: 'Traditional Events', to: '/categories/events' },
  { label: 'Maternity & Portraits', to: '/categories/maternity' },
];

export function Footer() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="bg-gradient-to-b from-[#4C1E28] via-[#3E1820] to-[#301118] text-[#F7F2E9] border-t border-[#C5A46D]/45">
      {/* Subtle Regional Identity Bar */}
      <div className="border-b border-[#C5A46D]/20 bg-[#321218]/65">
        <div className="studio-container py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#E8DCCB]/85">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-medium text-[#C5A46D]">Madhya Pradesh Coverage</span>
            <span aria-hidden="true" className="text-[#C5A46D]/45">
              ·
            </span>
            <span>Indore (Studio Base)</span>
            <span aria-hidden="true" className="text-[#C5A46D]/45">
              ·
            </span>
            <span>Bhopal</span>
            <span aria-hidden="true" className="text-[#C5A46D]/45">
              ·
            </span>
            <span>Ujjain</span>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-1.5 font-medium text-[#C5A46D] hover:text-[#F7F2E9] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Schedule a Consultation</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Main Burgundy & Gold Multi-Column Footer */}
      <div className="studio-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand Identity & Social Channels */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" aria-label={`${STUDIO_CONFIG.name} Home`} className="inline-block">
              <StudioLogo tone="light" size="lg" />
            </Link>
            <p className="font-editorial text-xl italic text-[#C5A46D]">
              “{STUDIO_CONFIG.tagline}”
            </p>
            <p className="text-sm text-[#E8DCCB]/80 leading-relaxed max-w-sm">
              {STUDIO_CONFIG.shortIntro}
            </p>

            {/* Social Links */}
            <div className="pt-2 space-y-3">
              <div className="text-xs tracking-[0.14em] text-[#C5A46D]">Follow the Studio</div>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={STUDIO_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${STUDIO_CONFIG.social.instagramHandle}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/40 bg-[#57252F]/60 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors"
                >
                  <Instagram className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={STUDIO_CONFIG.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube Wedding Films"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/40 bg-[#57252F]/60 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors"
                >
                  <Youtube className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={STUDIO_CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Studio Page"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/40 bg-[#57252F]/60 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors"
                >
                  <Facebook className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href={buildWhatsAppUrl(
                    `Namaste ${STUDIO_CONFIG.name}, I would love to inquire about wedding or event photography.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Studio Desk"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C5A46D]/40 bg-[#57252F]/60 text-[#F7F2E9] hover:bg-[#C5A46D] hover:text-[#171615] hover:border-[#C5A46D] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#E8DCCB]/75">
                <a
                  href={STUDIO_CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C5A46D] transition-colors"
                >
                  {STUDIO_CONFIG.social.instagramHandle}
                </a>
                <span aria-hidden="true" className="text-[#C5A46D]/45">
                  ·
                </span>
                <a
                  href={STUDIO_CONFIG.social.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C5A46D] transition-colors"
                >
                  Pinterest Boards
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Site Map — Studio Pages */}
          <nav aria-label="Footer site map" className="lg:col-span-2">
            <h3 className="font-editorial text-xl font-medium text-[#C5A46D] mb-4">Site Map</h3>
            <ul className="space-y-2.5 text-sm text-[#E8DCCB]/85">
              {SITE_MAP_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-[#F7F2E9] hover:underline underline-offset-4 decoration-[#C5A46D]/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3: Site Map — Photography Collections */}
          <nav aria-label="Photography collections" className="lg:col-span-2">
            <h3 className="font-editorial text-xl font-medium text-[#C5A46D] mb-4">Collections</h3>
            <ul className="space-y-2.5 text-sm text-[#E8DCCB]/85">
              {COLLECTION_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-[#F7F2E9] hover:underline underline-offset-4 decoration-[#C5A46D]/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 4: Contact Information — Indore, Bhopal & Ujjain */}
          <div className="lg:col-span-4 space-y-5">
            <h3 className="font-editorial text-xl font-medium text-[#C5A46D]">
              Contact &amp; Regional Desks
            </h3>

            {/* Direct Phone, Email & Hours */}
            <div className="space-y-2.5 text-sm text-[#E8DCCB]/90 pb-4 border-b border-[#C5A46D]/20">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${STUDIO_CONFIG.phoneHref}`}
                  className="hover:text-[#F7F2E9] transition-colors"
                >
                  {STUDIO_CONFIG.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${STUDIO_CONFIG.email}`}
                  className="hover:text-[#F7F2E9] break-all transition-colors"
                >
                  {STUDIO_CONFIG.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-[#E8DCCB]/75 pt-0.5">
                <Clock className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{STUDIO_CONFIG.businessHours}</span>
              </div>
            </div>

            {/* Indore, Bhopal & Ujjain Coverage Details */}
            <div className="space-y-3.5">
              {REGIONAL_DESKS.map((desk) => (
                <div key={desk.city} className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                  <div className="text-xs leading-relaxed">
                    <div className="flex flex-wrap items-center gap-2 text-[#F7F2E9] font-medium">
                      <span>{desk.city}</span>
                      <span aria-hidden="true" className="text-[#C5A46D]/50">
                        ·
                      </span>
                      <span className="text-[#C5A46D] font-normal">{desk.role}</span>
                    </div>
                    <p className="text-[#E8DCCB]/75 mt-0.5">{desk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extended Madhya Pradesh Cities + Newsletter Strip */}
        <div className="mt-14 pt-10 border-t border-[#C5A46D]/25 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h4 className="font-editorial text-xl text-[#C5A46D] mb-2">
              Destinations Across Madhya Pradesh
            </h4>
            <p className="text-xs text-[#E8DCCB]/75 mb-3.5 leading-relaxed max-w-xl">
              Headquartered in {STUDIO_CONFIG.city} — our travel-ready photography and 4K cinema
              crews cover celebrations on location across Madhya Pradesh upon advance booking:
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#E8DCCB]/90">
              {CITIES_WE_SERVE.map((city, idx) => (
                <span key={city.slug} className="inline-flex items-center gap-3">
                  <Link
                    to={`/categories/${city.recommendedCategory}`}
                    className="hover:text-[#C5A46D] transition-colors"
                  >
                    {city.name}
                  </Link>
                  {idx < CITIES_WE_SERVE.length - 1 && (
                    <span aria-hidden="true" className="text-[#C5A46D]/45">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <NewsletterSubscribe variant="compact" />
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Bar */}
      <div className="border-t border-[#C5A46D]/25 bg-[#260D13]">
        <div className="studio-container py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DCCB]/75">
          <p>
            © {new Date().getFullYear()} {STUDIO_CONFIG.name}. All rights reserved. Indore · Bhopal
            · Ujjain, Madhya Pradesh.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-[#F7F2E9] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-[#F7F2E9] transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/contact" className="hover:text-[#F7F2E9] transition-colors">
              Inquiries
            </Link>
            <button
              type="button"
              onClick={() => scrollTo(0, { duration: 1.4 })}
              className="inline-flex items-center gap-1.5 font-medium text-[#C5A46D] hover:text-[#F7F2E9] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
