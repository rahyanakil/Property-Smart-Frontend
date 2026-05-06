'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, TrendingUp, Users, Building } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
  AreaChart, Area,
} from 'recharts';
import { userApi, propertyApi, paymentApi } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Payment, User, Property } from '@/types';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2'];

export default function AdminAnalyticsPage() {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers', ''],
    queryFn: async () => (await userApi.list({ limit: 500 })).data.data,
  });

  const { data: propStats } = useQuery({
    queryKey: ['propertyStats'],
    queryFn: async () => (await propertyApi.stats()).data.data,
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => (await paymentApi.adminPayments()).data.data,
  });

  const { data: allPropsData } = useQuery({
    queryKey: ['adminAllProperties'],
    queryFn: async () => (await propertyApi.list({ limit: 500 })).data.data,
  });

  const allUsers: User[] = useMemo(() => usersData?.users || [], [usersData]);
  const allPayments: Payment[] = useMemo(() => paymentsData?.payments || [], [paymentsData]);
  const allProperties: Property[] = useMemo(() => allPropsData?.properties || [], [allPropsData]);

  // Revenue by month
  const revenueByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    allPayments
      .filter((p) => p.status === 'SUCCEEDED')
      .forEach((p) => {
        const month = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        map[month] = (map[month] || 0) + p.amount;
      });
    return Object.entries(map).map(([month, revenue]) => ({ month, revenue })).slice(-8);
  }, [allPayments]);

  // User growth by month
  const userGrowth = useMemo(() => {
    const map: Record<string, number> = {};
    allUsers.forEach((u) => {
      const month = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count })).slice(-8);
  }, [allUsers]);

  // User role distribution
  const roleDistribution = useMemo(() => [
    { name: 'Buyers', value: allUsers.filter((u) => u.role === 'BUYER').length },
    { name: 'Agents', value: allUsers.filter((u) => u.role === 'AGENT').length },
    { name: 'Admins', value: allUsers.filter((u) => u.role === 'ADMIN').length },
  ], [allUsers]);

  // Property type distribution
  const propertyTypeDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    allProperties.forEach((p) => {
      map[p.type] = (map[p.type] || 0) + 1;
    });
    return Object.entries(map).map(([type, count]) => ({ name: type, value: count }));
  }, [allProperties]);

  // Payment status breakdown
  const paymentStatusDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    allPayments.forEach((p) => {
      map[p.status] = (map[p.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [allPayments]);

  // Cumulative revenue trend
  const cumulativeRevenue = useMemo(() => {
    let running = 0;
    return revenueByMonth.map((d) => {
      running += d.revenue;
      return { month: d.month, cumulative: running };
    });
  }, [revenueByMonth]);

  const summaryStats = [
    {
      label: 'Total Users',
      value: usersData?.total || 0,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Total Properties',
      value: propStats?.total || 0,
      icon: Building,
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Total Transactions',
      value: allPayments.length,
      icon: BarChart2,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(allPayments.filter((p) => p.status === 'SUCCEEDED').reduce((s, p) => s + p.amount, 0)),
      icon: TrendingUp,
      color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
      isString: true,
    },
  ];

  if (usersLoading || paymentsLoading) {
    return <LoadingSpinner className="py-20" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
          <BarChart2 size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Platform performance overview</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map(({ label, value, icon: Icon, color, isString }) => (
          <div key={label} className="card p-5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {isString ? value : String(value)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts — row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Revenue Bar */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Monthly Revenue</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Succeeded payments per month</p>
          {revenueByMonth.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              No payment data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `৳${(v / 100000).toFixed(0)}L`} />
                <Tooltip formatter={(v) => formatPrice(v as number)} labelStyle={{ color: '#374151' }} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* User Growth Line */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">User Registration Trend</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">New users joined per month</p>
          {userGrowth.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
              No user data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a' }} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts — row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Role distribution */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Role Distribution</h3>
          {roleDistribution.every((d) => d.value === 0) ? (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%" cy="50%"
                  outerRadius={72}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {roleDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Property type */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property Types</h3>
          {propertyTypeDistribution.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={propertyTypeDistribution}
                  cx="50%" cy="50%"
                  outerRadius={72}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {propertyTypeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Payment status */}
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Status Breakdown</h3>
          {paymentStatusDistribution.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No payments yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={paymentStatusDistribution}
                  cx="50%" cy="50%"
                  outerRadius={72}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {paymentStatusDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Cumulative Revenue Area Chart */}
      {cumulativeRevenue.length > 1 && (
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Cumulative Revenue Growth</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Total revenue accumulated over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={cumulativeRevenue}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `৳${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v) => formatPrice(v as number)} />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                name="Cumulative Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
