import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok, fail, paginationParams, makeSlug } from '../utils/helpers';

export const listBlogs = async (req: AuthRequest, res: Response) => {
  const { category } = req.query as Record<string, string>;
  const { page, limit, skip } = paginationParams(req.query as Record<string, unknown>);
  const where: any = { isPublished: true };
  if (category) where.category = category;

  const [items, total] = await Promise.all([
    prisma.blog.findMany({ where, orderBy: { publishedAt: 'desc' }, skip, take: limit }),
    prisma.blog.count({ where }),
  ]);
  return ok(res, { items, total, page, limit, totalPages: Math.ceil(total / limit) });
};

export const getBlogBySlug = async (req: AuthRequest, res: Response) => {
  const post = await prisma.blog.findUnique({
    where: { slug: req.params.slug },
    include: { author: { select: { name: true } } },
  });
  if (!post || !post.isPublished) return fail(res, 'Post not found.', 404);
  return ok(res, { post });
};

// ---------------- Admin CRUD ----------------

const BLOG_FIELDS = ['title', 'category', 'excerpt', 'body', 'cover', 'isPublished'] as const;
const pickBlogFields = (body: Record<string, unknown>) => {
  const data: Record<string, unknown> = {};
  for (const key of BLOG_FIELDS) if (body[key] !== undefined) data[key] = body[key];
  return data;
};

export const createBlog = async (req: AuthRequest, res: Response) => {
  const data = pickBlogFields(req.body);
  const slug = `${makeSlug(String(data.title || ''))}-${Date.now().toString(36)}`;
  const post = await prisma.blog.create({
    data: { ...data, title: String(data.title || ''), excerpt: String(data.excerpt || ''), body: String(data.body || ''), slug, authorId: (req as AuthRequest).user?.id } as any,
  });
  return ok(res, { post }, 201);
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  const post = await prisma.blog.update({ where: { id: req.params.id }, data: pickBlogFields(req.body) as any });
  return ok(res, { post });
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  await prisma.blog.delete({ where: { id: req.params.id } });
  return ok(res, { message: 'Post deleted.' });
};
