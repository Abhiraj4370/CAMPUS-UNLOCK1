import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok, fail, paginationParams, makeSlug } from '../utils/helpers';
import { trackEvent } from '../services/analyticsService';

export const listUniversities = async (req: AuthRequest, res: Response) => {
  const { q, type, category, sort } = req.query as Record<string, string>;
  const { page, limit, skip } = paginationParams(req.query as Record<string, unknown>);

  const where: any = { isActive: true };
  if (q) where.OR = [{ name: { contains: q } }, { location: { contains: q } }];
  if (type) where.type = type;
  if (category) where.category = { slug: category };

  const orderMap: Record<string, any> = {
    rating: { rating: 'desc' },
    fees_asc: { avgFees: 'asc' },
    fees_desc: { avgFees: 'desc' },
    name: { name: 'asc' },
  };

  const [items, total] = await Promise.all([
    prisma.university.findMany({
      where,
      orderBy: orderMap[sort] || { rating: 'desc' },
      skip,
      take: limit,
      include: { category: true, _count: { select: { courses: true } } },
    }),
    prisma.university.count({ where }),
  ]);

  return ok(res, { items, total, page, limit, totalPages: Math.ceil(total / limit) });
};

export const featuredUniversities = async (_req: AuthRequest, res: Response) => {
  let items = await prisma.university.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { rating: 'desc' },
    take: 6,
    include: { category: true },
  });

  // SMART FALLBACK: Agar koi bhi university DB mein manually "Featured" nahi hai,
  // toh automatically Top 6 highest rated universities bhej do taaki frontend khali na rahe.
  if (items.length === 0) {
    items = await prisma.university.findMany({
      where: { isActive: true },
      orderBy: { rating: 'desc' },
      take: 6,
      include: { category: true },
    });
  }

  return ok(res, { items });
};

export const getUniversityBySlug = async (req: AuthRequest, res: Response) => {
  const university = await prisma.university.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: true,
      courses: { orderBy: { createdAt: 'desc' } },
      scholarships: { where: { isActive: true } },
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
  if (!university || !university.isActive) return fail(res, 'University not found.', 404);
  trackEvent('university_view', { id: university.id });
  return ok(res, { university });
};

export const compareUniversities = async (req: AuthRequest, res: Response) => {
  const ids = String(req.query.ids || '').split(',').filter(Boolean).slice(0, 4);
  if (!ids.length) return ok(res, { items: [] });
  const items = await prisma.university.findMany({ where: { id: { in: ids }, isActive: true } });
  // preserve requested order
  const ordered = ids.map((id) => items.find((u) => u.id === id)).filter(Boolean);
  return ok(res, { items: ordered });
};

// ---------------- Shortlist (requires auth) ----------------

export const toggleShortlist = async (req: AuthRequest, res: Response) => {
  if (!req.user) return fail(res, 'Please log in to continue.', 401);
  const universityId = req.params.id;

  const existing = await prisma.shortlist.findUnique({
    where: { userId_universityId: { userId: req.user.id, universityId } },
  });

  if (existing) {
    await prisma.shortlist.delete({ where: { id: existing.id } });
    return ok(res, { shortlisted: false });
  }
  await prisma.shortlist.create({ data: { userId: req.user.id, universityId } });
  return ok(res, { shortlisted: true });
};

export const getMyShortlist = async (req: AuthRequest, res: Response) => {
  if (!req.user) return fail(res, 'Please log in to continue.', 401);
  const items = await prisma.shortlist.findMany({
    where: { userId: req.user.id },
    include: { university: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return ok(res, { items: items.map((s) => s.university), ids: items.map((s) => s.universityId) });
};

// ---------------- Admin CRUD ----------------

const UNIVERSITY_FIELDS = [
  'name', 'type', 'location', 'establishedYear', 'logo', 'banner', 'about', 'rating',
  'avgFees', 'accreditation', 'naacGrade', 'totalCourses', 'totalStudents', 'totalFaculty',
  'placementRate', 'ugcEntitled', 'aicteApproved', 'brochureUrl', 'isFeatured', 'isActive', 'categoryId',
] as const;

const pickUniversityFields = (body: Record<string, unknown>) => {
  const data: Record<string, unknown> = {};

  for (const key of UNIVERSITY_FIELDS) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  // FIX: Agar frontend form se 'featured' ya 'active' bheja gaya hai (without 'is'), toh usko map karo
  if (body.featured !== undefined && data.isFeatured === undefined) {
    data.isFeatured = body.featured;
  }
  if (body.active !== undefined && data.isActive === undefined) {
    data.isActive = body.active;
  }

  if (data.establishedYear !== undefined) data.establishedYear = Number(data.establishedYear);
  if (data.rating !== undefined) data.rating = Number(data.rating);
  if (data.avgFees !== undefined) data.avgFees = Number(data.avgFees);
  if (data.totalCourses !== undefined) data.totalCourses = Number(data.totalCourses);
  if (data.totalStudents !== undefined) data.totalStudents = Number(data.totalStudents);
  if (data.totalFaculty !== undefined) data.totalFaculty = Number(data.totalFaculty);

  // Force Boolean safety so Prisma doesn't crash
  if (data.isFeatured !== undefined) data.isFeatured = data.isFeatured === true || data.isFeatured === 'true';
  if (data.isActive !== undefined) data.isActive = data.isActive === true || data.isActive === 'true';

  return data;
};

export const createUniversity = async (req: AuthRequest, res: Response) => {
  const data = pickUniversityFields(req.body);
  const slug = makeSlug(String(data.name || ''));
  const university = await prisma.university.create({ data: { ...data, name: String(data.name), slug } as any });
  return ok(res, { university }, 201);
};

export const updateUniversity = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = pickUniversityFields(req.body);
  const university = await prisma.university.update({ where: { id }, data: data as any });
  return ok(res, { university });
};

export const deleteUniversity = async (req: AuthRequest, res: Response) => {
  await prisma.university.delete({ where: { id: req.params.id } });
  return ok(res, { message: 'University deleted.' });
};

// ---------------- Categories ----------------

export const listCategories = async (_req: AuthRequest, res: Response) => {
  const items = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return ok(res, { items });
};