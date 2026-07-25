import { Course } from '@prisma/client';

export type { Course };

export const COURSE_TAGS = ['bestseller', 'popular', 'trending', 'top_rated'] as const;
export type CourseTag = (typeof COURSE_TAGS)[number];

export const COURSE_LEVELS = ['Undergraduate', 'Postgraduate', 'Diploma'] as const;
