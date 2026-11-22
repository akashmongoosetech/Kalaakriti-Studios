import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, Minus } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';
import { SERVICE_TIERS_COMPARISON, STUDIO_SERVICES } from '../../data/services';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';
import { SectionHeading } from '../../components/common/SectionHeading';

const SERVICE_FILTER_GROUPS = [
  { id: 'all', label: 'All 15 Services' },
  { id: 'weddings', label: 'Weddings & Rituals' },
  { id: 'portraits', label: 'Maternity, Baby & Portraits' },
  { id: 'events', label: 'Corporate, Drone & Commercial' },
] as const;

type FilterGroup = (typeof SERVICE_FILTER_GROUPS)[number]['id'];

function matchesGroup(slug: string, group: FilterGroup): boolean {
  if (group === 'all') return true;
  if (group === 'weddings') {
    return [
      'wedding-photography',
      'wedding-cinematography',
      'pre-wedding-photography',
      'pre-wedding-cinematic-films',
      'engagement-photography',
      'haldi-mehendi-photography',
      'traditional-photography',
    ].includes(slug);
  }
  if (group === 'portraits') {
    return [
      'maternity-photography',
      'baby-photography',
      'family-portraits',
      'birthday-photography',
      'professional-portrait-photography',
    ].includes(slug);
  }
  return ['corporate-event-photography', 'drone-photography', 'product-photography'].includes(slug);
}

