import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  authController.login
);

router.post(
  '/admin-login',
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  authController.adminLogin
);

router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);
router.put('/profile', requireAuth, authController.updateProfile);
router.get('/applications', requireAuth, authController.myApplications);
router.get('/saved-searches', requireAuth, authController.mySavedSearches);

export default router;
