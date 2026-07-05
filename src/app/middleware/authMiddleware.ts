import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { Admin } from '../modules/Admin/admin.model';
import { Teacher } from '../modules/Teacher/teacher.model';
import { ROLE } from '../types/role';
import { TRole } from '../utils/role';

/**
 * Authentication and Authorization Guard Middleware
 *
 * @param requiredRoles - Optional list of roles allowed to access the route.
 *                        If left empty, any authenticated user can access it.
 */
const authMiddleware = (...requiredRoles: TRole[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // 1. Token Existence & Schema Validation
    // Ensures the header exists and explicitly uses the standard 'Bearer <token>' format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized to access this resource.',
      );
    }

    // Extract the pure token string from the Bearer scheme
    const token = authHeader.split(' ')[1];

    // 2. JWT Verification
    // Verifies token integrity and expiration against our secret key
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Session expired or invalid token.');
    }

    const { role, email } = decoded;

    // 3. Database Integrity Check
    // Verifies that the user still exists in the database even if their token is valid
    let isUserValid = false;

    if (role === ROLE.teacher) {
      const teacher = await Teacher.isTeacherExistsByEmail(email);
      isUserValid = !!teacher;

      // Account verification check (uncomment if you choose to enforce this downstream)
      // if (teacher && !teacher.is_verified) {
      //   throw new AppError(httpStatus.BAD_REQUEST, 'Please verify your account to access this resource!');
      // }
    } else if ([ROLE.admin, ROLE.superAdmin, ROLE.teleMarketing, ROLE.teleSales].includes(role)) {
      const admin = await Admin.isAdminExistsByEmail(email);
      isUserValid = !!admin;
    }

    // If the role isn't recognized or the user was deleted/not found in DB
    if (!isUserValid) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'The requested account does not exist.');
    }

    // 4. Role-Based Authorization Guard
    // If specific roles are explicitly required, check if the current user's role is included
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You do not have the required permissions to access this resource.',
      );
    }

    // 5. Context Assignment
    // Attach the verified user payload to the request object for use in downstream controllers
    req.user = decoded;
    next();
  });

export default authMiddleware;
