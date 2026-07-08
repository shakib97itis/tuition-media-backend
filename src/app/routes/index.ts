import express from 'express';
import { TeacherRoutes } from '../modules/Teacher/teacher.router';
import { AuthenticationRoutes } from '../modules/Authentication/auth.router';
import { AdminRoutes } from '../modules/Admin/admin.router';
import { TuitionJobRouter } from '../modules/TuitionJob/tuitionJob.router';
import { AppliedApplicationRoutes } from '../modules/AppliedApplication/applied.router';
import { ImageUploadRoutes } from '../modules/ImageUpload/imageUpload.route';
import { LeadRoutes } from '../modules/Lead/lead.router';
import { TeacherLeadRouter } from '../modules/DirectLeadForTeacher/teacher.lead.router';

const router = express.Router();

const mainRoutes = [
  {
    path: '/auth',
    route: AuthenticationRoutes,
  },
  {
    path: '/teachers',
    route: TeacherRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/tuition-jobs',
    route: TuitionJobRouter,
  },
  {
    path: '/apply-applications',
    route: AppliedApplicationRoutes,
  },
  {
    path: '/media-upload',
    route: ImageUploadRoutes,
  },
  {
    path: '/leads',
    route: LeadRoutes,
  },
  {
    path: '/direct-leads',
    route: TeacherLeadRouter,
  },
];

mainRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
