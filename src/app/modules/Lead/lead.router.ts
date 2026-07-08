import express from 'express';
import { LeadControllers } from './lead.controllers';
import authMiddleware from '../../middleware/authMiddleware';
import { ROLE } from '../../types/role';

const router = express.Router();

// Public routes.
router.post('/create', LeadControllers.createLead);

// Private admin routes
router.get(
  '/all',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.superAdmin, ROLE.teleMarketing),
  LeadControllers.getAllLeads,
);

router.get(
  '/new',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleMarketing),
  LeadControllers.getNewLeads,
);

router.get(
  '/assigned',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  LeadControllers.getAssignedLeads,
);

router.get(
  '/assigned/own/:id',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  LeadControllers.getAssignedOwnLeads,
);

router.patch(
  '/assigned/:id',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  LeadControllers.makeLeadAsAssigned,
);

router.patch(
  '/update/:id',
  authMiddleware(ROLE.admin, ROLE.superAdmin, ROLE.teleSales),
  LeadControllers.updateLead,
);

export const LeadRoutes = router;