export default function ServicesPage() {
  const [group, setGroup] = useState<FilterGroup>('all');
  const visibleServices = STUDIO_SERVICES.filter((s) => matchesGroup(s.slug, group));

  return (
    <div>
      <SeoHelmet
        title={`15 Photography & Cinematography Services in Indore & MP | ${STUDIO_CONFIG.name}`}
        description="Explore 15 bespoke photography & 4K cinematography services across Indore, Bhopal, Ujjain, and Madhya Pradesh: weddings, pre-weddings, Haldi, Mehendi, drone, maternity, portraits, and corporate events."
        keywords={[
          'Wedding Photography Services Indore',
          '4K Wedding Cinematography Madhya Pradesh',
          'Drone Wedding Coverage Bhopal',
          'Maternity & Baby Photographer Indore',
        ]}
        ogImage={STUDIO_IMAGES.engagementSangeet}
        ogImageAlt="Luxury Indian engagement and wedding cinematography services"
        schemaType="ProfessionalService"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]}
      />
      {/* Hero */}
      <section className="relative min-h-[64vh] flex items-end pb-16 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <SafeImage
          src={STUDIO_IMAGES.engagementSangeet}
          alt="Luxury Indian engagement and Sangeet photography coverage"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/60 to-[#171615]/45" />
        <div className="studio-container relative z-10 max-w-4xl">
          <div className="text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-4">
            15 Specialized Offerings · Still Photography &amp; 4K Cinematography
          </div>
          <h1 className="hero-headline font-editorial font-medium">
            Bespoke Services Tailored to Every Celebration.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#E8DCCB]/85 leading-relaxed max-w-2xl">
            Whether you are planning a three-day royal wedding across Madhya Pradesh, a sunlit
            maternity sitting, or an executive leadership gala, each service is backed by dedicated
            specialists and transparent deliverables.
          </p>
        </div>
      </section>

      {/* Filter Bar + Detailed Service Catalog */}
      <section className="py-16 md:py-24 bg-[#F7F2E9]">
        <div className="studio-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-[#171615]/12">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171615]">
                Complete Service Directory
              </h2>
              <p className="text-sm text-[#5C554E] mt-1 tabular-nums">
                Showing {visibleServices.length} of {STUDIO_SERVICES.length} specialized studio services
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#E8DCCB]/70 rounded-lg border border-[#171615]/10">
              {SERVICE_FILTER_GROUPS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGroup(item.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    group === item.id
                      ? 'bg-[#57252F] text-[#F7F2E9]'
                      : 'text-[#171615]/80 hover:text-[#171615]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 space-y-14">
            {visibleServices.map((srv, idx) => {
              const reversed = idx % 2 === 1;
              return (
                <article
                  id={srv.slug}
                  key={srv.slug}
                  className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pb-14 border-b border-[#171615]/10 last:border-b-0"
                >
                  <div
                    className={`lg:col-span-5 overflow-hidden rounded-xl bg-[#171615] aspect-[4/3] lg:aspect-auto lg:min-h-[380px] ${
                      reversed ? 'lg:order-2' : ''
                    }`}
                  >
                    <SafeImage
                      src={srv.image}
                      alt={srv.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className={`lg:col-span-7 flex flex-col justify-between ${reversed ? 'lg:order-1' : ''}`}>
                    <div>
                      <div className="flex items-center gap-3 text-xs tracking-[0.14em] text-[#57252F] mb-2">
                        <span className="tabular-nums font-semibold">{srv.number}</span>
                        <span aria-hidden="true" className="opacity-40">
                          ·
                        </span>
                        <span>{srv.styles.join(' / ')}</span>
                      </div>

                      <h3 className="font-editorial text-3xl sm:text-4xl font-medium text-[#171615]">
                        {srv.name}
                      </h3>
                      <p className="mt-2 font-editorial text-xl italic text-[#57252F]">
                        {srv.tagline}
                      </p>
                      <p className="mt-4 text-sm sm:text-base text-[#5C554E] leading-relaxed prose-measure">
                        {srv.description}
                      </p>

                      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-xs font-semibold tracking-wider text-[#171615] mb-3">
                            What Is Included
                          </h4>
                          <ul className="space-y-2 text-sm text-[#5C554E]">
                            {srv.included.map((inc) => (
                              <li key={inc} className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#57252F] mt-0.5 shrink-0" aria-hidden="true" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold tracking-wider text-[#171615] mb-3">
                            Key Client Benefits
                          </h4>
                          <ul className="space-y-2 text-sm text-[#5C554E]">
                            {srv.benefits.map((ben) => (
                              <li key={ben} className="flex items-start gap-2.5">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#C5A46D] shrink-0" aria-hidden="true" />
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#171615]/10 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/booking?category=${srv.relatedCategorySlug}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Inquire &amp; Book</span>
                        <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                      </Link>
                      <Link
                        to={`/categories/${srv.relatedCategorySlug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#171615] hover:text-[#57252F] transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>View Related Portfolio</span>
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Suite Comparison Section */}
      <section className="py-20 md:py-28 bg-[#171615] text-[#F7F2E9]">
        <div className="studio-container">
          <SectionHeading
            devanagari="तुलना"
            kicker="Suite Comparison"
            title="Choosing the Right Coverage Tier"
            description="Compare how our core services combine across intimate gatherings, signature two-day weddings, and multi-day royal celebrations."
            tone="light"
          />

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {SERVICE_TIERS_COMPARISON.map((t) => (
              <div
                key={t.tier}
                className="rounded-xl bg-[#242220] border border-[#C5A46D]/25 p-7 space-y-3"
              >
                <h3 className="font-editorial text-2xl font-medium text-[#F7F2E9]">{t.tier}</h3>
                <p className="text-xs text-[#C5A46D]">
                  {t.crew} · Turnaround: {t.turnaround}
                </p>
                <p className="text-sm text-[#E8DCCB]/80 leading-relaxed">{t.highlight}</p>
                <p className="text-xs text-[#E8DCCB]/60 pt-2 border-t border-[#C5A46D]/15">
                  Ideal for: {t.idealFor}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#C5A46D]/25">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#242220] border-b border-[#C5A46D]/25 text-xs tracking-wider text-[#C5A46D]">
                  <th className="py-4 px-5 font-medium">Service</th>
                  <th className="py-4 px-5 font-medium text-center">Intimate</th>
                  <th className="py-4 px-5 font-medium text-center">Signature Suite</th>
                  <th className="py-4 px-5 font-medium text-center">Royal Heritage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A46D]/15 text-sm">
                {STUDIO_SERVICES.slice(0, 10).map((srv) => (
                  <tr key={srv.slug} className="hover:bg-[#242220]/60 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-[#F7F2E9]">{srv.name}</td>
                    {(['intimate', 'signature', 'royal'] as const).map((tierKey) => (
                      <td key={tierKey} className="py-3.5 px-5 text-center">
                        {srv.tierAvailability[tierKey] ? (
                          <Check className="w-4 h-4 text-[#C5A46D] mx-auto" aria-label="Included" />
                        ) : (
                          <Minus className="w-4 h-4 text-[#E8DCCB]/30 mx-auto" aria-label="Optional add-on" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-[#E8DCCB]/65">
              Every service can also be requested standalone or combined into a bespoke multi-day proposal.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-6 py-3 text-sm font-medium text-[#F7F2E9] border border-[#C5A46D]/40 hover:bg-[#6F323E] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Request Custom Proposal</span>
              <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
