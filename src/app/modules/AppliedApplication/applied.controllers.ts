import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AppliedApplicationServices } from './applied.services';

// Teacher-driven: Submit a job application
const applyForJobByTeacher = catchAsync(async (req, res) => {
  const { teacherId, jobId } = req.body;

  const result = await AppliedApplicationServices.applyForJobByTeacherIntoDB(teacherId, jobId);
  sendResponse(res, status.CREATED, 'Applied for job successfully', result);
});

// Teacher-driven: Fetch personal application list history
const getApplicationsForTeacher = catchAsync(async (req, res) => {
  const teacherId = req.params.teacherId as string;
  const { result, count } = await AppliedApplicationServices.getApplicationsForTeacherFromDB(
    teacherId,
    req.query,
  );

  sendResponse(res, status.OK, 'Your applications retrieved successfully', result, count);
});

// Teacher-driven: Get counts of applied, shortlisted, or selected items
const getStatsForTeacher = catchAsync(async (req, res) => {
  const teacherId = req.params.teacherId as string;
  const result = await AppliedApplicationServices.getStatsForTeacherFromDB(teacherId);

  sendResponse(res, status.OK, 'Application statistics retrieved successfully', result);
});

// Admin-driven: Pull candidates associated with a job assignment workflow
const getApplicationsForAdmin = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const { result, count } = await AppliedApplicationServices.getApplicationsForAdminFromDB(
    jobId as string,
    req.query,
  );

  sendResponse(res, status.OK, 'Job applicants record retrieved successfully', result, count);
});

// Admin-driven: Create an authenticated sourcing placement entry manually
const sourceTeacherByAdmin = catchAsync(async (req, res) => {
  const { adminId, ...payload } = req.body;

  const result = await AppliedApplicationServices.sourceTeacherByAdminIntoDB(adminId, payload);

  sendResponse(res, status.CREATED, 'Teacher sourced and shortlisted successfully', result);
});

// Admin-driven: Update pipeline funnel execution tracking metrics
const updateApplicationStatusByAdmin = catchAsync(async (req, res) => {
  const { applicationId } = req.params;
  const { status: targetStatus } = req.body;

  const result = await AppliedApplicationServices.updateApplicationStatusByAdminIntoDB(
    applicationId as string,
    targetStatus,
  );
  sendResponse(res, status.OK, `Application status updated to ${targetStatus}`, result);
});

export const AppliedApplicationControllers = {
  applyForJobByTeacher,
  getApplicationsForTeacher,
  getStatsForTeacher,
  getApplicationsForAdmin,
  sourceTeacherByAdmin,
  updateApplicationStatusByAdmin,
};
