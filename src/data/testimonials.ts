import { TestimonialItem } from '../types';
import { STUDIO_IMAGES } from './media';

/**
 * Sample placeholder client testimonials.
 * Clearly labeled in the UI as sample demonstration feedback until replaced
 * with verified client reviews.
 */
export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    quote:
      'Every photograph from our pheras and morning Haldi feels like stepping right back into that warmth. They never asked us to pause real moments—yet somehow caught my grandmother’s tears and every petal falling in the courtyard.',
    clientName: 'Meera & Aarav Joshi',
    eventLabel: 'Two-Day Heritage Wedding',
    city: 'Indore, Madhya Pradesh',
    portrait: STUDIO_IMAGES.heroWedding,
    isSample: true,
  },
  {
    id: 'test-2',
    quote:
      'Our Maheshwar pre-wedding shoot felt like an unhurried evening walk rather than a photo session. The sandstone colours, Banarasi saree movement, and sunset cinema reel left our entire family speechless at the Sangeet screening.',
    clientName: 'Ananya & Rohan Tiwari',
    eventLabel: 'Pre-Wedding Photo & Film',
    city: 'Bhopal, Madhya Pradesh',
    portrait: STUDIO_IMAGES.preweddingPalace,
    isSample: true,
  },
  {
    id: 'test-3',
    quote:
      'Having both candid storytellers and a patient traditional team meant our parents got every single relative portrait they hoped for, while we received museum-worthy bridal and Mehendi frames.',
    clientName: 'Ishita & Devendra Verma',
    eventLabel: 'Mehendi, Sangeet & Wedding',
    city: 'Ujjain, Madhya Pradesh',
    portrait: STUDIO_IMAGES.mehendiBridal,
    isSample: true,
  },
  {
    id: 'test-4',
    quote:
      'From styling advice on our ivory Chanderi saree to the calm, unhurried afternoon pacing on our verandah, the maternity session felt deeply respectful and graceful. We framed three prints immediately.',
    clientName: 'Aditi & Prateek Sharma',
    eventLabel: 'Maternity & Family Heirlooms',
    city: 'Dewas, Madhya Pradesh',
    portrait: STUDIO_IMAGES.maternityFamily,
    isSample: true,
  },
  {
    id: 'test-5',
    quote:
      'Watching our 4K wedding highlight film brought back every beat of the baraat, the quiet emotion of Kanyadaan, and our evening ring exchange under the chandeliers. Truly timeless craftsmanship.',
    clientName: 'Kavya & Siddharth Kulkarni',
    eventLabel: 'Engagement, Sangeet & Royal Pheras',
    city: 'Gwalior, Madhya Pradesh',
    portrait: STUDIO_IMAGES.engagementSangeet,
    isSample: true,
  },
];
