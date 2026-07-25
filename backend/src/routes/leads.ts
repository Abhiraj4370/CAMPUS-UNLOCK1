import { Router } from 'express';
import { body } from 'express-validator';
import * as c from '../controllers/leadController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  optionalAuth,
  [body('name').trim().notEmpty(), body('email').isEmail()],
  validate,
  c.createLead
);

router.get('/', requireAuth, requireAdmin, c.listLeads);
router.put('/:id/status', requireAuth, requireAdmin, c.updateLeadStatus);

export default router;
