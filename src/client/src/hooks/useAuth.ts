import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { ENDPOINTS } from '@/lib/endpoints';

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function useAuthProvider(): AuthContextValue {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verify token khi app khởi động bằng cách gọi GET /api/v1/auth/me
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
      return;
    }
    apiClient
      .get<{ data: User }>(ENDPOINTS.AUTH.ME)
      .then(({ data }) => setUser(data.data))
      .catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>(ENDPOINTS.AUTH.LOGIN, { email, password });
    localStorage.setItem('access_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);
    setUser(data.data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const { data } = await apiClient.post<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>(ENDPOINTS.AUTH.REGISTER, { email, password, name });
    localStorage.setItem('access_token', data.data.accessToken);
    localStorage.setItem('refresh_token', data.data.refreshToken);
    setUser(data.data.user);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    register,
  };
}
