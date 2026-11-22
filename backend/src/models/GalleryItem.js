const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    categorySlug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    src: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    reelFrames: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    aspectRatio: {
      type: String,
      enum: ['portrait', 'landscape', 'wide', 'square'],
      default: 'landscape',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      default: () => String(new Date().getFullYear()),
      trim: true,
    },
    coupleOrClient: {
      type: String,
      default: '',
      trim: true,
    },
    isDemoContent: {
      type: Boolean,
      default: false,
    },
    cameraSpec: {
      type: String,
      default: '',
      trim: true,
    },
    storyHighlights: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 100,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'gallery_items',
  }
);

galleryItemSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    slug: this.slug,
    type: this.type,
    title: this.title,
    category: this.category,
    categorySlug: this.categorySlug,
    thumbnail: this.thumbnail,
    src: this.src,
    ...(this.videoUrl ? { videoUrl: this.videoUrl } : {}),
    ...(this.reelFrames && this.reelFrames.length > 0 ? { reelFrames: this.reelFrames } : {}),
    ...(this.duration ? { duration: this.duration } : {}),
    description: this.description,
    aspectRatio: this.aspectRatio,
    location: this.location,
    year: this.year,
    coupleOrClient: this.coupleOrClient,
    isDemoContent: this.isDemoContent,
    ...(this.cameraSpec ? { cameraSpec: this.cameraSpec } : {}),
    ...(this.storyHighlights && this.storyHighlights.length > 0
      ? { storyHighlights: this.storyHighlights }
      : {}),
  };
};

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
