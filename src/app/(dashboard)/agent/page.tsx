'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Building, Calendar, TrendingUp, Eye, Pencil, Trash2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PropertyCard from '@/components/property/PropertyCard';
import { useAuth } from '@/hooks/useAuth';
import { propertyApi, bookingApi } from '@/lib/api';
import { formatDate, getStatusColor, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const TABS = ['Properties', 'Bookings'] as const;

export default function AgentDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<typeof TABS[number]>('Properties');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: propsData, isLoading: propsLoading } = useQuery({
    queryKey: ['agentProperties'],
    queryFn: async () => (await propertyApi.myProperties()).data.data,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['agentBookings'],
    queryFn: async () => (await bookingApi.agentBookings()).data.data,
    enabled: tab === 'Bookings',
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

  const updateBooking = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bookingApi.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agentBookings'] }); toast.success('Booking updated'); },
  });

  const properties = propsData?.properties || [];
  const bookings = bookingsData?.bookings || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome, {user?.name}</p>
            </div>
            <Link href="/dashboard/agent/new-property" className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Property
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Listings', value: propsData?.total || 0, icon: Building },
              { label: 'Total Bookings', value: bookingsData?.total || 0, icon: Calendar },
              { label: 'Total Views', value: properties.reduce((a: number, p: import('@/types').Property) => a + (p.viewCount || 0), 0), icon: Eye },
              { label: 'Pending Bookings', value: bookings.filter((b: import('@/types').Booking) => b.status === 'PENDING').length, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}>
                {t}
              </button>
            ))}
          </div>

          {/* Properties */}
          {tab === 'Properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propsLoading ? (
                <LoadingSpinner className="col-span-3 py-12" />
              ) : properties.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <Building size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No properties yet.</p>
                  <Link href="/dashboard/agent/new-property" className="btn-primary mt-4 inline-flex">Add your first property</Link>
                </div>
              ) : (
                properties.map((property: import('@/types').Property) => (
                  <div key={property.id} className="relative">
                    <PropertyCard property={property} />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <Link href={`/dashboard/agent/properties/${property.id}/edit`} className="w-8 h-8 bg-white shadow rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Pencil size={14} className="text-gray-600" />
                      </Link>
                      <button onClick={() => setDeleteId(property.id)} className="w-8 h-8 bg-white shadow rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Bookings */}
          {tab === 'Bookings' && (
            <div className="space-y-4">
              {bookingsLoading ? (
                <LoadingSpinner className="py-12" />
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-3 opacity-30" />
                  <p>No bookings yet.</p>
                </div>
              ) : (
                bookings.map((booking: import('@/types').Booking) => (
                  <div key={booking.id} className="card p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/properties/${booking.propertyId}`} className="font-semibold text-gray-900 hover:text-primary-600">
                          {booking.property?.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          By {booking.buyer?.name} ({booking.buyer?.email})
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(booking.date)} at {booking.timeSlot}</p>
                        {booking.notes && <p className="text-sm text-gray-400 italic mt-1">"{booking.notes}"</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={cn('badge', getStatusColor(booking.status))}>{booking.status}</span>
                        {booking.status === 'PENDING' && (
                          <button
                            onClick={() => updateBooking.mutate({ id: booking.id, status: 'CONFIRMED' })}
                            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                          >
                            <CheckCircle size={14} /> Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

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
