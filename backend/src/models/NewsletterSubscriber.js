const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
    source: {
      type: String,
      default: 'website_newsletter',
      trim: true,
      maxlength: 60,
    },
  },
  {
    timestamps: true,
    collection: 'newsletter_subscribers',
  }
);

newsletterSubscriberSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    email: this.email,
    status: this.status,
    source: this.source,
    subscribedAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
  };
};

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
