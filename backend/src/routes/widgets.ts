import { Router } from 'express';
import * as c from '../controllers/widgetController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', c.listWidgets);
router.get('/all', requireAuth, requireAdmin, c.listAllWidgets);
router.post('/', requireAuth, requireAdmin, c.createWidget);
router.put('/:id', requireAuth, requireAdmin, c.updateWidget);
router.delete('/:id', requireAuth, requireAdmin, c.deleteWidget);

export default router;
