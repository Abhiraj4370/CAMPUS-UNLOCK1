'use client';

import { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import type { User } from '@/types';
import { authApi } from '@/lib/auth';
import { ApiClientError } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (payload: { name: string; email: string; password: string; phone?: string; interestArea?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user: me } = await authApi.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedIn } = await authApi.login({ email, password });
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const adminLogin = useCallback(async (email: string, password: string) => {
    const { user: loggedIn } = await authApi.adminLogin({ email, password });
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (payload: Parameters<AuthContextValue['register']>[0]) => {
    const { user: created } = await authApi.register(payload);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore — clear local state regardless
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { ApiClientError };
