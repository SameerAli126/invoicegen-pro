'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import authService, { AuthResponse, User } from '../services/authService';
import { ToastProvider } from './UI/ToastContainer';

interface AppContextType {
  user: User | null;
  loading: boolean;
  demoMode: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  startDemo: () => void;
  stopDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
            setDemoMode(authService.isDemoMode());
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        authService.stopDemo();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      authService.stopDemo();
      setDemoMode(false);
      const response = await authService.login({ email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      authService.stopDemo();
      setDemoMode(false);
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setDemoMode(false);
  };

  const startDemo = () => {
    authService.logout();
    const demoUser = authService.startDemo();
    setUser(demoUser);
    setDemoMode(true);
  };

  const stopDemo = () => {
    authService.stopDemo();
    setUser(null);
    setDemoMode(false);
  };

  const value: AppContextType = {
    user,
    loading,
    demoMode,
    login,
    register,
    logout,
    startDemo,
    stopDemo,
  };

  return (
    <AppContext.Provider value={value}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AppContext.Provider>
  );
};
