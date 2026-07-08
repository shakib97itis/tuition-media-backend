import express from 'express';
import { AdminControllers } from './admin.controllers';
import authMiddleware from '../../middleware/authMiddleware';
import { ROLE } from '../../types/role';

const router = express.Router();
// Special route for super Admin.

// Routes for superAdmin and admin.
router.get('/', authMiddleware(ROLE.superAdmin, ROLE.admin), AdminControllers.getAllAdmins);
router.get('/:id', authMiddleware(ROLE.superAdmin, ROLE.admin), AdminControllers.getSingleAdmin);

// ! SuperAdmin should not be able to create another super admin.
// ! Only superAdmin should have the ability to create another admin.
// ! Same goes for other route. update and delete.
router.post('/create', authMiddleware(ROLE.superAdmin), AdminControllers.createAdmin);

router.patch(
  '/update/:id',
  authMiddleware(ROLE.superAdmin, ROLE.admin),
  AdminControllers.updateAdmin,
);

// * - didn't checked this two routes.
router.delete(
  '/delete/:id',
  authMiddleware(ROLE.superAdmin, ROLE.admin),
  AdminControllers.deleteAdmin,
);
router.patch(
  '/restore/:id',
  authMiddleware(ROLE.superAdmin, ROLE.admin),
  AdminControllers.restoreAdmin,
);

export const AdminRoutes = router;
