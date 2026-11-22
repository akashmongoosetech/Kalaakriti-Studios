const mongoose = require('mongoose');

const CONTACT_STATUSES = [
  'New',
  'Contacted',
  'In Progress',
  'Converted',
  'Closed',
  'Spam',
];

const contactSchema = new mongoose.Schema(
  {
    contactId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
      maxlength: 80,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
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
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      index: true,
    },
    eventDate: {
      type: String,
      default: '',
      trim: true,
      maxlength: 30,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: CONTACT_STATUSES,
      default: 'New',
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
    collection: 'contacts',
  }
);

contactSchema.index({ deletedAt: 1, createdAt: -1 });
contactSchema.index({ status: 1, deletedAt: 1 });

contactSchema.methods.toClientJSON = function toClientJSON() {
  return {
    id: this._id.toString(),
    contactId: this.contactId,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    email: this.email,
    mobile: this.mobile,
    subject: this.subject,
    eventType: this.eventType,
    city: this.city,
    eventDate: this.eventDate || '',
    message: this.message,
    status: this.status,
    submittedAt: this.createdAt ? this.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: this.updatedAt ? this.updatedAt.toISOString() : new Date().toISOString(),
    source: this.source,
    deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
  };
};

const Contact = mongoose.model('Contact', contactSchema);
Contact.CONTACT_STATUSES = CONTACT_STATUSES;

module.exports = Contact;
