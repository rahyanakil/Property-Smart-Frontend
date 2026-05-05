import Link from 'next/link';
import { Building } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Building size={40} className="text-primary-400 dark:text-primary-500" />
        </div>
        <div className="text-8xl font-extrabold text-primary-100 dark:text-primary-900/50 mb-2 select-none">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/properties" className="btn-secondary">Browse Properties</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
