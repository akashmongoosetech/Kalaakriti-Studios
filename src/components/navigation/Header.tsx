import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { StudioLogo } from '../common/StudioLogo';
import { CATEGORY_NAV_ITEMS, SERVICE_NAV_ITEMS } from '../../data/navigation';
import { STUDIO_CONFIG } from '../../data/studio';

/**
 * Sticky 3-Zone Editorial Top Bar:
 * [Brand Logo] — [Concise Single-Line Nav Links with Dropdowns] — [Book a Session CTA]
 * Transparent over dark full-screen hero sections, transitioning smoothly to warm ivory on scroll.
 */
export function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'categories' | 'services' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<'categories' | 'services' | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const hasDarkHero =
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/services' ||
    pathname === '/categories' ||
    pathname.startsWith('/categories/') ||
    pathname === '/gallery' ||
    pathname.startsWith('/gallery/') ||
    pathname === '/contact' ||
    pathname === '/booking';

  const isTransparent = hasDarkHero && !scrolled && !openDropdown && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
    setMobileAccordion(null);
  }, [pathname]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Lock body scroll when mobile overlay is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const linkBase = isTransparent
    ? 'text-[#F7F2E9]/90 hover:text-[#C5A46D]'
    : 'text-[#171615]/85 hover:text-[#57252F]';

  const activeStyle = isTransparent
    ? 'text-[#C5A46D] after:scale-x-100'
    : 'text-[#57252F] after:scale-x-100';

  const underlineClass =
    'relative py-1 whitespace-nowrap shrink-0 transition-colors after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-full after:bg-[#C5A46D] after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200';

  return (
    <header
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${
        isTransparent
          ? 'bg-gradient-to-b from-[#171615]/75 via-[#171615]/35 to-transparent border-b border-transparent'
          : 'bg-[#F7F2E9]/96 border-b border-[#171615]/10 shadow-[0_4px_24px_rgba(23,22,21,0.06)]'
      }`}
    >
      <div className="studio-container flex items-center justify-between gap-8 h-16 md:h-20">
        {/* Zone 1: Brand Logo */}
        <Link to="/" aria-label={`${STUDIO_CONFIG.name} — Home`} className="shrink-0">
          <StudioLogo tone={isTransparent ? 'light' : 'dark'} />
        </Link>

        {/* Zone 2: Desktop Navigation (5 concise single-line links) */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-7 text-sm font-medium">
          <NavLink
            to="/about"
            className={({ isActive }) => `${underlineClass} ${linkBase} ${isActive ? activeStyle : ''}`}
          >
            About
          </NavLink>

          {/* Services Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('services')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((cur) => (cur === 'services' ? null : 'services'))}
              aria-expanded={openDropdown === 'services'}
              className={`inline-flex items-center gap-1 cursor-pointer ${underlineClass} ${linkBase} ${
                pathname === '/services' ? activeStyle : ''
              }`}
            >
              <span>Services</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'services' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'services' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[540px]"
                >
                  <div className="rounded-xl bg-[#F7F2E9] border border-[#171615]/12 shadow-2xl p-6 grid grid-cols-2 gap-x-6 gap-y-4">
                    {SERVICE_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpenDropdown(null)}
                        className="group block rounded-lg p-2.5 hover:bg-[#E8DCCB]/60 transition-colors"
                      >
                        <div className="text-sm font-semibold text-[#171615] group-hover:text-[#57252F]">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-xs text-[#5C554E] mt-0.5 leading-snug">
                            {item.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Categories Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('categories')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              type="button"
              onClick={() => setOpenDropdown((cur) => (cur === 'categories' ? null : 'categories'))}
              aria-expanded={openDropdown === 'categories'}
              className={`inline-flex items-center gap-1 cursor-pointer ${underlineClass} ${linkBase} ${
                pathname.startsWith('/categories') ? activeStyle : ''
              }`}
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'categories' ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'categories' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[660px]"
                >
                  <div className="rounded-xl bg-[#F7F2E9] border border-[#171615]/12 shadow-2xl p-6">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#171615]/10">
                      <span className="font-editorial text-lg font-medium text-[#171615]">
                        Photography Collections
                      </span>
                      <Link
                        to="/categories"
                        onClick={() => setOpenDropdown(null)}
                        className="text-xs font-medium text-[#57252F] hover:underline underline-offset-4"
                      >
                        Explore All 13 Categories
                      </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
                      {CATEGORY_NAV_ITEMS.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpenDropdown(null)}
                          className="group block rounded-md px-2.5 py-2 hover:bg-[#E8DCCB]/65 transition-colors"
                        >
                          <div className="text-sm font-medium text-[#171615] group-hover:text-[#57252F]">
                            {item.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink
            to="/gallery"
            className={({ isActive }) => `${underlineClass} ${linkBase} ${isActive ? activeStyle : ''}`}
          >
            Gallery
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `${underlineClass} ${linkBase} ${isActive ? activeStyle : ''}`}
          >
            Contact
          </NavLink>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/booking"
            className={`hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
              isTransparent
                ? 'bg-[#F7F2E9] text-[#171615] hover:bg-[#E8DCCB]'
                : 'bg-[#57252F] text-[#F7F2E9] hover:bg-[#3E1820]'
            }`}
          >
            Book a Session
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className={`lg:hidden flex h-11 w-11 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
              isTransparent
                ? 'border-[#F7F2E9]/30 text-[#F7F2E9] hover:bg-[#171615]/50'
                : 'border-[#171615]/15 text-[#171615] hover:bg-[#E8DCCB]/60'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Full-Screen Animated Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24 }}
            className="lg:hidden fixed inset-0 top-16 z-40 bg-[#171615] text-[#F7F2E9] overflow-y-auto px-6 py-8 flex flex-col justify-between"
          >
            <nav aria-label="Mobile navigation" className="space-y-4">
              <Link
                to="/"
                className="block py-2 font-editorial text-3xl text-[#F7F2E9] hover:text-[#C5A46D]"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 font-editorial text-3xl text-[#F7F2E9] hover:text-[#C5A46D]"
              >
                About Us
              </Link>

              {/* Mobile Accordion: Categories */}
              <div className="border-y border-[#C5A46D]/20 py-2">
                <button
                  type="button"
                  onClick={() => setMobileAccordion((a) => (a === 'categories' ? null : 'categories'))}
                  className="flex w-full items-center justify-between py-2 font-editorial text-3xl text-[#F7F2E9] cursor-pointer"
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A46D] transition-transform ${
                      mobileAccordion === 'categories' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileAccordion === 'categories' && (
                  <div className="pt-2 pb-4 pl-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#E8DCCB]">
                    <Link to="/categories" className="font-semibold text-[#C5A46D] py-1">
                      All Photography Categories
                    </Link>
                    {CATEGORY_NAV_ITEMS.map((item) => (
                      <Link key={item.to} to={item.to} className="py-1 hover:text-[#C5A46D]">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Accordion: Services */}
              <div className="border-b border-[#C5A46D]/20 pb-2">
                <button
                  type="button"
                  onClick={() => setMobileAccordion((a) => (a === 'services' ? null : 'services'))}
                  className="flex w-full items-center justify-between py-2 font-editorial text-3xl text-[#F7F2E9] cursor-pointer"
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C5A46D] transition-transform ${
                      mobileAccordion === 'services' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {mobileAccordion === 'services' && (
                  <div className="pt-2 pb-4 pl-2 space-y-2 text-sm text-[#E8DCCB]">
                    {SERVICE_NAV_ITEMS.map((item) => (
                      <Link key={item.to} to={item.to} className="block py-1 hover:text-[#C5A46D]">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/gallery"
                className="block py-2 font-editorial text-3xl text-[#F7F2E9] hover:text-[#C5A46D]"
              >
                Portfolio &amp; Gallery
              </Link>
              <Link
                to="/contact"
                className="block py-2 font-editorial text-3xl text-[#F7F2E9] hover:text-[#C5A46D]"
              >
                Contact
              </Link>
            </nav>

            <div className="pt-8 mt-8 border-t border-[#C5A46D]/20 space-y-5">
              <Link
                to="/booking"
                className="flex w-full items-center justify-center rounded-lg bg-[#57252F] px-6 py-4 text-base font-medium text-[#F7F2E9] border border-[#C5A46D]/40 hover:bg-[#6F323E]"
              >
                Book Your Celebration
              </Link>
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#E8DCCB]/75">
                <span>{STUDIO_CONFIG.locationLabel}</span>
                <div className="flex items-center gap-4">
                  <a href={STUDIO_CONFIG.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A46D]">
                    Instagram
                  </a>
                  <a href={STUDIO_CONFIG.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A46D]">
                    YouTube
                  </a>
                  <a href={STUDIO_CONFIG.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A46D]">
                    Facebook
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
