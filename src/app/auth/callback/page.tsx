'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { TokenStore } from '@/lib/token';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const role = searchParams.get('role') || 'BUYER';
      const error = searchParams.get('error');

      if (error === 'oauth_denied') {
        toast.error('OAuth sign-in was cancelled.');
        router.replace('/login');
        return;
      }

      if (!token) {
        toast.error('Authentication failed. Please try again.');
        router.replace('/login');
        return;
      }

      // Store tokens so the axios interceptor can attach them as Bearer headers.
      // This works even when cross-origin cookies are blocked (Vercel deployments).
      TokenStore.setAccess(token);
      if (refreshToken) TokenStore.setRefresh(refreshToken);

      // Re-fetch the current user — the stored token will be attached automatically.
      await refreshUser();

      toast.success('Signed in successfully!');
      const dest =
        role === 'ADMIN' ? '/dashboard/admin' :
        role === 'AGENT' ? '/dashboard/agent' :
        '/dashboard/buyer';
      router.replace(dest);
    };

    handleCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-gray-950">
      <LoadingSpinner size="lg" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Completing sign-in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
