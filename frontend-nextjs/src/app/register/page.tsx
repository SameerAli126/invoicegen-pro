'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '../../components/AppProvider';
import Register from '../../components/Auth/Register';

function RegisterPage() {
  const { user, loading, register, startDemo } = useApp();
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && !recoveryCode) {
      router.replace('/dashboard');
      const fallback = setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }, 500);
      return () => clearTimeout(fallback);
    }
  }, [user, loading, recoveryCode, router]);

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const response = await register(name, email, password);
      if (response.recoveryCode) {
        setRecoveryCode(response.recoveryCode);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemo = () => {
    startDemo();
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (recoveryCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-secondary-200 p-6 space-y-4">
          <h2 className="text-2xl font-bold text-secondary-900">Save your recovery code</h2>
          <p className="text-secondary-600 text-sm">
            This 9-digit code is your permanent backup for resetting your password. Save it somewhere safe.
          </p>
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4 text-center">
            <div className="text-sm text-secondary-500">Recovery Code</div>
            <div className="text-2xl font-mono font-semibold text-secondary-900 mt-1">
              {recoveryCode}
            </div>
          </div>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
            onClick={() => router.push('/dashboard')}
          >
            Continue to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-secondary-700">Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <Register
      onRegister={handleRegister}
      onDemo={handleDemo}
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
