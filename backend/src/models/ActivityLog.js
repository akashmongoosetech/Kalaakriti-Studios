const mongoose = require('mongoose');

const ACTIVITY_TYPES = [
  'contact_received',
  'contact_updated',
  'contact_deleted',
  'booking_submitted',
  'booking_updated',
  'booking_deleted',
  'status_changed',
  'gallery_created',
  'gallery_updated',
  'gallery_deleted',
  'gallery_status_changed',
];

const activityLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },
    entityType: {
      type: String,
      enum: ['contact', 'booking', 'profile', 'gallery'],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      trim: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'activity_logs',
  }
);

activityLogSchema.index({ createdAt: -1 });

activityLogSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    type: this.type,
    title: this.title,
    description: this.description,
    entityType: this.entityType,
    entityId: this.entityId,
    timestamp: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
  };
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
