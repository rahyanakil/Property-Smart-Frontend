'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Heart, Clock, CheckCircle, BarChart2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { bookingApi, userApi } from '@/lib/api';
import { formatPrice, formatDate, getStatusColor, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const TABS = ['Overview', 'Bookings', 'Favorites'] as const;
type Tab = typeof TABS[number];
const PIE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

export default function BuyerDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(() => (searchParams.get('tab') as Tab) || 'Overview');

  useEffect(() => {
    const urlTab = searchParams.get('tab') as Tab | null;
    if (urlTab && TABS.includes(urlTab)) setTab(urlTab);
  }, [searchParams]);
  const [bookingFilter, setBookingFilter] = useState('ALL');

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['buyerBookings'],
    queryFn: async () => (await bookingApi.myBookings()).data.data,
  });

  const { data: favoritesData, isLoading: favLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => (await userApi.favorites()).data.data,
  });

  const cancelBooking = useMutation({
    mutationFn: (id: string) => bookingApi.updateStatus(id, 'CANCELLED'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['buyerBookings'] }); toast.success('Booking cancelled'); },
    onError: () => toast.error('Failed to cancel booking'),
  });

  const removeFavorite = useMutation({
    mutationFn: (propertyId: string) => userApi.toggleFavorite(propertyId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['favorites'] }); toast.success('Removed from favorites'); },
  });

  const bookings = useMemo(() => bookingsData?.bookings || [], [bookingsData]);
  const favorites = useMemo(() => favoritesData || [], [favoritesData]);

  const bookingsByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b: import('@/types').Booking) => { map[b.status] = (map[b.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const recentMonths = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b: import('@/types').Booking) => {
      const month = new Date(b.createdAt || b.date).toLocaleDateString('en-US', { month: 'short' });
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count })).slice(-6);
  }, [bookings]);

  const filteredBookings = bookings.filter((b: import('@/types').Booking) => bookingFilter === 'ALL' || b.status === bookingFilter);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Welcome back, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Bookings', value: bookingsData?.total || 0, icon: Calendar, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Confirmed', value: bookings.filter((b: import('@/types').Booking) => b.status === 'CONFIRMED').length, icon: CheckCircle, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
          { label: 'Pending', value: bookings.filter((b: import('@/types').Booking) => b.status === 'PENDING').length, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Saved Properties', value: favorites.length, icon: Heart, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); router.replace(`/dashboard/buyer?tab=${t}`, { scroll: false }); }} className={cn(
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
                <BarChart2 size={18} className="text-primary-500" /> Booking Activity
              </h3>
              {recentMonths.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No bookings yet.<br /><Link href="/properties" className="text-primary-500 hover:underline">Browse properties</Link></div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={recentMonths}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Bookings" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Booking Status</h3>
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
          {/* Recent bookings */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Bookings</h3>
            <div className="space-y-3">
              {bookings.slice(0, 3).length === 0 ? (
                <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
                  <Calendar size={36} className="mx-auto mb-2 opacity-30" />
                  <p>No bookings yet. <Link href="/properties" className="text-primary-500 hover:underline">Browse properties</Link></p>
                </div>
              ) : bookings.slice(0, 3).map((b: import('@/types').Booking) => (
                <div key={b.id} className="card p-4 flex gap-4">
                  {b.property?.images?.[0] && (
                    <img src={b.property.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/properties/${b.propertyId}`} className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1 text-sm">
                        {b.property?.title}
                      </Link>
                      <span className={cn('badge whitespace-nowrap', getStatusColor(b.status))}>{b.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(b.date)} at {b.timeSlot}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bookings tab */}
      {tab === 'Bookings' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map((f) => (
              <button key={f} onClick={() => setBookingFilter(f)}
                className={cn('text-xs px-3 py-1.5 rounded-full border transition-colors font-medium',
                  bookingFilter === f ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300')}>
                {f}
              </button>
            ))}
          </div>
          {bookingsLoading ? (
            <LoadingSpinner className="py-12" />
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p>No bookings found. <Link href="/properties" className="text-primary-600 hover:underline">Browse properties</Link></p>
            </div>
          ) : (
            filteredBookings.map((booking: import('@/types').Booking) => (
              <div key={booking.id} className="card p-5 flex gap-4">
                {booking.property?.images?.[0] && (
                  <img src={booking.property.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/properties/${booking.propertyId}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1">
                        {booking.property?.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatDate(booking.date)} at {booking.timeSlot}
                      </p>
                    </div>
                    <span className={cn('badge whitespace-nowrap', getStatusColor(booking.status))}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.status === 'PENDING' && (
                    <button
                      onClick={() => cancelBooking.mutate(booking.id)}
                      disabled={cancelBooking.isPending}
                      className="mt-3 text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Favorites tab */}
      {tab === 'Favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favLoading ? (
            <LoadingSpinner className="col-span-3 py-12" />
          ) : favorites.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
              <Heart size={48} className="mx-auto mb-3 opacity-30" />
              <p>No favorites yet. <Link href="/properties" className="text-primary-600 hover:underline">Browse properties</Link></p>
            </div>
          ) : (
            favorites.map((fav: { id: string; propertyId: string; property: { id: string; title: string; price: number; city: string; state: string; images: string[] } }) => (
              <div key={fav.id} className="card p-4 flex gap-3 hover:shadow-md transition-shadow">
                {fav.property?.images?.[0] && (
                  <img src={fav.property.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/properties/${fav.property?.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1 text-sm">
                    {fav.property?.title}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{fav.property?.city}, {fav.property?.state}</p>
                  <p className="text-primary-600 dark:text-primary-400 font-semibold mt-1 text-sm">{formatPrice(fav.property?.price)}</p>
                  <button
                    onClick={() => removeFavorite.mutate(fav.property?.id)}
                    className="mt-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
