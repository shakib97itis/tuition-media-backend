import express from 'express';
import { TuitionJobControllers } from './tuitionJob.controllers';
import { ROLE } from '../../types/role';
import authMiddleware from '../../middleware/authMiddleware';

const router = express.Router();

// ==========================================
//         PRIVATE ROUTES (ADMIN)
// ==========================================

// Create a new tuition job entry
router.post(
  '/admin/create',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  TuitionJobControllers.createTuitionJobFromAdmin,
);

// Get all tuition jobs with comprehensive filters, search, and full operational data
router.get(
  '/admin',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  TuitionJobControllers.getAllTuitionJobsForAdmin,
);

// Get all confirmed/running tuition jobs for administrative logging
router.get(
  '/admin/running',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  TuitionJobControllers.getAllRunningJobsForAdmin,
);

// Get complete details of a single tuition job (including sensitive metadata and contact info)
router.get(
  '/admin/:id',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  TuitionJobControllers.getTuitionJobByIdForAdmin,
);

// Update tuition job lifecycle states or configurations
router.patch(
  '/admin/update/:id',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  TuitionJobControllers.updateTuitionJobByIdFromAdmin,
);

// ==========================================
//         PUBLIC ROUTES (TEACHER)
// ==========================================

// Get all available tuition jobs (Sanitized and restricted by active states)
router.get('/', TuitionJobControllers.getAllTuitionJobsForTeacher);

// Get public profile details of a single tuition job by ID
router.get('/:id', TuitionJobControllers.getTuitionJobByIdForTeacher);

export const TuitionJobRouter = router;
