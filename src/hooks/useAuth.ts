'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from 'react';
import { authApi } from '@/lib/api';
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

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    const user = data.data.user;
    setUser(user);
    return user;
  };

  const register = async (formData: { name: string; email: string; password: string; role?: string }) => {
    const { data } = await authApi.register(formData);
    setUser(data.data.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return createElement(AuthContext.Provider, { value: { user, loading, login, register, logout, refreshUser } }, children);
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
