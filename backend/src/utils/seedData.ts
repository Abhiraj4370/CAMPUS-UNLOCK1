// Seed data for Campus Unlock. University/course names and categories are
// drawn from the real Indian online-education market; all descriptions,
// copy and stats below are written fresh for this project (not copied
// from any source) so the demo content reads naturally.

export const categories = [
  { name: 'Management', icon: '📈', courseCountLabel: '120+ Courses' },
  { name: 'Engineering & Technology', icon: '⚙️', courseCountLabel: '150+ Courses' },
  { name: 'Computer Applications', icon: '💻', courseCountLabel: '200+ Courses' },
  { name: 'Commerce', icon: '💼', courseCountLabel: '100+ Courses' },
  { name: 'Arts & Humanities', icon: '🎭', courseCountLabel: '80+ Courses' },
  { name: 'Science', icon: '🔬', courseCountLabel: '90+ Courses' },
];

export const universities = [
  {
    name: 'Amity University Online',
    type: 'PRIVATE' as const,
    location: 'Noida, Uttar Pradesh',
    establishedYear: 2005,
    rating: 4.8,
    totalReviews: 2458,
    totalCourses: 45,
    totalStudents: 50000,
    totalFaculty: 500,
    placementRate: '95%',
    avgFees: 150000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Management',
    about:
      'Amity University Online is one of India\'s earliest movers into digital higher education, known for a ' +
      'flexible-yet-rigorous curriculum across management, technology and commerce. Its online programs are ' +
      'delivered through a proprietary LMS with live sessions, recorded lectures and dedicated placement support.',
  },
  {
    name: 'Manipal Online University',
    type: 'DEEMED' as const,
    location: 'Manipal, Karnataka',
    establishedYear: 1953,
    rating: 4.7,
    totalReviews: 3100,
    totalCourses: 38,
    totalStudents: 22000,
    totalFaculty: 420,
    placementRate: '92%',
    avgFees: 160000,
    accreditation: 'A++',
    naacGrade: 'A++',
    categoryName: 'Management',
    about:
      'Backed by decades of academic reputation, Manipal Online University offers globally benchmarked online ' +
      'degrees across business, IT and the sciences, with strong alumni networks and industry tie-ups feeding ' +
      'directly into its placement cell.',
  },
  {
    name: 'Lovely Professional University Online',
    type: 'PRIVATE' as const,
    location: 'Phagwara, Punjab',
    establishedYear: 2005,
    rating: 4.6,
    totalReviews: 5800,
    totalCourses: 60,
    totalStudents: 30000,
    totalFaculty: 700,
    placementRate: '89%',
    avgFees: 120000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Engineering & Technology',
    about:
      'LPU Online extends one of India\'s largest private university campuses into a fully digital format, ' +
      'offering an unusually wide catalogue of UGC-entitled degrees spanning engineering, management and ' +
      'computer applications.',
  },
  {
    name: 'Chandigarh University Online',
    type: 'PRIVATE' as const,
    location: 'Chandigarh, Punjab',
    establishedYear: 2012,
    rating: 4.6,
    totalReviews: 1900,
    totalCourses: 42,
    totalStudents: 18000,
    totalFaculty: 310,
    placementRate: '90%',
    avgFees: 95000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Computer Applications',
    about:
      'Chandigarh University is known for an industry-integrated curriculum and an active placement cell that ' +
      'carries over into its online programs, particularly in computer applications and management.',
  },
  {
    name: 'Jain Online University',
    type: 'DEEMED' as const,
    location: 'Bangalore, Karnataka',
    establishedYear: 1990,
    rating: 4.6,
    totalReviews: 1300,
    totalCourses: 34,
    totalStudents: 12000,
    totalFaculty: 240,
    placementRate: '87%',
    avgFees: 105000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Commerce',
    about:
      'Jain Online is recognised for flexible learning formats aimed squarely at working professionals, with ' +
      'strong faculty support and a growing catalogue of commerce and management degrees.',
  },
  {
    name: 'DY Patil Online University',
    type: 'DEEMED' as const,
    location: 'Pune, Maharashtra',
    establishedYear: 1996,
    rating: 4.5,
    totalReviews: 1450,
    totalCourses: 30,
    totalStudents: 15000,
    totalFaculty: 280,
    placementRate: '88%',
    avgFees: 110000,
    accreditation: 'A',
    naacGrade: 'A',
    categoryName: 'Management',
    about:
      'DY Patil Online offers accredited online degrees with a particular focus on healthcare management, ' +
      'business administration and technology, backed by DY Patil\'s established institutional network.',
  },
  {
    name: 'Sharda Online University',
    type: 'PRIVATE' as const,
    location: 'Greater Noida, Uttar Pradesh',
    establishedYear: 1996,
    rating: 4.5,
    totalReviews: 980,
    totalCourses: 28,
    totalStudents: 9000,
    totalFaculty: 190,
    placementRate: '86%',
    avgFees: 90000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Computer Applications',
    about:
      'Sharda Online brings a multi-disciplinary, internationally-oriented curriculum online, with a growing ' +
      'international student base and dedicated career-services team.',
  },
  {
    name: 'NMIMS Global Online',
    type: 'DEEMED' as const,
    location: 'Mumbai, Maharashtra',
    establishedYear: 1981,
    rating: 4.7,
    totalReviews: 2100,
    totalCourses: 25,
    totalStudents: 20000,
    totalFaculty: 260,
    placementRate: '91%',
    avgFees: 175000,
    accreditation: 'A++',
    naacGrade: 'A++',
    categoryName: 'Management',
    about:
      'NMIMS Global Online carries the reputation of one of India\'s premier business schools into the online ' +
      'format, with a management-heavy course catalogue and strong industry linkages.',
  },
  {
    name: 'Amrita Online University',
    type: 'DEEMED' as const,
    location: 'Coimbatore, Tamil Nadu',
    establishedYear: 1994,
    rating: 4.6,
    totalReviews: 870,
    totalCourses: 22,
    totalStudents: 7000,
    totalFaculty: 150,
    placementRate: '85%',
    avgFees: 100000,
    accreditation: 'A++',
    naacGrade: 'A++',
    categoryName: 'Engineering & Technology',
    about:
      'Amrita Online extends a research-oriented university culture into flexible online programs across ' +
      'technology, business and the sciences.',
  },
  {
    name: 'SASTRA Online University',
    type: 'DEEMED' as const,
    location: 'Thanjavur, Tamil Nadu',
    establishedYear: 1984,
    rating: 4.6,
    totalReviews: 640,
    totalCourses: 18,
    totalStudents: 5000,
    totalFaculty: 200,
    placementRate: '88%',
    avgFees: 95000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Computer Applications',
    about:
      'SASTRA Online offers a cutting-edge virtual learning environment for working professionals and fresh ' +
      'graduates alike, with over 200 faculty members mentoring students through a modern LMS.',
  },
  {
    name: 'Parul Online University',
    type: 'PRIVATE' as const,
    location: 'Vadodara, Gujarat',
    establishedYear: 2015,
    rating: 4.4,
    totalReviews: 520,
    totalCourses: 20,
    totalStudents: 6000,
    totalFaculty: 130,
    placementRate: '82%',
    avgFees: 80000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Commerce',
    about:
      'Parul Online offers budget-friendly UGC-entitled degrees aimed at first-generation online learners, with ' +
      'a growing catalogue in commerce and computer applications.',
  },
  {
    name: 'Shoolini Online University',
    type: 'PRIVATE' as const,
    location: 'Solan, Himachal Pradesh',
    establishedYear: 2009,
    rating: 4.5,
    totalReviews: 410,
    totalCourses: 16,
    totalStudents: 4000,
    totalFaculty: 95,
    placementRate: '84%',
    avgFees: 85000,
    accreditation: 'A+',
    naacGrade: 'A+',
    categoryName: 'Science',
    about:
      'Shoolini Online is known for a research-driven culture and niche postgraduate programs, particularly in ' +
      'the sciences and applied management.',
  },
];

