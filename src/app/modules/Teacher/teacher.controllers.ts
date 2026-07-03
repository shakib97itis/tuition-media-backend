import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TeacherServices } from './teacher.services';

// ==========================================
// PUBLIC CONTROLLERS
// ==========================================

const getAllPublicTeachers = catchAsync(async (req, res) => {
  const { result, count } = await TeacherServices.getAllPublicTeachersFromDB(req.query);
  sendResponse(res, status.OK, 'Teachers retrieved successfully!', result, count);
});

const getSinglePublicTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherServices.getSinglePublicTeacherFromDB(id as string);
  sendResponse(res, status.OK, 'Teacher retrieved successfully!', result);
});

// ==========================================
// LOGGED-IN TEACHER CONTROLLERS (Self-Management)
// ==========================================

const getTeacherSelfProfile = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TeacherServices.getTeacherSelfProfileFromDB(id as string);
  sendResponse(res, status.OK, 'Profile retrieved successfully!', result);
});

const updateTeacherSelfProfile = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Crucial Security: Strip out roles, passwords, or status changes
  // so a user cannot maliciously elevate their own permissions.
  const { email, password, role, is_verified, serial_number, ...allowedUpdates } = req.body;

  const result = await TeacherServices.updateTeacherSelfProfileInDB(id as string, allowedUpdates);
  sendResponse(res, status.OK, 'Profile updated successfully!', result);
});

// ==========================================
// ADMIN PANEL CONTROLLERS
// ==========================================

const getAllPrivateTeachers = catchAsync(async (req, res) => {
  const { result, count } = await TeacherServices.getAllPrivateTeachersFromDB(req.query);
  sendResponse(res, status.OK, 'Teachers retrieved successfully!', result, count);
});

const getSinglePrivateTeacher = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TeacherServices.getSinglePrivateTeacherFromDB(id as string);
  sendResponse(res, status.OK, 'Teacher retrieved successfully!', result);
});

const updateTeacherByAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Strip out password and email for safety.
  const { password, email, ...allowedUpdates } = req.body;

  const result = await TeacherServices.updateTeacherByAdminInDB(id as string, allowedUpdates);
  sendResponse(res, status.OK, 'Teacher updated successfully by admin!', result);
});

export const TeacherControllers = {
  getAllPublicTeachers,
  getSinglePublicTeacher,
  getAllPrivateTeachers,
  getSinglePrivateTeacher,
  updateTeacherByAdmin,
  getTeacherSelfProfile,
  updateTeacherSelfProfile,
};
