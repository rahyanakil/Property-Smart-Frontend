'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Building, CreditCard, TrendingUp, CheckCircle, XCircle, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { userApi, propertyApi, paymentApi } from '@/lib/api';
import { formatPrice, formatDate, getStatusColor, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const TABS = ['Users', 'Properties', 'Payments'] as const;

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();
  const [tab, setTab] = useState<typeof TABS[number]>('Users');
  const [userSearch, setUserSearch] = useState('');

  if (user && user.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers', userSearch],
    queryFn: async () => (await userApi.list({ search: userSearch || undefined, limit: 20 })).data.data,
    enabled: tab === 'Users',
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
    enabled: tab === 'Payments',
  });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => userApi.toggleStatus(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success('User status updated'); },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userApi.updateRole(id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['adminUsers'] }); toast.success('Role updated'); },
  });

  const users = usersData?.users || [];
  const payments = paymentsData?.payments || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">System overview and management</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: usersData?.total || 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
              { label: 'Total Properties', value: propStats?.total || 0, icon: Building, color: 'bg-green-50 text-green-600' },
              { label: 'Available', value: propStats?.available || 0, icon: TrendingUp, color: 'bg-yellow-50 text-yellow-600' },
              { label: 'Total Revenue', value: formatPrice(payStats?.totalRevenue || 0), icon: CreditCard, color: 'bg-purple-50 text-purple-600', isString: true },
            ].map(({ label, value, icon: Icon, color, isString }) => (
              <div key={label} className="card p-5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', color)}>
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{isString ? value : value.toLocaleString()}</div>
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

          {/* Users tab */}
          {tab === 'Users' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input max-w-md"
              />

              {usersLoading ? (
                <LoadingSpinner className="py-12" />
              ) : (
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {['User', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u: import('@/types').User) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                                <span className="text-primary-600 font-bold text-xs">{u.name[0]}</span>
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{u.name}</div>
                                <div className="text-xs text-gray-500">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={u.role}
                              onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                              className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                            >
                              {['BUYER', 'AGENT', 'ADMIN'].map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('badge', u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{formatDate(u.createdAt)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleStatus.mutate(u.id)}
                              className={cn('text-xs font-medium', u.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700')}
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Payments tab */}
          {tab === 'Payments' && (
            <div className="card overflow-hidden">
              {paymentsLoading ? (
                <LoadingSpinner className="py-12" />
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Buyer', 'Property', 'Amount', 'Status', 'Date'].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-medium text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((p: import('@/types').Payment) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{p.buyer?.name || '-'}</td>
                        <td className="px-4 py-3 text-gray-700">{p.property?.title || '-'}</td>
                        <td className="px-4 py-3 font-semibold">{formatPrice(p.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={cn('badge', getStatusColor(p.status))}>{p.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Properties placeholder */}
          {tab === 'Properties' && (
            <div className="text-center py-12 text-gray-500">
              <Building size={48} className="mx-auto mb-3 opacity-30" />
              <p>Property management available via the <a href="/properties" className="text-primary-600 hover:underline">Properties page</a>.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
