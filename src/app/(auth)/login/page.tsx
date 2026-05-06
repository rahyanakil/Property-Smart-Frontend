'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Building, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

const DEMO_ACCOUNTS = {
  admin: { email: 'admin@propertysmart.com', password: 'Admin@1234' },
  agent: { email: 'agent@propertysmart.com', password: 'Agent@1234' },
  buyer: { email: 'buyer@propertysmart.com', password: 'Buyer@1234' },
};

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Animated floating orb
function Orb({ className, delay = 0, duration = 7 }: { className: string; delay?: number; duration?: number }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const shouldReduce = useReducedMotion();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const user = await login(data.email, data.password);
      toast.success('Welcome back!');
      const redirect = user.role === 'ADMIN' ? '/dashboard/admin' : user.role === 'AGENT' ? '/dashboard/agent' : '/dashboard/buyer';
      router.push(redirect);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    }
  };

  const fillDemo = (role: keyof typeof DEMO_ACCOUNTS) => {
    const acc = DEMO_ACCOUNTS[role];
    setValue('email', acc.email, { shouldValidate: true });
    setValue('password', acc.password, { shouldValidate: true });
    toast.success(`Demo ${role} credentials filled!`, { icon: '🔑' });
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/v1/auth/oauth/${provider}/callback`;
  };

  const formFields = [
    { label: 'Email', name: 'email' as const, type: 'email', placeholder: 'you@example.com', icon: Mail, error: errors.email },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950">

      {/* Ambient orbs */}
      {!shouldReduce && (
        <>
          <Orb className="absolute top-20 left-16 w-64 h-64 rounded-full bg-primary-200/40 dark:bg-primary-900/20 blur-3xl pointer-events-none" delay={0} duration={8} />
          <Orb className="absolute bottom-24 right-12 w-80 h-80 rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl pointer-events-none" delay={2} duration={10} />
          <Orb className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-100/30 dark:bg-primary-900/10 blur-3xl pointer-events-none" delay={4} duration={12} />
        </>
      )}

      {/* Main card */}
      <motion.div
        className="relative w-full max-w-md z-10"
        initial={shouldReduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        {/* Glow behind card */}
        {!shouldReduce && (
          <motion.div
            className="absolute -inset-4 rounded-3xl bg-primary-400/10 dark:bg-primary-600/10 blur-2xl pointer-events-none"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={shouldReduce ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <motion.div
            whileHover={shouldReduce ? {} : { scale: 1.05, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-2xl">
              <Building size={28} />
              PropertySmart
            </Link>
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>
        </motion.div>

        <motion.div
          className="card dark:bg-gray-900 p-8 shadow-xl backdrop-blur-sm"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Demo accounts */}
          <motion.div
            className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
            initial={shouldReduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease }}
          >
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-2 flex items-center gap-1.5">
              <Sparkles size={14} /> Demo Accounts (click to auto-fill):
            </p>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(DEMO_ACCOUNTS) as Array<keyof typeof DEMO_ACCOUNTS>).map((role, i) => (
                <motion.button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
                  whileHover={shouldReduce ? {} : { scale: 1.06, y: -2 }}
                  whileTap={shouldReduce ? {} : { scale: 0.94 }}
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {role}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* OAuth */}
          <motion.div
            className="space-y-2 mb-6"
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease }}
          >
            {[
              {
                provider: 'google' as const,
                label: 'Continue with Google',
                className: 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200',
                logo: (
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ),
              },
              {
                provider: 'github' as const,
                label: 'Continue with GitHub',
                className: 'border border-gray-300 dark:border-gray-600 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white',
                logo: (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                ),
              },
            ].map(({ provider, label, className, logo }) => (
              <motion.button
                key={provider}
                type="button"
                onClick={() => handleOAuth(provider)}
                className={`w-full flex items-center justify-center gap-3 font-medium text-sm py-2.5 px-4 rounded-lg transition-colors shadow-sm ${className}`}
                whileHover={shouldReduce ? {} : { scale: 1.02, y: -1 }}
                whileTap={shouldReduce ? {} : { scale: 0.98 }}
              >
                {logo} {label}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500">or sign in with email</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.4, ease }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative group">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register('email')}
                  type="email"
                  className="input pl-9 focus:ring-2 focus:ring-primary-500/20 transition-shadow"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    className="text-red-500 text-xs mt-1"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.52, duration: 0.4, ease }}
            >
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Link href="/contact" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  className="input pl-9 pr-10 focus:ring-2 focus:ring-primary-500/20 transition-shadow"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  whileTap={{ scale: 0.8 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPw ? 'off' : 'on'}
                      initial={{ opacity: 0, rotate: -30 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 30 }}
                      transition={{ duration: 0.15 }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    className="text-red-500 text-xs mt-1"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4, ease }}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 relative overflow-hidden"
                whileHover={shouldReduce ? {} : { scale: 1.02, boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}
                whileTap={shouldReduce ? {} : { scale: 0.98 }}
              >
                {/* Shimmer on hover */}
                {!shouldReduce && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Signing in…
                    </>
                  ) : 'Sign In'}
                </span>
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium hover:underline">
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
