# Campus Unlock

A full-stack web app for discovering, comparing and applying to online universities —
public site, student dashboard, and admin panel — built as two separate services:

- **`backend/`** — Express + TypeScript API, using Prisma ORM (SQLite by default).
- **`frontend/`** — Next.js 16 (App Router) + TypeScript + Tailwind CSS, calling the API.

Both ship with seed data (universities, courses, mentors, blog posts, scholarships) and
two demo accounts, so the whole thing works end-to-end right after setup — no manual
data entry required.

## Demo logins

| Role    | Email                        | Password     |
|---------|-------------------------------|---------------|
| Admin   | `admin@campusunlock.com`      | `admin123`    |
| Student | `student@campusunlock.com`    | `student123`  |

The same sign-in page handles both — you land on `/admin` or `/dashboard` automatically
based on the account's role.

## Prerequisites

- **Node.js 18.18+** (Node 20 or 22 recommended) — [nodejs.org](https://nodejs.org)
- npm (comes with Node)

No database server to install — the backend uses SQLite out of the box.

## Quick start (Windows PowerShell)

You'll run two servers in two separate terminal windows/tabs — the backend (port 5000)
and the frontend (port 3000).

**Terminal 1 — Backend:**
```powershell
cd D:\campus-unlock\backend
npm install
```
`npm install` automatically runs `prisma generate` (via a postinstall hook) and needs a
one-time internet connection to fetch Prisma's query engine — this is normal and only
happens once.

```powershell
npx prisma migrate dev --name init
npm run seed
npm run dev
```
You should see `🚀 Campus Unlock API listening on http://localhost:5000`.

**Terminal 2 — Frontend:**
```powershell
cd D:\campus-unlock\frontend
npm install
npm run dev
```
Then open **http://localhost:3000** in your browser.

## Quick start (macOS / Linux)

```bash
# Terminal 1
cd campus-unlock/backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev

# Terminal 2
cd campus-unlock/frontend
npm install
npm run dev
```

## Project structure

Matches the original roadmap:

```
campus-unlock/
├── frontend/          Next.js app (App Router, TypeScript, Tailwind)
│   ├── src/app/        pages — home, universities, programs, compare, blogs,
│   │                    news, about, contact, auth, dashboard, admin/*
│   ├── src/components/ layout, home, universities, ui, forms, admin components
│   ├── src/lib/         api client, auth helpers, constants, utils
│   ├── src/hooks/       useAuth, useComparison, useDebounce, useIntersection
│   ├── src/context/     AuthContext, ComparisonContext
│   └── src/types/       shared TypeScript types
│
└── backend/            Express API
    ├── src/config/       database (Prisma client), cloudinary, email
    ├── src/models/       thin type re-exports over the Prisma-generated types
    ├── src/routes/       auth, universities, courses, mentors, leads, blogs,
    │                     reviews, admin, search
    ├── src/middleware/   auth, admin, validate, upload
    ├── src/controllers/  one per resource, matching routes/
    ├── src/services/     emailService, analyticsService
    ├── src/utils/        helpers (JWT/password/response utils), seedData
    └── prisma/           schema.prisma, seed.ts
```

## How the pieces fit together

- **Auth** is JWT-based, stored in an httpOnly cookie set by the backend. The frontend's
  `AuthContext` calls `/api/auth/me` on load to restore the session, and every API
  request goes out with `credentials: 'include'` so the cookie rides along automatically.
- **Shortlist** (❤️) requires login and is stored server-side (`Shortlist` model).
  **Compare** (⚖️) works for guests too — it's stored in `localStorage` on the frontend
  and only resolved against the API when you view the comparison table.
- **Admin panel** (`/admin/*`) is guarded client-side by `AuthContext` (redirects
  non-admins) and server-side by the `requireAdmin` middleware on every `/api/admin/*`
  and admin-only CRUD route — so it's safe even if someone bypasses the UI.
- **Image uploads** — university logos/banners and mentor/blog photos are uploaded via
  `POST /api/upload` (multer, admin-only), which stores files under `backend/uploads/`
  and serves them back at `/uploads/<filename>`. If Cloudinary credentials are set in
  `backend/.env`, uploads go there instead automatically — nothing else changes. The
  admin forms for Colleges, Mentors, and Blog Posts each have an inline "Upload" button
  next to the relevant image field.
- **Widgets** (`/admin/widgets`) are small, admin-editable content blocks — feature
  highlights, trust badges, stat counters — rendered on public pages. The "Why Choose X
  University?" panel on every university profile pulls its list live from the Feature
  Highlight widgets, so editing them in the admin panel updates every university page
  at once.
- **Charts** on the admin dashboard are hand-rolled SVG (no extra charting library) fed
  by a small `/api/admin/chart-data` endpoint that aggregates real lead data.
- **Image uploads** (university logos/banners, mentor photos, blog cover images) go
  through `POST /api/upload` — admin-only, backed by local disk storage under
  `backend/uploads/` (served back out at `/uploads/...`). If you add Cloudinary
  credentials to `backend/.env`, uploads are pushed there instead automatically —
  nothing else in the app needs to change either way.
- **Widgets** (`/admin/widgets`) are small admin-managed content blocks — feature
  highlights, trust badges, stat counters. The "Why Choose X University?" panel on
  every university page pulls its content live from the Feature Highlight widgets,
  so editing them in the admin panel updates that section immediately.

> **Already ran `prisma migrate dev` before this update?** The `Widget` model is new.
> Just re-run `npx prisma migrate dev --name add_widgets` in `backend/` to pick it up —
> your existing data is untouched.

## Switching from SQLite to another database

The backend defaults to SQLite (`DATABASE_URL="file:./dev.db"` in `backend/.env`) so it
runs with zero external services. To use Postgres or MySQL instead:

1. Update the `datasource` block in `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"   // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in `backend/.env` to your connection string.
3. Re-run `npx prisma migrate dev` and `npm run seed`.

## Troubleshooting

- **`npm install` fails on `prisma generate`** — this step needs internet access to
  download Prisma's query engine binary the first time. Make sure you're not behind a
  firewall blocking `binaries.prisma.sh`, then re-run `npm install`.
- **Frontend loads but shows no data** — make sure the backend is running on port 5000
  first (`npm run dev` in `backend/`). Check `frontend/.env.local` has
  `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
- **"Invalid or expired session" right after logging in** — the backend and frontend
  need to run on the origins configured in `backend/.env` (`FRONTEND_URL`) and
  `frontend/.env.local` (`NEXT_PUBLIC_API_URL`). If you change ports, update both.
- **Reset all data** — delete `backend/prisma/dev.db`, then run
  `npx prisma migrate dev` and `npm run seed` again.
- **"Unknown arg `widget`" or missing Widgets page data** — if you ran
  `prisma migrate dev` before pulling an update that added the `Widget` model, just
  re-run `npx prisma migrate dev --name add_widgets` to pick up the new table, then
  `npm run seed` again (seeding is idempotent — safe to re-run any time).
