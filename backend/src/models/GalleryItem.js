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
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      required: true,
      default: 'image',
      index: true,
    },
    mediaUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    embedUrl: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    videoProvider: {
      type: String,
      enum: ['', 'youtube', 'youtube_shorts', 'vimeo', 'direct', 'reel'],
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
      maxlength: 80,
      index: true,
    },
    categorySlug: {
      type: String,
      default: 'general',
      lowercase: true,
      trim: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
      max: 100000,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },

    // Compatible portfolio monograph & rendering fields
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
      index: true,
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    src: {
      type: String,
      default: '',
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
    aspectRatio: {
      type: String,
      enum: ['portrait', 'landscape', 'wide', 'square'],
      default: 'landscape',
    },
    location: {
      type: String,
      default: '',
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
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'gallery_items',
  }
);

galleryItemSchema.index({ status: 1, displayOrder: 1, createdAt: -1 });
galleryItemSchema.index({ mediaType: 1, status: 1 });
galleryItemSchema.index({ categorySlug: 1, status: 1 });

// Keep canonical and legacy fields synchronized automatically
galleryItemSchema.pre('validate', function syncGalleryFields(next) {
  if (!this.mediaType && this.type) {
    this.mediaType = this.type;
  }
  this.type = this.mediaType || 'image';

  if (!this.mediaUrl) {
    this.mediaUrl = this.videoUrl || this.src || this.thumbnail || '';
  }

  if (!this.status) {
    this.status = this.isPublished === false ? 'inactive' : 'active';
  }
  this.isPublished = this.status === 'active';

  if (this.displayOrder === undefined || this.displayOrder === null) {
    this.displayOrder = typeof this.sortOrder === 'number' ? this.sortOrder : 0;
  }
  this.sortOrder = this.displayOrder;

  if (!this.category || !this.category.trim()) {
    this.category = 'General';
  }
  if (!this.categorySlug || !this.categorySlug.trim()) {
    this.categorySlug = this.category
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'general';
  }

  if (this.mediaType === 'image') {
    if (!this.src) this.src = this.mediaUrl;
    if (!this.thumbnail) this.thumbnail = this.mediaUrl;
  } else {
    if (!this.src) this.src = this.thumbnail || this.mediaUrl;
    if (this.videoProvider === 'direct' && !this.videoUrl) {
      this.videoUrl = this.mediaUrl;
    }
  }

  next();
});

galleryItemSchema.methods.toClientJSON = function toClientJSON() {
  const effectiveMediaType = this.mediaType || this.type || 'image';
  const effectiveStatus = this.status || (this.isPublished === false ? 'inactive' : 'active');
  const effectiveDisplayOrder =
    typeof this.displayOrder === 'number' ? this.displayOrder : Number(this.sortOrder || 0);
  const effectiveMediaUrl =
    this.mediaUrl || (effectiveMediaType === 'video' ? this.videoUrl || this.src : this.src) || '';

  return {
    id: this._id.toString(),
    slug: this.slug,
    title: this.title,
    description: this.description || '',
    mediaType: effectiveMediaType,
    type: effectiveMediaType,
    mediaUrl: effectiveMediaUrl,
    embedUrl: this.embedUrl || '',
    videoProvider: this.videoProvider || (effectiveMediaType === 'video' && this.reelFrames?.length ? 'reel' : ''),
    category: this.category || 'General',
    categorySlug: this.categorySlug || 'general',
    displayOrder: effectiveDisplayOrder,
    status: effectiveStatus,
    thumbnail: this.thumbnail || (effectiveMediaType === 'image' ? effectiveMediaUrl : ''),
    src: this.src || effectiveMediaUrl,
    ...(this.videoUrl ? { videoUrl: this.videoUrl } : {}),
    ...(this.reelFrames && this.reelFrames.length > 0 ? { reelFrames: this.reelFrames } : {}),
    ...(this.duration ? { duration: this.duration } : {}),
    aspectRatio: this.aspectRatio || 'landscape',
    location: this.location || '',
    year: this.year || String(new Date().getFullYear()),
    coupleOrClient: this.coupleOrClient || '',
    isDemoContent: Boolean(this.isDemoContent),
    ...(this.cameraSpec ? { cameraSpec: this.cameraSpec } : {}),
    ...(this.storyHighlights && this.storyHighlights.length > 0
      ? { storyHighlights: this.storyHighlights }
      : {}),
    createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: this.updatedAt ? this.updatedAt.toISOString() : new Date().toISOString(),
  };
};

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
