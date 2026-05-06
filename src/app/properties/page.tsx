'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import Pagination from '@/components/ui/Pagination';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useProperties } from '@/hooks/useProperties';
import { PropertyFilters as Filters } from '@/types';
import { staggerFast, fadeUp } from '@/lib/animations';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Skeleton card
function SkeletonCard({ i }: { i: number }) {
  return (
    <motion.div
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.35, ease }}
    >
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
      </div>
    </motion.div>
  );
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldReduce = useReducedMotion();

  const [filters, setFilters] = useState<Filters>({
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    type: (searchParams.get('type') as Filters['type']) || undefined,
    search: searchParams.get('search') || undefined,
    isFeatured: searchParams.get('isFeatured') === 'true' || undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data, isLoading } = useProperties(filters);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, String(v)); });
    router.push(`/properties?${params.toString()}`, { scroll: false });
  };

  const properties = data?.properties || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <motion.div
          className="mb-6"
          initial={shouldReduce ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <AnimatePresence mode="wait">
            {!isLoading && (
              <motion.p
                key={total}
                className="text-gray-500 dark:text-gray-400 mt-1"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
              >
                {total.toLocaleString()} {total === 1 ? 'property' : 'properties'} found
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          <PropertyFilters filters={filters} onChange={handleFilterChange} />
        </motion.div>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
              </motion.div>
            ) : properties.length === 0 ? (
              <motion.div
                key="empty"
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={shouldReduce ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🏠
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No properties found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search filters</p>
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${filters.page}-${filters.type}-${filters.search}`}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={shouldReduce ? {} : staggerFast}
                initial="hidden"
                animate="show"
              >
                {properties.map((property: import('@/types').Property) => (
                  <motion.div key={property.id} variants={shouldReduce ? {} : fadeUp}>
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Pagination
              page={filters.page || 1}
              totalPages={totalPages}
              onPageChange={(p) => handleFilterChange({ ...filters, page: p })}
            />
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Suspense fallback={
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} i={i} />)}
            </div>
          </div>
        </main>
      }>
        <PropertiesContent />
      </Suspense>
      <Footer />
    </div>
  );
}
