import { Request, Response, NextFunction } from 'express';
import { verifyToken, AUTH_COOKIE_NAME, fail } from '../utils/helpers';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  user?: { id: string; role: 'STUDENT' | 'ADMIN'; name: string; email: string };
}

/** Reads the JWT from the httpOnly cookie or an Authorization: Bearer header. */
const extractToken = (req: Request): string | null => {
  if (req.cookies?.[AUTH_COOKIE_NAME]) return req.cookies[AUTH_COOKIE_NAME];
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) return fail(res, 'Please log in to continue.', 401);

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return fail(res, 'Account no longer exists.', 401);

    req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
    next();
  } catch {
    return fail(res, 'Invalid or expired session. Please log in again.', 401);
  }
};

/** Like requireAuth, but doesn't fail if there's no token — used for guest-friendly routes. */
export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) return next();
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (user) req.user = { id: user.id, role: user.role, name: user.name, email: user.email };
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};
