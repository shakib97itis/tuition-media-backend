import express from 'express';
import { AppliedApplicationControllers } from './applied.controllers';
import authMiddleware from '../../middleware/authMiddleware';
import { ROLE } from '../../types/role';

const router = express.Router();

// ==========================================
//          TEACHER-FACING ROUTES
// ==========================================

// Teacher applies for an open tuition job posting
router.post(
  '/teacher/apply/:teacherId',
  authMiddleware(ROLE.teacher),
  AppliedApplicationControllers.applyForJobByTeacher,
);

// Retrieve all applications submitted by the authenticated teacher
router.get(
  '/teacher/my-applications/:teacherId',
  authMiddleware(ROLE.teacher),
  AppliedApplicationControllers.getApplicationsForTeacher,
);

// Fetch application status count metrics for the teacher's dashboard analytics
router.get(
  '/teacher/my-stats/:teacherId',
  authMiddleware(ROLE.teacher),
  AppliedApplicationControllers.getStatsForTeacher,
);

// ==========================================
//          ADMIN-FACING ROUTES
// ==========================================

// Admin views the list of teachers who applied for a specific job
router.get(
  '/admin/job/:jobId',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  AppliedApplicationControllers.getApplicationsForAdmin,
);

// Admin manually inserts a teacher into a job shortlist (Sourcing)
router.post(
  '/admin/source-teacher/:adminId',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  AppliedApplicationControllers.sourceTeacherByAdmin,
);

// Admin updates the pipeline tracking state of an application
router.patch(
  '/admin/application/:applicationId/status',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  AppliedApplicationControllers.updateApplicationStatusByAdmin,
);

export const AppliedApplicationRoutes = router;
