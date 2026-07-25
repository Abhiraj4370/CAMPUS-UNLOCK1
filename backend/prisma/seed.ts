import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
import {
  categories, universities, courseCatalog, mentors, scholarshipCatalog, blogPosts,
  featureWidgets, trustBadgeWidgets,
} from '../src/utils/seedData';

const prisma = new PrismaClient();
const slug = (s: string) => slugify(s, { lower: true, strict: true });

async function main() {
  console.log('Seeding Campus Unlock database...');

  // ---------------- Demo accounts ----------------
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@campusunlock.com' },
    update: {},
    create: { name: 'Platform Admin', email: 'admin@campusunlock.com', password: adminPassword, role: 'ADMIN' },
  });

  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@campusunlock.com' },
    update: {},
    create: {
      name: 'Abhi Raj', email: 'student@campusunlock.com', password: studentPassword,
      role: 'STUDENT', interestArea: 'Computer Applications', city: 'Delhi',
    },
  });

  // ---------------- Categories ----------------
  const categoryMap: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: { name: c.name, slug: slug(c.name), icon: c.icon, courseCountLabel: c.courseCountLabel },
    });
    categoryMap[c.name] = cat.id;
  }

  // ---------------- Universities + Courses ----------------
  const universityIds: string[] = [];
  for (const [i, u] of universities.entries()) {
    const uni = await prisma.university.upsert({
      where: { slug: slug(u.name) },
      update: {},
      create: {
        name: u.name,
        slug: slug(u.name),
        type: u.type,
        location: u.location,
        establishedYear: u.establishedYear,
        about: u.about,
        rating: u.rating,
        totalReviews: u.totalReviews,
        totalCourses: u.totalCourses,
        totalStudents: u.totalStudents,
        totalFaculty: u.totalFaculty,
        placementRate: u.placementRate,
        avgFees: u.avgFees,
        accreditation: u.accreditation,
        naacGrade: u.naacGrade,
        isFeatured: i < 6,
        categoryId: categoryMap[u.categoryName],
      },
    });
    universityIds.push(uni.id);

    // Give each university a rotating slice of the course catalog so listings look varied.
    const start = i % courseCatalog.length;
    const picks = [
      courseCatalog[start],
      courseCatalog[(start + 1) % courseCatalog.length],
      courseCatalog[(start + 2) % courseCatalog.length],
      courseCatalog[(start + 4) % courseCatalog.length],
    ];
    for (const c of picks) {
      const courseSlug = slug(`${c.title}-${u.name}`);
      await prisma.course.upsert({
        where: { slug: courseSlug },
        update: {},
        create: {
          title: c.title,
          slug: courseSlug,
          duration: c.duration,
          fee: c.fee,
          level: c.level,
          tag: c.tag,
          rating: Math.round((4.3 + Math.random() * 0.6) * 10) / 10,
          totalReviews: Math.floor(200 + Math.random() * 3000),
          universityId: uni.id,
        },
      });
    }

    // One scholarship per university, cycling through the catalog.
    const sch = scholarshipCatalog[i % scholarshipCatalog.length];
    const existingSch = await prisma.scholarship.findFirst({ where: { name: sch.name, universityId: uni.id } });
    if (!existingSch) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + sch.daysFromNow);
      await prisma.scholarship.create({
        data: {
          name: sch.name, description: sch.description, amountText: sch.amountText,
          deadline, universityId: uni.id,
        },
      });
    }
  }

  // ---------------- Mentors ----------------
  for (const m of mentors) {
    const existing = await prisma.mentor.findFirst({ where: { name: m.name } });
    if (!existing) await prisma.mentor.create({ data: { ...m } });
  }

  // ---------------- Blog posts ----------------
  for (const b of blogPosts) {
    const postSlug = slug(b.title);
    await prisma.blog.upsert({
      where: { slug: postSlug },
      update: {},
      create: { ...b, slug: postSlug, authorId: admin.id },
    });
  }

  // ---------------- Demo activity for the student account ----------------
  if (universityIds[0]) {
    await prisma.shortlist.upsert({
      where: { userId_universityId: { userId: student.id, universityId: universityIds[0] } },
      update: {},
      create: { userId: student.id, universityId: universityIds[0] },
    });
    const firstCourse = await prisma.course.findFirst({ where: { universityId: universityIds[0] } });
    await prisma.application.create({
      data: { userId: student.id, universityId: universityIds[0], courseId: firstCourse?.id, status: 'UNDER_REVIEW' },
    }).catch(() => {});
    await prisma.savedSearch.create({ data: { userId: student.id, query: 'Online MBA' } }).catch(() => {});
  }

  // ---------------- Sample leads (for the admin panel) ----------------
  const leadSeed = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9000000001', purpose: 'ADMISSION' as const },
    { name: 'Priya Singh', email: 'priya@example.com', phone: '9000000002', purpose: 'ADMISSION' as const },
    { name: 'Amit Kumar', email: 'amit@example.com', phone: '9000000003', purpose: 'COUNSELLING' as const },
    { name: 'Neha Verma', email: 'neha@example.com', phone: '9000000004', purpose: 'SCHOLARSHIP' as const },
  ];
  const existingLeads = await prisma.lead.count();
  if (existingLeads === 0) {
    for (const [i, l] of leadSeed.entries()) {
      await prisma.lead.create({ data: { ...l, universityId: universityIds[i % universityIds.length] } });
    }
  }

  // ---------------- Widgets (feature highlights + trust badges) ----------------
  const allWidgetSeed = [...featureWidgets, ...trustBadgeWidgets];
  for (const w of allWidgetSeed) {
    const existingWidget = await prisma.widget.findFirst({ where: { title: w.title, widgetType: w.widgetType } });
    if (!existingWidget) await prisma.widget.create({ data: w });
  }

  // ---------------- Site settings ----------------
  await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  console.log('Done!');
  console.log('Demo logins → admin: admin@campusunlock.com / admin123');
  console.log('              student: student@campusunlock.com / student123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
