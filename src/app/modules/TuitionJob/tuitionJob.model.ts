import mongoose, { Schema } from 'mongoose';
import { ITuitionJob } from './tuitionJob.interface';
import { Counter } from '../Counter/counter.model';

const TuitionJobSchema: Schema<ITuitionJob> = new Schema(
  {
    // --- Source & Internal private data ---
    lead_from: { type: Schema.Types.ObjectId, required: true, ref: 'Lead' },
    posted_by: { type: Schema.Types.ObjectId, required: true, ref: 'Admin' }, // Original creator
    assigned_admin: { type: Schema.Types.ObjectId, ref: 'Admin', default: null }, // Currently handling admin
    assigned_tutor: { type: Schema.Types.ObjectId, ref: 'Tutor', default: null },
    serial_number: { type: String, unique: true }, // Auto-assigned alphanumeric identifier for customer support mapping
    conversion_note: { type: String, trim: true }, // Explanatory logging from Lead-to-Job manual conversions
    status: {
      type: String,
      enum: ['draft', 'open', 'assigned', 'demo', 'follow-up', 'confirmed', 'cancelled'],
      default: 'open',
      index: true,
    },

    // --- Contact Details ---
    contact: { type: String, required: true },
    additional_contact: { type: String },

    // --- Public Posting Data ---
    title: { type: String, required: true, trim: true },
    job_description: { type: String, trim: true },

    // --- Student Information ---
    student_gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    number_of_students: { type: Number, required: true, default: 1 },
    tutoring_type: { type: String, enum: ['home', 'online', 'batch'], required: true, index: true },
    student_education: {
      category: { type: String, required: true, index: true }, // Broad classification grouping, e.g., "School", "Admission Test"
      course: { type: String, required: true }, // Targeted level, e.g., "Class 10", "HSC"
      subjects: { type: [String], required: true, index: true }, // Multi-value index for localized filtering arrays
    },
    location: {
      full_address: { type: String, required: true },
      country: { type: String, required: true },
      city: { type: String, required: true, index: true },
      area: { type: String, required: true, index: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },

    // --- Tutor Requirements ---
    tutor_gender: { type: String, enum: ['male', 'female', 'any'], required: true, default: 'any' },
    tutor_qualification: { type: [String], required: true }, // Institutional background preferences, e.g., ["BUET", "DU", "Public University"]

    // --- Schedule & Salary ---
    salary: {
      min: { type: Number },
      max: { type: Number },
      rate_type: { type: String, enum: ['monthly', 'per_class', 'per_week'], default: 'monthly' }, // Payroll baseline cycle
      negotiable: { type: Boolean, default: false }, // Fallback boolean flag if no numeric targets are provided
      actual_salary: { type: Number }, // Locked-in transaction cost designated during contract closing state
    },

    // --- Schedule & Timing ---
    days_per_week: { type: Number, required: true },
    preferred_time: { type: String, required: true }, // Text description block, e.g., "Evening", "04:00 PM"

    special_requirements: { type: String, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes for high-traffic query lookups
// TuitionJobSchema.index({ status: 1, tutoring_type: 1 });
// TuitionJobSchema.index({ 'location.city': 1, 'location.area': 1 });

// Middleware for ID auto-generation
TuitionJobSchema.pre('save', async function () {
  if (!this.isNew) return;

  const counter = await Counter.findOneAndUpdate(
    {},
    { $inc: { 'job_counter.value': 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  const value = counter?.job_counter?.value ?? 1;
  this.serial_number = `#TJ${String(value).padStart(5, '0')}`;
});

export const TuitionJob = mongoose.model<ITuitionJob>('TuitionJob', TuitionJobSchema);
