import { Link } from 'react-router-dom';
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { StudioLogo } from '../common/StudioLogo';
import { NewsletterSubscribe } from '../common/NewsletterSubscribe';
import { STUDIO_CONFIG } from '../../data/studio';
import { CITIES_WE_SERVE } from '../../data/cities';

export function Footer() {

  return (
    <footer className="bg-[#171615] text-[#F7F2E9] border-t border-[#C5A46D]/25">
      {/* Main 5-Column Studio Footer */}
      <div className="studio-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" aria-label={`${STUDIO_CONFIG.name} Home`}>
              <StudioLogo tone="light" size="lg" />
            </Link>
            <p className="font-editorial text-xl italic text-[#C5A46D]">
              “{STUDIO_CONFIG.tagline}”
            </p>
            <p className="text-sm text-[#E8DCCB]/75 leading-relaxed max-w-sm">
              {STUDIO_CONFIG.shortIntro}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-editorial text-lg font-medium text-[#C5A46D] mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm text-[#E8DCCB]/85">
              <li><Link to="/" className="hover:text-[#F7F2E9] transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-[#F7F2E9] transition-colors">About Studio</Link></li>
              <li><Link to="/services" className="hover:text-[#F7F2E9] transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="hover:text-[#F7F2E9] transition-colors">Portfolio &amp; Gallery</Link></li>
              <li><Link to="/categories" className="hover:text-[#F7F2E9] transition-colors">Categories</Link></li>
              <li><Link to="/booking" className="hover:text-[#F7F2E9] transition-colors">Book a Session</Link></li>
              <li><Link to="/contact" className="hover:text-[#F7F2E9] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Photography Categories */}
          <div className="lg:col-span-2">
            <h3 className="font-editorial text-lg font-medium text-[#C5A46D] mb-4">Collections</h3>
            <ul className="space-y-2.5 text-sm text-[#E8DCCB]/85">
              <li><Link to="/categories/wedding" className="hover:text-[#F7F2E9] transition-colors">Wedding</Link></li>
              <li><Link to="/categories/pre-wedding" className="hover:text-[#F7F2E9] transition-colors">Pre-Wedding</Link></li>
              <li><Link to="/categories/engagement" className="hover:text-[#F7F2E9] transition-colors">Engagement</Link></li>
              <li><Link to="/categories/haldi" className="hover:text-[#F7F2E9] transition-colors">Haldi Ceremony</Link></li>
              <li><Link to="/categories/mehendi" className="hover:text-[#F7F2E9] transition-colors">Mehendi</Link></li>
              <li><Link to="/categories/birthday" className="hover:text-[#F7F2E9] transition-colors">Birthday</Link></li>
              <li><Link to="/categories/events" className="hover:text-[#F7F2E9] transition-colors">Traditional Events</Link></li>
              <li><Link to="/categories/maternity" className="hover:text-[#F7F2E9] transition-colors">Maternity</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div className="lg:col-span-2 space-y-3.5 text-sm text-[#E8DCCB]/85">
            <h3 className="font-editorial text-lg font-medium text-[#C5A46D] mb-4">Studio Desk</h3>
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
              <a href={`tel:${STUDIO_CONFIG.phoneHref}`} className="hover:text-[#F7F2E9]">
                {STUDIO_CONFIG.phoneDisplay}
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
              <a href={`mailto:${STUDIO_CONFIG.email}`} className="hover:text-[#F7F2E9] break-all">
                {STUDIO_CONFIG.email}
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                {STUDIO_CONFIG.addressLine1}, {STUDIO_CONFIG.addressLine2}
              </span>
            </div>
            <p className="text-xs text-[#E8DCCB]/60 pt-1 leading-relaxed">
              {STUDIO_CONFIG.businessHours}
            </p>
          </div>

          {/* Column 5: Social Links & Journal Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-editorial text-lg font-medium text-[#C5A46D] mb-4">Follow Us</h3>
              <ul className="space-y-2 text-sm text-[#E8DCCB]/85">
                <li>
                  <a href={STUDIO_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7F2E9]">
                    Instagram · {STUDIO_CONFIG.social.instagramHandle}
                  </a>
                </li>
                <li>
                  <a href={STUDIO_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7F2E9]">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href={STUDIO_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7F2E9]">
                    YouTube Films
                  </a>
                </li>
                <li>
                  <a href={STUDIO_CONFIG.social.pinterest} target="_blank" rel="noopener noreferrer" className="hover:text-[#F7F2E9]">
                    Pinterest Boards
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter + Cities Strip */}
        <div className="mt-14 pt-10 border-t border-[#C5A46D]/20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <h4 className="font-editorial text-lg text-[#C5A46D] mb-2.5">
              Cities We Travel To Across Madhya Pradesh
            </h4>
            <p className="text-xs text-[#E8DCCB]/65 mb-3">
              Based in {STUDIO_CONFIG.city} — on-location destination coverage without physical branch claims:
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-[#E8DCCB]/85">
              {CITIES_WE_SERVE.map((city, idx) => (
                <span key={city.slug} className="inline-flex items-center gap-3">
                  <Link
                    to={`/categories/${city.recommendedCategory}`}
                    className="hover:text-[#C5A46D] transition-colors"
                  >
                    {city.name}
                  </Link>
                  {idx < CITIES_WE_SERVE.length - 1 && (
                    <span aria-hidden="true" className="text-[#C5A46D]/40">
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

      {/* Bottom Legal & Back to Top Bar */}
      <div className="border-t border-[#C5A46D]/15 bg-[#121110]">
        <div className="studio-container py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DCCB]/65">
          <p>
            © {new Date().getFullYear()} {STUDIO_CONFIG.name}. All rights reserved. Editable studio demonstration edition.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-[#F7F2E9] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-[#F7F2E9] transition-colors">
              Terms &amp; Conditions
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 text-[#C5A46D] hover:text-[#F7F2E9] transition-colors cursor-pointer"
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
