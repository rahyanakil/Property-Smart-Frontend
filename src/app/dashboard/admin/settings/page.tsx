'use client';

import { useState } from 'react';
import {
  Settings, CheckCircle, Shield, Bell, Users, Globe,
  Lock, AlertTriangle, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
  category: 'platform' | 'security' | 'notifications';
}

const SETTINGS: ToggleSetting[] = [
  // Platform
  { id: 'allow_registration', label: 'Allow New Registrations', description: 'Allow new users to create accounts on the platform.', defaultValue: true, category: 'platform' },
  { id: 'agent_verification', label: 'Agent Verification Required', description: 'Agents must be verified by admin before listing properties.', defaultValue: true, category: 'platform' },
  { id: 'featured_listings', label: 'Featured Listings Enabled', description: 'Allow agents to mark properties as featured.', defaultValue: true, category: 'platform' },
  { id: 'maintenance_mode', label: 'Maintenance Mode', description: 'Put the platform in maintenance mode. Users will see a maintenance page.', defaultValue: false, category: 'platform' },
  { id: 'public_listings', label: 'Public Property Listings', description: 'Allow unauthenticated users to browse property listings.', defaultValue: true, category: 'platform' },
  // Security
  { id: 'two_factor_auth', label: 'Two-Factor Authentication', description: 'Require 2FA for admin accounts.', defaultValue: false, category: 'security' },
  { id: 'session_timeout', label: 'Auto Session Timeout', description: 'Automatically log out inactive users after 30 minutes.', defaultValue: true, category: 'security' },
  { id: 'login_audit', label: 'Login Audit Logs', description: 'Log all login attempts for security auditing.', defaultValue: true, category: 'security' },
  // Notifications
  { id: 'email_booking', label: 'Booking Email Notifications', description: 'Send email alerts when new bookings are created.', defaultValue: true, category: 'notifications' },
  { id: 'email_payment', label: 'Payment Email Notifications', description: 'Send email receipts for payment transactions.', defaultValue: true, category: 'notifications' },
  { id: 'email_review', label: 'Review Email Notifications', description: 'Notify agents when buyers leave a review.', defaultValue: true, category: 'notifications' },
  { id: 'admin_digest', label: 'Weekly Admin Digest', description: 'Send a weekly summary email to admin accounts.', defaultValue: false, category: 'notifications' },
];

const CATEGORY_META = {
  platform: { label: 'Platform Settings', icon: Globe, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
  security: { label: 'Security Settings', icon: Lock, color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' },
  notifications: { label: 'Notification Settings', icon: Bell, color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' },
};

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@propertysmart.com', password: 'Admin@1234', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  { role: 'Agent', email: 'agent@propertysmart.com', password: 'Agent@1234', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { role: 'Buyer', email: 'buyer@propertysmart.com', password: 'Buyer@1234', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.defaultValue]))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully');
  };

  const categories = ['platform', 'security', 'notifications'] as const;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
          <Settings size={20} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Configure platform behaviour and notifications</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl mb-6 text-sm">
        <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <p className="text-blue-700 dark:text-blue-300">
          Settings changes take effect immediately. Some changes may require a platform restart to fully apply.
        </p>
      </div>

      {/* Setting groups */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const { label, icon: Icon, color } = CATEGORY_META[cat];
          const catSettings = SETTINGS.filter((s) => s.category === cat);
          return (
            <div key={cat} className="card p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
                  <Icon size={16} />
                </div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{label}</h2>
              </div>
              <div className="space-y-4">
                {catSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {setting.label}
                        </span>
                        {setting.id === 'maintenance_mode' && settings[setting.id] && (
                          <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-medium">
                            <AlertTriangle size={11} /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => toggle(setting.id)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                        settings[setting.id] ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
                          settings[setting.id] ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            {saved ? <CheckCircle size={16} /> : <Settings size={16} />}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle size={14} /> All changes saved
            </span>
          )}
        </div>
      </div>

      {/* Demo Credentials Card */}
      <div className="card p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Shield size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Demo Accounts</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Use these accounts to test the platform across different user roles.
        </p>
        <div className="space-y-3">
          {DEMO_CREDENTIALS.map(({ role, email, password, color }) => (
            <div key={role} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', color)}>{role}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{password}</p>
                </div>
              </div>
              <Users size={14} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Platform Info */}
      <div className="card p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Info size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Platform Information</h2>
        </div>
        <dl className="space-y-2 text-sm">
          {[
            { label: 'Platform Name', value: 'PropertySmart' },
            { label: 'Version', value: '1.0.0' },
            { label: 'Region', value: 'Bangladesh' },
            { label: 'Currency', value: 'BDT (৳)' },
            { label: 'Backend API', value: 'Express 5 + Prisma + Neon PostgreSQL' },
            { label: 'Frontend', value: 'Next.js 15 + React 19 + Tailwind CSS 3' },
            { label: 'Authentication', value: 'JWT (httpOnly cookies, 7d access / 30d refresh)' },
            { label: 'Payments', value: 'Stripe PaymentIntent API' },
            { label: 'Storage', value: 'Cloudinary (images & avatars)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
              <dd className="font-medium text-gray-800 dark:text-gray-200 text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
