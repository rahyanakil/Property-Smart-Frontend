'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, Calendar, TrendingUp, Building } from 'lucide-react';
import { propertyApi, bookingApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { Property, Booking } from '@/types';

const PIE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

export default function AgentAnalyticsPage() {
  const { data: propsData, isLoading: propsLoading } = useQuery({
    queryKey: ['agentProperties'],
    queryFn: async () => (await propertyApi.myProperties()).data.data,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['agentBookings'],
    queryFn: async () => (await bookingApi.agentBookings()).data.data,
  });

  const properties: Property[] = useMemo(() => propsData?.properties || [], [propsData]);
  const bookings: Booking[] = useMemo(() => bookingsData?.bookings || [], [bookingsData]);

  const totalViews = useMemo(() => properties.reduce((a, p) => a + (p.viewCount || 0), 0), [properties]);

  const topProperties = useMemo(() =>
    [...properties]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 8)
      .map((p) => ({ name: p.title.length > 22 ? p.title.slice(0, 22) + '…' : p.title, views: p.viewCount || 0 })),
    [properties]
  );

  const bookingsByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach((b) => { map[b.status] = (map[b.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const isLoading = propsLoading || bookingsLoading;

  const stats = [
    { label: 'Total Listings', value: propsData?.total || 0, icon: Building, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
    {
      label: 'Avg Views / Listing',
      value: properties.length ? Math.round(totalViews / properties.length) : 0,
      icon: TrendingUp,
      color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Performance overview for your listings</p>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Views bar chart */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye size={16} className="text-primary-500" /> Top Properties by Views
              </h3>
              {topProperties.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={topProperties} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={110} />
                    <Tooltip />
                    <Bar dataKey="views" fill="#2563eb" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Bookings pie */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-primary-500" /> Bookings by Status
              </h3>
              {bookingsByStatus.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No bookings yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={bookingsByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {bookingsByStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Booking Conversion Rate', value: totalViews ? `${((bookings.length / totalViews) * 100).toFixed(1)}%` : '0%' },
              { label: 'Pending Bookings', value: bookings.filter((b) => b.status === 'PENDING').length },
              { label: 'Completed Bookings', value: bookings.filter((b) => b.status === 'COMPLETED').length },
            ].map(({ label, value }) => (
              <div key={label} className="card p-5">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
