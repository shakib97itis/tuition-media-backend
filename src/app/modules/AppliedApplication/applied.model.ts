import mongoose, { Schema } from 'mongoose';
import { IAppliedApplication } from './applied.interface';

const AppliedApplicationSchema: Schema<IAppliedApplication> = new Schema(
  {
    job: { type: Schema.Types.ObjectId, required: true, ref: 'TuitionJob', index: true },
    applicant: { type: Schema.Types.ObjectId, required: true, ref: 'Teacher', index: true },

    // --- Application Status ---
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'hired', 'cancelled'],
      default: 'applied',
      index: true,
    },

    // --- Origin Tracking ---
    source: {
      type: String,
      enum: ['website_application', 'admin_sourced'],
      required: true,
      default: 'website_application',
    },

    // --- Admin Sourcing Meta ---
    managed_by: { type: Schema.Types.ObjectId, ref: 'Admin', default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Prevent duplicate applications for the same job by the same teacher[cite: 2]
AppliedApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Performance index for administrative analytics and dashboard views[cite: 2]
AppliedApplicationSchema.index({ status: 1, source: 1 });

export const AppliedApplication = mongoose.model<IAppliedApplication>(
  'JobApplication',
  AppliedApplicationSchema,
);
