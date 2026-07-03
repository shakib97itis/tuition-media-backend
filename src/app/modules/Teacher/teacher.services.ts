import GlobalQueryBuilder from '../../queryBuilder/GlobalQuaryBuilder';
import { ITeacher } from './teacher.interface';
import { Teacher } from './teacher.model';

// ==========================================
// PUBLIC SERVICES
// ==========================================

const getAllPublicTeachersFromDB = async (query: Record<string, unknown>) => {
  const teacherQuery = new GlobalQueryBuilder(Teacher.find(), query).filter().paginate();

  const result = await teacherQuery?.modelQuery.select('-password -phone -additional_phone -email');
  const count = await teacherQuery?.countTotal();
  return { result, count };
};

const getSinglePublicTeacherFromDB = async (id: string) => {
  const result = await Teacher.findById(id).select('-password -phone -additional_phone -email');
  return result;
};

// ==========================================
// LOGGED-IN TEACHER SERVICES (Self-Management)
// ==========================================

const getTeacherSelfProfileFromDB = async (id: string) => {
  const result = await Teacher.findById(id);
  return result;
};

const updateTeacherSelfProfileInDB = async (id: string, payload: Partial<ITeacher>) => {
  const result = await Teacher.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// ==========================================
// ADMIN PANEL SERVICES
// ==========================================

const getAllPrivateTeachersFromDB = async (query: Record<string, unknown>) => {
  const teacherQuery = new GlobalQueryBuilder(Teacher.find(), query)
    .search(['email', 'first_name', 'last_name', 'phone'])
    .filter()
    .paginate();

  const result = await teacherQuery?.modelQuery;
  const count = await teacherQuery?.countTotal();
  return { result, count };
};

const getSinglePrivateTeacherFromDB = async (id: string) => {
  const result = await Teacher.findById(id);
  return result;
};

const updateTeacherByAdminInDB = async (id: string, payload: Partial<ITeacher>) => {
  const result = await Teacher.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const TeacherServices = {
  getAllPublicTeachersFromDB,
  getSinglePublicTeacherFromDB,
  getAllPrivateTeachersFromDB,
  getSinglePrivateTeacherFromDB,
  updateTeacherByAdminInDB,
  getTeacherSelfProfileFromDB,
  updateTeacherSelfProfileInDB,
};
