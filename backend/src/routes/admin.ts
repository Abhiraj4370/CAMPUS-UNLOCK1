import { Router } from 'express';
import * as c from '../controllers/adminController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

// Every route in this file is admin-only.
router.use(requireAuth, requireAdmin);

router.get('/stats', c.dashboardStats);
router.get('/chart-data', c.chartData);
router.get('/users', c.listUsers);
router.get('/settings', c.getSettings);
router.put('/settings', c.updateSettings);

export default router;
