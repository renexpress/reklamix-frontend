/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useApi';
import { tokenManager } from '@/lib/api';

interface User {
  id: number;
  phone_number: string;
  is_staff: boolean;
  is_active: boolean;
  last_login: string | null;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isStaff: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Only fetch user if we have a token
  const hasToken = !!tokenManager.getAccessToken();

  const {
    data: user,
    isLoading: isUserLoading,
    refetch,
  } = useCurrentUser({
    enabled: hasToken && isInitialized,
    retry: false,
  });

  useEffect(() => {
    // Mark as initialized after first render
    setIsInitialized(true);
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    tokenManager.setTokens(accessToken, refreshToken);
    // Refetch user data after login
    refetch();
  };

  const logout = () => {
    tokenManager.clearTokens();
    window.location.href = '/login';
  };

  // Only show loading state during initial load (not background refetches)
  // This prevents the UI from flashing loading states when switching tabs
  const isLoading = hasToken && (!isInitialized || (isUserLoading && !user));

  const value: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user,
    isLoading,
    isStaff: user?.is_staff || false,
    login,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
