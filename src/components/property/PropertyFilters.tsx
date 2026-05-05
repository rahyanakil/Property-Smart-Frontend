'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PropertyFilters as Filters } from '@/types';
import { cn } from '@/lib/utils';

interface PropertyFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const PROPERTY_TYPES = ['HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL'];
const BEDROOMS = [1, 2, 3, 4, 5];

export default function PropertyFilters({ filters, onChange }: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (key: keyof Filters, value: unknown) =>
    onChange({ ...filters, [key]: value || undefined, page: 1 });

  const reset = () => onChange({ page: 1, limit: 12 });

  const hasActiveFilters = Object.keys(filters).some(
    (k) => !['page', 'limit', 'sortBy', 'sortOrder'].includes(k) && filters[k as keyof Filters]
  );

  return (
    <div className="card p-4 space-y-4">
      {/* Search + toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search properties..."
            value={filters.search || ''}
            onChange={(e) => update('search', e.target.value)}
            className="input pl-9"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn('btn-secondary flex items-center gap-2', showAdvanced && 'border-primary-500 text-primary-600')}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
        {hasActiveFilters && (
          <button onClick={reset} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 whitespace-nowrap">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Property types */}
      <div className="flex flex-wrap gap-2">
        {PROPERTY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => update('type', filters.type === type ? undefined : type)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium border transition-colors',
              filters.type === type
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
            )}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="border-t border-gray-100 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="$0"
              value={filters.minPrice || ''}
              onChange={(e) => update('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.maxPrice || ''}
              onChange={(e) => update('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
            <input
              type="text"
              placeholder="Any city"
              value={filters.city || ''}
              onChange={(e) => update('city', e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Min Bedrooms</label>
            <select
              value={filters.minBedrooms || ''}
              onChange={(e) => update('minBedrooms', e.target.value ? Number(e.target.value) : undefined)}
              className="input"
            >
              <option value="">Any</option>
              {BEDROOMS.map((n) => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sort By</label>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => update('sortBy', e.target.value)}
              className="input"
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
              <option value="area">Area</option>
              <option value="viewCount">Most Viewed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
            <select
              value={filters.sortOrder || 'desc'}
              onChange={(e) => update('sortOrder', e.target.value as 'asc' | 'desc')}
              className="input"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
