'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import {
  Home, Menu, X, User, LogOut, Building, ChevronDown,
  Sun, Moon, Heart, LayoutDashboard, Info, Phone, BookOpen,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const propertiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (propertiesRef.current && !propertiesRef.current.contains(e.target as Node)) setPropertiesOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dashboardLink = user
    ? user.role === 'ADMIN' ? '/dashboard/admin'
    : user.role === 'AGENT' ? '/dashboard/agent'
    : '/dashboard/buyer'
    : null;

  const propertyTypes = [
    { type: 'HOUSE', label: 'Houses' },
    { type: 'APARTMENT', label: 'Apartments' },
    { type: 'CONDO', label: 'Condos' },
    { type: 'TOWNHOUSE', label: 'Townhouses' },
    { type: 'LAND', label: 'Land' },
    { type: 'COMMERCIAL', label: 'Commercial' },
  ];

  const publicLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/blog', label: 'Blog', icon: BookOpen },
    { href: '/contact', label: 'Contact', icon: Phone },
  ];

  const authLinks = user ? [
    { href: dashboardLink!, label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ] : [];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400 shrink-0">
            <Building size={24} />
            PropertySmart
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                {label}
              </Link>
            ))}

            {/* Properties dropdown */}
            <div ref={propertiesRef} className="relative">
              <button
                onClick={() => setPropertiesOpen(!propertiesOpen)}
                className={cn(
                  'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith('/properties')
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                Properties <ChevronDown size={14} className={cn('transition-transform', propertiesOpen && 'rotate-180')} />
              </button>
              {propertiesOpen && (
                <div className="absolute top-full left-0 mt-1 w-44 card shadow-lg py-1 z-50">
                  <Link href="/properties" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium border-b dark:border-gray-700 mb-1" onClick={() => setPropertiesOpen(false)}>
                    All Properties
                  </Link>
                  {propertyTypes.map(({ type, label }) => (
                    <Link key={type} href={`/properties?type=${type}`} className="block px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400" onClick={() => setPropertiesOpen(false)}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                {user.role === 'BUYER' && (
                  <Link href="/dashboard/buyer?tab=Favorites" className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Favorites">
                    <Heart size={18} />
                  </Link>
                )}
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={28} height={28} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">{user.name[0].toUpperCase()}</span>
                      </div>
                    )}
                    <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={cn('transition-transform', profileOpen && 'rotate-180')} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 card shadow-lg py-1 z-50">
                      <div className="px-4 py-2.5 border-b dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full uppercase">{user.role}</span>
                      </div>
                      {dashboardLink && (
                        <Link href={dashboardLink} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setProfileOpen(false)}>
                          <LayoutDashboard size={14} /> Dashboard
                        </Link>
                      )}
                      <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setProfileOpen(false)}>
                        <User size={14} /> My Profile
                      </Link>
                      {user.role === 'BUYER' && (
                        <Link href="/dashboard/buyer?tab=Favorites" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setProfileOpen(false)}>
                          <Heart size={14} /> My Favorites
                        </Link>
                      )}
                      <div className="border-t dark:border-gray-700 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); setProfileOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
                <Link href="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t dark:border-gray-700 bg-white dark:bg-gray-900 py-3 px-4 space-y-1">
          {publicLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileOpen(false)}>
              <Icon size={15} /> {label}
            </Link>
          ))}
          <Link href="/properties" className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileOpen(false)}>
            <Building size={15} /> Properties
          </Link>
          {user ? (
            <>
              <div className="border-t dark:border-gray-700 pt-2 mt-2 space-y-1">
                {authLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-2 py-2.5 px-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setMobileOpen(false)}>
                    <Icon size={15} /> {label}
                  </Link>
                ))}
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 w-full py-2.5 px-3 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 pt-3 border-t dark:border-gray-700">
              <Link href="/login" className="btn-secondary flex-1 text-center" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/register" className="btn-primary flex-1 text-center" onClick={() => setMobileOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
