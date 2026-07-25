import { Router } from 'express';
import * as c from '../controllers/courseController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', c.listCourses);
router.get('/trending', c.trendingCourses);
router.get('/:slug', c.getCourseBySlug);

router.post('/', requireAuth, requireAdmin, c.createCourse);
router.put('/:id', requireAuth, requireAdmin, c.updateCourse);
router.delete('/:id', requireAuth, requireAdmin, c.deleteCourse);

export default router;
