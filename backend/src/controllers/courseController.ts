import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok, fail, paginationParams, makeSlug } from '../utils/helpers';
import { trackEvent } from '../services/analyticsService';

export const listCourses = async (req: AuthRequest, res: Response) => {
  const { q, level, university } = req.query as Record<string, string>;
  const { page, limit, skip } = paginationParams(req.query as Record<string, unknown>);

  const where: any = { university: { isActive: true } };
  if (q) where.title = { contains: q };
  if (level) where.level = level;
  if (university) where.universityId = university;

  const [items, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: { university: { select: { name: true, slug: true, logo: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return ok(res, { items, total, page, limit, totalPages: Math.ceil(total / limit) });
};

export const trendingCourses = async (_req: AuthRequest, res: Response) => {
  const items = await prisma.course.findMany({
    where: { university: { isActive: true } },
    include: { university: { select: { name: true, slug: true } } },
    orderBy: { rating: 'desc' },
    take: 8,
  });
  return ok(res, { items });
};

export const getCourseBySlug = async (req: AuthRequest, res: Response) => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.slug },
    include: { university: true },
  });
  if (!course) return fail(res, 'Course not found.', 404);
  trackEvent('course_view', { id: course.id });
  return ok(res, { course });
};

// ---------------- Admin CRUD ----------------

const COURSE_FIELDS = ['title', 'universityId', 'duration', 'fee', 'rating', 'tag', 'level'] as const;
const pickCourseFields = (body: Record<string, unknown>) => {
  const data: Record<string, unknown> = {};
  for (const key of COURSE_FIELDS) if (body[key] !== undefined) data[key] = body[key];
  if (data.fee !== undefined) data.fee = Number(data.fee);
  if (data.rating !== undefined) data.rating = Number(data.rating);
  return data;
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  const data = pickCourseFields(req.body);
  const slug = `${makeSlug(String(data.title || ''))}-${Date.now().toString(36)}`;
  const course = await prisma.course.create({ data: { ...data, title: String(data.title), slug } as any });
  return ok(res, { course }, 201);
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = pickCourseFields(req.body);
  const course = await prisma.course.update({ where: { id }, data: data as any });
  return ok(res, { course });
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  await prisma.course.delete({ where: { id: req.params.id } });
  return ok(res, { message: 'Course deleted.' });
};
