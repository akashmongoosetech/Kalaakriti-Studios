import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';
import { PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { GALLERY_ITEMS } from '../../data/gallery';
import { STUDIO_SERVICES } from '../../data/services';
import { CITIES_WE_SERVE } from '../../data/cities';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SafeImage } from '../../components/common/SafeImage';
import { SectionHeading } from '../../components/common/SectionHeading';
import { BeforeAfterSlider } from '../../components/common/BeforeAfterSlider';
import { RevealMask } from '../../components/animations/RevealMask';
import { TiltCard3D } from '../../components/animations/TiltCard3D';
import { FlipPhotoCard } from '../../components/animations/FlipPhotoCard';
import { HorizontalStoryStrip } from '../../components/animations/HorizontalStoryStrip';
import { GalleryCard } from '../../components/gallery/GalleryCard';
import { GalleryLightbox } from '../../components/gallery/GalleryLightbox';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { TestimonialCarousel } from '../../components/common/TestimonialCarousel';
import { NewsletterSubscribe } from '../../components/common/NewsletterSubscribe';
import { InstagramGrid } from '../../components/common/InstagramGrid';
import {
  AnimatedStatsStrip,
  FAQAccordionSection,
} from './HomeStatsAndTestimonials';
import { GalleryItem } from '../../types';

gsap.registerPlugin(ScrollTrigger);

const ThreeAmbientFrames = lazy(() => import('../../components/animations/ThreeAmbientFrames'));

const HOME_FEATURED_CATEGORY_SLUGS = [
  'wedding',
  'pre-wedding',
  'engagement',
  'haldi',
  'birthday',
  'anniversary',
  'corporate',
  'maternity',
  'baby-photography',
  'family',
  'events',
  'portrait',
];

const SIGNATURE_HOME_SERVICES = [
  'wedding-cinematography',
  'wedding-photography',
  'pre-wedding-cinematic-films',
  'engagement-photography',
  'drone-photography',
  'traditional-photography',
  'professional-portrait-photography',
];

const WHY_CHOOSE_US = [
  {
    number: '01',
    title: 'Creative Storytelling',
    detail: 'We weave quiet glances, ritual symbolism, and family warmth into a cohesive visual heirloom.',
  },
  {
    number: '02',
    title: 'Experienced Photography Team',
    detail: 'Seasoned Indian wedding leads fluent in Malwa, Marwari, Punjabi, Gujarati, and temple ceremonies.',
  },
  {
    number: '03',
    title: 'Professional Equipment',
    detail: 'Dual-slot full-frame cinema cameras, fast f/1.4 prime glass, wireless audio, and redundant backups.',
  },
  {
    number: '04',
    title: 'Cinematic Editing',
    detail: 'In-house colourists crafting warm, enduring film palettes instead of fleeting oversaturated presets.',
  },
  {
    number: '05',
    title: 'Attention to Detail',
    detail: 'From zari embroidery and ancestral jewellery to brass diyas and handwritten wedding notes.',
  },
  {
    number: '06',
    title: 'Timely Delivery',
    detail: 'Structured post-production schedules with 7-day highlight previews and clear delivery milestones.',
  },
  {
    number: '07',
    title: 'Personalized Packages',
    detail: 'Every wedding suite is tailored around your exact ritual itinerary, guest count, and priorities.',
  },
  {
    number: '08',
    title: 'Calm Event Coordination',
    detail: 'We collaborate seamlessly with planners, priests, and families so celebrations remain unhurried.',
  },
];

const BOOKING_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Share Your Requirements',
    description: 'Tell us your celebration dates, rituals, venue cities, and photography or film aspirations.',
  },
  {
    step: '02',
    title: 'Discuss Your Event',
    description: 'Connect over a studio coffee in Indore or a video consultation to align on visual style.',
  },
  {
    step: '03',
    title: 'Select Your Package',
    description: 'Review a transparent proposal outlining crew size, deliverables, albums, and timelines.',
  },
  {
    step: '04',
    title: 'Confirm Your Booking',
    description: 'Reserve your dates on our studio calendar and begin collaborative timeline planning.',
  },
  {
    step: '05',
    title: 'Enjoy Your Celebration',
    description: 'Be fully present with family while our team captures every ritual and candid heartbeat.',
  },
  {
    step: '06',
    title: 'Receive Your Memories',
    description: 'Relive your story through curated previews, full online galleries, 4K films, and heirloom albums.',
  },
];

