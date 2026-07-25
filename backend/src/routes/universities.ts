import { Router } from 'express';
import * as c from '../controllers/universityController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', c.listUniversities);
router.get('/featured', c.featuredUniversities);
router.get('/compare', c.compareUniversities);
router.get('/categories/all', c.listCategories);
router.get('/me/shortlist', requireAuth, c.getMyShortlist);
router.post('/:id/shortlist', requireAuth, c.toggleShortlist);
router.get('/:slug', c.getUniversityBySlug);

// Admin-only management (mounted again under /api/admin/universities — see routes/admin.ts)
router.post('/', requireAuth, requireAdmin, c.createUniversity);
router.put('/:id', requireAuth, requireAdmin, c.updateUniversity);
router.delete('/:id', requireAuth, requireAdmin, c.deleteUniversity);

export default router;
