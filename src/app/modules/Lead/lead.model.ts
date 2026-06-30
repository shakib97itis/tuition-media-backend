import mongoose, { Schema } from 'mongoose';
import { ILead, LeadModel } from './lead.interface';

const followUpSchema = new Schema(
  {
    note: { type: String },
    doneBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { _id: false, versionKey: false, timestamps: true },
);

const leadSchema = new Schema<ILead, LeadModel>(
  {
    name: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    details: { type: String, trim: true },
    lead_source: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'assigned', 'converted', 'canceled', 'blocked'],
      default: 'new',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Admin' },
    referredBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    convertedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    followUps: { type: [followUpSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

leadSchema.statics.getConvertedLeadsByAdmin = async function (adminId: string) {
  return await this.find({ convertedBy: adminId, status: 'converted' }).lean();
};

export const Lead = mongoose.model<ILead, LeadModel>('Lead', leadSchema);
