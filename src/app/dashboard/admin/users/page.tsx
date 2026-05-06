'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users, Shield, Building, UserCheck } from 'lucide-react';
import { userApi } from '@/lib/api';
import { formatDate, cn } from '@/lib/utils';
import { type User, type Role } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ROLES: Role[] = ['BUYER', 'AGENT', 'ADMIN'];
const PER_PAGE = 10;

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', search],
    queryFn: async () =>
      (await userApi.list({ search: search || undefined, limit: 200 })).data.data,
  });

  const toggleStatus = useMutation({
    mutationFn: (id: string) => userApi.toggleStatus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userApi.updateRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Role updated');
    },
    onError: () => toast.error('Failed to update role'),
  });

  const allUsers: User[] = useMemo(() => data?.users || [], [data]);

  const filtered = useMemo(() => {
    let list = allUsers;
    if (roleFilter !== 'ALL') list = list.filter((u) => u.role === roleFilter);
    return list;
  }, [allUsers, roleFilter]);

  const counts = useMemo(() => ({
    ALL: allUsers.length,
    BUYER: allUsers.filter((u) => u.role === 'BUYER').length,
    AGENT: allUsers.filter((u) => u.role === 'AGENT').length,
    ADMIN: allUsers.filter((u) => u.role === 'ADMIN').length,
  }), [allUsers]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleRoleFilter = (r: Role | 'ALL') => { setRoleFilter(r); setPage(1); };
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          {data?.total ?? 0} registered users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Users', value: counts.ALL, icon: Users, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Buyers', value: counts.BUYER, icon: UserCheck, color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' },
          { label: 'Agents', value: counts.AGENT, icon: Building, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Admins', value: counts.ADMIN, icon: Shield, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative max-w-xs flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(['ALL', ...ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleFilter(r)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full border transition-colors font-medium',
                roleFilter === r
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-primary-300'
              )}
            >
              {r} <span className="opacity-70">({counts[r as keyof typeof counts] ?? allUsers.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : paged.length === 0 ? (
        <div className="card p-12 text-center text-gray-500 dark:text-gray-400">
          <Users size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No users found.</p>
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">User</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400 hidden md:table-cell">Joined</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {paged.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                            <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">
                              {u.name[0]?.toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 dark:text-white truncate">{u.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })}
                          className="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 cursor-pointer"
                        >
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          'badge',
                          u.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        )}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden md:table-cell whitespace-nowrap">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleStatus.mutate(u.id)}
                          disabled={toggleStatus.isPending}
                          className={cn(
                            'text-xs font-medium disabled:opacity-50',
                            u.isActive
                              ? 'text-red-600 dark:text-red-400 hover:text-red-700'
                              : 'text-green-600 dark:text-green-400 hover:text-green-700'
                          )}
                        >
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
