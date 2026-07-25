import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok, fail } from '../utils/helpers';

export const listMentors = async (_req: AuthRequest, res: Response) => {
  const items = await prisma.mentor.findMany({ where: { isActive: true }, orderBy: { studentsHelped: 'desc' } });
  return ok(res, { items });
};

export const getMentor = async (req: AuthRequest, res: Response) => {
  const mentor = await prisma.mentor.findUnique({ where: { id: req.params.id } });
  if (!mentor) return fail(res, 'Mentor not found.', 404);
  return ok(res, { mentor });
};

// ---------------- Admin CRUD ----------------

const MENTOR_FIELDS = ['name', 'designation', 'specialty', 'bio', 'photo', 'experienceYears', 'studentsHelped', 'isActive'] as const;
const pickMentorFields = (body: Record<string, unknown>) => {
  const data: Record<string, unknown> = {};
  for (const key of MENTOR_FIELDS) if (body[key] !== undefined) data[key] = body[key];
  if (data.experienceYears !== undefined) data.experienceYears = Number(data.experienceYears);
  if (data.studentsHelped !== undefined) data.studentsHelped = Number(data.studentsHelped);
  return data;
};

export const createMentor = async (req: AuthRequest, res: Response) => {
  const data = pickMentorFields(req.body);
  const mentor = await prisma.mentor.create({ data: { ...data, name: String(data.name || ''), designation: String(data.designation || '') } as any });
  return ok(res, { mentor }, 201);
};

export const updateMentor = async (req: AuthRequest, res: Response) => {
  const mentor = await prisma.mentor.update({ where: { id: req.params.id }, data: pickMentorFields(req.body) as any });
  return ok(res, { mentor });
};

export const deleteMentor = async (req: AuthRequest, res: Response) => {
  await prisma.mentor.delete({ where: { id: req.params.id } });
  return ok(res, { message: 'Mentor removed.' });
};
