'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from 'react';
import { authApi } from '@/lib/api';
import { TokenStore } from '@/lib/token';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user — called on mount and after any auth action.
  // The axios interceptor will attach the stored token as Bearer header,
  // so this works even when cross-origin cookies are blocked.
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authApi.me();
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await authApi.login({ email, password });
    const { user, accessToken, refreshToken } = data.data;

    // Store tokens so the axios interceptor can send them as Bearer headers.
    // This bypasses cross-origin cookie blocking on Vercel.
    if (accessToken) TokenStore.setAccess(accessToken);
    if (refreshToken) TokenStore.setRefresh(refreshToken);

    setUser(user);
    return user;
  };

  const register = async (formData: { name: string; email: string; password: string; role?: string }) => {
    const { data } = await authApi.register(formData);
    const { user, accessToken, refreshToken } = data.data;

    if (accessToken) TokenStore.setAccess(accessToken);
    if (refreshToken) TokenStore.setRefresh(refreshToken);

    setUser(user);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    TokenStore.clear();
    setUser(null);
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, loading, login, register, logout, refreshUser } },
    children,
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
