import { CityCoverage } from '../types';

/**
 * Regional service coverage across Madhya Pradesh.
 * Clearly framed as on-location travel coverage from our base studio,
 * without implying separate physical branches in each city.
 */
export const CITIES_WE_SERVE: CityCoverage[] = [
  {
    slug: 'indore',
    name: 'Indore',
    regionTag: 'Studio Base · Malwa Plateau',
    description:
      'Our primary creative base for luxury hotel weddings, heritage courtyard celebrations, fine-art studio portraits, and corporate galas across Vijay Nagar, Bypass resorts, and Rajwada heritage trails.',
    venuesStyle: 'Grand lawns, boutique heritage hotels & residence courtyards',
    recommendedCategory: 'wedding',
  },
  {
    slug: 'bhopal',
    name: 'Bhopal',
    regionTag: 'City of Lakes · Destination Coverage',
    description:
      'Regular on-location coverage for regal lakeside weddings, Nawabi heritage pre-wedding editorials, maternity sessions, and leadership summits across Bhopal’s historic estates and lakefront venues.',
    venuesStyle: 'Lakeside palaces, heritage resorts & formal ballrooms',
    recommendedCategory: 'pre-wedding',
  },
  {
    slug: 'ujjain',
    name: 'Ujjain',
    regionTag: 'Sacred Cultural Heartland',
    description:
      'Dedicated coverage for traditional multi-day Indian weddings, sacred temple pujas, Griha Pravesh ceremonies, and sunlit ancestral haveli Haldi celebrations.',
    venuesStyle: 'Traditional wedding gardens, sacred rituals & haveli courtyards',
    recommendedCategory: 'haldi',
  },
  {
    slug: 'dewas',
    name: 'Dewas',
    regionTag: 'Malwa Celebrations',
    description:
      'Full wedding photography, Sangeet cinematography, and multi-generational family portrait sessions for closely knit celebrations throughout Dewas.',
    venuesStyle: 'Family estates, celebration lawns & festive home gatherings',
    recommendedCategory: 'engagement',
  },
  {
    slug: 'ratlam',
    name: 'Ratlam',
    regionTag: 'Western Madhya Pradesh',
    description:
      'Complete wedding suites combining candid photography, traditional coverage, and 4K wedding films for multi-day Malwa and Marwari celebrations.',
    venuesStyle: 'Grand banquet venues & vibrant Baraat processions',
    recommendedCategory: 'wedding',
  },
  {
    slug: 'gwalior',
    name: 'Gwalior',
    regionTag: 'Royal Architectural Heritage',
    description:
      'Destination wedding and pre-wedding productions framed against Gwalior’s monumental sandstone palaces, forts, and aristocratic estates.',
    venuesStyle: 'Palace heritage venues & grand evening receptions',
    recommendedCategory: 'pre-wedding',
  },
  {
    slug: 'jabalpur',
    name: 'Jabalpur',
    regionTag: 'Narmada & Mahakoshal',
    description:
      'On-location wedding cinematography, engagement coverage, and nature-framed couple portraits near Bhedaghat and premier city resorts.',
    venuesStyle: 'Resort weddings, river landscapes & milestone events',
    recommendedCategory: 'wedding',
  },
  {
    slug: 'madhya-pradesh',
    name: 'Maheshwar, Mandu & Beyond',
    regionTag: 'Destination & Travel Crew',
    description:
      'Our travel-ready team covers destination pre-weddings and palace weddings at Maheshwar Fort, Mandu, Orchha, Pachmarhi, and across India upon advance scheduling.',
    venuesStyle: 'Heritage forts, river ghats & destination palaces',
    recommendedCategory: 'pre-wedding',
  },
];
