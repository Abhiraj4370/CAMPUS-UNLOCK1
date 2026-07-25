-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "interestArea" TEXT,
    "city" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'PRIVATE',
    "location" TEXT NOT NULL,
    "establishedYear" INTEGER NOT NULL,
    "logo" TEXT,
    "banner" TEXT,
    "about" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "totalCourses" INTEGER NOT NULL DEFAULT 0,
    "totalStudents" INTEGER NOT NULL DEFAULT 0,
    "totalFaculty" INTEGER NOT NULL DEFAULT 0,
    "placementRate" TEXT NOT NULL DEFAULT '90%',
    "avgFees" REAL NOT NULL DEFAULT 0.0,
    "accreditation" TEXT NOT NULL DEFAULT 'A+',
    "naacGrade" TEXT NOT NULL DEFAULT 'A+',
    "ugcEntitled" BOOLEAN NOT NULL DEFAULT true,
    "aicteApproved" BOOLEAN NOT NULL DEFAULT true,
    "brochureUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT,
    CONSTRAINT "University_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '📚',
    "courseCountLabel" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "fee" REAL NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "tag" TEXT,
    "level" TEXT NOT NULL DEFAULT 'Postgraduate',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "universityId" TEXT NOT NULL,
    CONSTRAINT "Course_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scholarship" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amountText" TEXT NOT NULL,
    "deadline" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "universityId" TEXT,
    CONSTRAINT "Scholarship_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "courseName" TEXT,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "specialty" TEXT,
    "bio" TEXT,
    "photo" TEXT,
    "experienceYears" INTEGER NOT NULL DEFAULT 3,
    "studentsHelped" INTEGER NOT NULL DEFAULT 500,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "purpose" TEXT NOT NULL DEFAULT 'ADMISSION',
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "universityId" TEXT,
    CONSTRAINT "Lead_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Guides',
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "cover" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,
    CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shortlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    CONSTRAINT "Shortlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Shortlist_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "courseId" TEXT,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "query" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "siteName" TEXT NOT NULL DEFAULT 'Campus Unlock',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@campusunlock.com',
    "supportPhone" TEXT NOT NULL DEFAULT '1800-123-4567',
    "address" TEXT NOT NULL DEFAULT 'Noida, Uttar Pradesh, India'
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "widgetType" TEXT NOT NULL DEFAULT 'FEATURE',
    "icon" TEXT NOT NULL DEFAULT '⭐',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Shortlist_userId_universityId_key" ON "Shortlist"("userId", "universityId");
