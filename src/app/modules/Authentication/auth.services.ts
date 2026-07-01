import status from 'http-status';
import AppError from '../../errors/AppError';
import { Teacher } from '../Teacher/teacher.model';
import {
  IAdminLogin,
  ITeacherLogin,
  ITeacherRegistration,
  ITeacherUpdatePassword,
} from './auth.interface';
import config from '../../config';
import { createToken, verifyToken } from '../../utils/auth';
import { SignOptions } from 'jsonwebtoken';
import { Admin } from '../Admin/admin.model';
import bcrypt from 'bcrypt';

const loginTeacherIntoDB = async (payload: ITeacherLogin) => {
  const user = await Teacher.isTeacherExistsByEmail(payload.email);
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'user not found!');
  }

  const passwordMatch = await Teacher.isPasswordMatched(payload?.password, user?.password);
  if (!passwordMatch) {
    throw new AppError(status.FORBIDDEN, 'Password incorrect!');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  );

  return {
    user: {
      ...user,
    },
    accessToken,
    refreshToken,
  };
};

const teacherRegistrationIntoDB = async (payload: ITeacherRegistration) => {
  let user;
  user = await Teacher.isTeacherExistsByEmail(payload.email);
  if (user) {
    throw new AppError(status.NOT_FOUND, 'User Already exists');
  }
  user = await Teacher.create({
    ...payload,
  });

  const jwtPayload = {
    email: payload.email,
    role: 'teacher',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  );

  return {
    user: user.toObject(),
    accessToken,
    refreshToken,
  };
};

const refreshTeacherTokenFromDB = async (token: string) => {
  try {
    const { _doc } = verifyToken(token, config.jwt_refresh_secret as string);
    const user = await Teacher.findOne({ email: _doc.email });
    if (!user) throw new AppError(status.NOT_FOUND, 'Teacher not found!');
    const jwtPayload = {
      email: user.email,
      role: user.role,
    };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as SignOptions['expiresIn'],
    );
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as SignOptions['expiresIn'],
    );
    return { user, accessToken, refreshToken };
  } catch (error: any) {
    throw new AppError(status.UNAUTHORIZED, error?.message);
  }
};

const loginAdminIntoDB = async (payload: IAdminLogin) => {
  const admin = await Admin.findByEmailAndValidate(
    payload.email,
    payload.password,
    payload.ip_address,
  );

  const jwtPayload = { email: admin!.email, role: admin!.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as SignOptions['expiresIn'],
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as SignOptions['expiresIn'],
  );

  await Admin.updateOne({ email: admin!.email }, { last_login: new Date() });

  return {
    user: admin,
    accessToken,
    refreshToken,
  };
};

const changeTeacherPasswordIntoDB = async (id: string, payload: ITeacherUpdatePassword) => {
  const user = await Teacher.findById(id).select('+password');
  if (!user) {
    throw new AppError(status.NOT_FOUND, 'Teacher not found');
  }

  const passwordMatch = await Teacher.isPasswordMatched(payload.current_password, user?.password);
  if (!passwordMatch) {
    throw new AppError(status.FORBIDDEN, 'Current password is incorrect');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.new_password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await Teacher.findByIdAndUpdate(id, {
    password: newHashedPassword,
  });

  if (!result) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Password change failed');
  }
  return;
};

const refreshAdminTokenFromDB = async (token: string) => {
  try {
    const { _doc } = verifyToken(token, config.jwt_refresh_secret as string);
    const admin = await Admin.findOne({ email: _doc.email });
    if (!admin) throw new AppError(status.NOT_FOUND, 'Admin not found!');
    const jwtPayload = { email: admin!.email, role: admin!.role };
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as SignOptions['expiresIn'],
    );
    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as SignOptions['expiresIn'],
    );
    return { user: admin, accessToken, refreshToken };
  } catch (error: any) {
    throw new AppError(status.UNAUTHORIZED, error?.message);
  }
};

export const AuthServices = {
  loginTeacherIntoDB,
  teacherRegistrationIntoDB,
  loginAdminIntoDB,
  refreshTeacherTokenFromDB,
  refreshAdminTokenFromDB,
  changeTeacherPasswordIntoDB,
};
