import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TuitionJobServices } from './tuitionJob.services';

// ==========================================
//        PRIVATE CONTROLLERS (ADMIN)
// ==========================================

// Handles creation request processing for administrative users
const createTuitionJobFromAdmin = catchAsync(async (req, res) => {
  const result = await TuitionJobServices.createTuitionJobFromAdminIntoDB(req.body);
  sendResponse(res, status.CREATED, 'Tuition job created successfully', result);
});

// Handles structural dashboard listings for internal admin workflows
const getAllTuitionJobsForAdmin = catchAsync(async (req, res) => {
  const { result, count } = await TuitionJobServices.getAllTuitionJobsForAdminFromDB(req.query);
  sendResponse(res, status.OK, 'Admin tuition jobs retrieved successfully', result, count);
});

// Handles delivery of closed execution contracts under active tracking state
const getAllRunningJobsForAdmin = catchAsync(async (req, res) => {
  const { result, count } = await TuitionJobServices.getAllRunningJobsForAdminFromDB(req.query);
  sendResponse(res, status.OK, 'Running tuition jobs retrieved successfully', result, count);
});

// Handles explicit metadata lookup queries for internal admin modifications
const getTuitionJobByIdForAdmin = catchAsync(async (req, res) => {
  const result = await TuitionJobServices.getTuitionJobByIdForAdminFromDB(req.params.id as string);
  sendResponse(res, status.OK, 'Complete internal tuition job data retrieved successfully', result);
});

// Handles patching update actions over valid target tuition job records
const updateTuitionJobByIdFromAdmin = catchAsync(async (req, res) => {
  const result = await TuitionJobServices.updateTuitionJobFromAdminIntoDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, status.OK, 'Tuition job updated successfully', result);
});

// ==========================================
//        PUBLIC CONTROLLERS (TEACHER)
// ==========================================

// Handles delivery of public feed records optimized for teacher review
const getAllTuitionJobsForTeacher = catchAsync(async (req, res) => {
  const { result, count } = await TuitionJobServices.getAllTuitionJobsForTeacherFromDB(req.query);
  sendResponse(res, status.OK, 'Public tuition jobs retrieved successfully', result, count);
});

// Handles matching single query delivery for public teacher profile interactions
const getTuitionJobByIdForTeacher = catchAsync(async (req, res) => {
  const result = await TuitionJobServices.getTuitionJobByIdForTeacherFromDB(
    req.params.id as string,
  );
  sendResponse(res, status.OK, 'Tuition job public profile retrieved successfully', result);
});

export const TuitionJobControllers = {
  createTuitionJobFromAdmin,
  getAllTuitionJobsForAdmin,
  getTuitionJobByIdForAdmin,
  getAllRunningJobsForAdmin,
  updateTuitionJobByIdFromAdmin,
  getAllTuitionJobsForTeacher,
  getTuitionJobByIdForTeacher,
};
