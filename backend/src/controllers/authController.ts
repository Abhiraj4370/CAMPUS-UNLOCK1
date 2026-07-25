import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import {
  hashPassword, comparePassword, signToken, setAuthCookie, clearAuthCookie, ok, fail,
} from '../utils/helpers';
import { PUBLIC_USER_FIELDS } from '../models/User';
import { trackEvent } from '../services/analyticsService';
import { sendWelcomeEmail } from '../services/emailService';

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password, phone, interestArea } = req.body;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return fail(res, 'An account with this email already exists.', 409);

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), password: passwordHash, phone, interestArea },
    select: PUBLIC_USER_FIELDS,
  });

  trackEvent('signup');
  sendWelcomeEmail(user.name, user.email).catch(() => {});

  const token = signToken({ userId: user.id, role: user.role as 'STUDENT' | 'ADMIN' });
  setAuthCookie(res, token);
  return ok(res, { user, token }, 201);
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return fail(res, 'Invalid email or password.', 401);

  const valid = await comparePassword(password, user.password);
  if (!valid) return fail(res, 'Invalid email or password.', 401);

  const token = signToken({ userId: user.id, role: user.role });
  setAuthCookie(res, token);

  const { password: _pw, ...publicUser } = user;
  return ok(res, { user: publicUser, token });
};

export const adminLogin = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.role !== 'ADMIN') return fail(res, 'Invalid admin credentials.', 401);

  const valid = await comparePassword(password, user.password);
  if (!valid) return fail(res, 'Invalid admin credentials.', 401);

  const token = signToken({ userId: user.id, role: user.role });
  setAuthCookie(res, token);

  const { password: _pw, ...publicUser } = user;
  return ok(res, { user: publicUser, token });
};

export const logout = async (_req: AuthRequest, res: Response) => {
  clearAuthCookie(res);
  return ok(res, { message: 'Logged out.' });
};

export const me = async (req: AuthRequest, res: Response) => {
  if (!req.user) return fail(res, 'Not authenticated.', 401);
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: PUBLIC_USER_FIELDS });
  return ok(res, { user });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) return fail(res, 'Not authenticated.', 401);
  const { name, phone, city, bio, interestArea, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, phone, city, bio, interestArea, avatar },
    select: PUBLIC_USER_FIELDS,
  });
  return ok(res, { user });
};

export const myApplications = async (req: AuthRequest, res: Response) => {
  if (!req.user) return fail(res, 'Not authenticated.', 401);
  const items = await prisma.application.findMany({
    where: { userId: req.user.id },
    include: { university: true, course: true },
    orderBy: { appliedAt: 'desc' },
  });
  return ok(res, { items });
};

export const mySavedSearches = async (req: AuthRequest, res: Response) => {
  if (!req.user) return fail(res, 'Not authenticated.', 401);
  const items = await prisma.savedSearch.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
  return ok(res, { items });
};
