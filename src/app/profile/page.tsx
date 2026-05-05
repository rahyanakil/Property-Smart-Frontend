'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Save, Key } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/lib/api';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [pwSection, setPwSection] = useState(false);

  type ProfileData = z.infer<typeof profileSchema>;
  type PasswordData = z.infer<typeof passwordSchema>;

  const { register: regProfile, handleSubmit: handleProfile, formState: { isSubmitting: profileSubmitting } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' },
  });

  const { register: regPw, handleSubmit: handlePw, reset: resetPw, formState: { errors: pwErrors, isSubmitting: pwSubmitting } } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  if (!user) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  const onProfileSave = async (data: z.infer<typeof profileSchema>) => {
    try {
      await userApi.updateProfile(data);
      await refreshUser();
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const onPasswordChange = async (data: z.infer<typeof passwordSchema>) => {
    try {
      await userApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully');
      resetPw();
      setPwSection(false);
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    try {
      await userApi.uploadAvatar(file);
      await refreshUser();
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

          {/* Avatar */}
          <div className="card p-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-2xl">{user.name[0]}</span>
                  </div>
                )}
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
                  {avatarLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera size={14} className="text-white" />}
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="sr-only" />
                </label>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full uppercase">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Profile form */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <form onSubmit={handleProfile(onProfileSave)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...regProfile('name')} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...regProfile('phone')} className="input" placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea {...regProfile('bio')} rows={3} className="input resize-none" placeholder="Tell us about yourself..." />
              </div>
              <button type="submit" disabled={profileSubmitting} className="btn-primary flex items-center gap-2">
                <Save size={16} />
                {profileSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              <button onClick={() => setPwSection(!pwSection)} className="btn-secondary flex items-center gap-2 text-sm">
                <Key size={14} /> Change Password
              </button>
            </div>

            {pwSection && (
              <form onSubmit={handlePw(onPasswordChange)} className="space-y-4 border-t border-gray-100 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input {...regPw('currentPassword')} type="password" className="input" />
                  {pwErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.currentPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input {...regPw('newPassword')} type="password" className="input" />
                  {pwErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.newPassword.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input {...regPw('confirmPassword')} type="password" className="input" />
                  {pwErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{pwErrors.confirmPassword.message}</p>}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { resetPw(); setPwSection(false); }} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={pwSubmitting} className="btn-primary">
                    {pwSubmitting ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
