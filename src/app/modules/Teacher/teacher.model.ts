import mongoose, { Schema } from 'mongoose';
import { ITeacher, TeacherModel } from './teacher.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Counter } from '../Counter/counter.model';

const teacherSchema = new Schema<ITeacher, TeacherModel>(
  {
    full_name: { type: String, required: true, trim: true },
    serial_number: { type: String, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      enum: ['teacher'],
      default: 'teacher',
    },
    phone: { type: String, required: true },
    additional_phone: { type: String },
    present_address: { type: String },
    permanent_address: { type: String },
    preferred_teaching_locations: {
      city: { type: String },
      country: { type: String },
      area: { type: [String], default: [] },
    },
    about_me: { type: String },
    preferred_tutoring: {
      categories: { type: [String], default: [] },
      courses: { type: [String], default: [] },
      subjects: { type: [String], default: [] },
      tutoring_types: { type: [String], default: [] },
      salary_range: {
        min: { type: Number },
        max: { type: Number },
      },
    },

    education: {
      school: {
        name: { type: String },
        gpa: { type: String },
        group: { type: String },
        board: { type: String },
        curriculum: { type: String },
        year_of_passing: { type: Number },
      },
      college: {
        name: { type: String },
        gpa: { type: String },
        group: { type: String },
        board: { type: String },
        curriculum: { type: String },
        year_of_passing: { type: Number },
        status: { type: String, enum: ['graduated', 'studying'] },
      },
      diploma: {
        is_diploma: { type: Boolean },
        name: { type: String },
        type: { type: String },
        department: { type: String },
        study_level: { type: String },
        cgpa: { type: String },
        session: { type: String },
        status: { type: String, enum: ['graduated', 'studying'] },
      },
      graduation: {
        name: { type: String },
        type: { type: String },
        department: { type: String },
        study_level: { type: String },
        gpa: { type: String },
        session: { type: String },
        status: { type: String, enum: ['graduated', 'studying'] },
      },
      post_graduation: {
        name: { type: String },
        type: { type: String },
        department: { type: String },
        study_level: { type: String },
        gpa: { type: String },
        session: { type: String },
        status: { type: String, enum: ['graduated', 'studying'] },
      },
    },

    years_of_experience: { type: Number },

    tutoring_availability: {
      days: { type: [String], default: [] },
    },

    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },

    date_of_birth: { type: Date },

    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },

    profile_picture: { type: String },

    religion: { type: String },

    marital_status: {
      type: String,
      enum: ['unmarried', 'married'],
    },

    parents_info: {
      father_name: { type: String },
      father_phone: { type: String },
      mother_name: { type: String },
      mother_phone: { type: String },
      emergency_contact_name: { type: String },
      emergency_contact_phone: { type: String },
    },

    identification: {
      type: {
        type: String,
        enum: ['passport', 'nid', 'driving_license', 'birth_certificate'],
      },
      number: { type: String },
      front_image: { type: String },
      back_image: { type: String },
    },

    certifications: [
      {
        type: { type: String },
        certificate_url: { type: String },
      },
    ],

    profile_completion: {
      is_completed: { type: Boolean, default: false },
      percentage: { type: Number, default: 0 },
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
  },
);

// --- Indexes for Optimization ---
// teacherSchema.index({ is_deleted: 1, is_active: 1 });
// teacherSchema.index({ 'preferred_teaching_locations.area': 1 });
// teacherSchema.index({ 'preferred_tutoring.subjects': 1 });

// --- Pre-Save Hooks (Pure Async/Await) ---

// 1. Auto-increment serial number hook
teacherSchema.pre('save', async function () {
  if (!this.isNew) return;

  const counter = await Counter.findOneAndUpdate(
    {},
    {
      $inc: {
        'teacher_counter.value': 1,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );

  const value = counter?.teacher_counter?.value ?? 1;
  this.serial_number = `#${value}`;
});

// 2. Encrypt Password hook
teacherSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const saltRounds = Number(config.bcrypt_salt_rounds) || 12;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// --- Statics ---
teacherSchema.statics.isTeacherExistsByEmail = async function (email: string) {
  return await this.findOne({ email, is_deleted: false }).select('+password').lean();
};

teacherSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const Teacher = mongoose.model<ITeacher, TeacherModel>('Teacher', teacherSchema);
