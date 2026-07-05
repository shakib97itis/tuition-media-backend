import { Document, Types } from 'mongoose';

export interface ITuitionJob extends Document {
  // --- Source & Internal Meta ---
  lead_from: Types.ObjectId;
  posted_by: Types.ObjectId;
  assigned_tutor?: Types.ObjectId | null;
  assigned_admin?: Types.ObjectId | null;
  contact: string;
  additional_contact: string;
  serial_number?: string;
  conversion_note?: string;

  // --- Public Posting Data ---
  title: string;

  // --- Student Information ---
  student_gender: 'male' | 'female' | 'other';
  number_of_students: number;
  tutoring_type: 'home' | 'online' | 'batch';
  student_education: {
    category: string;
    course: string;
    subjects: string[];
  };

  // --- Geographic Routing Data ---
  location: {
    full_address: string;
    country: string;
    city: string;
    area: string;
    latitude?: number;
    longitude?: number;
  };

  // --- Schedule & Timing ---
  days_per_week: number;
  preferred_time: string;

  // --- Financial Layout ---
  salary: {
    min?: number;
    max?: number;
    negotiable: boolean;
    rate_type: 'monthly' | 'per_class' | 'per_week';
    actual_salary?: number;
  };

  // --- Tutor Preferences ---
  tutor_gender: 'male' | 'female' | 'any';
  tutor_qualification: string[];
  special_requirements?: string;

  // --- Operational Lifecycle State ---
  status: 'draft' | 'open' | 'assigned' | 'demo' | 'follow-up' | 'confirmed' | 'cancelled';

  // --- Mongoose Auto-Generated Timestamps ---
  createdAt: Date;
  updatedAt: Date;
}
