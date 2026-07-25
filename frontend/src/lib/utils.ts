import { clsx, type ClassValue } from 'clsx';

/** Merge conditional class names — thin wrapper so components can `cn('a', cond && 'b')`. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatCompactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [60, 'second'], [60, 'minute'], [24, 'hour'], [7, 'day'], [4.345, 'week'], [12, 'month'], [Infinity, 'year'],
  ];
  let value = seconds;
  let unit = 'second';
  for (const [amount, name] of units) {
    if (value < amount) { unit = name; break; }
    value = Math.floor(value / amount);
    unit = name;
  }
  return value <= 1 ? 'just now' : `${value} ${unit}${value === 1 ? '' : 's'} ago`;
}

export function initials(name: string): string {
  return name.trim().slice(0, 2).toUpperCase();
}

export function slugToTitle(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export const TAG_LABELS: Record<string, string> = {
  bestseller: 'Bestseller',
  popular: 'Popular',
  trending: 'Trending',
  top_rated: 'Top Rated',
};

export const TYPE_LABELS: Record<string, string> = {
  GOVERNMENT: 'Government',
  PRIVATE: 'Private University',
  DEEMED: 'Deemed University',
};

export const STATUS_LABELS: Record<string, string> = {
  NEW: 'New', IN_PROGRESS: 'In Progress', RESOLVED: 'Resolved',
  SUBMITTED: 'Submitted', UNDER_REVIEW: 'Under Review', ADMITTED: 'Admitted', REJECTED: 'Rejected',
};
