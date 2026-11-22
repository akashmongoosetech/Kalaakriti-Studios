export interface NavDropdownItem {
  label: string;
  to: string;
  description?: string;
}

export const CATEGORY_NAV_ITEMS: NavDropdownItem[] = [
  { label: 'Wedding Photography', to: '/categories/wedding', description: 'Pheras, varmala, mandap & bridal portraits' },
  { label: 'Pre-Wedding Shoots', to: '/categories/pre-wedding', description: 'Heritage forts, palaces & romantic narratives' },
  { label: 'Engagement & Sangeet', to: '/categories/engagement', description: 'Ring ceremonies, performances & evening galas' },
  { label: 'Haldi Ceremony', to: '/categories/haldi', description: 'Sunlit turmeric rituals & floral celebrations' },
  { label: 'Mehendi Celebration', to: '/categories/mehendi', description: 'Bridal henna artistry & intimate folk moments' },
  { label: 'Maternity Photography', to: '/categories/maternity', description: 'Graceful heirlooms celebrating motherhood' },
  { label: 'Baby Photography', to: '/categories/baby-photography', description: 'Newborn milestones & naming ceremonies' },
  { label: 'Birthday Celebrations', to: '/categories/birthday', description: 'Candid family joy & milestone parties' },
  { label: 'Anniversary Stories', to: '/categories/anniversary', description: 'Silver, golden & vow-renewal portraits' },
  { label: 'Family Portraits', to: '/categories/family', description: 'Multi-generational studio & home portraits' },
  { label: 'Fine-Art Portraits', to: '/categories/portrait', description: 'Editorial Indian couture & personal portraits' },
  { label: 'Corporate Events', to: '/categories/corporate', description: 'Summits, leadership galas & brand events' },
  { label: 'Traditional Events', to: '/categories/events', description: 'Griha Pravesh, Upanayana & cultural pujas' },
];

export const SERVICE_NAV_ITEMS: NavDropdownItem[] = [
  { label: 'Wedding Photography', to: '/services#wedding-photography', description: 'Candid & documentary full wedding coverage' },
  { label: 'Wedding Cinematography', to: '/services#wedding-cinematography', description: '4K cinema reels & full-length heirloom films' },
  { label: 'Pre-Wedding Photography & Films', to: '/services#pre-wedding-photography', description: 'Destination shoots across Madhya Pradesh' },
  { label: 'Haldi, Mehendi & Engagement', to: '/services#haldi-mehendi-photography', description: 'Multi-day ritual storytelling' },
  { label: 'Drone & Aerial Cinematography', to: '/services#drone-photography', description: 'Grand baraat & heritage venue perspectives' },
  { label: 'Maternity, Baby & Family', to: '/services#maternity-photography', description: 'Intimate generational portraits' },
  { label: 'Corporate & Product Coverage', to: '/services#corporate-event-photography', description: 'Refined brand and executive storytelling' },
  { label: 'View All 15 Services', to: '/services', description: 'Compare packages, deliverables & styles' },
];
