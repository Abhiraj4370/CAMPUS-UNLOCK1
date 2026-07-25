import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf'];
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
  else cb(new Error('Unsupported file type.'));
};

/** Local-disk upload middleware (used directly when Cloudinary isn't configured). */
export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

/** Builds a public URL for a locally-uploaded file, served by app.ts under /uploads. */
export const localFileUrl = (filename: string) => `/uploads/${filename}`;
