import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

// ---------------- Passwords ----------------
export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

// ---------------- JWT ----------------
export interface JwtPayload {
  userId: string;
  role: 'STUDENT' | 'ADMIN';
}

export const signToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as JwtPayload;
};

const COOKIE_NAME = 'campus_unlock_token';
export const AUTH_COOKIE_NAME = COOKIE_NAME;

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME);
};

// ---------------- API response helpers ----------------
export class ApiError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const ok = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

export const fail = (res: Response, message: string, status = 400) =>
  res.status(status).json({ success: false, message });

// ---------------- Pagination ----------------
export const paginationParams = (query: Record<string, unknown>) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// ---------------- Slugs ----------------
import slugify from 'slugify';
export const makeSlug = (text: string) => slugify(text, { lower: true, strict: true });
