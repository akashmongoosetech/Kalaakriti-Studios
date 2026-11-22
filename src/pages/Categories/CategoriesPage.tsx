import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PHOTOGRAPHY_CATEGORIES } from '../../data/categories';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';
import { RevealMask } from '../../components/animations/RevealMask';
import { TiltCard3D } from '../../components/animations/TiltCard3D';

export default function CategoriesPage() {
  return (
    <div>
      <SeoHelmet
        title={`13 Indian Photography Categories in Madhya Pradesh | ${STUDIO_CONFIG.name}`}
        description="Browse 13 curated Indian photography collections across Indore, Bhopal, Ujjain, Dewas, Ratlam, Gwalior & Jabalpur: Wedding, Pre-Wedding, Engagement, Haldi, Mehendi, Maternity, Baby, Portraits & Events."
        keywords={[
          'Indian Wedding Categories Indore',
          'Haldi & Mehendi Photography MP',
          'Pre-Wedding Shoots Maheshwar Mandu',
          'Family & Maternity Portraits Bhopal',
        ]}
        ogImage={STUDIO_IMAGES.haldiRitual}
        ogImageAlt="Authentic Indian Haldi ceremony photography collection"
        schemaType="CollectionPage"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Categories', path: '/categories' },
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-16 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <SafeImage
          src={STUDIO_IMAGES.haldiRitual}
          alt="Vibrant Indian Haldi ceremony celebration"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/60 to-[#171615]/45" />
        <div className="studio-container relative z-10 max-w-4xl">
          <div className="text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-4">
            13 Dedicated Photography Collections
          </div>
          <h1 className="hero-headline font-editorial font-medium">
            Curated by Tradition, Emotion &amp; Occasion.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#E8DCCB]/85 leading-relaxed max-w-2xl">
            Every Indian celebration carries its own palette, tempo, and cultural grace. Step inside
            any collection below to view tailored imagery, photography styles, packages, and FAQs.
          </p>
        </div>
      </section>

      {/* Image-First Editorial Grid */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7">
            {PHOTOGRAPHY_CATEGORIES.map((category, idx) => (
              <RevealMask key={category.slug} delay={(idx % 3) * 0.06}>
                <TiltCard3D maxTilt={4} className="h-full">
                  <Link
                    to={`/categories/${category.slug}`}
                    className="group flex flex-col h-full overflow-hidden rounded-xl bg-[#FFFFFF] border border-[#171615]/10 hover:border-[#C5A46D] transition-colors shadow-[0_6px_28px_rgba(23,22,21,0.04)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#171615]">
                      <SafeImage
                        src={category.cardImage}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#171615]/80 via-[#171615]/15 to-transparent" />
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-[#E8DCCB]">
                        <span className="tabular-nums">{category.sampleCount} Demo Images</span>
                        <span
                          style={{ fontFamily: 'var(--font-devanagari)' }}
                          className="text-[#C5A46D] text-sm"
                        >
                          {category.devanagariLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171615] group-hover:text-[#57252F] transition-colors">
                          {category.name}
                        </h2>
                        <p className="mt-2.5 text-sm text-[#5C554E] leading-relaxed">
                          {category.shortDescription}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#171615]/10 flex items-center justify-between text-xs font-semibold text-[#57252F]">
                        <span>Explore Gallery</span>
                        <ArrowUpRight
                          className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </TiltCard3D>
              </RevealMask>
            ))}
          </div>

          <div className="mt-16 rounded-xl bg-[#57252F] text-[#F7F2E9] p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-editorial text-3xl sm:text-4xl font-medium">
                Planning a Multi-Ritual Wedding Week?
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#E8DCCB]/85 leading-relaxed">
                Combine Haldi, Mehendi, Engagement, Pre-Wedding, and Wedding Day coverage into one
                cohesive visual narrative with a unified crew.
              </p>
            </div>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F7F2E9] px-6 py-3.5 text-sm font-medium text-[#171615] hover:bg-[#E8DCCB] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Customize Your Wedding Suite</span>
              <ArrowRight className="w-4 h-4 text-[#57252F]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
