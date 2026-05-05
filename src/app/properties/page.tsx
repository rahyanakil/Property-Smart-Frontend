'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import Pagination from '@/components/ui/Pagination';
import { useProperties } from '@/hooks/useProperties';
import { PropertyFilters as Filters } from '@/types';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            {!isLoading && (
              <p className="text-gray-500 mt-1">{total} properties found</p>
            )}
          </div>

          <PropertyFilters filters={filters} onChange={handleFilterChange} />

          <div className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-700">No properties found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property: import('@/types').Property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            <Pagination
              page={filters.page || 1}
              totalPages={totalPages}
              onPageChange={(p) => handleFilterChange({ ...filters, page: p })}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
