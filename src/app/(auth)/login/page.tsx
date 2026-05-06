'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Building, Eye, EyeOff, Lock, Mail, Sparkles,
  MapPin, Bed, Bath, TrendingUp, Shield, Star,
} from 'lucide-react';
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

const STATS = [
  { value: '10K+', label: 'Properties', icon: Building },
  { value: '5K+', label: 'Happy Clients', icon: TrendingUp },
  { value: '200+', label: 'Expert Agents', icon: Shield },
];

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
      router.push(
        user.role === 'ADMIN' ? '/dashboard/admin' :
        user.role === 'AGENT' ? '/dashboard/agent' :
        '/dashboard/buyer'
      );
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
    }
  };

  const fillDemo = (role: keyof typeof DEMO_ACCOUNTS) => {
    const acc = DEMO_ACCOUNTS[role];
    setValue('email', acc.email, { shouldValidate: true });
    setValue('password', acc.password, { shouldValidate: true });
    toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} credentials filled!`, { icon: '🔑' });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div className="relative lg:w-[45%] bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 flex flex-col justify-between p-8 lg:p-12 overflow-hidden min-h-[280px] lg:min-h-screen">

        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Ambient blobs */}
        {!shouldReduce && (
          <>
            <motion.div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-primary-400/20 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-400/15 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }} />
          </>
        )}

        {/* Logo */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <Link href="/" className="inline-flex items-center gap-2.5 text-white font-bold text-xl">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <Building size={20} className="text-white" />
            </div>
            PropertySmart
          </Link>
        </motion.div>

        {/* Main copy */}
        <motion.div
          className="my-auto py-10"
          initial={shouldReduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            Find Your Dream<br />
            <span className="text-yellow-400">Property Today</span>
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed mb-8 max-w-xs">
            Join thousands of buyers, agents, and investors on Bangladesh&apos;s most trusted real estate platform.
          </p>

          {/* Stat row */}
          <motion.div
            className="grid grid-cols-3 gap-3 mb-8"
            variants={shouldReduce ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                variants={shouldReduce ? {} : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.1, duration: 0.45, ease } } }}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center"
              >
                <Icon size={16} className="mx-auto mb-1 text-yellow-400" />
                <div className="text-white font-bold text-base">{value}</div>
                <div className="text-primary-300 text-xs">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating property card */}
          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ease }}
            whileHover={shouldReduce ? {} : { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shrink-0">
                <Building size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-white font-semibold text-sm">Gulshan Villa</span>
                  <span className="text-xs bg-green-400/20 text-green-300 px-2 py-0.5 rounded-full border border-green-400/30">Available</span>
                </div>
                <div className="flex items-center gap-1 text-primary-300 text-xs mb-2">
                  <MapPin size={11} /> Gulshan-1, Dhaka
                </div>
                <div className="flex items-center gap-3 text-primary-200 text-xs mb-2">
                  <span className="flex items-center gap-1"><Bed size={11} /> 4 bed</span>
                  <span className="flex items-center gap-1"><Bath size={11} /> 3 bath</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-bold text-sm">৳ 1.20 Cr</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => <Star key={n} size={9} className="text-yellow-400 fill-yellow-400" />)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom testimonial */}
        <motion.div
          className="text-primary-300 text-xs"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          &ldquo;Found my dream apartment in Dhanmondi within 2 weeks!&rdquo;
          <div className="mt-1 font-semibold text-primary-200">— Nadia Rahman, Dhaka</div>
        </motion.div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-950">
        <motion.div
          className="w-full max-w-md"
          initial={shouldReduce ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          {/* Heading */}
          <motion.div
            className="mb-8"
            initial={shouldReduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to your PropertySmart account</p>
          </motion.div>

          {/* Demo accounts */}
          <motion.div
            className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl"
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease }}
          >
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-xs mb-2.5 flex items-center gap-1.5">
              <Sparkles size={13} /> Quick demo — click to auto-fill
            </p>
            <div className="flex gap-2">
              {(Object.keys(DEMO_ACCOUNTS) as Array<keyof typeof DEMO_ACCOUNTS>).map((role, i) => (
                <motion.button
                  key={role}
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="flex-1 bg-white dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
                  whileHover={shouldReduce ? {} : { y: -2 }}
                  whileTap={shouldReduce ? {} : { scale: 0.95 }}
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28 + i * 0.07, type: 'spring', stiffness: 400, damping: 22 }}
                >
                  {role}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.32, duration: 0.4, ease }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <div className="relative group">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                <input
                  {...register('email')}
                  type="email"
                  className="input pl-10 py-3 rounded-xl focus:ring-2 focus:ring-primary-500/20 transition-shadow"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p className="text-red-500 text-xs mt-1.5"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Link href="/contact" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  className="input pl-10 pr-11 py-3 rounded-xl focus:ring-2 focus:ring-primary-500/20 transition-shadow"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <motion.button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  whileTap={{ scale: 0.8 }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={showPw ? 'off' : 'on'}
                      initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 30 }} transition={{ duration: 0.15 }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p className="text-red-500 text-xs mt-1.5"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4, ease }}
              className="pt-1"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm relative overflow-hidden transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                whileHover={shouldReduce ? {} : { scale: 1.01, boxShadow: '0 10px 30px rgba(37,99,235,0.45)' }}
                whileTap={shouldReduce ? {} : { scale: 0.98 }}
              >
                {!shouldReduce && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: '-100%' }} whileHover={{ x: '200%' }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }} />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      Signing in…
                    </>
                  ) : 'Sign In'}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Create one free
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
