import mongoose, { Schema } from 'mongoose';
import { ITeacher, TeacherModel } from './teacher.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { Counter } from '../Counter/counter.model';

const teacherSchema = new Schema<ITeacher, TeacherModel>(
  {
    // overview & Personal details
    about_me: { type: String },
    full_name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    additional_phone: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    religion: { type: String },
    date_of_birth: { type: Date },
    blood_group: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    marital_status: {
      type: String,
      enum: ['unmarried', 'married'],
    },
    serial_number: { type: String, unique: true },
    present_address: { type: String },
    permanent_address: { type: String },

    // Tutoring Preferences
    years_of_experience: { type: Number },
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
    tutoring_availability: {
      days: { type: [String], default: [] },
    },
    preferred_teaching_locations: {
      country: { type: String },
      city: { type: String },
      area: { type: [String], default: [] },
    },

    // Academic Credentials
    education: {
      school: {
        name: { type: String },
        group: { type: String },
        curriculum: { type: String },
        board: { type: String },
        grade: { type: String }, // GPA
        year_of_passing: { type: Number },
      },
      college: {
        name: { type: String },
        group: { type: String }, // GPA
        curriculum: { type: String },
        board: { type: String },
        grade: { type: String },
        year_of_passing: { type: Number },
      },
      graduation: {
        name: { type: String },
        department: { type: String }, // Which subjects they studied in graduation.
        type: { type: String, enum: ['public', 'private'] },
        grade: { type: String }, // CGPA
        status: { type: String }, // first to forth year or graduation completed.
        year_of_passing: { type: Number }, // if status is graduation completed then we will ask for year.
      },
      post_graduation: {
        name: { type: String },
        department: { type: String },
        type: { type: String, enum: ['public', 'private'] },
        grade: { type: String }, // CGPA
        status: { type: String },
        year_of_passing: { type: Number },
      },
    },

    // Family & Verification Documents
    parents_info: {
      father_name: { type: String },
      father_phone: { type: String },
      mother_name: { type: String },
      mother_phone: { type: String },
      other_contact_name: { type: String },
      other_contact_phone: { type: String },
    },

    identification: {
      type: {
        type: String,
        enum: ['passport', 'nid', 'birth_certificate'],
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

    // others fields
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

    profile_picture: { type: String },

    role: {
      type: String,
      required: true,
      trim: true,
      enum: ['teacher'],
      default: 'teacher',
    },

    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
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
