'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '../../components/AppProvider';
import Navbar from '../../components/Layout/Navbar';
import Clients from '../../components/pages/Clients';

function ClientsPage() {
  const { user, loading, logout } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />
      <Clients user={user} />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <ClientsPage />
    </AppProvider>
  );
}
