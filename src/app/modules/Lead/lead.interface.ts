import mongoose, { Model } from 'mongoose';

export interface ILead {
  name: string;
  contact: string;
  details: string;
  lead_source: string;
  assignedTo?: mongoose.Types.ObjectId;
  referredBy?: mongoose.Types.ObjectId;
  status: 'new' | 'assigned' | 'interested' | 'converted' | 'canceled';
  convertedBy?: mongoose.Types.ObjectId;
  followUps: {
    date: Date;
    note?: string;
    doneBy: mongoose.Types.ObjectId;
  }[];
}

export interface LeadModel extends Model<ILead> {
  getConvertedLeadsByAdmin(adminId: string): Promise<ILead[]>;
}
