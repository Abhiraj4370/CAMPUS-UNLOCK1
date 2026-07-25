import { Router, Request, Response } from 'express';
import { prisma } from '../config/database';
import { ok } from '../utils/helpers';
import { trackEvent } from '../services/analyticsService';

const router = Router();

/** Global search across universities, courses and blog posts — powers the header search bar. */
router.get('/', async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  if (!q) return ok(res, { universities: [], courses: [], blogs: [] });

  trackEvent('search', { q });

  const [universities, courses, blogs] = await Promise.all([
    prisma.university.findMany({ where: { isActive: true, name: { contains: q } }, take: 5 }),
    prisma.course.findMany({ where: { title: { contains: q } }, include: { university: { select: { name: true, slug: true } } }, take: 5 }),
    prisma.blog.findMany({ where: { isPublished: true, title: { contains: q } }, take: 5 }),
  ]);

  return ok(res, { universities, courses, blogs });
});

export default router;
