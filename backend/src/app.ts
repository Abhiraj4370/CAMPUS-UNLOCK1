import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/auth';
import universityRoutes from './routes/universities';
import courseRoutes from './routes/courses';
import mentorRoutes from './routes/mentors';
import leadRoutes from './routes/leads';
import blogRoutes from './routes/blogs';
import reviewRoutes from './routes/reviews';
import adminRoutes from './routes/admin';
import searchRoutes from './routes/search';
import widgetRoutes from './routes/widgets';
import uploadRoutes from './routes/upload';
import { fail } from './utils/helpers';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Locally-uploaded files (logos, banners, avatars) when Cloudinary isn't configured.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req: Request, res: Response) => res.json({ success: true, message: 'Campus Unlock API is running.' }));

app.use('/api/auth', authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/upload', uploadRoutes);

// 404 for unknown API routes
app.use('/api', (_req: Request, res: Response) => fail(res, 'Not found.', 404));

// Central error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong on our end.';
  res.status(status).json({ success: false, message });
});

export default app;
