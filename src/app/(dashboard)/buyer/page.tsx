'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Heart, CreditCard, Home, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { bookingApi, userApi } from '@/lib/api';
import { formatPrice, formatDate, getStatusColor, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

const TABS = ['Bookings', 'Favorites'] as const;

export default function BuyerDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<typeof TABS[number]>('Bookings');

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['buyerBookings'],
    queryFn: async () => (await bookingApi.myBookings()).data.data,
  });

  const { data: favoritesData, isLoading: favLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => (await userApi.favorites()).data.data,
    enabled: tab === 'Favorites',
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

  const bookings = bookingsData?.bookings || [];
  const favorites = favoritesData || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: bookingsData?.total || 0, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
              { label: 'Confirmed', value: bookings.filter((b: import('@/types').Booking) => b.status === 'CONFIRMED').length, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
              { label: 'Pending', value: bookings.filter((b: import('@/types').Booking) => b.status === 'PENDING').length, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
              { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-red-600 bg-red-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                  tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Bookings tab */}
          {tab === 'Bookings' && (
            <div className="space-y-4">
              {bookingsLoading ? (
                <LoadingSpinner className="py-12" />
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No bookings yet. <Link href="/properties" className="text-primary-600 hover:underline">Browse properties</Link></p>
                </div>
              ) : (
                bookings.map((booking: import('@/types').Booking) => (
                  <div key={booking.id} className="card p-5 flex gap-4">
                    {booking.property?.images?.[0] && (
                      <img src={booking.property.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/properties/${booking.propertyId}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                            {booking.property?.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-0.5">
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
                          className="mt-3 text-xs text-red-600 hover:text-red-700 font-medium"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favLoading ? (
                <LoadingSpinner className="col-span-2 py-12" />
              ) : favorites.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <Heart size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No favorites yet. <Link href="/properties" className="text-primary-600 hover:underline">Browse properties</Link></p>
                </div>
              ) : (
                favorites.map((fav: { id: string; propertyId: string; property: { id: string; title: string; price: number; city: string; state: string; images: string[] } }) => (
                  <div key={fav.id} className="card p-4 flex gap-3">
                    {fav.property?.images?.[0] && (
                      <img src={fav.property.images[0]} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <Link href={`/properties/${fav.property?.id}`} className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                        {fav.property?.title}
                      </Link>
                      <p className="text-sm text-gray-500">{fav.property?.city}, {fav.property?.state}</p>
                      <p className="text-primary-600 font-semibold mt-1">{formatPrice(fav.property?.price)}</p>
                      <button
                        onClick={() => removeFavorite.mutate(fav.property?.id)}
                        className="mt-2 text-xs text-red-500 hover:text-red-600"
                      >
                        Remove favorite
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
