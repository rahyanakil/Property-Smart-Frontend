import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'PropertySmart', template: '%s | PropertySmart' },
  description: 'Find your dream property with PropertySmart — the modern real estate marketplace.',
  keywords: ['real estate', 'property', 'buy', 'rent', 'house', 'apartment'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ScrollProgressBar />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
