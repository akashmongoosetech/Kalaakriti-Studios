const GalleryItem = require('../models/GalleryItem');
const Testimonial = require('../models/Testimonial');
const InstagramPost = require('../models/InstagramPost');
const {
  SEED_GALLERY_ITEMS,
  SEED_TESTIMONIALS,
  SEED_INSTAGRAM_POSTS,
} = require('./seedData');

async function seedDatabase() {
  const [galleryCount, testimonialCount, instagramCount] = await Promise.all([
    GalleryItem.countDocuments(),
    Testimonial.countDocuments(),
    InstagramPost.countDocuments(),
  ]);

  if (galleryCount === 0) {
    await GalleryItem.insertMany(SEED_GALLERY_ITEMS);
    console.log(`[seed] Seeded ${SEED_GALLERY_ITEMS.length} gallery items.`);
  }

  if (testimonialCount === 0) {
    await Testimonial.insertMany(SEED_TESTIMONIALS);
    console.log(`[seed] Seeded ${SEED_TESTIMONIALS.length} testimonials.`);
  }

  if (instagramCount === 0) {
    await InstagramPost.insertMany(SEED_INSTAGRAM_POSTS);
    console.log(`[seed] Seeded ${SEED_INSTAGRAM_POSTS.length} Instagram posts.`);
  }
}

module.exports = { seedDatabase };
