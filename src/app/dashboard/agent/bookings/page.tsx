'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Calendar, CheckCircle, XCircle, Clock, Building } from 'lucide-react';
import { bookingApi } from '@/lib/api';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import { type Booking, type BookingStatus } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const;
type Filter = typeof FILTERS[number];
const PER_PAGE = 8;

export default function AgentBookingsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['agentBookings'],
    queryFn: async () => (await bookingApi.agentBookings()).data.data,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      bookingApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agentBookings'] });
      toast.success('Booking updated');
    },
    onError: () => toast.error('Failed to update booking'),
  });

  const bookings: Booking[] = useMemo(() => data?.bookings || [], [data]);

  const filtered = useMemo(() =>
    filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter),
    [bookings, filter]
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = useMemo(() => ({
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === 'PENDING').length,
    CONFIRMED: bookings.filter((b) => b.status === 'CONFIRMED').length,
    COMPLETED: bookings.filter((b) => b.status === 'COMPLETED').length,
    CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length,
  }), [bookings]);

  const handleFilter = (f: Filter) => { setFilter(f); setPage(1); };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Requests</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Manage viewing appointments for your listings
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: counts.ALL, icon: Calendar, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Pending', value: counts.PENDING, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Confirmed', value: counts.CONFIRMED, icon: CheckCircle, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
          { label: 'Completed', value: counts.COMPLETED, icon: Building, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', color)}>
              <Icon size={18} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleFilter(f)}
            className={cn(
              'text-xs px-3 py-1.5 rounded-full border transition-colors font-medium',
              filter === f
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300'
            )}
          >
            {f} <span className="opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Booking list */}
      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : paged.length === 0 ? (
        <div className="card p-12 text-center text-gray-500 dark:text-gray-400">
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {filtered.length === 0 && bookings.length > 0
              ? `No ${filter.toLowerCase()} bookings.`
              : 'No booking requests yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paged.map((booking) => (
              <div key={booking.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: property + buyer info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      href={`/properties/${booking.propertyId}`}
                      className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1 block"
                    >
                      {booking.property?.title ?? 'Property'}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{booking.buyer?.name}</span>
                      {booking.buyer?.email && (
                        <span className="text-gray-400 dark:text-gray-500"> · {booking.buyer.email}</span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(booking.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {booking.timeSlot}
                      </span>
                    </div>
                    {booking.notes && (
                      <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-1">
                        &ldquo;{booking.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Right: status + actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <span className={cn('badge', getStatusColor(booking.status))}>
                      {booking.status}
                    </span>

                    {booking.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus.mutate({ id: booking.id, status: 'CONFIRMED' })}
                          disabled={updateStatus.isPending}
                          className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 disabled:opacity-50"
                        >
                          <CheckCircle size={14} /> Confirm
                        </button>
                        <button
                          onClick={() => updateStatus.mutate({ id: booking.id, status: 'CANCELLED' })}
                          disabled={updateStatus.isPending}
                          className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      </div>
                    )}

                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateStatus.mutate({ id: booking.id, status: 'COMPLETED' })}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 disabled:opacity-50"
                      >
                        <CheckCircle size={14} /> Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
