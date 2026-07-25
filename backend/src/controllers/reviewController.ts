import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok, fail } from '../utils/helpers';

export const createReview = async (req: AuthRequest, res: Response) => {
  if (!req.user) return fail(res, 'Please log in to leave a review.', 401);
  const { universityId, rating, comment, courseName } = req.body;

  const review = await prisma.review.create({
    data: { userId: req.user.id, universityId, rating: Number(rating), comment, courseName },
  });

  const agg = await prisma.review.aggregate({ where: { universityId }, _avg: { rating: true }, _count: true });
  await prisma.university.update({
    where: { id: universityId },
    data: { rating: agg._avg.rating || 4.5, totalReviews: agg._count },
  });

  return ok(res, { review }, 201);
};

export const listReviewsForModeration = async (_req: AuthRequest, res: Response) => {
  const items = await prisma.review.findMany({
    include: { user: { select: { name: true } }, university: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return ok(res, { items });
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  await prisma.review.delete({ where: { id: req.params.id } });
  return ok(res, { message: 'Review removed.' });
};
