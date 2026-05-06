'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useFeaturedProperties } from '@/hooks/useProperties';
import PropertyCard from './PropertyCard';
import { staggerFast } from '@/lib/animations';

export default function FeaturedProperties() {
  const { data: properties, isLoading, error } = useFeaturedProperties();
  const shouldReduce = useReducedMotion();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse h-72">
            <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !properties?.length) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No featured properties available yet.
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={shouldReduce ? {} : staggerFast}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      {properties.map((property: ReturnType<typeof properties>[number]) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </motion.div>
  );
}
