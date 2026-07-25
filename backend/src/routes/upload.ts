import { Router, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import { AuthRequest } from '../middleware/auth';
import { upload, localFileUrl } from '../middleware/upload';
import { cloudinaryEnabled } from '../config/cloudinary';
import cloudinary from '../config/cloudinary';
import { ok, fail } from '../utils/helpers';
import fs from 'fs';

const router = Router();

/**
 * Single-file upload used by the admin panel for university logos/banners
 * and mentor photos. Uses local disk storage by default (served back out
 * under /uploads — see app.ts); if Cloudinary credentials are present in
 * .env, the local file is pushed to Cloudinary instead and the local copy
 * is cleaned up, so nothing else in the app needs to change either way.
 */
router.post('/', requireAuth, requireAdmin, upload.single('file'), async (req: AuthRequest, res: Response) => {
  if (!req.file) return fail(res, 'No file was uploaded.', 422);

  if (cloudinaryEnabled) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'campus-unlock' });
      fs.unlink(req.file.path, () => {});
      return ok(res, { url: result.secure_url });
    } catch {
      return fail(res, 'Cloudinary upload failed.', 500);
    }
  }

  return ok(res, { url: localFileUrl(req.file.filename) });
});

export default router;
