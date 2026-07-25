import { Router } from 'express';
import { body } from 'express-validator';
import * as c from '../controllers/reviewController';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/',
  requireAuth,
  [body('universityId').notEmpty(), body('rating').isInt({ min: 1, max: 5 }), body('comment').trim().notEmpty()],
  validate,
  c.createReview
);

router.get('/moderation/all', requireAuth, requireAdmin, c.listReviewsForModeration);
router.delete('/:id', requireAuth, requireAdmin, c.deleteReview);

export default router;
