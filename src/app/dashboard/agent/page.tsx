'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Building, Calendar, TrendingUp, Eye, Pencil, Trash2, CheckCircle, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PropertyCard from '@/components/property/PropertyCard';
import { useAuth } from '@/hooks/useAuth';
import { propertyApi, bookingApi } from '@/lib/api';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const TABS = ['Overview', 'Properties', 'Bookings', 'Analytics'] as const;
type Tab = typeof TABS[number];
const PIE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

function AgentDashboardContent() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(() => (searchParams.get('tab') as Tab) || 'Overview');

  useEffect(() => {
    const urlTab = searchParams.get('tab') as Tab | null;
    if (urlTab && TABS.includes(urlTab)) setTab(urlTab);
  }, [searchParams]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bookingFilter, setBookingFilter] = useState('ALL');
  const [bookingPage, setBookingPage] = useState(1);
  const PER_PAGE = 5;

  const { data: propsData, isLoading: propsLoading } = useQuery({
    queryKey: ['agentProperties'],
    queryFn: async () => (await propertyApi.myProperties()).data.data,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['agentBookings'],
    queryFn: async () => (await bookingApi.agentBookings()).data.data,
  });

  const deleteProperty = useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agentProperties'] }); toast.success('Property deleted'); setDeleteId(null); },
    onError: () => toast.error('Failed to delete property'),
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bookingApi.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agentBookings'] }); toast.success('Booking updated'); },
  });

  const properties = useMemo(() => propsData?.properties || [], [propsData]);
  const allBookings = useMemo(() => bookingsData?.bookings || [], [bookingsData]);

  // Chart data
  const bookingsByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    allBookings.forEach((b: import('@/types').Booking) => { map[b.status] = (map[b.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allBookings]);

  const topProperties = useMemo(() =>
    [...properties].sort((a: import('@/types').Property, b: import('@/types').Property) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5)
      .map((p: import('@/types').Property) => ({ name: p.title.slice(0, 20) + (p.title.length > 20 ? '...' : ''), views: p.viewCount || 0 })),
    [properties]
  );

  // Filtered bookings
  const filteredBookings = allBookings.filter((b: import('@/types').Booking) => bookingFilter === 'ALL' || b.status === bookingFilter);
  const totalPages = Math.ceil(filteredBookings.length / PER_PAGE);
  const pageBookings = filteredBookings.slice((bookingPage - 1) * PER_PAGE, bookingPage * PER_PAGE);

  const totalViews = properties.reduce((a: number, p: import('@/types').Property) => a + (p.viewCount || 0), 0);
  const pendingCount = allBookings.filter((b: import('@/types').Booking) => b.status === 'PENDING').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <Link href="/dashboard/agent/new-property" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Listings', value: propsData?.total || 0, icon: Building, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total Bookings', value: allBookings.length, icon: Calendar, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Pending Bookings', value: pendingCount, icon: TrendingUp, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); router.replace(`/dashboard/agent?tab=${t}`, { scroll: false }); }} className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
            tab === t ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          )}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye size={18} className="text-primary-500" /> Top Properties by Views
              </h3>
              {topProperties.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">Add properties to see analytics</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={topProperties} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary-500" /> Bookings by Status
              </h3>
              {bookingsByStatus.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No bookings yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={bookingsByStatus} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {bookingsByStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
          {/* Recent properties */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Listings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.slice(0, 3).map((property: import('@/types').Property) => (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Link href={`/dashboard/agent/properties/${property.id}/edit`} className="w-8 h-8 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <Pencil size={14} className="text-gray-600 dark:text-gray-400" />
                    </Link>
                    <button onClick={() => setDeleteId(property.id)} className="w-8 h-8 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                  <Building size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No properties yet.</p>
                  <Link href="/dashboard/agent/new-property" className="btn-primary mt-4 inline-flex">Add your first property</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Properties tab */}
      {tab === 'Properties' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {propsLoading ? (
            <LoadingSpinner className="col-span-3 py-12" />
          ) : properties.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
              <Building size={48} className="mx-auto mb-3 opacity-30" />
              <p>No properties yet.</p>
              <Link href="/dashboard/agent/new-property" className="btn-primary mt-4 inline-flex">Add your first property</Link>
            </div>
          ) : (
            properties.map((property: import('@/types').Property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Link href={`/dashboard/agent/properties/${property.id}/edit`} className="w-8 h-8 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Pencil size={14} className="text-gray-600 dark:text-gray-400" />
                  </Link>
                  <button onClick={() => setDeleteId(property.id)} className="w-8 h-8 bg-white dark:bg-gray-800 shadow rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bookings tab */}
      {tab === 'Bookings' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((f) => (
              <button key={f} onClick={() => { setBookingFilter(f); setBookingPage(1); }}
                className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors font-medium',
                  bookingFilter === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300')}>
                {f}
              </button>
            ))}
          </div>
          {bookingsLoading ? (
            <LoadingSpinner className="py-12" />
          ) : pageBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p>No bookings yet.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {pageBookings.map((booking: import('@/types').Booking) => (
                  <div key={booking.id} className="card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link href={`/properties/${booking.propertyId}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1">
                          {booking.property?.title}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          By <strong>{booking.buyer?.name}</strong> ({booking.buyer?.email})
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(booking.date)} at {booking.timeSlot}</p>
                        {booking.notes && <p className="text-sm text-gray-400 italic mt-1">&ldquo;{booking.notes}&rdquo;</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={cn('badge', getStatusColor(booking.status))}>{booking.status}</span>
                        {booking.status === 'PENDING' && (
                          <button onClick={() => updateBooking.mutate({ id: booking.id, status: 'CONFIRMED' })}
                            className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 font-medium">
                            <CheckCircle size={14} /> Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <button onClick={() => setBookingPage(p => Math.max(1, p - 1))} disabled={bookingPage === 1} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">Prev</button>
                  <span className="text-sm text-gray-500 dark:text-gray-400 self-center">Page {bookingPage} of {totalPages}</span>
                  <button onClick={() => setBookingPage(p => Math.min(totalPages, p + 1))} disabled={bookingPage === totalPages} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Analytics tab */}
      {tab === 'Analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart2 size={18} className="text-primary-500" /> Property Views
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProperties.length ? topProperties : [{ name: 'No data', views: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={bookingsByStatus.length ? bookingsByStatus : [{ name: 'No bookings', value: 1 }]}
                    cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {(bookingsByStatus.length ? bookingsByStatus : [{ name: 'None', value: 1 }]).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Avg. Views Per Listing', value: properties.length ? Math.round(totalViews / properties.length) : 0 },
              { label: 'Booking Conversion Rate', value: properties.length ? `${Math.round((allBookings.length / (totalViews || 1)) * 100)}%` : '0%' },
              { label: 'Properties Listed', value: propsData?.total || 0 },
            ].map(({ label, value }) => (
              <div key={label} className="card p-5">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
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

export default function AgentDashboard() {
  return <Suspense><AgentDashboardContent /></Suspense>;
}
