'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Building, Eye, EyeOff, Lock, Mail, User,
  CheckCircle, Home, Briefcase, Shield, Zap, HeartHandshake,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['BUYER', 'AGENT']),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const FEATURES = [
  { icon: Shield, text: 'Verified listings only' },
  { icon: Zap, text: 'Instant booking requests' },
  { icon: HeartHandshake, text: 'Trusted by 5,000+ clients' },
  { icon: CheckCircle, text: 'Free to get started' },
];

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const shouldReduce = useReducedMotion();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'BUYER' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      await authRegister({ name: data.name, email: data.email, password: data.password, role: data.role });
      toast.success('Account created! Welcome to PropertySmart 🎉');
      router.push(data.role === 'AGENT' ? '/dashboard/agent' : '/dashboard/buyer');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  const fields = [
    { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'Your full name', icon: User, error: errors.name },
    { name: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: Mail, error: errors.email },
    { name: 'password' as const, label: 'Password', type: showPw ? 'text' : 'password', placeholder: 'Min. 8 characters', icon: Lock, error: errors.password },
    { name: 'confirmPassword' as const, label: 'Confirm Password', type: 'password', placeholder: 'Repeat your password', icon: Lock, error: errors.confirmPassword },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div className="relative lg:w-[45%] bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700 flex flex-col justify-between p-8 lg:p-12 overflow-hidden min-h-[260px] lg:min-h-screen">

        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Ambient blobs */}
        {!shouldReduce && (
          <>
            <motion.div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary-400/20 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 11, delay: 3, repeat: Infinity, ease: 'easeInOut' }} />
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
            Start Your<br />
            <span className="text-yellow-400">Property Journey</span>
          </h2>
          <p className="text-primary-200 text-sm leading-relaxed mb-8 max-w-xs">
            Create a free account and get access to thousands of verified listings across Bangladesh.
          </p>

          {/* Feature list */}
          <motion.div
            className="space-y-3 mb-8"
            variants={shouldReduce ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                variants={shouldReduce ? {} : { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.08, duration: 0.4, ease } } }}
                className="flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-yellow-400" />
                </div>
                <span className="text-primary-100 text-sm">{text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Role cards preview */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5, ease }}
          >
            {[
              { icon: Home, label: 'Buyer', desc: 'Browse & book viewings' },
              { icon: Briefcase, label: 'Agent', desc: 'List & sell properties' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                <Icon size={18} className="text-yellow-400 mb-2" />
                <div className="text-white font-semibold text-sm">{label}</div>
                <div className="text-primary-300 text-xs mt-0.5">{desc}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom copy */}
        <motion.div
          className="text-primary-400 text-xs"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Trusted by buyers, agents &amp; investors across Bangladesh
        </motion.div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-gray-950 overflow-y-auto">
        <motion.div
          className="w-full max-w-md py-4"
          initial={shouldReduce ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          {/* Heading */}
          <motion.div
            className="mb-7"
            initial={shouldReduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Free forever. No credit card required.</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Role selector */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4, ease }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'BUYER', emoji: '🏠', label: 'Buy / Rent', sub: 'Browse listings' },
                  { value: 'AGENT', emoji: '🏢', label: 'Sell / List', sub: 'Become an agent' },
                ] as const).map(({ value, emoji, label, sub }) => (
                  <motion.label
                    key={value}
                    whileHover={shouldReduce ? {} : { scale: 1.02 }}
                    whileTap={shouldReduce ? {} : { scale: 0.98 }}
                    className={`relative flex flex-col items-center p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedRole === value
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input {...register('role')} type="radio" value={value} className="sr-only" />
                    {selectedRole === value && (
                      <motion.div
                        className="absolute top-2 right-2 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      >
                        <CheckCircle size={10} className="text-white" />
                      </motion.div>
                    )}
                    <span className="text-xl mb-1">{emoji}</span>
                    <span className={`font-semibold text-sm ${selectedRole === value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Staggered fields */}
            {fields.map(({ name, label, type, placeholder, icon: Icon, error }, i) => (
              <motion.div
                key={name}
                initial={shouldReduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.4, ease }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <div className="relative group">
                  <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                  <input
                    {...register(name)}
                    type={type}
                    className="input pl-10 py-3 rounded-xl focus:ring-2 focus:ring-primary-500/20 transition-shadow"
                    placeholder={placeholder}
                  />
                  {name === 'password' && (
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
                  )}
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p className="text-red-500 text-xs mt-1.5"
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Submit */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.4, ease }}
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
                      Creating account…
                    </>
                  ) : 'Create Free Account'}
                </span>
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </motion.p>

          <motion.p
            className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.82 }}
          >
            By creating an account you agree to our{' '}
            <Link href="/contact" className="hover:underline">Terms</Link> &amp;{' '}
            <Link href="/contact" className="hover:underline">Privacy Policy</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
