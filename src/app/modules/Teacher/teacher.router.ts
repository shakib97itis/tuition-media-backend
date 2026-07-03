import express from 'express';
import authMiddleware from '../../middleware/authMiddleware';
import { ROLE } from '../../types/role';
import { TeacherControllers } from './teacher.controllers';

const router = express.Router();

const STAFF_ROLES = [ROLE.admin, ROLE.superAdmin, ROLE.teleMarketing, ROLE.teleSales];

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/public', TeacherControllers.getAllPublicTeachers);
router.get('/public/:id', TeacherControllers.getSinglePublicTeacher);

// ==========================================
// LOGGED-IN TEACHER ROUTES (Self-Management)
// ==========================================
router.get('/profile/:id', authMiddleware(ROLE.teacher), TeacherControllers.getTeacherSelfProfile);
router.patch(
  '/profile/:id',
  authMiddleware(ROLE.teacher),
  TeacherControllers.updateTeacherSelfProfile,
);

// ==========================================
// ADMIN PANEL ROUTES
// ==========================================
router.get('/', authMiddleware(...STAFF_ROLES), TeacherControllers.getAllPrivateTeachers);
router.get('/:id', authMiddleware(...STAFF_ROLES), TeacherControllers.getSinglePrivateTeacher);
router.patch('/:id', authMiddleware(...STAFF_ROLES), TeacherControllers.updateTeacherByAdmin);

export const TeacherRoutes = router;
