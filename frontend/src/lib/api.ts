// Thin fetch wrapper around the Campus Unlock Express API. Every call
// includes credentials so the httpOnly auth cookie set by the backend is
// sent automatically — no manual token plumbing needed on simple pages.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Base origin (no /api suffix) — used to resolve relative paths like
// "/uploads/xyz.jpg" that the backend returns for uploaded logos/banners/photos
// into full <img src> URLs.
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

/** Resolves a possibly-relative file path (e.g. "/uploads/logo.png") returned by
 * the backend into an absolute URL. Leaves already-absolute URLs (e.g. a
 * Cloudinary URL) untouched. */
export function resolveFileUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

export class ApiClientError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, params?: RequestOptions['params']) {
  const url = new URL(`${API_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  const res = await fetch(buildUrl(path, params), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...headers },
    ...rest,
  });

  const json = await res.json().catch(() => ({ success: false, message: 'Unexpected server response.' }));

  if (!res.ok || !json.success) {
    throw new ApiClientError(res.status, json.message || 'Something went wrong.');
  }
  return json.data as T;
}

/** Uploads a single file (multipart/form-data) — used for university logos/banners
 * and mentor photos in the admin panel. Returns the URL to store on the record. */
async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const json = await res.json().catch(() => ({ success: false, message: 'Unexpected server response.' }));

  if (!res.ok || !json.success) {
    throw new ApiClientError(res.status, json.message || 'Could not upload file.');
  }
  return json.data as { url: string };
}

export const api = {
  get: <T>(path: string, params?: RequestOptions['params']) => request<T>(path, { method: 'GET', params }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: uploadFile,
};

export default api;
