import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok } from '../utils/helpers';

export const dashboardStats = async (_req: AuthRequest, res: Response) => {
  const [totalUniversities, totalCourses, totalUsers, totalLeads, topUniversities, recentLeads] = await Promise.all([
    prisma.university.count(),
    prisma.course.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.lead.count(),
    prisma.university.findMany({
      orderBy: { rating: 'desc' }, take: 5,
      include: { _count: { select: { courses: true, leads: true } } },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { university: { select: { name: true } } } }),
  ]);

  return ok(res, { totalUniversities, totalCourses, totalUsers, totalLeads, topUniversities, recentLeads });
};

export const chartData = async (_req: AuthRequest, res: Response) => {
  const now = new Date();
  const months: { label: string; start: Date; end: Date }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    months.push({ label: start.toLocaleString('en-US', { month: 'short' }), start, end });
  }

  const values = await Promise.all(
    months.map((m) => prisma.lead.count({ where: { createdAt: { gte: m.start, lt: m.end } } }))
  );

  const statusGroups = await prisma.lead.groupBy({ by: ['status'], _count: true });
  const statusMap: Record<string, number> = { NEW: 0, IN_PROGRESS: 0, RESOLVED: 0 };
  statusGroups.forEach((g) => { statusMap[g.status] = g._count; });

  return ok(res, {
    leadsOverview: { labels: months.map((m) => m.label), values },
    statusBreakdown: { labels: ['New', 'In Progress', 'Resolved'], values: [statusMap.NEW, statusMap.IN_PROGRESS, statusMap.RESOLVED] },
  });
};

export const listUsers = async (_req: AuthRequest, res: Response) => {
  const items = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, phone: true, interestArea: true, createdAt: true,
      _count: { select: { shortlist: true, applications: true } },
    },
  });
  return ok(res, { items });
};

export const getSettings = async (_req: AuthRequest, res: Response) => {
  const settings = await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  return ok(res, { settings });
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  const { siteName, supportEmail, supportPhone, address } = req.body;
  const settings = await prisma.setting.upsert({
    where: { id: 1 },
    update: { siteName, supportEmail, supportPhone, address },
    create: { id: 1, siteName, supportEmail, supportPhone, address },
  });
  return ok(res, { settings });
};
