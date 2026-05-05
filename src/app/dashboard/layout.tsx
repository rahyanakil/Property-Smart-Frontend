'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building, LayoutDashboard, Users, CreditCard, Settings,
  Calendar, Heart, User, Plus, BarChart2, Menu, X, LogOut,
  ChevronRight, Shield, Home,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { Sun, Moon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

function getNavItems(role: string | undefined): NavItem[] {
  if (role === 'ADMIN') {
    return [
      { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/admin?tab=Users', label: 'Users', icon: Users },
      { href: '/dashboard/admin?tab=Properties', label: 'Properties', icon: Building },
      { href: '/dashboard/admin?tab=Payments', label: 'Payments', icon: CreditCard },
      { href: '/dashboard/admin?tab=Analytics', label: 'Analytics', icon: BarChart2 },
      { href: '/dashboard/admin?tab=Settings', label: 'Settings', icon: Settings },
    ];
  }
  if (role === 'AGENT') {
    return [
      { href: '/dashboard/agent', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/agent?tab=Properties', label: 'My Properties', icon: Building },
      { href: '/dashboard/agent?tab=Bookings', label: 'Bookings', icon: Calendar },
      { href: '/dashboard/agent/new-property', label: 'Add Property', icon: Plus },
      { href: '/dashboard/agent?tab=Analytics', label: 'Analytics', icon: BarChart2 },
      { href: '/dashboard/profile', label: 'Profile', icon: User },
    ];
  }
  return [
    { href: '/dashboard/buyer', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/buyer?tab=Bookings', label: 'My Bookings', icon: Calendar },
    { href: '/dashboard/buyer?tab=Favorites', label: 'Favorites', icon: Heart },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const navItems = getNavItems(user.role);

  const roleIcon = user.role === 'ADMIN' ? Shield : user.role === 'AGENT' ? Building : Home;
  const RoleIcon = roleIcon;

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    return pathname === base || (base !== '/dashboard' && pathname.startsWith(base));
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-200',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-5 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary-600 dark:text-primary-400">
            <Building size={22} />
            PropertySmart
          </Link>
          <button className="ml-auto lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-bold">{user.name[0].toUpperCase()}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <RoleIcon size={10} className="text-primary-500 shrink-0" />
                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(href)
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
              {isActive(href) && <ChevronRight size={14} className="ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <Link href="/properties" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Building size={18} /> Browse Listings
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 px-4 sticky top-0 z-20">
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile dropdown (dashboard top bar) */}
          <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">{user.name[0].toUpperCase()}</span>
              </div>
            )}
            <span className="hidden sm:block">{user.name.split(' ')[0]}</span>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
