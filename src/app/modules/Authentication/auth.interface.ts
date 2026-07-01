export interface ITeacherLogin {
  email: string;
  password: string;
}

export interface ITeacherRegistration {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ITeacherUpdatePassword {
  current_password: string;
  new_password: string;
}

export interface IAdminLogin {
  email: string;
  password: string;
  ip_address: string;
}
