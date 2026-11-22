const mongoose = require('mongoose');

const BOOKING_STATUSES = [
  'Pending',
  'Contacted',
  'Quotation Sent',
  'Confirmed',
  'In Progress',
  'Completed',
  'Cancelled',
  'Rejected',
];

const COVERAGE_MODES = ['photography', 'cinematography', 'both'];

const bookingSchema = new mongoose.Schema(
  {
    referenceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    whatsapp: {
      type: String,
      default: '',
      trim: true,
      maxlength: 25,
    },
    eventCategory: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    eventDate: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
      index: true,
    },
    eventDuration: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    eventLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    guestCount: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    coverageMode: {
      type: String,
      enum: COVERAGE_MODES,
      default: 'both',
    },
    addOns: {
      type: [String],
      default: [],
    },
    budgetRange: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    additionalRequirements: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: 'Pending',
      index: true,
    },
    source: {
      type: String,
      enum: ['public_form', 'admin_demo'],
      default: 'public_form',
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'bookings',
  }
);

bookingSchema.index({ deletedAt: 1, createdAt: -1 });
bookingSchema.index({ status: 1, deletedAt: 1 });
bookingSchema.index({ eventCategory: 1, deletedAt: 1 });
bookingSchema.index({ eventDate: 1, deletedAt: 1 });

bookingSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    referenceId: this.referenceId,
    fullName: this.fullName,
    email: this.email,
    mobile: this.mobile,
    whatsapp: this.whatsapp || '',
    eventCategory: this.eventCategory,
    eventName: this.eventName,
    eventDate: this.eventDate,
    eventDuration: this.eventDuration,
    eventLocation: this.eventLocation,
    city: this.city,
    guestCount: this.guestCount,
    coverageMode: this.coverageMode,
    addOns: Array.isArray(this.addOns) ? this.addOns : [],
    budgetRange: this.budgetRange,
    additionalRequirements: this.additionalRequirements || '',
    message: this.message,
    status: this.status,
    createdAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: this.updatedAt ? this.updatedAt.toISOString() : new Date().toISOString(),
    source: this.source,
    deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
  };
};

const Booking = mongoose.model('Booking', bookingSchema);
Booking.BOOKING_STATUSES = BOOKING_STATUSES;
Booking.COVERAGE_MODES = COVERAGE_MODES;

module.exports = Booking;
