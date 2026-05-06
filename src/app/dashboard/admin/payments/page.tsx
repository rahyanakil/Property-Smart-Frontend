'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, TrendingUp, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { paymentApi } from '@/lib/api';
import { formatPrice, formatDate, getStatusColor, cn } from '@/lib/utils';
import { type Payment, type PaymentStatus } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const FILTERS: Array<PaymentStatus | 'ALL'> = ['ALL', 'SUCCEEDED', 'PENDING', 'FAILED', 'REFUNDED'];
const PER_PAGE = 12;

export default function AdminPaymentsPage() {
  const [filter, setFilter] = useState<PaymentStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => (await paymentApi.adminPayments()).data.data,
  });

  const { data: statsData } = useQuery({
    queryKey: ['paymentStats'],
    queryFn: async () => (await paymentApi.stats()).data.data,
  });

  const payments: Payment[] = useMemo(() => paymentsData?.payments || [], [paymentsData]);

  const filtered = useMemo(() =>
    filter === 'ALL' ? payments : payments.filter((p) => p.status === filter),
    [payments, filter]
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleFilter = (f: PaymentStatus | 'ALL') => { setFilter(f); setPage(1); };

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(statsData?.totalRevenue || 0),
      icon: TrendingUp,
      color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
      isString: true,
    },
    {
      label: 'Succeeded',
      value: statsData?.succeeded || 0,
      icon: CheckCircle,
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending',
      value: statsData?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    },
    {
      label: 'Failed',
      value: statsData?.failed || 0,
      icon: XCircle,
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
          <CreditCard size={20} className="text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {paymentsData?.total ?? 0} total transactions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, isString }) => (
          <div key={label} className="card p-5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{isString ? value : String(value)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-5">
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
            {f === 'ALL' ? `All (${payments.length})` : `${f} (${payments.filter((p) => p.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      {paymentsLoading ? (
        <LoadingSpinner className="py-20" />
      ) : paged.length === 0 ? (
        <div className="card p-12 text-center text-gray-500 dark:text-gray-400">
          <CreditCard size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {filtered.length === 0 && payments.length > 0
              ? `No ${filter.toLowerCase()} payments found.`
              : 'No payments yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                  <tr>
                    {['Buyer', 'Property', 'Amount', 'Currency', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {paged.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                            <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">
                              {payment.buyer?.name?.[0] || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {payment.buyer?.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {payment.buyer?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                        {payment.property?.title || 'N/A'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                        {formatPrice(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 uppercase text-xs">
                        {payment.currency || 'bdt'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {payment.status === 'SUCCEEDED' && <CheckCircle size={13} className="text-green-500" />}
                          {payment.status === 'PENDING' && <Clock size={13} className="text-yellow-500" />}
                          {payment.status === 'FAILED' && <XCircle size={13} className="text-red-500" />}
                          {payment.status === 'REFUNDED' && <RefreshCw size={13} className="text-blue-500" />}
                          <span className={cn('badge', getStatusColor(payment.status))}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(payment.createdAt)}
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-medium transition-colors',
                      p === page ? 'bg-primary-600 text-white' : 'btn-secondary'
                    )}
                  >
                    {p}
                  </button>
                ))}
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
