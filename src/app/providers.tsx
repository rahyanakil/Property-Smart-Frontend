'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/context/ThemeContext';
import SmoothScroll from '@/components/ui/SmoothScroll';
import PageTransition from '@/components/ui/PageTransition';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } } })
  );

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SmoothScroll>
            <PageTransition>
            {children}
            </PageTransition>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: { borderRadius: '8px', background: '#333', color: '#fff' },
              }}
            />
          </SmoothScroll>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
