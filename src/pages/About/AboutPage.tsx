import { Link } from 'react-router-dom';
import { ArrowRight, Aperture, Camera, Film, Heart, Layers, ShieldCheck } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studio';
import { STUDIO_IMAGES } from '../../data/media';
import { SeoHelmet } from '../../components/common/SeoHelmet';
import { SafeImage } from '../../components/common/SafeImage';
import { SectionHeading } from '../../components/common/SectionHeading';
import { RevealMask } from '../../components/animations/RevealMask';
import { TiltCard3D } from '../../components/animations/TiltCard3D';

const JOURNEY_MILESTONES = [
  {
    chapter: 'Chapter 01 · Origins',
    title: 'A Quiet Devotion to Documentary Indian Storytelling',
    body: 'Born from a love for natural-light portraiture and regional Malwa traditions, our studio began with a single conviction: Indian weddings deserve the tonal patience of fine-art monographs rather than rushed flash photography.',
  },
  {
    chapter: 'Chapter 02 · Cinema Evolution',
    title: 'Integrating 4K Wedding Filmmaking & Live Sound',
    body: 'We expanded our collective to unite editorial still photographers with narrative cinematographers and audio engineers—capturing live Vedic mantras, shehnai acoustics, and heartfelt parental blessings alongside still heirlooms.',
  },
  {
    chapter: 'Chapter 03 · Madhya Pradesh Heritage',
    title: 'Destination Narratives Across Forts, Lakes & Havelis',
    body: 'Today our Indore-based collective regularly travels to Bhopal, Ujjain, Maheshwar, Mandu, Gwalior, and destination estates across India—documenting intimate weddings, pre-weddings, and multi-generational family milestones.',
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Raghavendra Joshi (Sample Lead)',
    role: 'Founder & Lead Editorial Photographer',
    specialty: 'Wedding rituals, natural-light bridal portraiture & monograph curation.',
    image: STUDIO_IMAGES.portraitStudio,
  },
  {
    name: 'Nandini Malhotra (Sample Director)',
    role: 'Creative Director & Head of Cinematography',
    specialty: '4K wedding films, narrative pacing & heritage pre-wedding direction.',
    image: STUDIO_IMAGES.mehendiBridal,
  },
  {
    name: 'Siddhant Kulkarni (Sample Lead)',
    role: 'Senior Colourist & Documentary Specialist',
    specialty: 'Haldi candids, low-light Sangeet storytelling & archival album grading.',
    image: STUDIO_IMAGES.preweddingPalace,
  },
];

const EQUIPMENT_STACK = [
  {
    icon: Camera,
    title: 'Full-Frame Mirrorless Flagships',
    detail: 'Dual-card-slot silent-shutter bodies ensuring zero disruption during sacred mantras and instantaneous backup redundancy.',
  },
  {
    icon: Aperture,
    title: 'Fast f/1.2 & f/1.4 Prime Optics',
    detail: 'Signature 35mm, 50mm, and 85mm cinema and still primes delivering painterly depth in candlelit mandaps and banquet halls.',
  },
  {
    icon: Film,
    title: '4K 10-Bit Cinema & Audio Rigs',
    detail: 'Stabilized cinema gimbals, wireless lapel microphones for vows, and DGCA-compliant aerial drones for heritage estates.',
  },
  {
    icon: ShieldCheck,
    title: 'Triple-Redundant Archive Storage',
    detail: 'On-site RAID backups every evening plus encrypted cloud archives safeguarding your family’s irreplaceable memories.',
  },
];

const WORKFLOW_PILLARS = [
  { step: '01', title: 'Discovery & Visual Moodboard', detail: 'We learn your rituals, family dynamics, and preferred editorial atmosphere.' },
  { step: '02', title: 'Itinerary & Light Mapping', detail: 'We align golden-hour portrait windows with your wedding muhurat schedule.' },
  { step: '03', title: 'Unobtrusive Event Coverage', detail: 'Coordinated candid, traditional, and cinema teams working in quiet harmony.' },
  { step: '04', title: 'Hand-Graded Post-Production', detail: 'Individual frame colour calibration, narrative film editing, and album design.' },
];

