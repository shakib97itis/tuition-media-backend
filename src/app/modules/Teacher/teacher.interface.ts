import { Model } from 'mongoose';

export interface ITeacher {
  // _id?: string;

  // Overview & Personal Details
  about_me?: string;
  full_name: string;
  phone: string;
  additional_phone?: string;
  email: string;
  gender?: 'male' | 'female' | 'other';
  religion?: string;
  date_of_birth?: string | Date;
  blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  marital_status?: 'unmarried' | 'married';
  serial_number?: string;
  present_address?: string;
  permanent_address?: string;

  // Tutoring Preferences
  years_of_experience: number;
  preferred_tutoring: {
    categories: string[];
    courses: string[];
    subjects: string[];
    tutoring_types: string[];
    salary_range: {
      min?: number;
      max?: number;
    };
  };
  tutoring_availability: {
    days: string[];
  };
  preferred_teaching_locations: {
    country?: string;
    city?: string;
    area: string[];
  };

  // Academic Credentials
  education: {
    school: {
      name?: string;
      group?: string;
      curriculum?: string;
      board?: string;
      grade?: string;
      year_of_passing?: number;
    };
    college: {
      name?: string;
      group?: string;
      curriculum?: string;
      board?: string;
      grade?: string;
      year_of_passing?: number;
    };
    graduation: {
      name?: string;
      department?: string;
      type?: 'public' | 'private';
      grade?: string;
      status?: string;
      year_of_passing?: number;
    };
    post_graduation: {
      name?: string;
      department?: string;
      type?: 'public' | 'private';
      grade?: string;
      status?: string;
      year_of_passing?: number;
    };
  };

  // Family & Verification Documents
  parents_info: {
    father_name?: string;
    father_phone?: string;
    mother_name?: string;
    mother_phone?: string;
    other_contact_name?: string;
    other_contact_phone?: string;
  };

  identification: {
    type?: 'passport' | 'nid' | 'birth_certificate';
    number?: string;
    front_image?: string;
    back_image?: string;
  };

  certifications: {
    type: string;
    certificate_url: string;
  }[];

  // others fields
  profile_completion?: {
    is_completed: boolean;
    percentage: number;
  };
  is_verified?: boolean;
  is_active?: boolean;
  is_deleted?: boolean;
  profile_picture?: string;
  role?: 'teacher';
  password: string;
  // Timestamps
  created_at?: Date;
  updated_at?: Date;
}

export interface TeacherModel extends Model<ITeacher> {
  isTeacherExistsByEmail(email: string): Promise<ITeacher | null>;
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
