import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { ok, paginationParams } from '../utils/helpers';
import { sendLeadNotification } from '../services/emailService';
import { trackEvent } from '../services/analyticsService';

/** Public endpoint: admission enquiry / contact / counselling / scholarship forms all post here. */
export const createLead = async (req: AuthRequest, res: Response) => {
  const { name, email, phone, purpose, message, universityId } = req.body;
  const lead = await prisma.lead.create({
    data: { name, email, phone, purpose: purpose || 'ADMISSION', message, universityId: universityId || undefined },
  });

  trackEvent('lead_submitted', { purpose: lead.purpose });

  // Fire-and-forget notification email (logs to console if SMTP isn't configured).
  sendLeadNotification(lead).catch(() => {});

  // If the person submitting is a logged-in student, also record it as an application.
  const authReq = req as AuthRequest;
  if (authReq.user && universityId) {
    await prisma.application.create({
      data: { userId: authReq.user.id, universityId, courseId: req.body.courseId || undefined },
    }).catch(() => {});
  }

  return ok(res, { lead }, 201);
};

// ---------------- Admin ----------------

export const listLeads = async (req: AuthRequest, res: Response) => {
  const { status, purpose } = req.query as Record<string, string>;
  const { page, limit, skip } = paginationParams(req.query as Record<string, unknown>);
  const where: any = {};
  if (status) where.status = status;
  if (purpose) where.purpose = purpose;

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where, include: { university: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, skip, take: limit,
    }),
    prisma.lead.count({ where }),
  ]);
  return ok(res, { items, total, page, limit, totalPages: Math.ceil(total / limit) });
};

export const updateLeadStatus = async (req: AuthRequest, res: Response) => {
  const lead = await prisma.lead.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  return ok(res, { lead });
};
