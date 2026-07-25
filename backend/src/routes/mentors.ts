import { Router } from 'express';
import * as c from '../controllers/mentorController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', c.listMentors);
router.get('/:id', c.getMentor);

router.post('/', requireAuth, requireAdmin, c.createMentor);
router.put('/:id', requireAuth, requireAdmin, c.updateMentor);
router.delete('/:id', requireAuth, requireAdmin, c.deleteMentor);

export default router;
