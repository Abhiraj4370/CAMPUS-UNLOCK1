import { Router } from 'express';
import * as c from '../controllers/blogController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get('/', c.listBlogs);
router.get('/:slug', c.getBlogBySlug);

router.post('/', requireAuth, requireAdmin, c.createBlog);
router.put('/:id', requireAuth, requireAdmin, c.updateBlog);
router.delete('/:id', requireAuth, requireAdmin, c.deleteBlog);

export default router;
