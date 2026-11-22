import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Maximize2 } from 'lucide-react';
import { getCategoryBySlug, PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { getGalleryItemsByCategorySlug } from '../../data/gallery';
import { STUDIO_SERVICES } from '../../data/services';
import { STUDIO_CONFIG } from '../../data/studio';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';
import { SectionHeading } from '../../components/common/SectionHeading';
import { GalleryCard } from '../../components/gallery/GalleryCard';
import { GalleryLightbox } from '../../components/gallery/GalleryLightbox';
import NotFoundPage from '../NotFound/NotFoundPage';
import { GalleryItem } from '../../types';

export default function CategoryDetailsPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!category) {
    return <NotFoundPage />;
  }

  const galleryList = getGalleryItemsByCategorySlug(category.slug);
  const featuredLightboxItems: GalleryItem[] = category.featuredImages.map((img, i) => ({
    id: `${category.slug}-featured-${i}`,
    slug: galleryList[0]?.slug || 'royal-indore-palace-wedding',
    title: img.caption,
    category: category.name,
    categorySlug: category.slug,
    type: 'image',
    src: img.src,
    thumbnail: img.src,
    location: STUDIO_CONFIG.locationLabel,
    year: '2026',
    coupleOrClient: STUDIO_CONFIG.name,
    description: img.alt,
    aspectRatio: 'landscape',
  }));
  const openLightbox = (list: GalleryItem[], index: number) => {
    setLightboxItems(list);
    setLightboxIndex(index);
  };
  const relatedServices = STUDIO_SERVICES.filter((s) =>
    category.relatedServiceSlugs.includes(s.slug)
  );
  const relatedCategories = PHOTOGRAPHY_CATEGORIES.filter((c) =>
    category.relatedCategories.includes(c.slug)
  );

  return (
    <div>
      <SeoHelmet
        title={category.seoTitle}
        description={category.seoDescription}
        keywords={[
          `${category.name} Indore`,
          `${category.name} Bhopal`,
          `${category.name} Ujjain`,
          `${category.name} Madhya Pradesh`,
          ...category.styles.map((s) => s.title),
        ]}
        ogImage={category.heroImage}
        ogImageAlt={`${category.name} by ${STUDIO_CONFIG.name} in Madhya Pradesh`}
        schemaType="CollectionPage"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
          { name: category.name, path: `/categories/${category.slug}` },
        ]}
      />
      {/* 1. FULL-WIDTH CATEGORY HERO */}
      <section className="relative min-h-[68vh] flex items-end pb-16 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <SafeImage
          src={category.heroImage}
          alt={category.name}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/55 to-[#171615]/40" />

        <div className="studio-container relative z-10">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#C5A46D] hover:text-[#F7F2E9] mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>All Photography Categories</span>
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-3">
              <span style={{ fontFamily: 'var(--font-devanagari)' }} className="tracking-normal text-base">
                {category.devanagariLabel}
              </span>
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span className="tabular-nums">{category.sampleCount} Curated Demo Frames</span>
            </div>
            <h1 className="hero-headline font-editorial font-medium">{category.name}</h1>
            <p className="mt-5 text-base sm:text-lg text-[#E8DCCB]/90 leading-relaxed max-w-2xl">
              {category.longDescription}
            </p>
          </div>
        </div>
      </section>

      {/* 2 & 3. SHORT INTRODUCTION & FEATURED PHOTOGRAPHY */}
      <section className="py-20 md:py-24 bg-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <SectionHeading
              devanagari={category.devanagariLabel}
              kicker="Collection Overview"
              title={`Our Editorial Approach to ${category.name}`}
            />
            <p className="text-base text-[#5C554E] leading-relaxed prose-measure">
              {category.introduction}
            </p>
            <div className="pt-2">
              <Link
                to={`/booking?category=${category.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-6 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors"
              >
                <span>Check Date Availability</span>
                <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {category.featuredImages.map((img, i) => (
              <figure
                key={img.caption}
                role="button"
                tabIndex={0}
                onClick={() => openLightbox(featuredLightboxItems, i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(featuredLightboxItems, i);
                  }
                }}
                aria-label={`Inspect high-resolution photograph: ${img.caption}`}
                className={`group cursor-pointer ${i === 0 && category.featuredImages.length === 3 ? 'sm:col-span-2' : ''} overflow-hidden rounded-xl bg-[#171615] border border-[#171615]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#57252F]`}
              >
                <div className={`relative overflow-hidden ${i === 0 && category.featuredImages.length === 3 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                  <SafeImage
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#57252F]/90 border border-[#C5A46D]/60 text-[#F7F2E9] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <Maximize2 className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
                <figcaption className="px-4 py-3 text-xs text-[#E8DCCB]/85 bg-[#171615]">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MIXED IMAGE & VIDEO GALLERY FOR THIS CATEGORY */}
      <section className="py-20 md:py-24 bg-[#E8DCCB]/40 border-y border-[#171615]/8">
        <div className="studio-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <SectionHeading
              kicker="Photographs & Films"
              title={`${category.name} Highlights`}
              description="Click any photograph or cinema highlight reel to open fullscreen viewing with controls."
            />
            <Link
              to="/gallery"
              className="text-sm font-semibold text-[#57252F] hover:text-[#171615] whitespace-nowrap shrink-0 underline underline-offset-4"
            >
              Open Full Studio Gallery
            </Link>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {galleryList.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                onOpenLightbox={() => openLightbox(galleryList, idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. PHOTOGRAPHY STYLES */}
      <section className="py-20 md:py-24 bg-[#F7F2E9]">
        <div className="studio-container">
          <SectionHeading
            kicker="Visual Languages"
            title="Photography & Cinema Styles Available"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.styles.map((st, idx) => (
              <div
                key={st.title}
                className="rounded-xl bg-[#FFFFFF] border border-[#171615]/10 p-7 space-y-3"
              >
                <div className="text-xs font-semibold tracking-[0.16em] text-[#C5A46D] tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <h3 className="font-editorial text-2xl font-medium text-[#171615]">{st.title}</h3>
                <p className="text-sm text-[#5C554E] leading-relaxed">{st.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 & 7. SAMPLE PACKAGES & RELATED SERVICES */}
      <section className="py-20 md:py-24 bg-[#171615] text-[#F7F2E9]">
        <div className="studio-container space-y-16">
          <div>
            <SectionHeading
              kicker="Sample Packages"
              title={`Curated ${category.name} Suites`}
              description="Editable sample package structures — every booking proposal is tailored to your celebration timeline and location."
              tone="light"
            />
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {category.packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className="rounded-xl bg-[#242220] border border-[#C5A46D]/30 p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs text-[#C5A46D] mb-2">{pkg.coverage}</div>
                    <h3 className="font-editorial text-3xl font-medium text-[#F7F2E9]">
                      {pkg.name}
                    </h3>
                    <p className="mt-2.5 text-sm text-[#E8DCCB]/80 leading-relaxed">{pkg.summary}</p>
                    <ul className="mt-6 space-y-2.5 text-sm text-[#F7F2E9]/90">
                      {pkg.deliverables.map((del) => (
                        <li key={del} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0" aria-hidden="true" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#C5A46D]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span className="text-xs text-[#E8DCCB]/65">{pkg.note}</span>
                    <Link
                      to={`/booking?category=${category.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#6F323E] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Request Quote</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {relatedServices.length > 0 && (
            <div className="pt-12 border-t border-[#C5A46D]/20">
              <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#F7F2E9] mb-6">
                Related Studio Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedServices.map((srv) => (
                  <Link
                    key={srv.slug}
                    to={`/services#${srv.slug}`}
                    className="group rounded-xl bg-[#242220]/75 border border-[#C5A46D]/20 p-5 hover:border-[#C5A46D] transition-colors"
                  >
                    <div className="text-xs text-[#C5A46D] mb-1">Service {srv.number}</div>
                    <div className="font-editorial text-xl font-medium text-[#F7F2E9] group-hover:text-[#C5A46D] transition-colors">
                      {srv.name}
                    </div>
                    <p className="mt-2 text-xs text-[#E8DCCB]/75 line-clamp-2">{srv.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 8. CATEGORY FAQs */}
      <section className="py-20 bg-[#F7F2E9]">
        <div className="studio-container max-w-4xl">
          <SectionHeading
            kicker="Common Questions"
            title={`${category.name} FAQs`}
          />
          <div className="mt-8 divide-y divide-[#171615]/12 border-y border-[#171615]/12">
            {category.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#171615]">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-[#57252F] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm sm:text-base text-[#5C554E] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. RELATED CATEGORIES + BOOKING CTA */}
      <section className="py-20 bg-[#E8DCCB]/45 border-t border-[#171615]/8">
        <div className="studio-container space-y-14">
          <div>
            <h2 className="font-editorial text-3xl font-medium text-[#171615] mb-8">
              Explore Related Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCategories.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/categories/${rel.slug}`}
                  className="group rounded-xl overflow-hidden bg-[#F7F2E9] border border-[#171615]/10 hover:border-[#C5A46D] transition-colors"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#171615]">
                    <SafeImage
                      src={rel.cardImage}
                      alt={rel.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5 flex items-center justify-between gap-2">
                    <span className="font-editorial text-xl font-medium text-[#171615] group-hover:text-[#57252F]">
                      {rel.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#57252F] shrink-0" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[#57252F] text-[#F7F2E9] p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-editorial text-3xl sm:text-4xl font-medium">
                Ready to Plan Your {category.name}?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#E8DCCB]/85 max-w-xl">
                Share your celebration dates and venue city to receive a tailored proposal from our
                Indore studio team.
              </p>
            </div>
            <Link
              to={`/booking?category=${category.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#F7F2E9] px-7 py-3.5 text-sm font-medium text-[#171615] hover:bg-[#E8DCCB] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Start Booking Inquiry</span>
              <ArrowRight className="w-4 h-4 text-[#57252F]" aria-hidden="true" />
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