export const courseCatalog: Array<{ title: string; duration: string; fee: number; level: string; tag?: string }> = [
  { title: 'Online MBA', duration: '2 Years', fee: 150000, level: 'Postgraduate', tag: 'bestseller' },
  { title: 'Online Executive MBA', duration: '15 Months', fee: 210000, level: 'Postgraduate', tag: 'popular' },
  { title: 'Online MCA', duration: '2 Years', fee: 95000, level: 'Postgraduate', tag: 'trending' },
  { title: 'Online BCA', duration: '3 Years', fee: 75000, level: 'Undergraduate' },
  { title: 'Online BBA', duration: '3 Years', fee: 90000, level: 'Undergraduate', tag: 'popular' },
  { title: 'Online B.Com', duration: '3 Years', fee: 60000, level: 'Undergraduate' },
  { title: 'Online M.Com', duration: '2 Years', fee: 65000, level: 'Postgraduate' },
  { title: 'Online MA (Economics)', duration: '2 Years', fee: 55000, level: 'Postgraduate' },
  { title: 'Online M.Sc Data Science', duration: '2 Years', fee: 120000, level: 'Postgraduate', tag: 'trending' },
  { title: 'Online PGDM', duration: '1 Year', fee: 135000, level: 'Diploma' },
  { title: 'Online BA', duration: '3 Years', fee: 45000, level: 'Undergraduate' },
  { title: 'Online Advanced Diploma in Digital Marketing', duration: '12 Months', fee: 50000, level: 'Diploma', tag: 'top_rated' },
];

export const mentors = [
  { name: 'Dr. Kavita Rao', designation: 'Career Counsellor', specialty: 'Engineering admissions & scholarships', experienceYears: 12, studentsHelped: 4200 },
  { name: 'Arjun Malhotra', designation: 'Ex-Admissions Officer', specialty: 'MBA & Management programs', experienceYears: 9, studentsHelped: 3100 },
  { name: 'Sana Iyer', designation: 'Study Abroad Consultant', specialty: 'International placements & transfers', experienceYears: 7, studentsHelped: 2600 },
  { name: 'Rohit Verma', designation: 'Ed-Tech Advisor', specialty: 'Computer Applications & Data Science', experienceYears: 5, studentsHelped: 1800 },
];

