import api from './api';
import type { User } from '@/types';

export const authApi = {
  register: (payload: { name: string; email: string; password: string; phone?: string; interestArea?: string }) =>
    api.post<{ user: User; token: string }>('/auth/register', payload),

  login: (payload: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', payload),

  adminLogin: (payload: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/admin-login', payload),

  logout: () => api.post<{ message: string }>('/auth/logout'),

  me: () => api.get<{ user: User }>('/auth/me'),

  updateProfile: (payload: Partial<Pick<User, 'name' | 'phone' | 'city' | 'bio' | 'interestArea' | 'avatar'>>) =>
    api.put<{ user: User }>('/auth/profile', payload),
};
