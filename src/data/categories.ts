import { PhotographyCategory } from '../types';
import { STUDIO_IMAGES } from './media';

export const PHOTOGRAPHY_CATEGORIES: PhotographyCategory[] = [
  {
    slug: 'wedding',
    name: 'Wedding Photography',
    devanagariLabel: 'विवाह',
    shortDescription:
      'Sacred pheras, emotional vidaai, royal baraat energy, and heirloom bridal portraits crafted with documentary honesty.',
    longDescription:
      'From the quiet grace of bridal solah shringar to the joyful chaos of the baraat and the quiet reverence of Saat Phere around the sacred Agni, our wedding photography preserves every ritual and unspoken glance.',
    introduction:
      'An Indian wedding unfolds like a multi-act symphony across generations. Our lead photographers blend unscripted documentary storytelling with editorial portraiture—ensuring grandparents’ blessings, varmala laughter, mandap details, and intimate couple frames are archived in timeless, natural color.',
    heroImage: STUDIO_IMAGES.heroWedding,
    cardImage: STUDIO_IMAGES.heroWedding,
    sampleCount: 48,
    featuredImages: [
      {
        src: STUDIO_IMAGES.heroWedding,
        alt: 'Indian bride in burgundy zardozi lehenga and groom in ivory sherwani under marigold mandap',
        caption: 'Twilight portraits beneath a hand-strung marigold and mogra mandap',
      },
      {
        src: STUDIO_IMAGES.weddingPheras,
        alt: 'Sacred Indian wedding pheras ceremony around glowing brass havan kund fire',
        caption: 'Saat Phere — sacred vows illuminated by the havan kund',
      },
      {
        src: STUDIO_IMAGES.engagementSangeet,
        alt: 'Indian wedding evening celebration under chandeliers and amber lights',
        caption: 'Varmala and evening reception celebration beneath courtyard lights',
      },
    ],
    styles: [
      {
        title: 'Candid Documentary Storytelling',
        detail: 'Unposed, emotionally observant framing of rituals, tears of joy, and spontaneous family warmth.',
      },
      {
        title: 'Editorial Bridal & Couple Portraiture',
        detail: 'Architectural, magazine-grade portraits celebrating Banarasi weaves, zardozi craft, and heirloom jewellery.',
      },
      {
        title: 'Traditional Ritual Coverage',
        detail: 'Complete, respectful documentation of Ganesh Puja, Kanyadaan, Sindoor Daan, and family group portraits.',
      },
      {
        title: 'Cinematic Wedding Films',
        detail: '4K multi-camera cinematography pairing live vows, shehnai acoustics, and slow-motion twilight frames.',
      },
    ],
    relatedServiceSlugs: ['wedding-photography', 'wedding-cinematography', 'drone-photography', 'traditional-photography'],
    packages: [
      {
        name: 'Intimate Rituals Collection',
        summary: 'Designed for single-day temple or boutique heritage weddings up to 150 guests.',
        coverage: '1 Full Wedding Day · 2 Photographers + 1 Cinematographer',
        deliverables: [
          '400+ colour-graded high-resolution photographs',
          '3–4 minute cinematic wedding highlight film',
          'Private online gallery for family downloads',
          '1 handcrafted 30-sheet linen layflat album (optional add-on)',
        ],
        note: 'Sample package structure — tailored upon consultation.',
      },
      {
        name: 'Royal Heritage Celebration',
        summary: 'Complete 2–3 day coverage spanning Haldi, Mehendi, Sangeet, Baraat, and Pheras.',
        coverage: 'Up to 3 Days · Lead Candid + Traditional Team + Cinema Crew + Drone',
        deliverables: [
          '1,200+ hand-edited editorial and candid photographs',
          '5–7 minute signature wedding film + full ceremony edit',
          '2 heirloom fine-art albums (couple + parents edition)',
          'Same-week preview set of 40 curated frames',
        ],
        note: 'Sample package structure — travel outside Indore quoted transparently.',
      },
    ],
    faqs: [
      {
        question: 'How many photographers cover a full Indian wedding?',
        answer:
          'For weddings of 250–600 guests, we typically assign 1 lead candid photographer, 1 associate candid photographer, 1 traditional photographer, and a dedicated cinematography crew so no family member or ritual is ever missed.',
      },
      {
        question: 'Do you capture both bride and groom getting-ready moments?',
        answer:
          'Yes. Our split-team workflow ensures parallel coverage of bridal shringar, jewellery details, groom sehra bandi, and baraat preparations simultaneously.',
      },
    ],
    relatedCategories: ['pre-wedding', 'haldi', 'mehendi', 'engagement'],
    seoTitle: 'Indian Wedding Photography in Indore & Madhya Pradesh | Kalaakriti Studios',
    seoDescription:
      'Editorial Indian wedding photography capturing pheras, varmala, mandap rituals, and royal couple portraits across Indore, Bhopal, Ujjain, and Madhya Pradesh.',
  },
  {
    slug: 'pre-wedding',
    name: 'Pre-Wedding Photography',
    devanagariLabel: 'प्री-वेडिंग',
    shortDescription:
      'Romantic editorial couple narratives framed against Madhya Pradesh heritage forts, river ghats, and golden-hour landscapes.',
    longDescription:
      'Celebrate your chemistry before the wedding festivities begin with thoughtfully art-directed pre-wedding shoots across Maheshwar Fort, Mandu, Orchha, Bhopal lakes, or intimate private estates.',
    introduction:
      'Pre-wedding sessions are unhurried chapters where you can simply be yourselves. We assist with concept moodboards, heritage wardrobe pairing—from flowing Maheshwari silk sarees to tailored bandhgalas—and golden-hour location scouting so every photograph feels cinematic rather than staged.',
    heroImage: STUDIO_IMAGES.preweddingPalace,
    cardImage: STUDIO_IMAGES.preweddingPalace,
    sampleCount: 36,
    featuredImages: [
      {
        src: STUDIO_IMAGES.preweddingPalace,
        alt: 'Indian couple walking along sandstone arches of Maheshwar Fort at sunset',
        caption: 'Golden hour along Narmada sandstone colonnades at Maheshwar',
      },
      {
        src: STUDIO_IMAGES.heroWedding,
        alt: 'Royal courtyard couple portrait in traditional Indian couture',
        caption: 'Dusk romance inside an illuminated heritage courtyard',
      },
      {
        src: STUDIO_IMAGES.portraitStudio,
        alt: 'Fine-art portrait in Maheshwari silk saree',
        caption: 'Quiet heirloom solo portraits woven into every couple narrative',
      },
    ],
    styles: [
      {
        title: 'Heritage Architecture Editorial',
        detail: 'Framed along sandstone jharokhas, palace courtyards, and stepwells in Maheshwar, Mandu, and Orchha.',
      },
      {
        title: 'Nature & Golden-Hour Poetry',
        detail: 'Soft dawn mist, riverbanks, and forest estates with warm natural backlighting.',
      },
      {
        title: 'Save-the-Date Cinema Films',
        detail: '2–3 minute lyrical short films scored with atmospheric sound design for wedding invitations.',
      },
    ],
    relatedServiceSlugs: ['pre-wedding-photography', 'pre-wedding-cinematic-films', 'drone-photography'],
    packages: [
      {
        name: 'Golden Hour Portrait Session',
        summary: 'Single-location editorial shoot in or around Indore and Ujjain.',
        coverage: 'Half Day (4–5 Hours) · 2 Wardrobe Changes',
        deliverables: [
          '65+ fine-art retouched images',
          'Wardrobe & location styling consultation',
          'High-resolution online gallery for invitations',
        ],
        note: 'Sample package structure — monument entry fees are borne directly by clients.',
      },
      {
        name: 'Heritage Destination Story',
        summary: 'Full-day photo + cinema narrative at Maheshwar, Mandu, Bhopal, or Pachmarhi.',
        coverage: 'Full Day (Sunrise to Sunset) · Photo + 4K Film + Drone',
        deliverables: [
          '120+ editorial colour-graded photographs',
          '2–3 minute pre-wedding cinema reel + vertical teaser',
          '1 fine-art coffee table signature book (optional)',
        ],
        note: 'Sample package structure — custom destination itineraries available.',
      },
    ],
    faqs: [
      {
        question: 'When should we schedule our pre-wedding shoot?',
        answer:
          'We recommend booking 6–10 weeks before your wedding so you receive edited photographs and teaser films in time for digital invitations and reception displays.',
      },
      {
        question: 'Can you help us choose outfits and locations in Madhya Pradesh?',
        answer:
          'Yes. Every pre-wedding booking includes a bespoke moodboard covering heritage venues like Maheshwar Fort, Jahaz Mahal in Mandu, or serene resorts near Bhopal and Indore, paired with palette guidance.',
      },
    ],
    relatedCategories: ['wedding', 'engagement', 'portrait'],
    seoTitle: 'Pre-Wedding Photography & Films in Madhya Pradesh | Kalaakriti Studios',
    seoDescription:
      'Romantic Indian pre-wedding photography and cinematic films at Maheshwar, Mandu, Indore, and Bhopal.',
  },
  {
    slug: 'engagement',
    name: 'Engagement Photography',
    devanagariLabel: 'सगाई',
    shortDescription:
      'Glamorous ring exchanges, Sangeet performances, couple portraits, and luminous evening hospitality.',
    longDescription:
      'From the solemn Tilak and ring exchange to high-energy family dance performances under chandelier-lit lawns, we photograph engagements with crisp low-light precision and celebratory warmth.',
    introduction:
      'Engagement and Sangeet evenings blend heartfelt milestone promises with vibrant family performances. Our fast prime lenses and balanced ambient-flash technique preserve the true sparkle of fairy lights, velvet couture, and genuine emotion without harsh glare.',
    heroImage: STUDIO_IMAGES.engagementSangeet,
    cardImage: STUDIO_IMAGES.engagementSangeet,
    sampleCount: 32,
    featuredImages: [
      {
        src: STUDIO_IMAGES.engagementSangeet,
        alt: 'Indian couple exchanging engagement rings under floral arch and warm string lights',
        caption: 'The ring exchange beneath cascading jasmine and chandelier light',
      },
      {
        src: STUDIO_IMAGES.heroWedding,
        alt: 'Couple standing hand in hand in royal evening attire',
        caption: 'Pre-ceremony couple portraits before guests arrive',
      },
    ],
    styles: [
      {
        title: 'Low-Light Evening Editorial',
        detail: 'Clean, natural skin tones and glowing chandelier bokeh in banquet halls and night lawns.',
      },
      {
        title: 'Dynamic Sangeet Performance Coverage',
        detail: 'Crisp motion capture of family choreography, couple first dances, and cheering relatives.',
      },
      {
        title: 'Heirloom Ring & Detail Macro',
        detail: 'Artful close-ups of engagement rings, custom floral stages, and couture embroidery.',
      },
    ],
    relatedServiceSlugs: ['engagement-photography', 'wedding-cinematography', 'traditional-photography'],
    packages: [
      {
        name: 'Evening Ring & Portrait Coverage',
        summary: 'Dedicated candid and traditional photography for intimate ring ceremonies.',
        coverage: 'Up to 6 Hours · 2 Photographers',
        deliverables: [
          '250+ edited high-resolution photographs',
          'Dedicated 30-minute couple portrait session before the event',
          'Online gallery delivered within 2 weeks',
        ],
        note: 'Sample package structure — cinema reel add-on available.',
      },
    ],
    faqs: [
      {
        question: 'Do we get time for couple portraits during an evening engagement?',
        answer:
          'We schedule a relaxed 30-minute portrait window right after you are ready and before guests fill the venue, capturing clean stage and architecture frames.',
      },
    ],
    relatedCategories: ['wedding', 'pre-wedding', 'haldi', 'mehendi'],
    seoTitle: 'Indian Engagement & Sangeet Photography | Kalaakriti Studios',
    seoDescription:
      'Luminous Indian engagement, ring ceremony, and Sangeet photography across Indore, Bhopal, and Ujjain.',
  },
  {
    slug: 'haldi',
    name: 'Haldi Ceremony',
    devanagariLabel: 'हल्दी',
    shortDescription:
      'Sun-drenched turmeric rituals, marigold petal showers, brass urlis, and uninhibited family laughter.',
    longDescription:
      'Haldi is pure sunlit joy—vivid saffron tones, playful elders, phoolon ki holi, and tender blessings captured with authentic documentary rhythm.',
    introduction:
      'Few Indian wedding rituals match the warmth and spontaneity of a morning Haldi. Our team works nimbly through flying marigold petals and turmeric splashes using weather-sealed lenses, preserving rich natural yellows and heartfelt multi-generational reactions.',
    heroImage: STUDIO_IMAGES.haldiRitual,
    cardImage: STUDIO_IMAGES.haldiRitual,
    sampleCount: 28,
    featuredImages: [
      {
        src: STUDIO_IMAGES.haldiRitual,
        alt: 'Joyful Indian bride and groom during Haldi ceremony with marigold petals and brass urlis',
        caption: 'Phoolon ki holi and grandmother’s joyful blessings in the sunlit courtyard',
      },
      {
        src: STUDIO_IMAGES.mehendiBridal,
        alt: 'Bride smiling in sunlit floral courtyard',
        caption: 'Radiant daytime portraits wrapped in marigold garlands',
      },
    ],
    styles: [
      {
        title: 'High-Speed Petal & Splash Action',
        detail: 'Freezing suspended marigold showers and authentic bursts of laughter in bright sunlight.',
      },
      {
        title: 'True-to-Life Saffron & Skin Grading',
        detail: 'Carefully balanced color grading so turmeric yellows remain vibrant without muddying skin tones.',
      },
    ],
    relatedServiceSlugs: ['haldi-mehendi-photography', 'wedding-cinematography', 'drone-photography'],
    packages: [
      {
        name: 'Morning Rituals Haldi Coverage',
        summary: 'Vibrant documentary coverage of Bride or Groom Haldi celebrations.',
        coverage: 'Up to 5 Hours · Candid + Traditional + Optional Reel',
        deliverables: [
          '220+ colour-graded daytime photographs',
          '60-second vertical celebration reel (with cinema add-on)',
          'Full decor, floral urli, and family candid archive',
        ],
        note: 'Sample package structure — often bundled with Mehendi and Wedding coverage.',
      },
    ],
    faqs: [
      {
        question: 'What time of day produces the best Haldi photographs?',
        answer:
          'Morning light between 9:00 AM and 11:30 AM or late afternoon shaded courtyards give luminous golden warmth without harsh overhead shadows.',
      },
    ],
    relatedCategories: ['mehendi', 'wedding', 'engagement'],
    seoTitle: 'Haldi Ceremony Photography in Indore & MP | Kalaakriti Studios',
    seoDescription:
      'Authentic, joyful Indian Haldi ceremony photography featuring marigold showers, turmeric rituals, and candid family storytelling.',
  },
  {
    slug: 'mehendi',
    name: 'Mehendi Celebration',
    devanagariLabel: 'मेहंदी',
    shortDescription:
      'Intricate bridal henna artistry, vibrant courtyard canopies, folk songs, and soulful bridal portraits.',
    longDescription:
      'Celebrating the artistry of bridal henna, emerald and fuchsia weaves, dholak rhythms, and intimate moments between sisters, mothers, and childhood friends.',
    introduction:
      'A Mehendi afternoon is woven with intimate storytelling—from the delicate geometry of henna motifs and shimmering kaleere to cousins singing traditional banna-banni melodies. We balance close-up craft photography with relaxed editorial portraits.',
    heroImage: STUDIO_IMAGES.mehendiBridal,
    cardImage: STUDIO_IMAGES.mehendiBridal,
    sampleCount: 26,
    featuredImages: [
      {
        src: STUDIO_IMAGES.mehendiBridal,
        alt: 'Indian bride displaying intricate dark mehendi henna hands and gold kaleere',
        caption: 'Bridal henna poetry paired with kundan bangles and heirloom kaleere',
      },
      {
        src: STUDIO_IMAGES.haldiRitual,
        alt: 'Family gathered in sunlit courtyard adorned with marigold strings',
        caption: 'Generations laughing together beneath marigold canopies',
      },
    ],
    styles: [
      {
        title: 'Intricate Henna & Jewellery Macro',
        detail: 'Fine-focus close-ups highlighting personalized mehendi motifs, lacquer bangles, and floral hairpieces.',
      },
      {
        title: 'Intimate Sisterhood & Family Candids',
        detail: 'Unforced storytelling of mothers feeding the bride, dholak singing circles, and playful cousins.',
      },
    ],
    relatedServiceSlugs: ['haldi-mehendi-photography', 'wedding-photography', 'professional-portrait-photography'],
    packages: [
      {
        name: 'Mehendi & Bridal Portrait Session',
        summary: 'Editorial and candid documentation for home courtyard or resort Mehendi functions.',
        coverage: 'Up to 5 Hours · 2 Photographers',
        deliverables: [
          '200+ edited photographs including henna macro details',
          'Dedicated bridal portrait mini-session once henna sets',
          'Private high-resolution gallery delivery',
        ],
        note: 'Sample package structure — customizable within wedding suites.',
      },
    ],
    faqs: [
      {
        question: 'When should bridal portraits happen during Mehendi?',
        answer:
          'We photograph quick portraits right before henna begins so the bride can move freely, followed by delicate hand-detail frames once the intricate design is complete.',
      },
    ],
    relatedCategories: ['haldi', 'wedding', 'engagement'],
    seoTitle: 'Bridal Mehendi Photography in Madhya Pradesh | Kalaakriti Studios',
    seoDescription:
      'Fine-art Indian Mehendi photography highlighting intricate bridal henna, vibrant floral canopies, and heartfelt family moments.',
  },
  {
    slug: 'birthday',
    name: 'Birthday Photography',
    devanagariLabel: 'जन्मदिन',
    shortDescription:
      'Heartfelt milestone birthdays, first-year celebrations, candlelit cake cutting, and joyful multi-generational gatherings.',
    longDescription:
      'Whether it is a child’s first birthday garden party or a beloved grandparent’s 75th milestone evening, we photograph birthdays with warmth, patience, and unobtrusive storytelling.',
    introduction:
      'Birthdays bring three generations together in effortless joy. We focus on real laughter—grandparents clapping beside the cake table, toddlers discovering balloons, and heartfelt toasts—rather than stiff line-up snapshots.',
    heroImage: STUDIO_IMAGES.birthdayCelebration,
    cardImage: STUDIO_IMAGES.birthdayCelebration,
    sampleCount: 22,
    featuredImages: [
      {
        src: STUDIO_IMAGES.birthdayCelebration,
        alt: 'Indian family celebrating young child birthday in garden around candlelit cake',
        caption: 'Three generations sharing the warmth of a garden birthday evening',
      },
      {
        src: STUDIO_IMAGES.maternityFamily,
        alt: 'Warm family portrait in afternoon verandah light',
        caption: 'Relaxed pre-party family portraits in natural light',
      },
    ],
    styles: [
      {
        title: 'Child-Friendly Candid Documentary',
        detail: 'Patient, playful photography at eye level that lets children stay completely comfortable.',
      },
      {
        title: 'Milestone Evening Elegance',
        detail: 'Refined editorial coverage for 50th, 60th, and 75th family celebrations and gala dinners.',
      },
    ],
    relatedServiceSlugs: ['birthday-photography', 'family-portraits', 'traditional-photography'],
    packages: [
      {
        name: 'Milestone Celebration Coverage',
        summary: 'Complete event photography for home garden or hotel birthday gatherings.',
        coverage: 'Up to 4 Hours · 1 Lead Candid + 1 Associate Photographer',
        deliverables: [
          '180+ hand-edited photographs',
          'Decor, cake details, and full family group portraits',
          'Fast 7-day online gallery turnaround',
        ],
        note: 'Sample package structure — short highlight video available on request.',
      },
    ],
    faqs: [
      {
        question: 'Can you photograph a quick family portrait session before guests arrive?',
        answer:
          'Yes! Arriving 30 minutes early allows us to capture calm, beautifully lit family and birthday-star portraits alongside untouched decor.',
      },
    ],
    relatedCategories: ['baby-photography', 'family', 'anniversary'],
    seoTitle: 'Birthday & Milestone Event Photography in Indore | Kalaakriti Studios',
    seoDescription:
      'Warm, candid Indian birthday photography for first birthdays, children’s parties, and milestone family celebrations.',
  },
  {
    slug: 'anniversary',
    name: 'Anniversary Photography',
    devanagariLabel: 'वर्षगांठ',
    shortDescription:
      'Silver and golden jubilee celebrations, vow renewals, and deeply dignified couple portraits.',
    longDescription:
      'Honoring decades of shared life with graceful couple portraiture, family speeches, and luminous dinner celebrations for 25th and 50th wedding anniversaries.',
    introduction:
      'A 25th or 50th anniversary carries a depth of love that deserves museum-quality portraiture. We create calm, flattering portraits of the couple before documenting toasts, blessings, and evening celebrations with family.',
    heroImage: STUDIO_IMAGES.weddingPheras,
    cardImage: STUDIO_IMAGES.engagementSangeet,
    sampleCount: 18,
    featuredImages: [
      {
        src: STUDIO_IMAGES.engagementSangeet,
        alt: 'Couple celebrating beneath warm fairy lights and floral stage',
        caption: 'Evening anniversary reception illuminated in amber and floral gold',
      },
      {
        src: STUDIO_IMAGES.birthdayCelebration,
        alt: 'Multi-generational Indian family smiling together',
        caption: 'Children, grandchildren, and elders gathered in celebration',
      },
    ],
    styles: [
      {
        title: 'Heirloom Couple Portraits',
        detail: 'Timeless, dignified lighting that celebrates grace, silk textiles, and lifelong companionship.',
      },
      {
        title: 'Celebration & Tribute Documentary',
        detail: 'Capturing heartfelt family speeches, varmala renewals, and candid reunion embraces.',
      },
    ],
    relatedServiceSlugs: ['family-portraits', 'traditional-photography', 'wedding-cinematography'],
    packages: [
      {
        name: 'Silver & Golden Jubilee Suite',
        summary: 'Portrait session plus full evening anniversary gala coverage.',
        coverage: 'Up to 5 Hours · Photo + Optional Tribute Film',
        deliverables: [
          '220+ curated high-resolution photographs',
          'Multi-generational family portraits',
          'Optional fine-art archival print album',
        ],
        note: 'Sample package structure — customizable for home or banquet venues.',
      },
    ],
    faqs: [
      {
        question: 'Can you include interviews or blessings from family members in an anniversary film?',
        answer:
          'Yes, our cinematography team can record short, heartfelt video tributes from children and friends woven seamlessly into the anniversary highlight reel.',
      },
    ],
    relatedCategories: ['family', 'wedding', 'birthday'],
    seoTitle: 'Wedding Anniversary Photography in Indore & Bhopal | Kalaakriti Studios',
    seoDescription:
      'Celebrate 25th and 50th wedding anniversaries with heirloom couple portraiture and documentary gala photography.',
  },
  {
    slug: 'corporate',
    name: 'Corporate Photography',
    devanagariLabel: 'कॉर्पोरेट',
    shortDescription:
      'Leadership summits, heritage hotel galas, executive portraits, and refined brand event documentation.',
    longDescription:
      'Polished, discreet photojournalism for corporate conferences, award nights, annual galas, and leadership branding across Indore, Bhopal, and Madhya Pradesh.',
    introduction:
      'Corporate storytelling demands editorial restraint, punctuality, and an instinct for decisive moments—from keynote authority on stage to authentic executive networking in grand ballrooms.',
    heroImage: STUDIO_IMAGES.corporateEvent,
    cardImage: STUDIO_IMAGES.corporateEvent,
    sampleCount: 24,
    featuredImages: [
      {
        src: STUDIO_IMAGES.corporateEvent,
        alt: 'Corporate leadership gala and keynote speaker in luxury Indian heritage ballroom',
        caption: 'Keynote moments and executive hospitality in a grand ballroom',
      },
      {
        src: STUDIO_IMAGES.portraitStudio,
        alt: 'Editorial executive portrait in natural window light',
        caption: 'Refined leadership and founder portraiture',
      },
    ],
    styles: [
      {
        title: 'Executive Event Photojournalism',
        detail: 'Clean architectural framing of stages, panels, award handovers, and VIP interactions.',
      },
      {
        title: 'Same-Day Press & PR Selects',
        detail: 'Rapidly graded highlight sets ready for LinkedIn, press releases, and internal comms.',
      },
    ],
    relatedServiceSlugs: ['corporate-event-photography', 'product-photography', 'professional-portrait-photography'],
    packages: [
      {
        name: 'Conference & Gala Coverage',
        summary: 'Full-day or evening business summit, launch, or awards documentation.',
        coverage: 'Half Day or Full Day · 1–2 Photographers + Event Reel Option',
        deliverables: [
          '150–350 colour-balanced commercial-ready images',
          '20 same-evening PR highlight photos',
          'Commercial web & print usage license',
        ],
        note: 'Sample package structure — GST-ready corporate invoicing available when integrated.',
      },
    ],
    faqs: [
      {
        question: 'How fast can you deliver select images for media and social updates?',
        answer:
          'We provide 15–25 curated, colour-graded selects within 4 hours of the event conclusion for immediate press and LinkedIn publishing.',
      },
    ],
    relatedCategories: ['portrait', 'events', 'anniversary'],
    seoTitle: 'Corporate Event & Executive Photography in Indore | Kalaakriti Studios',
    seoDescription:
      'Discreet, editorial corporate event photography, leadership summits, and executive portraits in Indore and Bhopal.',
  },
  {
    slug: 'maternity',
    name: 'Maternity Photography',
    devanagariLabel: 'मातृत्व',
    shortDescription:
      'Serene, natural-light heirloom portraits celebrating motherhood in flowing Indian silks and heritage spaces.',
    longDescription:
      'Tasteful, deeply comforting maternity portraits photographed in warm natural light—honoring the quiet beauty of expectation in handloom sarees or soft contemporary drapery.',
    introduction:
      'Motherhood deserves portraits that feel timeless twenty years from now. Rather than overly artificial studio props, we favour sunlit verandahs, heritage textures, Chanderi and Banarasi silks, and gentle direction that keeps expectant mothers completely at ease.',
    heroImage: STUDIO_IMAGES.maternityFamily,
    cardImage: STUDIO_IMAGES.maternityFamily,
    sampleCount: 20,
    featuredImages: [
      {
        src: STUDIO_IMAGES.maternityFamily,
        alt: 'Expectant Indian mother in warm ivory Chanderi silk saree with husband on heritage verandah',
        caption: 'Afternoon warmth on a carved sandstone verandah in ivory Chanderi silk',
      },
      {
        src: STUDIO_IMAGES.portraitStudio,
        alt: 'Graceful solo Indian woman portrait in natural window light',
        caption: 'Quiet solo portraiture with timeless film tonality',
      },
    ],
    styles: [
      {
        title: 'Heritage Silk & Natural Light',
        detail: 'Celebrating Indian textiles—Chanderi, Maheshwari, and pastel organza—in soft golden light.',
      },
      {
        title: 'Intimate Home & Godh Bharai',
        detail: 'Warm lifestyle sessions at your residence or candid coverage of traditional Godh Bharai rituals.',
      },
    ],
    relatedServiceSlugs: ['maternity-photography', 'baby-photography', 'family-portraits'],
    packages: [
      {
        name: 'Serene Motherhood Portrait Session',
        summary: 'Unhurried 2.5-hour maternity portrait session for mother and partner.',
        coverage: '2.5 Hours · Home, Studio, or Heritage Courtyard',
        deliverables: [
          '45+ delicately retouched fine-art portraits',
          'Styling & silk saree colour consultation',
          'Optional museum-grade framed print trio',
        ],
        note: 'Sample package structure — best scheduled between 28 and 34 weeks.',
      },
    ],
    faqs: [
      {
        question: 'Which week of pregnancy is ideal for a maternity shoot?',
        answer:
          'Between 28 and 34 weeks is generally most comfortable—the baby bump is beautifully defined while you still feel energetic for a relaxed two-hour session.',
      },
    ],
    relatedCategories: ['baby-photography', 'family', 'portrait'],
    seoTitle: 'Indian Maternity Photography in Indore & MP | Kalaakriti Studios',
    seoDescription:
      'Graceful, natural-light Indian maternity photography celebrating motherhood in timeless silk drapery and warm heritage settings.',
  },
  {
    slug: 'baby-photography',
    name: 'Baby Photography',
    devanagariLabel: 'शिशु',
    shortDescription:
      'Gentle newborn storytelling, milestone portraits, and sacred Namkaran and Annaprashan ceremonies.',
    longDescription:
      'Capturing tiny hands, peaceful newborn expressions, and joyful first-year cultural rituals like Namkaran (naming ceremony) and Annaprashan in calm, baby-led sessions.',
    introduction:
      'Early childhood passes in the blink of an eye. Our baby sessions follow your child’s natural feeding and nap rhythm, using gentle natural window light, breathable cotton weaves, and warm family interaction.',
    heroImage: STUDIO_IMAGES.birthdayCelebration,
    cardImage: STUDIO_IMAGES.maternityFamily,
    sampleCount: 19,
    featuredImages: [
      {
        src: STUDIO_IMAGES.birthdayCelebration,
        alt: 'Smiling Indian child surrounded by loving parents and grandparents',
        caption: 'Joyful milestone warmth surrounded by family affection',
      },
      {
        src: STUDIO_IMAGES.maternityFamily,
        alt: 'Expecting parents in soft ivory ethnic attire',
        caption: 'Seamless bump-to-baby family archive collections',
      },
    ],
    styles: [
      {
        title: 'Baby-Led Home Lifestyle',
        detail: 'Unhurried newborn and infant portraits in the comfort and safety of your home.',
      },
      {
        title: 'Namkaran & Annaprashan Rituals',
        detail: 'Authentic coverage of traditional Indian cradle ceremonies and first-rice blessings.',
      },
    ],
    relatedServiceSlugs: ['baby-photography', 'maternity-photography', 'family-portraits'],
    packages: [
      {
        name: 'First-Year Milestone & Ritual Session',
        summary: 'Gentle home portrait session or traditional naming ceremony coverage.',
        coverage: '2–3 Hours · Baby-Led Flexible Pacing',
        deliverables: [
          '50+ soft, natural-toned photographs',
          'Parent and grandparent interaction frames',
          'Safe, hygienic natural-light setup',
        ],
        note: 'Sample package structure — bump-to-baby combo available.',
      },
    ],
    faqs: [
      {
        question: 'Do you travel to our home for newborn sessions?',
        answer:
          'Yes. For newborns and young infants, we strongly recommend home sessions where the baby feels warm, familiar, and comfortable.',
      },
    ],
    relatedCategories: ['maternity', 'birthday', 'family'],
    seoTitle: 'Baby, Newborn & Namkaran Photography in Indore | Kalaakriti Studios',
    seoDescription:
      'Gentle, baby-led newborn portraits, milestone sessions, and Namkaran ceremony photography across Indore and Madhya Pradesh.',
  },
  {
    slug: 'family',
    name: 'Family Portraits',
    devanagariLabel: 'परिवार',
    shortDescription:
      'Multi-generational heirloom portraits honoring grandparents, parents, and children in enduring editorial light.',
    longDescription:
      'Meaningful family portraiture crafted to hang on your walls for decades—bringing together elders, siblings, and children during festivals, reunions, or calm Sunday mornings.',
    introduction:
      'In Indian homes, photographs of elders and reunions become our most cherished heirlooms. We compose warm, unforced family portraits in ancestral courtyards, gardens, or our studio using timeless tonal palettes.',
    heroImage: STUDIO_IMAGES.birthdayCelebration,
    cardImage: STUDIO_IMAGES.birthdayCelebration,
    sampleCount: 24,
    featuredImages: [
      {
        src: STUDIO_IMAGES.birthdayCelebration,
        alt: 'Three generations of an Indian family smiling together in festive ethnic attire',
        caption: 'Multi-generational portraits rooted in warmth and togetherness',
      },
      {
        src: STUDIO_IMAGES.maternityFamily,
        alt: 'Indian couple portrait on sunlit verandah',
        caption: 'Intimate generational storytelling in natural afternoon light',
      },
    ],
    styles: [
      {
        title: 'Multi-Generational Heirlooms',
        detail: 'Thoughtfully composed portraits uniting grandparents, parents, and children with natural grace.',
      },
      {
        title: 'Festive & Home Reunion Sessions',
        detail: 'Diwali, Raksha Bandhan, or family homecoming sessions captured at your ancestral home.',
      },
    ],
    relatedServiceSlugs: ['family-portraits', 'professional-portrait-photography', 'birthday-photography'],
    packages: [
      {
        name: 'Heirloom Family Session',
        summary: 'Relaxed portrait sitting for families of 4 to 18 members.',
        coverage: '2 Hours · Residence, Garden, or Studio',
        deliverables: [
          '45+ high-resolution colour-graded portraits',
          'Individual sub-family and grandparent combinations',
          'Archival cotton-rag framing guidance',
        ],
        note: 'Sample package structure — custom print sizing available.',
      },
    ],
    faqs: [
      {
        question: 'What should our family wear for a timeless portrait?',
        answer:
          'Coordinated natural fabrics in ivory, beige, deep burgundy, muted mustard, or indigo handloom weaves photograph effortlessly without clashing.',
      },
    ],
    relatedCategories: ['anniversary', 'maternity', 'portrait'],
    seoTitle: 'Indian Family Portrait Photography in Indore | Kalaakriti Studios',
    seoDescription:
      'Multi-generational Indian family portraits and festive heirloom photography crafted in Indore and Madhya Pradesh.',
  },
  {
    slug: 'portrait',
    name: 'Portrait Photography',
    devanagariLabel: 'व्यक्तिचित्र',
    shortDescription:
      'Museum-grade fine-art portraits, classical Indian couture studies, and distinguished personal branding.',
    longDescription:
      'Sculpted window light, textured limestone backdrops, and medium-format tonal depth—crafted for artists, founders, bridal couture designers, and personal milestone portraits.',
    introduction:
      'Great portraiture reveals presence without artifice. Inspired by classical Indian painting and natural-light editorial monographs, our portrait sessions honour textile drape, posture, and quiet confidence.',
    heroImage: STUDIO_IMAGES.portraitStudio,
    cardImage: STUDIO_IMAGES.portraitStudio,
    sampleCount: 30,
    featuredImages: [
      {
        src: STUDIO_IMAGES.portraitStudio,
        alt: 'Fine-art portrait of Indian woman in burgundy Maheshwari silk saree by soft window light',
        caption: 'Maheshwari handloom silk sculpted in directional morning window light',
      },
      {
        src: STUDIO_IMAGES.mehendiBridal,
        alt: 'Editorial Indian bridal portrait with gold jewellery',
        caption: 'Couture and jewellery storytelling with rich tonal separation',
      },
    ],
    styles: [
      {
        title: 'Fine-Art Handloom & Couture Portraits',
        detail: 'Editorial studies highlighting Banarasi, Chanderi, and Maheshwari textiles and temple jewellery.',
      },
      {
        title: 'Founder & Creative Executive Headshots',
        detail: 'Approachable, authoritative environmental portraits for authors, architects, and business leaders.',
      },
    ],
    relatedServiceSlugs: ['professional-portrait-photography', 'product-photography', 'family-portraits'],
    packages: [
      {
        name: 'Editorial Portrait Sitting',
        summary: 'Bespoke studio or natural-light architectural portrait sitting.',
        coverage: '2 Hours · Up to 3 Wardrobe Looks',
        deliverables: [
          '25 museum-grade retouched portraits',
          'Bespoke lighting & wardrobe direction',
          'Print-ready and editorial web exports',
        ],
        note: 'Sample package structure — hair & makeup artists can be coordinated.',
      },
    ],
    faqs: [
      {
        question: 'I am camera-shy. Will you guide poses during the portrait session?',
        answer:
          'Completely. We use calm conversation and micro-adjustments to posture, gaze, and hand placement so you look natural and poised rather than stiff.',
      },
    ],
    relatedCategories: ['wedding', 'maternity', 'corporate'],
    seoTitle: 'Fine-Art & Editorial Portrait Photography | Kalaakriti Studios',
    seoDescription:
      'Timeless Indian fine-art portraits, handloom couture editorials, and executive headshots in Indore, Madhya Pradesh.',
  },
  {
    slug: 'events',
    name: 'Traditional Events',
    devanagariLabel: 'परंपरा',
    shortDescription:
      'Griha Pravesh, Upanayana, Mata Ki Chowki, classical music evenings, and sacred cultural gatherings.',
    longDescription:
      'Respectful, atmospheric photography for traditional Indian ceremonies, temple pujas, housewarmings, and cultural performances across Madhya Pradesh.',
    introduction:
      'Indian cultural life extends far beyond weddings. From the sacred threshold ritual of Griha Pravesh to classical sitar recitals and ancestral pujas, we photograph every tradition with quiet reverence and cultural sensitivity.',
    heroImage: STUDIO_IMAGES.weddingPheras,
    cardImage: STUDIO_IMAGES.haldiRitual,
    sampleCount: 25,
    featuredImages: [
      {
        src: STUDIO_IMAGES.weddingPheras,
        alt: 'Sacred havan fire ritual surrounded by marigold garlands and brass lamps',
        caption: 'Reverent coverage of sacred Agni rituals and brass diya illumination',
      },
      {
        src: STUDIO_IMAGES.haldiRitual,
        alt: 'Family gathered in sunlit heritage courtyard with flowers',
        caption: 'Warm family participation during traditional morning ceremonies',
      },
    ],
    styles: [
      {
        title: 'Sacred Puja & Griha Pravesh',
        detail: 'Unobtrusive, respectful documentation of priests, kalash rituals, and family blessings.',
      },
      {
        title: 'Cultural & Classical Gatherings',
        detail: 'Atmospheric low-light coverage of classical dance, music baithaks, and festive celebrations.',
      },
    ],
    relatedServiceSlugs: ['traditional-photography', 'corporate-event-photography', 'drone-photography'],
    packages: [
      {
        name: 'Sacred Ceremony & Gathering Coverage',
        summary: 'Half-day or full-day photography for Griha Pravesh, Upanayana, or cultural pujas.',
        coverage: 'Up to 5 Hours · 1–2 Photographers',
        deliverables: [
          '180+ authentic documentary and family photographs',
          'Full ritual sequence preserved chronologically',
          'Optional traditional printed family album',
        ],
        note: 'Sample package structure — travel across Ujjain, Indore, and Bhopal available.',
      },
    ],
    faqs: [
      {
        question: 'Do your photographers understand temple and puja etiquette?',
        answer:
          'Yes. Our crew dresses appropriately for sacred spaces, works silently without intrusive flash during mantras, and coordinates politely with priests and elders.',
      },
    ],
    relatedCategories: ['wedding', 'haldi', 'family'],
    seoTitle: 'Traditional Indian Ceremony & Cultural Event Photography | Kalaakriti Studios',
    seoDescription:
      'Respectful documentary photography for Griha Pravesh, Upanayana, sacred pujas, and cultural events across Madhya Pradesh.',
  },
];

export function getCategoryBySlug(slug: string): PhotographyCategory | undefined {
  return PHOTOGRAPHY_CATEGORIES.find((cat) => cat.slug === slug);
}