export const scholarshipCatalog = [
  { name: 'Merit Scholarship', description: 'Fee waiver for candidates scoring above 85% in their qualifying exam.', amountText: 'Up to 50% off tuition', daysFromNow: 30 },
  { name: 'Need-Based Scholarship', description: 'Reduced fees for applicants demonstrating financial need.', amountText: 'Up to 30% off tuition', daysFromNow: 45 },
  { name: 'Women in Tech Scholarship', description: 'Supporting women enrolling in engineering and computer applications programs.', amountText: 'Up to 25% off tuition', daysFromNow: 60 },
  { name: 'Defence & Veterans Scholarship', description: 'For serving and retired defence personnel and their dependents.', amountText: 'Up to 40% off tuition', daysFromNow: 90 },
];

export const blogPosts = [
  {
    title: 'How to Choose the Right Online University for Your Career Goals',
    category: 'Guides',
    excerpt: 'A practical framework for shortlisting universities based on outcomes, cost and fit rather than rankings alone.',
    body:
      'Choosing where to study shapes the network you build and the opportunities that open up after graduation. ' +
      'Start with a short list of criteria that matter to you — accreditation, placement record, faculty access, ' +
      'and total cost of the degree — then compare programs against them one at a time instead of relying on ' +
      'reputation alone.\n\nOnce you have two or three finalists, talk to current students if you can, and read ' +
      'the fine print on the fee structure. A slightly cheaper program with a hidden exam fee or mandatory ' +
      'on-campus module can end up costing more than it first appears.',
  },
  {
    title: 'Online MBA vs Executive MBA: Which One Fits You?',
    category: 'Careers',
    excerpt: 'Both open doors to leadership roles, but they serve very different stages of a career.',
    body:
      'An Online MBA is usually built for early-to-mid career professionals looking to formalise business ' +
      'fundamentals, while an Executive MBA assumes several years of managerial experience and leans harder on ' +
      "peer learning and case studies drawn from participants' own workplaces.\n\nIf you are under five years " +
      'into your career, the standard Online MBA is typically the better and more affordable fit. If you are ' +
      "already managing teams, the EMBA's cohort of peers is often the bigger value driver than the syllabus itself.",
  },
  {
    title: 'Understanding NAAC and UGC Approval Before You Enrol',
    category: 'Guides',
    excerpt: "What these accreditations actually mean, and why they matter more than a university's advertising.",
    body:
      "NAAC grades (from C up to A++) assess an institution's overall quality, while UGC entitlement specifically " +
      'confirms that a university is authorised to offer online degrees. A university can be well known and ' +
      'still lack current UGC entitlement for online programs, so it is worth checking both before you apply, ' +
      'not just one.\n\nEvery university listed on Campus Unlock displays its current NAAC grade and UGC status ' +
      'directly on the profile page for exactly this reason.',
  },
  {
    title: 'Top Career Paths After an Online MCA Degree',
    category: 'Careers',
    excerpt: 'From backend development to product management, here is where an MCA can take you.',
    body:
      'An MCA remains one of the most versatile postgraduate degrees for a tech career in India, opening doors to ' +
      'software development, systems analysis, and increasingly, data-focused roles as electives shift toward ' +
      'analytics and machine learning.\n\nEmployers largely care about the projects and internships behind the ' +
      'degree, so pick a program that includes a genuine capstone project over one that is coursework-only.',
  },
];

export const featureWidgets: Array<{ widgetType: 'FEATURE'; icon: string; title: string; description: string; position: number }> = [
  { widgetType: 'FEATURE', icon: '🔄', title: 'Flexible Learning', description: 'Study at your own pace from anywhere', position: 1 },
  { widgetType: 'FEATURE', icon: '🏅', title: 'Industry Recognition', description: 'UGC entitled & industry approved degrees', position: 2 },
  { widgetType: 'FEATURE', icon: '👩‍🏫', title: 'Expert Faculty', description: 'Learn from industry experts and academicians', position: 3 },
  { widgetType: 'FEATURE', icon: '💼', title: 'Placement Support', description: '100% placement assistance support', position: 4 },
  { widgetType: 'FEATURE', icon: '🌐', title: 'Global Exposure', description: 'International collaborations & tie-ups', position: 5 },
  { widgetType: 'FEATURE', icon: '⚙️', title: 'Advanced LMS', description: 'Modern learning management system', position: 6 },
];

export const trustBadgeWidgets: Array<{ widgetType: 'TRUST_BADGE'; icon: string; title: string; description: string; position: number }> = [
  { widgetType: 'TRUST_BADGE', icon: '🛡️', title: '100% Trusted', description: 'Verified Universities', position: 1 },
  { widgetType: 'TRUST_BADGE', icon: '🎧', title: 'Expert Mentors', description: 'Guidance & Support', position: 2 },
  { widgetType: 'TRUST_BADGE', icon: '⚖️', title: 'Compare Easily', description: 'Find the Best Fit', position: 3 },
  { widgetType: 'TRUST_BADGE', icon: '✨', title: 'Best Offers', description: 'Save More on Education', position: 4 },
];
