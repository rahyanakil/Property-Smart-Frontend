'use client';

import Link from 'next/link';
import { useRef } from 'react';
import {
  motion, useReducedMotion, useMotionValue, useSpring, useTransform,
} from 'framer-motion';
import { Building, Users, Award, Target, Heart, TrendingUp, Shield, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CountUp from '@/components/ui/CountUp';
import WordReveal from '@/components/ui/WordReveal';
import AnimatedSection, { AnimatedItem } from '@/components/ui/AnimatedSection';
import { staggerContainer, staggerFast, fadeUp, fadeLeft, fadeRight } from '@/lib/animations';

const team = [
  { name: 'James Mitchell', role: 'CEO & Co-Founder', initials: 'JM', bio: '15+ years in real estate technology. Former VP at a top US brokerage.', gradient: 'from-primary-500 to-primary-700' },
  { name: 'Priya Sharma', role: 'CTO', initials: 'PS', bio: 'Led engineering at two PropTech startups. Stanford CS graduate.', gradient: 'from-purple-500 to-purple-700' },
  { name: 'Marcus Lee', role: 'Head of Sales', initials: 'ML', bio: 'Closed $500M+ in real estate deals. Expert in luxury residential markets.', gradient: 'from-secondary-500 to-secondary-600' },
  { name: 'Sofia Alvarez', role: 'Head of Design', initials: 'SA', bio: 'Designed award-winning property apps used by 2M+ users globally.', gradient: 'from-pink-500 to-rose-600' },
  { name: 'David Chen', role: 'Head of Agents', initials: 'DC', bio: 'Built and managed a network of 200+ top-rated real estate agents.', gradient: 'from-amber-500 to-orange-600' },
  { name: 'Rachel Kim', role: 'Marketing Director', initials: 'RK', bio: "Grew PropertySmart's user base from 0 to 50K in 18 months.", gradient: 'from-cyan-500 to-blue-600' },
];

const values = [
  { icon: Shield, title: 'Trust & Transparency', desc: 'Every listing is verified. Every agent is screened. No hidden fees, ever.' },
  { icon: Heart, title: 'Client First', desc: 'We measure our success by how well our clients succeed. Your goals are our goals.' },
  { icon: TrendingUp, title: 'Innovation', desc: 'We continuously build better tools — smarter search, richer analytics, faster bookings.' },
  { icon: Users, title: 'Community', desc: "PropertySmart is more than a marketplace. We're building a community of informed buyers, sellers, and agents." },
];

const timeline = [
  { year: '2020', title: 'Founded', desc: 'PropertySmart launched with 50 listings and a team of 4 in New York.' },
  { year: '2021', title: 'First 1,000 Users', desc: 'Grew to 1,000+ registered buyers and onboarded 25 verified agents.' },
  { year: '2022', title: 'Series A Funding', desc: 'Raised $5M to expand to 10 major US cities and build our AI search engine.' },
  { year: '2023', title: 'National Expansion', desc: 'Reached 50 states with 5,000+ listings and launched our agent dashboard.' },
  { year: '2024', title: '10,000 Listings', desc: 'Crossed 10,000 active listings and $2B in property value on the platform.' },
];

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// 3D tilt card for team members
function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 28 });
  const rotY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 28 });

  return (
    <motion.div
      ref={ref}
      className="card p-6 flex gap-4 cursor-default"
      variants={shouldReduce ? {} : fadeUp}
      style={shouldReduce ? {} : { rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 600 }}
      onMouseMove={(e) => {
        if (shouldReduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        rawX.set((e.clientX - r.left) / r.width - 0.5);
        rawY.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
      whileHover={shouldReduce ? {} : { y: -6, boxShadow: '0 20px 40px -12px rgba(37,99,235,0.18)' }}
      initial={shouldReduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease }}
    >
      <motion.div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0`}
        whileHover={shouldReduce ? {} : { scale: 1.08, rotate: 6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {member.initials}
      </motion.div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">{member.role}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white py-24 px-4 overflow-hidden">
        {/* Ambient blobs */}
        {!shouldReduce && (
          <>
            <motion.div
              className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary-400/20 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-blue-400/15 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6"
            initial={shouldReduce ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <Building size={16} /> Our Story
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <WordReveal text="We're Changing How People Find Homes" delay={0.15} stagger={0.06} />
          </h1>

          <motion.p
            className="text-xl text-primary-100 max-w-2xl mx-auto"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.6, ease }}
          >
            PropertySmart was founded in 2020 with a single mission: make real estate accessible, transparent, and stress-free for everyone.
          </motion.p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection variants={fadeLeft}>
              <AnimatedItem variants={fadeLeft}>
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-3">
                  <Target size={16} /> OUR MISSION
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Making Real Estate Accessible to Everyone
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We believe finding a home should be an exciting journey, not an overwhelming ordeal. PropertySmart combines powerful technology with deep market expertise.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  From first-time buyers to seasoned investors — our platform adapts to meet every real estate need with verified listings, intelligent search, and a network of trusted agents.
                </p>
                <div className="flex gap-4 mt-8">
                  <motion.div whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
                    <Link href="/register" className="btn-primary">Get Started</Link>
                  </motion.div>
                  <motion.div whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
                    <Link href="/contact" className="btn-secondary">Talk to Us</Link>
                  </motion.div>
                </div>
              </AnimatedItem>
            </AnimatedSection>

            {/* Stats with CountUp */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={shouldReduce ? {} : staggerFast}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                { icon: Building, to: 10000, suffix: '+', label: 'Active Listings', gradient: 'from-primary-500 to-primary-700' },
                { icon: Users, to: 5000, suffix: '+', label: 'Happy Clients', gradient: 'from-secondary-500 to-secondary-600' },
                { icon: Award, to: 200, suffix: '+', label: 'Verified Agents', gradient: 'from-purple-500 to-purple-700' },
                { icon: TrendingUp, to: 2, suffix: 'B+', prefix: '$', label: 'Property Value Listed', gradient: 'from-amber-500 to-orange-600' },
              ].map(({ icon: Icon, to, suffix, prefix, label, gradient }) => (
                <motion.div
                  key={label}
                  variants={shouldReduce ? {} : fadeUp}
                  whileHover={shouldReduce ? {} : { y: -6, scale: 1.03 }}
                  className="card p-6 text-center cursor-default"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    <CountUp to={to} suffix={suffix} prefix={prefix ?? ''} duration={1.8} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Values</h2>
              <p className="text-gray-500 dark:text-gray-400">The principles that guide everything we do</p>
            </AnimatedItem>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={shouldReduce ? {} : staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={shouldReduce ? {} : fadeUp}
                whileHover={shouldReduce ? {} : { y: -8, boxShadow: '0 16px 32px -8px rgba(37,99,235,0.16)' }}
                className="card p-6 text-center cursor-default"
              >
                <motion.div
                  className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  initial={shouldReduce ? false : { rotate: -15, scale: 0 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon size={24} className="text-primary-600 dark:text-primary-400" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meet the Team</h2>
              <p className="text-gray-500 dark:text-gray-400">The people building the future of real estate</p>
            </AnimatedItem>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Our Journey</h2>
              <p className="text-gray-500 dark:text-gray-400">From a startup idea to a nationwide platform</p>
            </AnimatedItem>
          </AnimatedSection>

          <div className="space-y-6">
            {timeline.map(({ year, title, desc }, i) => (
              <motion.div
                key={year}
                className="flex gap-4"
                initial={shouldReduce ? false : { opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-xs font-bold shrink-0"
                    initial={shouldReduce ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 500, damping: 22 }}
                  >
                    {year.slice(2)}
                  </motion.div>
                  {i < timeline.length - 1 && (
                    <motion.div
                      className="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 mt-2 origin-top"
                      initial={shouldReduce ? false : { scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease }}
                    />
                  )}
                </div>
                <motion.div
                  className="card p-4 flex-1 mb-2"
                  whileHover={shouldReduce ? {} : { x: 4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-primary-600 dark:text-primary-400">{year}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-primary-600 dark:bg-primary-800 text-white text-center overflow-hidden relative">
        {!shouldReduce && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        <div className="relative max-w-2xl mx-auto">
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
          >
            <motion.div
              animate={shouldReduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Clock size={40} className="mx-auto mb-4 opacity-80" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">
              <WordReveal text="Join the PropertySmart Community" delay={0.1} stagger={0.05} />
            </h2>
            <p className="text-primary-100 mb-8">
              Whether you&apos;re buying, selling, or just exploring — we&apos;re here to help.
            </p>
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              variants={shouldReduce ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                { href: '/register', label: 'Create Account', className: 'bg-white text-primary-600 hover:bg-primary-50 font-semibold px-6 py-3 rounded-lg transition-colors' },
                { href: '/properties', label: 'Browse Properties', className: 'border border-white text-white hover:bg-primary-700 font-semibold px-6 py-3 rounded-lg transition-colors' },
              ].map(({ href, label, className }) => (
                <motion.div
                  key={label}
                  variants={shouldReduce ? {} : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } } }}
                  whileHover={shouldReduce ? {} : { scale: 1.06, y: -3 }}
                  whileTap={shouldReduce ? {} : { scale: 0.96 }}
                >
                  <Link href={href} className={className}>{label}</Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
