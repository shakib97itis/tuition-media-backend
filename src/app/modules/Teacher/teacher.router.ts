import express from 'express';
import { TeacherControllers } from './teacher.controllers';
import authMiddleware from '../../middleware/authMiddleware';
import { ROLE } from '../../types/role';

const router = express.Router();

// * Publicly available Routes
router.get('/public', TeacherControllers.getAllPublicTeachers);
router.get('/public/profile/:id', TeacherControllers.getSinglePublicTeacher);

// * Private admin panel Routes
router.get(
  '/admin/private',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleMarketing, ROLE.teleSales),
  TeacherControllers.getAllPrivateTeachers,
);

// * Logged in teacher Routes
router.get(
  '/own/profile/:id',
  authMiddleware(ROLE.teacher),
  TeacherControllers.getSinglePrivateTeacher,
);
router.patch('/profile/update/:id', authMiddleware(ROLE.teacher), TeacherControllers.updateTeacher);

export const TeacherRoutes = router;
