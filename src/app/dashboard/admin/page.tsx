'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Building, CreditCard, TrendingUp, CheckCircle, Shield, BarChart2 } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { userApi, propertyApi, paymentApi } from '@/lib/api';
import { formatPrice, formatDate, getStatusColor, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';

const TABS = ['Overview', 'Users', 'Properties', 'Payments', 'Analytics', 'Settings'] as const;
type Tab = typeof TABS[number];

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>('Overview');
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const PER_PAGE = 8;

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers', userSearch],
    queryFn: async () => (await userApi.list({ search: userSearch || undefined, limit: 100 })).data.data,
  });

  const { data: propStats } = useQuery({
    queryKey: ['propertyStats'],
    queryFn: async () => (await propertyApi.stats()).data.data,
  });

  const { data: payStats } = useQuery({
    queryKey: ['paymentStats'],
    queryFn: async () => (await paymentApi.stats()).data.data,
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => (await paymentApi.adminPayments()).data.data,
  });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => userApi.toggleStatus(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success('User status updated'); },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userApi.updateRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success('Role updated'); },
  });

  const allUsers = useMemo(() => usersData?.users || [], [usersData]);
  const allPayments = useMemo(() => paymentsData?.payments || [], [paymentsData]);

  // Chart data
  const revenueByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    allPayments.filter((p: import('@/types').Payment) => p.status === 'SUCCEEDED').forEach((p: import('@/types').Payment) => {
      const month = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      map[month] = (map[month] || 0) + p.amount;
    });
    return Object.entries(map).map(([month, revenue]) => ({ month, revenue })).slice(-6);
  }, [allPayments]);

  const roleDistribution = useMemo(() => {
    const buyers = allUsers.filter((u: import('@/types').User) => u.role === 'BUYER').length;
    const agents = allUsers.filter((u: import('@/types').User) => u.role === 'AGENT').length;
    const admins = allUsers.filter((u: import('@/types').User) => u.role === 'ADMIN').length;
    return [
      { name: 'Buyers', value: buyers },
      { name: 'Agents', value: agents },
      { name: 'Admins', value: admins },
    ];
  }, [allUsers]);

  const userGrowth = useMemo(() => {
    const map: Record<string, number> = {};
    allUsers.forEach((u: import('@/types').User) => {
      const month = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count })).slice(-6);
  }, [allUsers]);

  // Paginated users
  const filteredUsers = allUsers.filter((u: import('@/types').User) =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE);
  const pageUsers = filteredUsers.slice((userPage - 1) * PER_PAGE, userPage * PER_PAGE);

  const statCards = [
    { label: 'Total Users', value: usersData?.total || 0, icon: Users, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Total Properties', value: propStats?.total || 0, icon: Building, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
    { label: 'Available', value: propStats?.available || 0, icon: TrendingUp, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' },
    { label: 'Total Revenue', value: formatPrice(payStats?.totalRevenue || 0), icon: CreditCard, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400', isString: true },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* Stats grid */}
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

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
            tab === t ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          )}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue chart */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart2 size={18} className="text-primary-500" /> Monthly Revenue
              </h3>
              {revenueByMonth.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No payment data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => formatPrice(v as number)} />
                    <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* User role distribution */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
              {roleDistribution.every(d => d.value === 0) ? (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No user data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={roleDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {roleDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* User growth */}
            <div className="card p-6 lg:col-span-2">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Registration Trend</h3>
              {userGrowth.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users tab */}
      {tab === 'Users' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <input type="text" placeholder="Search by name or email..." value={userSearch}
              onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }} className="input max-w-sm" />
          </div>
          {usersLoading ? (
            <LoadingSpinner className="py-12" />
          ) : (
            <>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                      <tr>
                        {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {pageUsers.map((u: import('@/types').User) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                                <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">{u.name[0]}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-800 dark:text-gray-200">{u.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select value={u.role} onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                              className="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                              {['BUYER', 'AGENT', 'ADMIN'].map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('badge', u.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400')}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => toggleStatus.mutate(u.id)}
                              className={cn('text-xs font-medium', u.isActive ? 'text-red-600 dark:text-red-400 hover:text-red-700' : 'text-green-600 dark:text-green-400 hover:text-green-700')}>
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {(userPage - 1) * PER_PAGE + 1}–{Math.min(userPage * PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">Prev</button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setUserPage(p)} className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-colors', p === userPage ? 'bg-primary-600 text-white' : 'btn-secondary')}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setUserPage(p => Math.min(totalPages, p + 1))} disabled={userPage === totalPages} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Properties tab */}
      {tab === 'Properties' && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <Building size={56} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Manage All Properties</p>
          <p className="text-sm mb-6">Browse and moderate all listed properties on the platform.</p>
          <a href="/properties" className="btn-primary">Browse Properties</a>
        </div>
      )}

      {/* Payments tab */}
      {tab === 'Payments' && (
        <div className="space-y-4">
          <div className="card overflow-hidden">
            {paymentsLoading ? (
              <LoadingSpinner className="py-12" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                    <tr>
                      {['Buyer', 'Property', 'Amount', 'Status', 'Date'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {allPayments.map((p: import('@/types').Payment) => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{p.buyer?.name || '-'}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">{p.property?.title || '-'}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatPrice(p.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('badge', getStatusColor(p.status))}>{p.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics tab */}
      {tab === 'Analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueByMonth.length ? revenueByMonth : [{ month: 'No data', revenue: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatPrice(v as number)} />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={userGrowth.length ? userGrowth : [{ month: 'No data', count: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Settings tab */}
      {tab === 'Settings' && (
        <div className="max-w-lg space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" /> Platform Settings
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Allow new registrations', defaultChecked: true },
                { label: 'Email notifications', defaultChecked: true },
                { label: 'Agent verification required', defaultChecked: true },
                { label: 'Maintenance mode', defaultChecked: false },
              ].map(({ label, defaultChecked }) => (
                <label key={label} className="flex items-center justify-between py-2 cursor-pointer">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  <div className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition-colors', defaultChecked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700')}>
                    <span className={cn('inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform', defaultChecked ? 'translate-x-4.5' : 'translate-x-0.5')} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
