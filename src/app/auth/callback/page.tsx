'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const role = searchParams.get('role') || 'BUYER';

      if (token) {
        await refreshUser();
        toast.success('Logged in successfully!');
        const dest = role === 'ADMIN' ? '/dashboard/admin' : role === 'AGENT' ? '/dashboard/agent' : '/dashboard/buyer';
        router.replace(dest);
      } else {
        toast.error('Authentication failed');
        router.replace('/login');
      }
    };

    handleCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-500">Completing authentication...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
