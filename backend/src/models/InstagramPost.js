const mongoose = require('mongoose');

const instagramPostSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    media_type: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'],
      default: 'IMAGE',
    },
    media_url: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail_url: {
      type: String,
      default: '',
      trim: true,
    },
    permalink: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    aspectRatio: {
      type: String,
      enum: ['portrait', 'landscape', 'square'],
      default: 'square',
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'instagram_posts',
  }
);

instagramPostSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this.externalId || this._id.toString(),
    caption: this.caption,
    media_type: this.media_type,
    media_url: this.media_url,
    thumbnail_url: this.thumbnail_url || this.media_url,
    permalink: this.permalink,
    timestamp: this.timestamp ? this.timestamp.toISOString() : new Date().toISOString(),
    location: this.location || '',
    aspectRatio: this.aspectRatio,
  };
};

module.exports = mongoose.model('InstagramPost', instagramPostSchema);
