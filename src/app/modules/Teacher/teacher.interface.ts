import { Model } from 'mongoose';

export interface ITeacher {
  serial_number?: string;
  full_name: string;
  email: string;
  password: string;
  phone: string;
  role: 'teacher';
  additional_phone?: string;

  present_address?: string;
  permanent_address?: string;

  preferred_teaching_locations?: {
    city: string;
    country: string;
    area: string[];
  };

  about_me?: string;

  preferred_tutoring?: {
    categories: string[];
    courses: string[];
    subjects: string[];
    tutoring_types: string[];
    salary_range: {
      min: number;
      max: number;
    };
  };

  education: {
    school?: {
      name: string;
      gpa: string;
      group: string;
      board: string;
      curriculum: string;
      year_of_passing: number;
    };

    college?: {
      name: string;
      gpa?: string;
      group: string;
      board: string;
      curriculum: string;
      year_of_passing?: number;
      status: 'graduated' | 'studying';
      is_diploma_student?: boolean;
    };

    diploma?: {
      is_diploma: boolean;
      name: string;
      type: string;
      department: string;
      study_level: string;
      cgpa?: string;
      session?: string;
      status: 'graduated' | 'studying';
    };

    graduation?: {
      name: string;
      type: string;
      department: string;
      study_level: string;
      gpa?: string;
      session?: string;
      status: 'graduated' | 'studying';
    };

    post_graduation?: {
      name: string;
      type: string;
      department: string;
      study_level: string;
      gpa?: string;
      session?: string;
      status: 'graduated' | 'studying';
    };
  };

  years_of_experience?: number;

  tutoring_availability?: {
    days: string[];
  };

  gender: 'male' | 'female' | 'other';

  date_of_birth: Date;

  blood_group?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

  profile_picture?: string;

  religion?: string;

  marital_status?: 'unmarried' | 'married';

  parents_info?: {
    father_name: string;
    father_phone: string;
    mother_name: string;
    mother_phone: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
  };

  identification?: {
    type: 'passport' | 'nid' | 'driving_license' | 'birth_certificate';
    number: string;
    front_image: string;
    back_image: string;
  };

  certifications?: Array<{
    type: string;
    certificate_url: string;
  }>;

  profile_completion: {
    is_completed: boolean;
    percentage: number;
  };

  is_verified: boolean;
  is_active: boolean;
  is_deleted: boolean;

  created_at?: Date;
  updated_at?: Date;
}

export interface TeacherModel extends Model<ITeacher> {
  isTeacherExistsByEmail(email: string): Promise<ITeacher | null>;
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
