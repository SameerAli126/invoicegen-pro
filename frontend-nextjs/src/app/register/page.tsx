'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '../../components/AppProvider';
import Register from '../../components/Auth/Register';

function RegisterPage() {
  const { user, loading, register } = useApp();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const success = await register(name, email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setAuthError('Registration failed. Please try again.');
      }
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <Register
      onRegister={handleRegister}
      loading={authLoading}
      error={authError}
    />
  );
}

export default function Page() {
  return (
    <AppProvider>
      <RegisterPage />
    </AppProvider>
  );
}
