import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { fail } from '../utils/helpers';

/** Must run after requireAuth. Restricts a route to ADMIN-role users. */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return fail(res, 'Please log in to continue.', 401);
  if (req.user.role !== 'ADMIN') return fail(res, 'Admin access required.', 403);
  next();
};
