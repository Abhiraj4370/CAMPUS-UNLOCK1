/**
 * Minimal in-memory analytics tracker. In production this would forward to
 * a real analytics provider; here it keeps lightweight counters so the
 * admin dashboard has something real to read without external services.
 */
type EventName = 'search' | 'university_view' | 'course_view' | 'lead_submitted' | 'signup';

const counters: Record<EventName, number> = {
  search: 0,
  university_view: 0,
  course_view: 0,
  lead_submitted: 0,
  signup: 0,
};

export const trackEvent = (event: EventName, _meta?: Record<string, unknown>) => {
  counters[event] = (counters[event] || 0) + 1;
};

export const getEventCounters = () => ({ ...counters });
