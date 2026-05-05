'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Eye, EyeOff, Save, Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  bio: z.string().max(300, 'Bio max 300 characters').optional(),
});

const pwSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type ProfileFormData = z.infer<typeof profileSchema>;
type PwFormData = z.infer<typeof pwSchema>;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register: rp, handleSubmit: hp, formState: { errors: ep, isSubmitting: isp } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '', bio: user?.bio || '' },
  });

  const { register: rw, handleSubmit: hw, formState: { errors: ew, isSubmitting: isw }, reset: resetPw } = useForm<PwFormData>({
    resolver: zodResolver(pwSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await userApi.updateProfile(data);
      await refreshUser();
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: PwFormData) => {
    try {
      await userApi.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed!');
      resetPw();
    } catch {
      toast.error('Current password incorrect');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    setUploadingAvatar(true);
    try {
      await userApi.uploadAvatar(avatarFile);
      await refreshUser();
      toast.success('Avatar updated!');
      setAvatarFile(null);
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Manage your account information</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Avatar card */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Camera size={18} className="text-primary-500" /> Profile Photo
          </h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {(avatarPreview || user.avatar) ? (
                <img src={avatarPreview || user.avatar!} alt={user.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/40" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center ring-4 ring-primary-50 dark:ring-primary-900/20">
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-2xl">{user.name[0].toUpperCase()}</span>
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
                <Camera size={13} className="text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn('badge uppercase', user.role === 'ADMIN' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : user.role === 'AGENT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400')}>
                  <Shield size={10} className="mr-1" />{user.role}
                </span>
              </div>
              {avatarFile && (
                <button onClick={handleAvatarUpload} disabled={uploadingAvatar} className="btn-primary text-xs mt-3">
                  {uploadingAvatar ? 'Uploading...' : 'Save Photo'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-primary-500" /> Personal Information
          </h2>
          <form onSubmit={hp(onProfileSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
              <input {...rp('name')} className="input" placeholder="Your full name" />
              {ep.name && <p className="text-red-500 text-xs mt-1">{ep.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={user.email} disabled className="input opacity-60 cursor-not-allowed" />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input {...rp('phone')} className="input" placeholder="+880 1711-000000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea {...rp('bio')} rows={3} className="input resize-none" placeholder="Tell us about yourself..." />
              {ep.bio && <p className="text-red-500 text-xs mt-1">{ep.bio.message}</p>}
            </div>
            <button type="submit" disabled={isp} className="btn-primary flex items-center gap-2">
              <Save size={16} />
              {isp ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield size={18} className="text-primary-500" /> Change Password
          </h2>
          <form onSubmit={hw(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password *</label>
              <div className="relative">
                <input {...rw('currentPassword')} type={showPw ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {ew.currentPassword && <p className="text-red-500 text-xs mt-1">{ew.currentPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password *</label>
              <div className="relative">
                <input {...rw('newPassword')} type={showNewPw ? 'text' : 'password'} className="input pr-10" placeholder="Min 8 chars, uppercase + number" />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {ew.newPassword && <p className="text-red-500 text-xs mt-1">{ew.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password *</label>
              <input {...rw('confirmPassword')} type="password" className="input" placeholder="••••••••" />
              {ew.confirmPassword && <p className="text-red-500 text-xs mt-1">{ew.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isw} className="btn-primary flex items-center gap-2">
              <Shield size={16} />
              {isw ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
