export const SITE_NAME = 'Campus Unlock';
export const SITE_TAGLINE = 'Find, Compare & Choose The Best Online University';

export const NAV_LINKS = [
  { href: '/universities', label: 'Universities' },
  { href: '/programs', label: 'Courses' },
  { href: '/compare', label: 'Compare' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
];

export const FOOTER_LINKS = {
  quickLinks: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/news', label: 'News' },
  ],
  forStudents: [
    { href: '/universities', label: 'Find Universities' },
    { href: '/programs', label: 'Find Courses' },
    { href: '/compare', label: 'Compare Universities' },
  ],
  forUniversities: [
    { href: '/contact', label: 'List Your University' },
    { href: '/contact', label: 'Partner With Us' },
    { href: '/contact', label: 'Advertise' },
  ],
};

export const UNIVERSITY_TYPES: { value: string; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'PRIVATE', label: 'Private University' },
  { value: 'DEEMED', label: 'Deemed University' },
];

export const COURSE_LEVELS = ['Undergraduate', 'Postgraduate', 'Diploma'];

export const MAX_COMPARE = 4;

export const COMPARE_STORAGE_KEY = 'campus-unlock-compare';
