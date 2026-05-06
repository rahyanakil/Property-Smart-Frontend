'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Building, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
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

function Orb({ className, delay = 0, duration = 7 }: { className: string; delay?: number; duration?: number }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -24, 0], x: [0, 12, 0], scale: [1, 1.12, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

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
      toast.success('Account created successfully!');
      router.push(data.role === 'AGENT' ? '/dashboard/agent' : '/dashboard/buyer');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  const fields = [
    { name: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: User, error: errors.name },
    { name: 'email' as const, label: 'Email', type: 'email', placeholder: 'you@example.com', icon: Mail, error: errors.email },
    { name: 'password' as const, label: 'Password', type: showPw ? 'text' : 'password', placeholder: 'Min. 8 characters', icon: Lock, error: errors.password },
    { name: 'confirmPassword' as const, label: 'Confirm Password', type: 'password', placeholder: 'Repeat password', icon: Lock, error: errors.confirmPassword },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950">

      {!shouldReduce && (
        <>
          <Orb className="absolute top-16 right-20 w-72 h-72 rounded-full bg-primary-200/35 dark:bg-primary-900/20 blur-3xl pointer-events-none" delay={0} duration={9} />
          <Orb className="absolute bottom-16 left-12 w-80 h-80 rounded-full bg-blue-200/35 dark:bg-blue-900/20 blur-3xl pointer-events-none" delay={3} duration={11} />
        </>
      )}

      <motion.div
        className="relative w-full max-w-md z-10"
        initial={shouldReduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        {!shouldReduce && (
          <motion.div
            className="absolute -inset-4 rounded-3xl bg-primary-400/8 dark:bg-primary-600/8 blur-2xl pointer-events-none"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={shouldReduce ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-2xl">
            <Building size={28} />
            PropertySmart
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Join thousands of property seekers</p>
        </motion.div>

        <motion.div
          className="card dark:bg-gray-900 p-8 shadow-xl"
          initial={shouldReduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Role selector */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {(['BUYER', 'AGENT'] as const).map((role) => (
                  <motion.label
                    key={role}
                    whileHover={shouldReduce ? {} : { scale: 1.02 }}
                    whileTap={shouldReduce ? {} : { scale: 0.98 }}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedRole === role
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <input {...register('role')} type="radio" value={role} className="sr-only" />
                    <span className="font-medium text-sm">
                      {role === 'BUYER' ? '🏠 Buyer' : '🏢 Agent'}
                    </span>
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
                transition={{ delay: 0.32 + i * 0.07, duration: 0.4, ease }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <div className="relative group">
                  <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    {...register(name)}
                    type={type}
                    className="input pl-9 focus:ring-2 focus:ring-primary-500/20 transition-shadow"
                    placeholder={placeholder}
                  />
                  {name === 'password' && (
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
                  )}
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-red-500 text-xs mt-1"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                    >
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
              transition={{ delay: 0.7, duration: 0.4, ease }}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3 relative overflow-hidden"
                whileHover={shouldReduce ? {} : { scale: 1.02, boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}
                whileTap={shouldReduce ? {} : { scale: 0.98 }}
              >
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
                      Creating account…
                    </>
                  ) : 'Create Account'}
                </span>
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium hover:underline">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
