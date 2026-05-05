import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="text-7xl font-extrabold text-primary-100 mb-2">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/properties" className="btn-secondary">Browse Properties</Link>
      </div>
    </div>
  );
}
