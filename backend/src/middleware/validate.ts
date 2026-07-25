import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { fail } from '../utils/helpers';

/** Runs after an express-validator chain; short-circuits with a 422 on failure. */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    return fail(res, first.msg || 'Invalid input.', 422);
  }
  next();
};
