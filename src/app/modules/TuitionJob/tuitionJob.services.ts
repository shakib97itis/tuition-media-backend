import GlobalQueryBuilder from '../../queryBuilder/GlobalQueryBuilder';
import { ITuitionJob } from './tuitionJob.interface';
import { TuitionJob } from './tuitionJob.model';

/**
 * Helper utility to map incoming flat query parameters to nested schema object paths.
 * Prevents GlobalQueryBuilder.filter() from failing on nested sub-documents.
 */

const transformQueryKeys = (query: Record<string, unknown>): Record<string, unknown> => {
  const transformed: Record<string, unknown> = {};

  Object.keys(query).forEach((key) => {
    if (['category', 'course', 'subjects'].includes(key)) {
      transformed[`student_education.${key}`] = query[key];
    } else if (['country', 'city', 'area'].includes(key)) {
      transformed[`location.${key}`] = query[key];
    } else {
      transformed[key] = query[key];
    }
  });

  return transformed;
};

// ==========================================
//             PRIVATE SERVICES (ADMIN)
// ==========================================

/**
 * Persists a new tuition job into the database
 * @param payload Structural tuition job model payload
 */
const createTuitionJobFromAdminIntoDB = async (payload: ITuitionJob) => {
  const result = await TuitionJob.create(payload);
  return result;
};

/**
 * Fetches all tuition jobs with complete internal details for administrators.
 * Supports cross-nested sub-document filtering and high-level structural search metrics.
 * @param query Express request query object
 */
const getAllTuitionJobsForAdminFromDB = async (query: Record<string, unknown>) => {
  const processedQuery = transformQueryKeys(query);

  const jobQuery = new GlobalQueryBuilder(TuitionJob.find(), processedQuery);

  // Search through title text strings, unique auto-generated serial fields, and customer contacts
  jobQuery.search(['title', 'serial_number', 'contact']);
  jobQuery.filter();
  jobQuery.fields();
  jobQuery.paginate();

  const result = await jobQuery.modelQuery;
  const count = await jobQuery.countTotal();

  return { result, count };
};

/**
 * Retrieves full comprehensive information of a tuition job for admin users
 * @param id Document ObjectId string
 */
const getTuitionJobByIdForAdminFromDB = async (id: string) => {
  const result = await TuitionJob.findById(id)
    .populate('lead_from')
    .populate('posted_by')
    .populate('assigned_admin')
    .populate('assigned_tutor');
  return result;
};

/**
 * Fetches ongoing jobs filtered by confirmed execution states for internal operational tracking
 * @param query Express request query object
 */
const getAllRunningJobsForAdminFromDB = async (query: Record<string, unknown>) => {
  const processedQuery = transformQueryKeys(query);

  const jobQuery = new GlobalQueryBuilder(TuitionJob.find({ status: 'confirmed' }), processedQuery);
  jobQuery.search(['title', 'serial_number', 'contact']);
  jobQuery.filter();
  jobQuery.fields();
  jobQuery.paginate();

  const result = await jobQuery.modelQuery;
  const count = await jobQuery.countTotal();

  return { result, count };
};

/**
 * Modifies an existing tuition job profile configuration
 * @param id Document ObjectId string
 * @param payload Change set properties mapping to schema model definitions
 */
const updateTuitionJobFromAdminIntoDB = async (id: string, payload: Partial<ITuitionJob>) => {
  const result = await TuitionJob.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// ==========================================
//             PUBLIC SERVICES (TEACHER)
// ==========================================

/**
 * Fetches filtered public tuition jobs for teachers.
 * Restricts data strictly to public visibility states and strips sensitive internal info.
 * @param query Express request query object
 */
const getAllTuitionJobsForTeacherFromDB = async (query: Record<string, unknown>) => {
  const processedQuery = transformQueryKeys(query);

  // Enforce visible public lifecycle status conditions
  const baseQuery = TuitionJob.find({
    status: { $in: ['open', 'assigned', 'demo', 'follow-up'] },
  });

  const jobQuery = new GlobalQueryBuilder(baseQuery, processedQuery);
  jobQuery.search(['title', 'serial_number']);
  jobQuery.filter();
  jobQuery.fields();
  jobQuery.paginate();

  // Exclude private administrative properties and direct contact details
  const result = await jobQuery.modelQuery.select(
    '-lead_from -posted_by -assigned_admin -assigned_tutor -conversion_note -contact -additional_contact',
  );
  const count = await jobQuery.countTotal();

  return { result, count };
};

/**
 * Retrieves a single public tuition job with scrubbed private records
 * @param id Document ObjectId string
 */
const getTuitionJobByIdForTeacherFromDB = async (id: string) => {
  const result = await TuitionJob.findOne({
    _id: id,
    status: { $in: ['open', 'assigned', 'demo', 'follow-up'] },
  }).select(
    '-lead_from -posted_by -assigned_admin -assigned_tutor -conversion_note -contact -additional_contact',
  );
  return result;
};

export const TuitionJobServices = {
  createTuitionJobFromAdminIntoDB,
  getAllTuitionJobsForAdminFromDB,
  getAllRunningJobsForAdminFromDB,
  getTuitionJobByIdForAdminFromDB,
  updateTuitionJobFromAdminIntoDB,
  getAllTuitionJobsForTeacherFromDB,
  getTuitionJobByIdForTeacherFromDB,
};
