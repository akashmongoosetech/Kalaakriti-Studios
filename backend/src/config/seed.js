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
    const normalizedSeedItems = SEED_GALLERY_ITEMS.map((item) => ({
      ...item,
      mediaType: item.type || 'image',
      mediaUrl: item.videoUrl || item.src || item.thumbnail,
      videoProvider: item.type === 'video' ? (item.videoUrl ? 'direct' : 'reel') : '',
      displayOrder: typeof item.sortOrder === 'number' ? item.sortOrder : 0,
      status: item.isPublished === false ? 'inactive' : 'active',
    }));
    await GalleryItem.insertMany(normalizedSeedItems);
    console.log(`[seed] Seeded ${normalizedSeedItems.length} gallery items.`);
  } else {
    // Migrate any pre-existing gallery documents missing canonical Gallery Management fields
    const legacyItems = await GalleryItem.find({
      $or: [
        { mediaType: { $exists: false } },
        { mediaUrl: { $exists: false } },
        { status: { $exists: false } },
        { displayOrder: { $exists: false } },
      ],
    });
    if (legacyItems.length > 0) {
      await Promise.all(
        legacyItems.map((doc) => {
          doc.mediaType = doc.mediaType || doc.type || 'image';
          doc.mediaUrl = doc.mediaUrl || doc.videoUrl || doc.src || doc.thumbnail || '';
          doc.videoProvider =
            doc.videoProvider ||
            (doc.mediaType === 'video' ? (doc.videoUrl ? 'direct' : 'reel') : '');
          doc.displayOrder =
            typeof doc.displayOrder === 'number' ? doc.displayOrder : Number(doc.sortOrder || 0);
          doc.status = doc.status || (doc.isPublished === false ? 'inactive' : 'active');
          return doc.save();
        })
      );
      console.log(`[seed] Backfilled canonical gallery fields on ${legacyItems.length} existing items.`);
    }
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
