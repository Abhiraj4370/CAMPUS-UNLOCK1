// Shared types mirroring the shapes returned by the Campus Unlock API
// (backend/prisma/schema.prisma is the source of truth).

export type Role = 'STUDENT' | 'ADMIN';
export type UniversityType = 'GOVERNMENT' | 'PRIVATE' | 'DEEMED';
export type LeadPurpose = 'ADMISSION' | 'COUNSELLING' | 'CONTACT' | 'SCHOLARSHIP';
export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ADMITTED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  interestArea?: string | null;
  city?: string | null;
  bio?: string | null;
  avatar?: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  courseCountLabel: string;
}

export interface University {
  id: string;
  name: string;
  slug: string;
  type: UniversityType;
  location: string;
  establishedYear: number;
  logo?: string | null;
  banner?: string | null;
  about: string;
  rating: number;
  totalReviews: number;
  totalCourses: number;
  totalStudents: number;
  totalFaculty: number;
  placementRate: string;
  avgFees: number;
  accreditation: string;
  naacGrade: string;
  ugcEntitled: boolean;
  aicteApproved: boolean;
  brochureUrl?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  category?: Category | null;
  courses?: Course[];
  scholarships?: Scholarship[];
  reviews?: Review[];
  _count?: { courses: number; leads?: number };
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  duration: string;
  fee: number;
  rating: number;
  totalReviews: number;
  tag?: string | null;
  level: string;
  universityId: string;
  university?: Pick<University, 'name' | 'slug' | 'logo'> & { id?: string };
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amountText: string;
  deadline: string;
  isActive: boolean;
  university?: { name: string } | null;
}

export interface Review {
  id: string;
  rating: number;
  courseName?: string | null;
  comment: string;
  createdAt: string;
  user?: { name: string };
  university?: { name: string };
}

export interface Mentor {
  id: string;
  name: string;
  designation: string;
  specialty?: string | null;
  bio?: string | null;
  photo?: string | null;
  experienceYears: number;
  studentsHelped: number;
  isActive: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  purpose: LeadPurpose;
  message?: string | null;
  status: LeadStatus;
  createdAt: string;
  university?: { name: string } | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  cover?: string | null;
  isPublished: boolean;
  publishedAt: string;
  author?: { name: string } | null;
}

export interface Application {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  university: University;
  course?: Course | null;
  user?: Pick<User, 'name' | 'email'>;
}

export type WidgetType = 'FEATURE' | 'TRUST_BADGE' | 'STAT';

export interface Widget {
  id: string;
  widgetType: WidgetType;
  icon: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  position: number;
}

export interface Setting {
  id: number;
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
