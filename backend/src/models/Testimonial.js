const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    quote: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    eventLabel: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    portrait: {
      type: String,
      required: true,
      trim: true,
    },
    isSample: {
      type: Boolean,
      default: false,
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
    collection: 'testimonials',
  }
);

testimonialSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    quote: this.quote,
    clientName: this.clientName,
    eventLabel: this.eventLabel,
    city: this.city,
    portrait: this.portrait,
    isSample: Boolean(this.isSample),
  };
};

module.exports = mongoose.model('Testimonial', testimonialSchema);
