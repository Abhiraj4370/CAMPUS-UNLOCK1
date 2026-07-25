// Prisma generates the `User` type from prisma/schema.prisma directly.
// This file re-exports it plus small helper constants so the rest of the
// app can `import { Role } from '../models/User'` instead of reaching
// into @prisma/client everywhere.
import { User, Role } from '@prisma/client';

export type { User };
export { Role };

// Fields safe to send to the client (never the password hash).
export const PUBLIC_USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  interestArea: true,
  city: true,
  bio: true,
  avatar: true,
  createdAt: true,
} as const;