export default function AboutPage() {
  return (
    <div>
      <SeoHelmet
        title={`About Us — ${STUDIO_CONFIG.name} | Indore & Madhya Pradesh Photography Studio`}
        description="Meet the Indian wedding photographers, 4K cinematographers, and colourists behind Kalaakriti Studios in Indore, serving Bhopal, Ujjain, Maheshwar, Gwalior, and Madhya Pradesh."
        keywords={[
          'About Kalaakriti Studios Indore',
          'Candid Wedding Team Madhya Pradesh',
          'Luxury Photography Studio Indore',
        ]}
        ogImage={STUDIO_IMAGES.portraitStudio}
        ogImageAlt="Fine-art Indian handloom saree portrait by Kalaakriti Studios"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about' },
        ]}
      />
      {/* 1. ABOUT HERO */}
      <section className="relative min-h-[72vh] flex items-end pb-16 pt-32 bg-[#171615] text-[#F7F2E9] overflow-hidden">
        <SafeImage
          src={STUDIO_IMAGES.weddingPheras}
          alt="Sacred Indian wedding pheras photographed in warm candlelight"
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171615] via-[#171615]/55 to-[#171615]/40" />
        <div className="studio-container relative z-10 max-w-4xl">
          <div className="text-xs sm:text-sm tracking-[0.16em] text-[#C5A46D] mb-4">
            About {STUDIO_CONFIG.name} · {STUDIO_CONFIG.locationLabel}
          </div>
          <h1 className="hero-headline font-editorial font-medium">
            Crafted for Families Who Cherish Authenticity Over Spectacle.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-[#E8DCCB]/85 leading-relaxed max-w-2xl">
            We are an Indian photography and cinematography collective dedicated to turning fleeting
            rituals, silk textures, and multi-generational affection into enduring visual heirlooms.
          </p>
        </div>
      </section>

      {/* 2. STUDIO INTRODUCTION */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <RevealMask className="lg:col-span-6 space-y-5">
            <SectionHeading
              devanagari="दृष्टिकोण"
              kicker="Studio Introduction"
              title="Where Cultural Reverence Meets Editorial Craft"
            />
            <p className="text-base text-[#5C554E] leading-relaxed prose-measure">
              Indian celebrations carry layers of symbolism—the fragrance of fresh mogra woven into
              bridal hair, the hush when Vedic vows circle the sacred fire, and the joyous warmth of
              cousins dancing through sunlit courtyards. Our studio was built to honour these details
              with patience and aesthetic clarity.
            </p>
            <p className="text-base text-[#5C554E] leading-relaxed prose-measure">
              Based in {STUDIO_CONFIG.city}, {STUDIO_CONFIG.state}, we take on a curated calendar of
              weddings, pre-weddings, and portrait commissions so every family works closely with our
              senior visual directors rather than an outsourced crew.
            </p>
          </RevealMask>

          <div className="lg:col-span-6 grid grid-cols-12 gap-4 items-end">
            <TiltCard3D className="col-span-7">
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-[#171615]/10 shadow-lg bg-[#171615]">
                <SafeImage
                  src={STUDIO_IMAGES.portraitStudio}
                  alt="Fine-art Indian handloom saree portrait by window light"
                  className="h-full w-full object-cover"
                />
              </div>
            </TiltCard3D>
            <TiltCard3D className="col-span-5">
              <div className="aspect-[3/4] overflow-hidden rounded-xl border border-[#171615]/10 shadow-lg bg-[#171615]">
                <SafeImage
                  src={STUDIO_IMAGES.maternityFamily}
                  alt="Warm verandah portrait in Chanderi silk"
                  className="h-full w-full object-cover"
                />
              </div>
            </TiltCard3D>
          </div>
        </div>
      </section>

      {/* 3. OUR JOURNEY (Timeline) */}
      <section className="py-20 md:py-28 bg-[#E8DCCB]/45 border-y border-[#171615]/10">
        <div className="studio-container">
          <SectionHeading
            devanagari="यात्रा"
            kicker="Our Journey"
            title="Growing With Every Family Who Welcomed Us In"
          />
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {JOURNEY_MILESTONES.map((item) => (
              <RevealMask
                key={item.chapter}
                className="rounded-xl bg-[#F7F2E9] border border-[#171615]/10 p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold tracking-[0.14em] text-[#57252F] mb-3">
                    {item.chapter}
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#171615]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm sm:text-base text-[#5C554E] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </RevealMask>
            ))}
          </div>
        </div>
      </section>

      {/* 4 & 5. PHILOSOPHY + MISSION & VISION */}
      <section className="py-20 md:py-28 bg-[#171615] text-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-5">
            <SectionHeading
              devanagari="दर्शन"
              kicker="Photography Philosophy"
              title="Timeless Over Trendy. Honest Over Staged."
              tone="light"
            />
            <p className="text-sm sm:text-base text-[#E8DCCB]/80 leading-relaxed">
              Trends fade quickly—over-processed presets and forced choreography rarely age well. We
              anchor our visual language in directional natural light, faithful fabric colours, and
              human empathy so your album feels just as moving thirty years from now.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-xl bg-[#242220] border border-[#C5A46D]/25 p-8 space-y-3">
              <Heart className="w-6 h-6 text-[#C5A46D]" aria-hidden="true" />
              <h3 className="font-editorial text-2xl font-medium text-[#F7F2E9]">Our Mission</h3>
              <p className="text-sm text-[#E8DCCB]/80 leading-relaxed">
                To preserve Indian weddings, family rituals, and personal milestones with editorial
                craftsmanship, cultural sensitivity, and dependable warmth from first consultation to
                printed heirloom.
              </p>
            </div>
            <div className="rounded-xl bg-[#242220] border border-[#C5A46D]/25 p-8 space-y-3">
              <Layers className="w-6 h-6 text-[#C5A46D]" aria-hidden="true" />
              <h3 className="font-editorial text-2xl font-medium text-[#F7F2E9]">Our Vision</h3>
              <p className="text-sm text-[#E8DCCB]/80 leading-relaxed">
                To set the benchmark for luxury editorial wedding photography and cinema in Madhya
                Pradesh—celebrating regional heritage, handloom artistry, and authentic human stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CREATIVE APPROACH */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 overflow-hidden rounded-xl aspect-[16/11] bg-[#171615] border border-[#171615]/10">
            <SafeImage
              src={STUDIO_IMAGES.preweddingPalace}
              alt="Couple framed by sandstone palace architecture at sunset"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-5">
            <SectionHeading
              kicker="Our Creative Approach"
              title="Three Lenses Working in Quiet Choreography"
            />
            <p className="text-sm sm:text-base text-[#5C554E] leading-relaxed">
              Every celebration combines three complementary perspectives: an editorial lead focused
              on couple beauty and architectural composition, a documentary storyteller attuned to
              unspoken family emotion, and a dedicated traditional specialist ensuring elders and
              visiting guests are warmly archived.
            </p>
            <ul className="space-y-2.5 text-sm text-[#171615]">
              <li>01. Light-first scouting of every venue courtyard and mandap</li>
              <li>02. Gentle, minimal direction for camera-shy couples</li>
              <li>03. Cohesive colour continuity across photography and 4K films</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. OUR TEAM */}
      <section className="py-20 md:py-28 bg-[#E8DCCB]/40 border-y border-[#171615]/8">
        <div className="studio-container">
          <SectionHeading
            devanagari="कलाकार"
            kicker="The Creative Collective"
            title="Meet the Storytellers Behind the Lens"
            description="Sample studio team profiles — replace with your actual photographers, editors, and studio founders."
          />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="rounded-xl overflow-hidden bg-[#F7F2E9] border border-[#171615]/10"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#171615]">
                  <SafeImage
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs text-[#57252F] font-medium">{member.role}</div>
                  <h3 className="font-editorial text-2xl font-medium text-[#171615] mt-1">
                    {member.name}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#5C554E] leading-relaxed">{member.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BEHIND THE SCENES */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container">
          <SectionHeading
            kicker="Behind the Scenes"
            title="Calm Precision in the Heart of Every Celebration"
            description="How our crew prepares before dawn pheras, coordinates sunlit Haldi courtyards, and edits late into the season."
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#171615]">
                <SafeImage
                  src={STUDIO_IMAGES.haldiRitual}
                  alt="Daytime Haldi courtyard documentary framing"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-editorial text-xl font-medium">Weather-Sealed Action</h3>
              <p className="text-sm text-[#5C554E]">
                Stepping right into marigold showers and turmeric laughter to preserve immersive wide angles.
              </p>
            </div>
            <div className="space-y-3">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#171615]">
                <SafeImage
                  src={STUDIO_IMAGES.engagementSangeet}
                  alt="Evening lighting balance during Indian Sangeet"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-editorial text-xl font-medium">Balanced Ambient Lighting</h3>
              <p className="text-sm text-[#5C554E]">
                Preserving warm fairy lights and architectural chandeliers without flattening evening mood.
              </p>
            </div>
            <div className="space-y-3">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#171615]">
                <SafeImage
                  src={STUDIO_IMAGES.corporateEvent}
                  alt="Discreet event coverage in grand ballroom"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-editorial text-xl font-medium">Quiet Presence</h3>
              <p className="text-sm text-[#5C554E]">
                Dressed appropriately for sacred and formal occasions so we blend seamlessly with guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. EQUIPMENT & TECHNOLOGY */}
      <section className="py-20 md:py-28 bg-[#171615] text-[#F7F2E9]">
        <div className="studio-container">
          <SectionHeading
            devanagari="तकनीक"
            kicker="Equipment & Craftsmanship"
            title="Cinema-Grade Tools Built for Demanding Light"
            tone="light"
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EQUIPMENT_STACK.map((gear) => {
              const Icon = gear.icon;
              return (
                <div
                  key={gear.title}
                  className="rounded-xl bg-[#242220] border border-[#C5A46D]/20 p-7 space-y-3.5"
                >
                  <Icon className="w-6 h-6 text-[#C5A46D]" aria-hidden="true" />
                  <h3 className="font-editorial text-2xl font-medium text-[#F7F2E9]">{gear.title}</h3>
                  <p className="text-sm text-[#E8DCCB]/75 leading-relaxed">{gear.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10 & 11. WORKING PROCESS & WHY CLIENTS CHOOSE US */}
      <section className="py-20 md:py-28 bg-[#F7F2E9]">
        <div className="studio-container grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              kicker="Our Working Process"
              title="Structured Care at Every Milestone"
            />
            <div className="space-y-6 pt-2">
              {WORKFLOW_PILLARS.map((p) => (
                <div key={p.step} className="flex gap-5 pb-6 border-b border-[#171615]/10">
                  <span className="font-editorial text-3xl text-[#C5A46D] tabular-nums shrink-0">
                    {p.step}
                  </span>
                  <div>
                    <h3 className="font-editorial text-2xl font-medium text-[#171615]">{p.title}</h3>
                    <p className="mt-1 text-sm text-[#5C554E] leading-relaxed">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 rounded-xl bg-[#57252F] text-[#F7F2E9] p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <div className="text-xs tracking-[0.16em] text-[#C5A46D] mb-3">
                Why Families Choose Us
              </div>
              <h3 className="font-editorial text-3xl sm:text-4xl font-medium leading-tight">
                Because Your Wedding Happens Once—and Lives Forever in Photographs.
              </h3>
              <ul className="mt-7 space-y-3.5 text-sm sm:text-base text-[#E8DCCB]/90">
                <li>· Deep cultural fluency across Indian ceremonies &amp; multi-day itineraries</li>
                <li>· Balanced candid artistry paired with dependable traditional family coverage</li>
                <li>· Transparent proposals with zero hidden travel or album surprises</li>
                <li>· Curated preview gallery delivered within 7 working days</li>
                <li>· Dedicated post-production colourists and custom album designers</li>
              </ul>
            </div>

            <div className="mt-10 pt-6 border-t border-[#C5A46D]/25 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F7F2E9] px-6 py-3 text-sm font-medium text-[#171615] hover:bg-[#E8DCCB] transition-colors"
              >
                <span>Reserve Your Dates</span>
                <ArrowRight className="w-4 h-4 text-[#57252F]" aria-hidden="true" />
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 rounded-lg border border-[#F7F2E9]/35 px-6 py-3 text-sm font-medium text-[#F7F2E9] hover:bg-[#F7F2E9]/10 transition-colors"
              >
                <span>Explore Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