export default function HomePage() {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    const ctx = gsap.context(() => {
      if (heroBgRef.current) {
        gsap.to(heroBgRef.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: heroBgRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.children,
          { opacity: 0.01, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }
        );
      }
    });
    return () => ctx.revert();
  }, [prefersReduced]);

  const featuredCategories = HOME_FEATURED_CATEGORY_SLUGS.map((slug) =>
    PHOTOGRAPHY_CATEGORIES.find((c) => c.slug === slug)
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  const featuredPortfolio = GALLERY_ITEMS.slice(0, 8);
  const signatureServices = SIGNATURE_HOME_SERVICES.map((slug) =>
    STUDIO_SERVICES.find((s) => s.slug === slug)
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));

  const openLightboxWithList = (list: GalleryItem[], item: GalleryItem) => {
    const idx = list.findIndex((entry) => entry.id === item.id);
    setLightboxItems(list);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  return (
    <div>
      <SeoHelmet
        title={`${STUDIO_CONFIG.name} — Luxury Indian Wedding Photography & Cinematography in Indore, MP`}
        description="Luxury Indian wedding photography, pre-wedding films, Haldi, Mehendi, maternity, portraits, and event cinematography across Indore, Bhopal, Ujjain, Dewas, Ratlam, Gwalior, and Jabalpur."
        keywords={[
          'Wedding Photographer Indore',
          'Wedding Cinematography Bhopal',
          'Pre-Wedding Shoot Maheshwar',
          'Haldi Mehendi Photography Ujjain',
          'Luxury Indian Wedding Studio Madhya Pradesh',
        ]}
        ogImage={STUDIO_IMAGES.heroWedding}
        ogImageAlt="Indian royal wedding couple beneath a floral mandap in Madhya Pradesh"
        schemaType="LocalBusiness"
      />
      {/* SECTION 1: CINEMATIC HERO */}
      <section className="relative min-h-screen flex items-end pb-16 sm:pb-24 pt-28 overflow-hidden bg-[#171615] text-[#F7F2E9]">
        <div ref={heroBgRef} className="absolute inset-0 -top-10 -bottom-10">
          <SafeImage
            src={STUDIO_IMAGES.heroWedding}
            alt="Indian royal wedding couple beneath a marigold and mogra mandap at twilight"
            loading="eager"
            className="h-full w-full object-cover object-center scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/50 to-[#171615]/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171615]/75 via-[#171615]/25 to-transparent" />
        </div>

        {/* Subtle decorative antique-gold architectural corner lines */}
        <div
          aria-hidden="true"
          className="hidden lg:block pointer-events-none absolute top-28 right-10 w-24 h-24 border-t border-r border-[#C5A46D]/40"
        />

        <div className="studio-container relative z-10">
          <div ref={heroTextRef} className="max-w-4xl 2xl:max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-5">
              <span style={{ fontFamily: 'var(--font-devanagari)' }} className="tracking-normal text-base">
                {STUDIO_CONFIG.devanagariName}
              </span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span>Indian Wedding Photography &amp; Cinematography</span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span>{STUDIO_CONFIG.locationLabel}</span>
            </div>

            <h1 className="hero-headline font-editorial font-medium text-[#F7F2E9]">
              Every Moment Has a Story. We Make It Timeless.
            </h1>

            <p className="mt-6 text-base sm:text-lg 2xl:text-xl text-[#E8DCCB]/90 leading-relaxed max-w-2xl">
              {STUDIO_CONFIG.tagline} From sacred pheras under marigold mandaps to heritage pre-wedding
              editorials across Indore, Bhopal, Ujjain, and Madhya Pradesh, we craft heirloom
              photographs and cinema films steeped in emotion.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2.5 rounded-lg bg-[#57252F] px-7 py-3.5 text-sm sm:text-base font-medium text-[#F7F2E9] border border-[#C5A46D]/40 hover:bg-[#6F323E] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explore Our Work</span>
                <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2.5 rounded-lg bg-[#F7F2E9]/10 px-7 py-3.5 text-sm sm:text-base font-medium text-[#F7F2E9] border border-[#F7F2E9]/35 hover:bg-[#F7F2E9] hover:text-[#171615] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Book Your Date</span>
              </Link>
            </div>
          </div>

          <div className="mt-14 pt-6 border-t border-[#F7F2E9]/15 flex items-center justify-between text-xs text-[#E8DCCB]/75">
            <span>Weddings · Pre-Weddings · Haldi &amp; Mehendi · Portraits · Cinema Films</span>
            <a
              href="#studio-introduction"
              className="hidden sm:inline-flex items-center gap-2 text-[#C5A46D] hover:text-[#F7F2E9] transition-colors"
            >
              <span>Scroll to discover</span>
              <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Editorial Marquee Section Divider */}
      <div className="bg-[#57252F] text-[#E8DCCB] py-3.5 overflow-hidden border-y border-[#C5A46D]/30">
        <div className="flex w-max animate-editorial-marquee whitespace-nowrap text-xs sm:text-sm tracking-[0.2em] font-medium">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8">
              <span>Indian Wedding Editorial</span>
              <span className="text-[#C5A46D]">·</span>
              <span>Maheshwar &amp; Mandu Pre-Weddings</span>
              <span className="text-[#C5A46D]">·</span>
              <span>4K Heritage Cinematography</span>
              <span className="text-[#C5A46D]">·</span>
              <span>Haldi &amp; Mehendi Documentary</span>
              <span className="text-[#C5A46D]">·</span>
              <span>Indore · Bhopal · Ujjain</span>
              <span className="text-[#C5A46D]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 2: STUDIO INTRODUCTION (Asymmetric Editorial Composition + 3D Floating Cards) */}
      <section id="studio-introduction" className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <RevealMask className="lg:col-span-5 space-y-6">
            <SectionHeading
              devanagari="परिचय"
              kicker="The Studio Philosophy"
              title="More Than Photographs. Memories That Last Forever."
            />
            <p className="text-base text-[#5C554E] leading-relaxed prose-measure">
              At {STUDIO_CONFIG.name}, we believe Indian celebrations are living heirlooms—where
              generations gather in handwoven silk, marigold fragrance, and joyful chaos that unfolds
              only once. Rather than interrupting your rituals for rigid poses, we observe with quiet
              instinct and editorial precision.
            </p>
            <p className="text-base text-[#5C554E] leading-relaxed prose-measure">
              Every photograph is composed with natural colour restraint—preserving the deep burgundy
              of zardozi bridal weaves, the warm glow of havan embers, and the subtle emotion in a
              father’s eyes during vidaai.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#57252F] hover:text-[#171615] transition-colors underline underline-offset-4"
              >
                <span>Read Our Studio Story</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#171615] hover:text-[#57252F] transition-colors"
              >
                <span>Explore 15 Services</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </RevealMask>

          <div className="lg:col-span-7 grid grid-cols-12 gap-5 items-center">
            <TiltCard3D className="col-span-12 sm:col-span-7">
              <div className="overflow-hidden rounded-xl border border-[#171615]/10 shadow-xl aspect-[3/4] bg-[#171615]">
                <SafeImage
                  src={STUDIO_IMAGES.haldiRitual}
                  alt="Authentic sunlit Indian Haldi ritual surrounded by marigold petals and family"
                  className="h-full w-full object-cover"
                />
              </div>
            </TiltCard3D>
            <div className="col-span-12 sm:col-span-5 space-y-5">
              <TiltCard3D>
                <div className="overflow-hidden rounded-xl border border-[#171615]/10 shadow-lg aspect-[4/3] bg-[#171615]">
                  <SafeImage
                    src={STUDIO_IMAGES.preweddingPalace}
                    alt="Indian couple walking along heritage sandstone arches at sunset"
                    className="h-full w-full object-cover"
                  />
                </div>
              </TiltCard3D>
              <div className="rounded-xl bg-[#E8DCCB]/70 border border-[#171615]/10 p-6">
                <p className="font-editorial text-xl italic text-[#57252F] leading-snug">
                  “We photograph the feeling of the room, not merely how it looked.”
                </p>
                <p className="mt-2.5 text-xs text-[#5C554E]">
                  Crafted for Indian weddings, rituals &amp; heirloom family archives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED CATEGORIES (12 Categories Grid) */}
      <section className="py-20 md:py-28 bg-[#E8DCCB]/40 border-y border-[#171615]/8">
        <div className="studio-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              devanagari="श्रेणियाँ"
              kicker="Curated Collections"
              title="Every Chapter of Indian Celebration"
              description="Explore dedicated photography galleries crafted for traditional ceremonies, intimate portraits, and milestone gatherings."
            />
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#57252F] hover:text-[#171615] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All 13 Categories</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/categories/${cat.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-[#F7F2E9] border border-[#171615]/10 hover:border-[#C5A46D] transition-colors"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#171615]">
                  <SafeImage
                    src={cat.cardImage}
                    alt={`${cat.name} — ${STUDIO_CONFIG.name}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-xs text-[#E8DCCB] tabular-nums">
                    {cat.sampleCount} Demo Photographs
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-editorial text-2xl font-medium text-[#171615] group-hover:text-[#57252F] transition-colors">
                        {cat.name}
                      </h3>
                      <span
                        style={{ fontFamily: 'var(--font-devanagari)' }}
                        className="text-xs text-[#C5A46D] shrink-0"
                      >
                        {cat.devanagariLabel}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#5C554E] leading-relaxed line-clamp-2">
                      {cat.shortDescription}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#171615]/8 flex items-center justify-between text-xs font-semibold text-[#57252F]">
                    <span>Explore Category</span>
                    <ArrowUpRight
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURED PORTFOLIO (Mixed Images & Videos Masonry + Horizontal Story Strip) */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              devanagari="चित्रशाला"
              kicker="Featured Portfolio"
              title="Photographs & Cinema Films, Woven Together"
              description="Select any photograph or film reel below to open our fullscreen viewing room with playback and project notes."
            />
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-6 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View All Gallery</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            </Link>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6">
            {featuredPortfolio.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onOpenLightbox={(selected) => openLightboxWithList(featuredPortfolio, selected)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Dark Horizontal Storytelling Strip + Editorial Colour Grading Before/After */}
      <section className="py-20 md:py-28 bg-[#171615] text-[#F7F2E9]">
        <div className="studio-container space-y-20">
          <div>
            <SectionHeading
              devanagari="कथाक्रम"
              kicker="Horizontal Storytelling"
              title="Complete Celebration Chapters & Cinema Reels"
              tone="light"
            />
            <div className="mt-10">
              <HorizontalStoryStrip
                items={GALLERY_ITEMS.slice(0, 7)}
                onSelectItem={(selected) => openLightboxWithList(GALLERY_ITEMS.slice(0, 7), selected)}
              />
            </div>
          </div>

          {/* Before / After Editorial Post-Production Showcase */}
          <div className="pt-16 border-t border-[#C5A46D]/20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <SectionHeading
                devanagari="रंग-संयोजन"
                kicker="Editorial Colour Craft"
                title="From Camera RAW to Timeless Heirloom Tone"
                description="Our in-house colour grading honours natural Indian skin tones, authentic Banarasi crimson, and warm candlelight depth—never washed-out or artificial filters."
                tone="light"
              />
              <ul className="space-y-3 text-sm text-[#E8DCCB]/80 pt-2">
                <li>01. True-to-life silk, gold zari &amp; turmeric colour fidelity</li>
                <li>02. Balanced highlight recovery across bright mandap firelight</li>
                <li>03. Calibrated tonal profiles prepared for museum-grade linen albums</li>
              </ul>
            </div>
            <div className="lg:col-span-7">
              <BeforeAfterSlider
                imageSrc={STUDIO_IMAGES.weddingPheras}
                alt="Sacred Indian wedding pheras ceremony colour grading comparison"
                caption="Slide to compare flat camera RAW capture against Kalaakriti’s signature warm film grade."
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: OUR STORY (Split-Screen + Selective Lightweight Three.js 3D Gilded Frames) */}
      <section className="relative py-20 md:py-28 bg-[#1D1B1A] text-[#F7F2E9] overflow-hidden border-t border-[#C5A46D]/20">
        <ErrorBoundary silent>
          <Suspense fallback={null}>
            <ThreeAmbientFrames />
          </Suspense>
        </ErrorBoundary>

        <div className="studio-container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 bg-[#171615]/88 p-8 sm:p-10 rounded-xl border border-[#C5A46D]/25">
            <SectionHeading
              devanagari="हमारी कहानी"
              kicker="Our Story & Creative Vision"
              title="Rooted in Madhya Pradesh Heritage, Guided by Cinema"
              tone="light"
            />
            <p className="text-sm sm:text-base text-[#E8DCCB]/85 leading-relaxed">
              Founded by visual storytellers who grew up amidst the brass lanterns, classical raagas,
              and grand joint-family weddings of Malwa, {STUDIO_CONFIG.name} was born to elevate Indian
              wedding documentation into lasting editorial art.
            </p>
            <p className="text-sm sm:text-base text-[#E8DCCB]/85 leading-relaxed">
              Our photographers, cinematographers, and colourists work as a unified studio collective—limiting
              commissions each season so every couple receives thoughtful creative direction from
              pre-wedding planning to final album binding.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F7F2E9] px-6 py-3 text-sm font-medium text-[#171615] hover:bg-[#E8DCCB] transition-colors"
              >
                <span>Meet the Team &amp; Craft</span>
                <ArrowRight className="w-4 h-4 text-[#57252F]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-5">
            <div className="overflow-hidden rounded-xl border border-[#C5A46D]/30 aspect-[3/4] bg-[#242220]">
              <SafeImage
                src={STUDIO_IMAGES.portraitStudio}
                alt="Fine-art Indian portrait in Maheshwari silk saree"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-[#C5A46D]/30 aspect-[3/4] mt-10 bg-[#242220]">
              <SafeImage
                src={STUDIO_IMAGES.mehendiBridal}
                alt="Editorial bridal Mehendi portrait"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: SIGNATURE SERVICES (Interactive 3D Flip Photography Cards) */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              devanagari="सेवाएँ"
              kicker="Signature Services"
              title="Crafted Across Still Photography & 4K Cinema"
              description="Hover or tap any signature service card to flip and inspect deliverables, styles, and dedicated coverage options."
            />
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#57252F] hover:text-[#171615] whitespace-nowrap shrink-0"
            >
              <span>Compare All 15 Services</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {signatureServices.map((srv) => (
              <FlipPhotoCard
                key={srv.slug}
                frontImage={srv.image}
                alt={srv.name}
                title={srv.name}
                subtitle={`Service ${srv.number}`}
                backSummary={srv.description}
                highlights={srv.included.slice(0, 3)}
                to={`/services#${srv.slug}`}
                ctaLabel="Inspect Service Details"
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: WHY CHOOSE US */}
      <section className="py-20 md:py-28 bg-[#E8DCCB]/40 border-t border-[#171615]/8">
        <div className="studio-container">
          <SectionHeading
            devanagari="विशेषताएँ"
            kicker="Why Families Trust Us"
            title="Discipline Behind the Romance"
            description="Great wedding photography depends equally on emotional empathy and dependable technical execution."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#171615]/12 border border-[#171615]/12 rounded-xl overflow-hidden">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item.number} className="bg-[#F7F2E9] p-7 space-y-3">
                <div className="text-xs font-semibold tracking-[0.16em] text-[#C5A46D] tabular-nums">
                  {item.number}
                </div>
                <h3 className="font-editorial text-2xl font-medium text-[#171615]">{item.title}</h3>
                <p className="text-sm text-[#5C554E] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: STATISTICS (Editable Demonstration Counters) */}
      <AnimatedStatsStrip />

      {/* SECTION 9: 6-STEP PROCESS */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container">
          <SectionHeading
            devanagari="प्रक्रिया"
            kicker="From First Hello to Heirloom Album"
            title="Our Six-Step Celebration Journey"
            description="A transparent, unhurried workflow designed so you and your family stay relaxed from inquiry to final delivery."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BOOKING_PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="pt-6 border-t border-[#57252F]/25 flex flex-col justify-between"
              >
                <div>
                  <span className="font-editorial text-4xl text-[#C5A46D] tabular-nums">
                    {item.step}
                  </span>
                  <h3 className="font-editorial text-2xl font-medium text-[#171615] mt-3">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#5C554E] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: TESTIMONIALS CAROUSEL */}
      <TestimonialCarousel />

      {/* SECTION 11: INSTAGRAM LUXURY MASONRY GALLERY */}
      <InstagramGrid />

      {/* SECTION 12: CITIES WE SERVE */}
      <section className="py-20 md:py-28 bg-[#171615] text-[#F7F2E9]">
        <div className="studio-container">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <SectionHeading
              devanagari="मध्य प्रदेश"
              kicker="Regional & Destination Coverage"
              title="Across Indore, Bhopal, Ujjain & Heritage Madhya Pradesh"
              description="Operating from our Indore base, our travel-ready photography and cinema teams cover celebrations across Madhya Pradesh upon advance scheduling."
              tone="light"
            />
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#C5A46D] hover:text-[#F7F2E9] whitespace-nowrap shrink-0"
            >
              <span>Check Outstation Availability</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CITIES_WE_SERVE.map((city) => (
              <div
                key={city.slug}
                className="rounded-xl bg-[#242220] border border-[#C5A46D]/20 p-6 flex flex-col justify-between hover:border-[#C5A46D]/55 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#C5A46D] mb-2">
                    <span>{city.regionTag}</span>
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </div>
                  <h3 className="font-editorial text-2xl font-medium text-[#F7F2E9]">{city.name}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-[#E8DCCB]/75 leading-relaxed">
                    {city.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#C5A46D]/15 flex items-center justify-between text-xs">
                  <Link
                    to={`/categories/${city.recommendedCategory}`}
                    className="text-[#C5A46D] hover:text-[#F7F2E9] transition-colors inline-flex items-center gap-1"
                  >
                    <span>Explore Collection</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/booking"
                    className="text-[#E8DCCB]/75 hover:text-[#F7F2E9] transition-colors"
                  >
                    Inquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13: FAQ */}
      <FAQAccordionSection />

      {/* SECTION 13B: NEWSLETTER SUBSCRIBE */}
      <NewsletterSubscribe variant="editorial" />

      {/* SECTION 14: FINAL CINEMATIC CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden bg-[#171615] text-[#F7F2E9]">
        <SafeImage
          src={STUDIO_IMAGES.preweddingPalace}
          alt="Romantic Indian couple at golden hour along Maheshwar heritage arches"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/60 to-[#171615]/70" />

        <div className="studio-container relative z-10 text-center max-w-3xl mx-auto">
          <div className="text-xs sm:text-sm tracking-[0.18em] text-[#C5A46D] mb-4">
            Limited Seasonal Commissions · {STUDIO_CONFIG.locationLabel}
          </div>
          <h2 className="section-headline font-editorial font-medium text-[#F7F2E9]">
            Your Story Deserves to Be Remembered.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#E8DCCB]/85 leading-relaxed">
            Share your wedding dates, ritual calendar, or portrait vision with us. We would be
            honoured to craft timeless heirlooms for your family.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#57252F] px-8 py-4 text-sm sm:text-base font-medium text-[#F7F2E9] border border-[#C5A46D]/45 hover:bg-[#6F323E] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Let&apos;s Plan Your Celebration</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-[#F7F2E9]/35 px-7 py-4 text-sm sm:text-base font-medium text-[#F7F2E9] hover:bg-[#F7F2E9] hover:text-[#171615] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Contact Studio Desk</span>
            </Link>
          </div>
        </div>
      </section>

      <GalleryLightbox
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextIdx) => setLightboxIndex(nextIdx)}
      />
    </div>
  );
}
