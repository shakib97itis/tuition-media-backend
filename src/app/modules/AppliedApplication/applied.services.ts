import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import status from 'http-status';
import GlobalQueryBuilder from '../../queryBuilder/GlobalQuaryBuilder';
import { AppliedApplication } from './applied.model';
import { IAppliedApplication } from './applied.interface';

/**
 * Persists a teacher-initiated job application record into the database
 */
const applyForJobByTeacherIntoDB = async (teacherId: string, jobId: string) => {
  // Validate presence of duplicate applications prior to database level errors
  const existingApplication = await AppliedApplication.findOne({
    job: jobId,
    applicant: teacherId,
  });
  
  if (existingApplication) {
    throw new AppError(status.BAD_REQUEST, 'You have already applied for this tuition job.');
  }

  const result = await AppliedApplication.create({
    job: jobId,
    applicant: teacherId,
    source: 'website_application', // Identifies user self-application
    status: 'applied',
  });
  return result;
};

/**
 * Retrieves paginated, filterable applications submitted exclusively by a specific teacher
 */
const getApplicationsForTeacherFromDB = async (
  teacherId: string,
  query: Record<string, unknown>,
) => {
  const applicationQuery = new GlobalQueryBuilder(
    AppliedApplication.find({ applicant: teacherId }),
    query,
  );

  applicationQuery.paginate();
  const result = await applicationQuery.modelQuery.populate('job'); // Pulls relational details from TuitionJob
  const count = await applicationQuery.countTotal();

  return { result, count };
};

/**
 * Compiles real-time dynamic dashboard pipeline metrics for individual teacher overview accounts
 */
const getStatsForTeacherFromDB = async (teacherId: string) => {
  const stats = await AppliedApplication.aggregate([
    {
      $match: { applicant: new mongoose.Types.ObjectId(teacherId) },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Map database aggregation outcomes back cleanly to standardized flat properties
  const formattedStats = { applied: 0, shortlisted: 0, rejected: 0, hired: 0, cancelled: 0 };
  stats.forEach((item) => {
    if (item._id in formattedStats) {
      formattedStats[item._id as keyof typeof formattedStats] = item.count;
    }
  });

  return formattedStats;
};

/**
 * Retrieves applications mapped to a targeted Job ID for administrative matching pipelines
 */
const getApplicationsForAdminFromDB = async (jobId: string, query: Record<string, unknown>) => {
  const applicationQuery = new GlobalQueryBuilder(AppliedApplication.find({ job: jobId }), query);

  applicationQuery.paginate();
  const result = await applicationQuery.modelQuery.populate('applicant');
  const count = await applicationQuery.countTotal();

  return { result, count };
};

/**
 * Injects a specified candidate directly into the job shortlist bypass lane (Admin Sourcing)
 */
const sourceTeacherByAdminIntoDB = async (
  adminId: string,
  payload: Partial<IAppliedApplication>,
) => {
  const { job, applicant } = payload;

  const existingApplication = await AppliedApplication.findOne({ job, applicant });
  if (existingApplication) {
    throw new AppError(
      status.BAD_REQUEST,
      'This teacher is already mapped to this job application.',
    );
  }

  const result = await AppliedApplication.create({
    job,
    applicant,
    source: 'admin_sourced', // Explicit origin classification identifier
    status: 'shortlisted', // Bypasses initial queue directly to shortlisted status
    managed_by: adminId, // Audit log tracing back to the admin who acted
  });
  return result;
};

/**
 * Modifies tracking pipeline field status values on requested records
 */
const updateApplicationStatusByAdminIntoDB = async (
  applicationId: string,
  targetStatus: string,
) => {
  const result = await AppliedApplication.findByIdAndUpdate(
    applicationId,
    { status: targetStatus },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new AppError(status.NOT_FOUND, 'Target job application profile not found.');
  }
  return result;
};

export const AppliedApplicationServices = {
  applyForJobByTeacherIntoDB,
  getApplicationsForTeacherFromDB,
  getStatsForTeacherFromDB,
  getApplicationsForAdminFromDB,
  sourceTeacherByAdminIntoDB,
  updateApplicationStatusByAdminIntoDB,
};
