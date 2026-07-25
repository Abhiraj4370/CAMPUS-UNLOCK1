import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok, fail } from '../utils/helpers';

/** Public: only active widgets, in display order — used to render "Why Choose X" etc. */
export const listWidgets = async (req: AuthRequest, res: Response) => {
  const { type } = req.query as Record<string, string>;
  const where: any = { isActive: true };
  if (type) where.widgetType = type;
  const items = await prisma.widget.findMany({ where, orderBy: { position: 'asc' } });
  return ok(res, { items });
};

/** Admin: every widget, active or not, for the management table. */
export const listAllWidgets = async (_req: AuthRequest, res: Response) => {
  const items = await prisma.widget.findMany({ orderBy: { position: 'asc' } });
  return ok(res, { items });
};

const WIDGET_FIELDS = ['widgetType', 'icon', 'title', 'description', 'isActive', 'position'] as const;
const pickWidgetFields = (body: Record<string, unknown>) => {
  const data: Record<string, unknown> = {};
  for (const key of WIDGET_FIELDS) if (body[key] !== undefined) data[key] = body[key];
  if (data.position !== undefined) data.position = Number(data.position);
  return data;
};

export const createWidget = async (req: AuthRequest, res: Response) => {
  const data = pickWidgetFields(req.body);
  if (!data.title) return fail(res, 'Title is required.', 422);
  const widget = await prisma.widget.create({ data: { ...data, title: String(data.title) } as any });
  return ok(res, { widget }, 201);
};

export const updateWidget = async (req: AuthRequest, res: Response) => {
  const widget = await prisma.widget.update({ where: { id: req.params.id }, data: pickWidgetFields(req.body) as any });
  return ok(res, { widget });
};

export const deleteWidget = async (req: AuthRequest, res: Response) => {
  await prisma.widget.delete({ where: { id: req.params.id } });
  return ok(res, { message: 'Widget removed.' });
};
