'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Building, Eye, Search } from 'lucide-react';
import { propertyApi } from '@/lib/api';
import { formatPrice, getStatusColor, cn } from '@/lib/utils';
import { type Property, type PropertyStatus } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

const STATUSES: PropertyStatus[] = ['AVAILABLE', 'PENDING', 'SOLD', 'RENTED', 'INACTIVE'];
const PER_PAGE = 10;

export default function AgentPropertiesPage() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['agentProperties'],
    queryFn: async () => (await propertyApi.myProperties()).data.data,
  });

  const deleteProperty = useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agentProperties'] });
      toast.success('Property deleted');
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete property'),
  });

  const properties: Property[] = useMemo(() => data?.properties || [], [data]);

  const filtered = useMemo(() => {
    let list = properties;
    if (statusFilter !== 'ALL') list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)
      );
    }
    return list;
  }, [properties, statusFilter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilterChange = (f: PropertyStatus | 'ALL') => {
    setStatusFilter(f);
    setPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            {data?.total ?? 0} total listing{data?.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard/agent/new-property" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['ALL', ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-colors font-medium',
                statusFilter === s
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : paged.length === 0 ? (
        <div className="card p-12 text-center text-gray-500 dark:text-gray-400">
          <Building size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {filtered.length === 0 && properties.length > 0
              ? 'No properties match your filters.'
              : 'No properties yet.'}
          </p>
          {properties.length === 0 && (
            <Link href="/dashboard/agent/new-property" className="btn-primary mt-4 inline-flex">
              Add your first property
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Property</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      <Eye size={14} className="inline mr-1" />Views
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {paged.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
                            {property.images?.[0] ? (
                              <Image
                                src={property.images[0]}
                                alt={property.title}
                                width={48}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building size={16} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/properties/${property.id}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1"
                            >
                              {property.title}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {property.city}, {property.state}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden sm:table-cell capitalize">
                        {property.type.toLowerCase()}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {formatPrice(property.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('badge', getStatusColor(property.status))}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                        {property.viewCount ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/agent/properties/${property.id}/edit`}
                            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} className="text-gray-600 dark:text-gray-400" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(property.id)}
                            className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Delete Property"
          message="Are you sure? This will permanently remove the property and all associated data."
          onConfirm={() => deleteProperty.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
          danger
          loading={deleteProperty.isPending}
        />
      )}
    </div>
  );
}
