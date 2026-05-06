'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  motion, useReducedMotion, AnimatePresence,
  useMotionValue, useSpring, useTransform,
} from 'framer-motion';
import {
  Search, Home, Building, TrendingUp, Star, ChevronRight, MapPin,
  Shield, Clock, Award, Users, CheckCircle, ChevronDown,
  FileSearch, Key, Handshake, MessageSquare, Phone, Mail,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FeaturedProperties from '@/components/property/FeaturedProperties';
import AnimatedSection, { AnimatedItem } from '@/components/ui/AnimatedSection';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, staggerFast } from '@/lib/animations';

const testimonials = [
  {
    name: 'নাদিয়া রহমান',
    role: 'প্রথমবার বাড়ি ক্রেতা',
    avatar: 'NR',
    rating: 5,
    text: 'PropertySmart এর মাধ্যমে গুলশানে আমার স্বপ্নের ফ্ল্যাট খুঁজে পেলাম। ফিল্টার সিস্টেম অসাধারণ এবং এজেন্টরা খুবই সহায়ক। মাত্র ২ সপ্তাহে বাড়ি পেয়েছি!',
  },
  {
    name: 'করিম সাহেব',
    role: 'রিয়েল এস্টেট বিনিয়োগকারী',
    avatar: 'KS',
    rating: 5,
    text: 'একাধিক প্রপার্টি পরিচালনা করা এখন অনেক সহজ। অ্যানালিটিক্স ও মার্কেট ইনসাইট সত্যিই অমূল্য। ঢাকা ও চট্টগ্রামে আমার বিনিয়োগ এই প্ল্যাটফর্ম থেকেই করেছি।',
  },
  {
    name: 'রহিমা চৌধুরী',
    role: 'প্রপার্টি এজেন্ট, ৫ বছর',
    avatar: 'RC',
    rating: 5,
    text: 'এজেন্ট ড্যাশবোর্ড আমার সব দরকার মেটায়। লিস্টিং, বুকিং ও ক্লায়েন্ট ম্যানেজমেন্ট একটি জায়গা থেকেই করতে পারছি। আমার ব্যবসা ৪০% বেড়েছে।',
  },
];

const faqs = [
  {
    q: 'How do I list my property on PropertySmart?',
    a: 'Register as an Agent, complete your profile, then use the "Add Property" button in your dashboard. You can add photos, details, pricing, and your property goes live immediately after review.',
  },
  {
    q: 'Are the listings verified?',
    a: 'Yes. All properties go through our verification process. Our team reviews each listing for accuracy, and agents must complete identity verification before listing properties.',
  },
  {
    q: 'How does the booking/viewing process work?',
    a: "As a buyer, click \"Book Viewing\" on any property page. Select your preferred date and time. The agent will confirm within 24 hours. You'll receive email notifications for all updates.",
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit cards, debit cards, and bank transfers through our secure Stripe payment system. All transactions are encrypted and PCI-compliant.',
  },
  {
    q: 'Can I save properties to view later?',
    a: 'Absolutely. Click the heart icon on any property to add it to your Favorites. Access all your saved properties from your buyer dashboard anytime.',
  },
];

// Floating blob — purely decorative, GPU-only transforms
function GlowBlob({ className, duration = 8, delay = 0 }: { className: string; duration?: number; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.55, 0.25] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// Floating decorative stat card
function FloatingCard({
  x, y, rotate, children,
}: {
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  rotate: ReturnType<typeof useSpring>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ x, y, rotate, willChange: 'transform' }}
      className="absolute pointer-events-none select-none"
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-2xl text-white text-sm font-medium">
        {children}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const shouldReduce = useReducedMotion();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/properties?search=${encodeURIComponent(q)}` : '/properties');
  };

  const bezier: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
  const heroRef = useRef<HTMLElement>(null);

  // Mouse-tracking parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  // Each decorative layer moves at a different speed — depth illusion
  const blob1X  = useTransform(smoothX, [-0.5, 0.5], [-40, 40]);
  const blob1Y  = useTransform(smoothY, [-0.5, 0.5], [-28, 28]);
  const blob2X  = useTransform(smoothX, [-0.5, 0.5], [28, -28]);
  const blob2Y  = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const blob3X  = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const blob3Y  = useTransform(smoothY, [-0.5, 0.5], [30, -30]);
  const card1X  = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const card1Y  = useTransform(smoothY, [-0.5, 0.5], [-16, 16]);
  const card1R  = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const card2X  = useTransform(smoothX, [-0.5, 0.5], [16, -16]);
  const card2Y  = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);
  const card2R  = useTransform(smoothX, [-0.5, 0.5], [4, -4]);
  const card3X  = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const card3Y  = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const card3R  = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);
  const contentX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const contentY = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);
  // Spotlight position
  const spotX = useTransform(smoothX, [-0.5, 0.5], ['20%', '80%']);
  const spotY = useTransform(smoothY, [-0.5, 0.5], ['10%', '70%']);

  const handleHeroMouse = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduce || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [shouldReduce, mouseX, mouseY]);

  const handleHeroLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Hero stagger variants
  const heroContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
  };
  const heroItem = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: bezier } },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ───── 1. Hero ───── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouse}
        onMouseLeave={handleHeroLeave}
        className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white overflow-hidden"
        style={{ minHeight: '68vh', perspective: '1000px' }}
      >
        {/* Dot-grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Mouse-driven spotlight */}
        {!shouldReduce && (
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 600,
              height: 600,
              left: spotX,
              top: spotY,
              x: '-50%',
              y: '-50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
              willChange: 'transform',
            }}
          />
        )}

        {/* Parallax blobs */}
        {!shouldReduce ? (
          <>
            <motion.div style={{ x: blob1X, y: blob1Y, willChange: 'transform' }} className="absolute -top-32 -left-32 pointer-events-none">
              <GlowBlob className="w-[480px] h-[480px] rounded-full bg-primary-400/25 blur-3xl" duration={9} />
            </motion.div>
            <motion.div style={{ x: blob2X, y: blob2Y, willChange: 'transform' }} className="absolute -bottom-28 -right-28 pointer-events-none">
              <GlowBlob className="w-[420px] h-[420px] rounded-full bg-blue-400/20 blur-3xl" duration={11} delay={1.5} />
            </motion.div>
            <motion.div style={{ x: blob3X, y: blob3Y, willChange: 'transform' }} className="absolute top-1/2 -translate-y-1/2 -right-48 pointer-events-none">
              <GlowBlob className="w-[320px] h-[320px] rounded-full bg-yellow-400/10 blur-3xl" duration={13} delay={3} />
            </motion.div>
          </>
        ) : (
          <>
            <GlowBlob className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-500/20 blur-3xl pointer-events-none" />
            <GlowBlob className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
          </>
        )}

        {/* Floating decorative stat cards (parallax, hidden on mobile) */}
        {!shouldReduce && (
          <div className="hidden lg:block">
            <div className="absolute" style={{ top: '14%', left: '3%' }}>
              <FloatingCard x={card1X} y={card1Y} rotate={card1R}>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">🏠</span>
                  <div>
                    <div className="text-xs text-white/60 leading-none">New listing</div>
                    <div className="font-bold text-sm">Gulshan Villa</div>
                    <div className="text-xs text-green-300">৳ 1.2 Cr</div>
                  </div>
                </div>
              </FloatingCard>
            </div>
            <div className="absolute" style={{ top: '60%', left: '2%' }}>
              <FloatingCard x={card2X} y={card2Y} rotate={card2R}>
                <div className="flex items-center gap-2">
                  <span className="text-blue-300 text-lg">📍</span>
                  <div>
                    <div className="text-xs text-white/60 leading-none">Just booked</div>
                    <div className="font-bold text-sm">Dhanmondi Apt</div>
                    <div className="text-xs text-blue-300">Viewing confirmed</div>
                  </div>
                </div>
              </FloatingCard>
            </div>
            <div className="absolute" style={{ top: '20%', right: '3%' }}>
              <FloatingCard x={card3X} y={card3Y} rotate={card3R}>
                <div className="flex items-center gap-2">
                  <span className="text-green-300 text-lg">✨</span>
                  <div>
                    <div className="text-xs text-white/60 leading-none">Featured</div>
                    <div className="font-bold text-sm">Bashundhara Tower</div>
                    <div className="text-xs text-white/70">5 bed · 4200 sqft</div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-black/15" />

        {/* Hero content — subtle parallax on whole block */}
        <motion.div
          style={shouldReduce ? { minHeight: '68vh' } : { x: contentX, y: contentY, willChange: 'transform', minHeight: '68vh' }}
          className="relative max-w-5xl mx-auto px-4 py-28 text-center flex flex-col items-center justify-center"
        >
          <motion.div
            className="flex flex-col items-center gap-6 w-full"
            variants={shouldReduce ? {} : heroContainer}
            initial="hidden"
            animate="show"
          >
            {/* Live badge */}
            <motion.span
              variants={shouldReduce ? {} : heroItem}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium"
              whileHover={shouldReduce ? {} : { scale: 1.04, backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              10,000+ Properties Listed Nationwide
            </motion.span>

            {/* Heading */}
            <motion.h1
              variants={shouldReduce ? {} : heroItem}
              className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.3)' }}
            >
              Find Your Dream
              <motion.span
                className="block text-yellow-400"
                animate={shouldReduce ? {} : { textShadow: ['0 0 0px rgba(250,204,21,0)', '0 0 32px rgba(250,204,21,0.5)', '0 0 0px rgba(250,204,21,0)'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                Property Today
              </motion.span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={shouldReduce ? {} : heroItem}
              className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed"
            >
              Browse thousands of listings — houses, apartments, condos, and commercial spaces.
              Your perfect property is just a search away.
            </motion.p>

            {/* Search */}
            <motion.form
              variants={shouldReduce ? {} : heroItem}
              onSubmit={handleSearch}
              className="bg-white/95 dark:bg-gray-800 rounded-2xl p-2 max-w-2xl w-full mx-auto flex gap-2 shadow-2xl backdrop-blur-sm"
              whileFocus={shouldReduce ? {} : { boxShadow: '0 0 0 3px rgba(59,130,246,0.4), 0 20px 48px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center flex-1 gap-2 px-3">
                <Search className="text-gray-400 shrink-0" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by city, area, or property type..."
                  className="flex-1 text-gray-800 dark:text-gray-200 dark:bg-gray-800 outline-none text-sm bg-transparent"
                />
              </div>
              <motion.button
                type="submit"
                className="btn-primary rounded-xl whitespace-nowrap"
                whileHover={shouldReduce ? {} : { scale: 1.05, boxShadow: '0 6px 20px rgba(37,99,235,0.5)' }}
                whileTap={shouldReduce ? {} : { scale: 0.96 }}
              >
                Search
              </motion.button>
            </motion.form>

            {/* Quick filters */}
            <motion.div variants={shouldReduce ? {} : heroItem} className="flex gap-2 flex-wrap justify-center">
              {['For Sale', 'For Rent', 'New Listings', 'Featured'].map((f, i) => (
                <motion.div
                  key={f}
                  initial={shouldReduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.08, duration: 0.4, ease: bezier }}
                  whileHover={shouldReduce ? {} : { scale: 1.08, backgroundColor: 'rgba(255,255,255,0.22)' }}
                  whileTap={shouldReduce ? {} : { scale: 0.94 }}
                >
                  <Link href="/properties" className="block bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full transition-colors">
                    {f}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats — each number pops in */}
            <motion.div
              variants={shouldReduce ? {} : heroItem}
              className="mt-6 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center"
            >
              {[
                { label: 'Properties', value: '10,000+' },
                { label: 'Happy Clients', value: '5,000+' },
                { label: 'Expert Agents', value: '200+' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.12, type: 'spring', stiffness: 400, damping: 22 }}
                  className="group"
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-extrabold text-yellow-400"
                    whileHover={shouldReduce ? {} : { scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-blue-200/80 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" className="w-full" preserveAspectRatio="none" style={{ height: 40 }}>
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" fill="currentColor" className="text-gray-50 dark:text-gray-900" />
          </svg>
        </div>
      </section>

      {/* ───── 2. Browse by Type ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-10">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse by Type</h2>
              <p className="text-gray-500 dark:text-gray-400">Find the property that fits your lifestyle</p>
            </AnimatedItem>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={shouldReduce ? {} : staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {[
              { type: 'HOUSE', label: 'Houses', icon: Home, count: '3,200+' },
              { type: 'APARTMENT', label: 'Apartments', icon: Building, count: '2,800+' },
              { type: 'CONDO', label: 'Condos', icon: Building, count: '1,500+' },
              { type: 'TOWNHOUSE', label: 'Townhouses', icon: Home, count: '900+' },
              { type: 'LAND', label: 'Land', icon: MapPin, count: '600+' },
              { type: 'COMMERCIAL', label: 'Commercial', icon: TrendingUp, count: '400+' },
            ].map(({ type, label, icon: Icon, count }) => (
              <motion.div key={type} variants={shouldReduce ? {} : fadeUp}>
                <motion.div whileHover={shouldReduce ? {} : { y: -4, scale: 1.03 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
                  <Link
                    href={`/properties?type=${type}`}
                    className="card p-5 text-center hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md transition-all group block"
                  >
                    <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                      <Icon size={24} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 block">{label}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 block">{count}</span>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── 3. Featured Properties ───── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="flex items-center justify-between mb-8">
            <AnimatedItem variants={fadeLeft}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Properties</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked listings from our top agents</p>
              </div>
            </AnimatedItem>
            <AnimatedItem variants={fadeRight}>
              <motion.div whileHover={shouldReduce ? {} : { x: 4 }}>
                <Link href="/properties?isFeatured=true" className="btn-secondary flex items-center gap-1">
                  View All <ChevronRight size={16} />
                </Link>
              </motion.div>
            </AnimatedItem>
          </AnimatedSection>
          <FeaturedProperties />
        </div>
      </section>

      {/* ───── 4. How It Works ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection className="mb-12">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">How It Works</h2>
              <p className="text-gray-500 dark:text-gray-400">Find your perfect home in 3 simple steps</p>
            </AnimatedItem>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
            variants={shouldReduce ? {} : staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-400 dark:from-primary-800 dark:to-primary-600" />
            {[
              { step: '01', icon: FileSearch, title: 'Search & Filter', desc: 'Use our advanced search and filtering tools to find properties that match your exact criteria — location, price, type, and more.' },
              { step: '02', icon: Key, title: 'Book a Viewing', desc: 'Schedule a property viewing directly through the platform. Choose your preferred date and time. Our agents confirm within 24 hours.' },
              { step: '03', icon: Handshake, title: 'Close the Deal', desc: 'Work with our verified agents to finalize the purchase or rental agreement. Secure payments processed safely through Stripe.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <motion.div
                key={step}
                variants={shouldReduce ? {} : fadeUp}
                whileHover={shouldReduce ? {} : { y: -6, boxShadow: '0 16px 32px -8px rgba(37,99,235,0.14)' }}
                className="card p-8 text-center transition-shadow cursor-default"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon size={30} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <motion.span
                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 dark:bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    initial={shouldReduce ? false : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.3 }}
                  >
                    {step}
                  </motion.span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── 5. Why PropertySmart ───── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection variants={fadeLeft}>
              <AnimatedItem variants={fadeLeft}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose PropertySmart?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">We combine cutting-edge technology with deep real estate expertise to deliver an unmatched property search experience.</p>
              </AnimatedItem>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'Verified Listings Only', desc: 'Every listing is manually reviewed by our team for accuracy and legitimacy.' },
                  { icon: Clock, title: '24/7 Support', desc: 'Our dedicated support team is available round the clock to assist you.' },
                  { icon: TrendingUp, title: 'Real-time Market Data', desc: 'Access live pricing trends, neighborhood statistics, and investment insights.' },
                  { icon: Award, title: 'Award-Winning Service', desc: 'Recognized as the #1 real estate platform for 3 consecutive years.' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={shouldReduce ? false : { opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1, ease: bezier }}
                    className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={shouldReduce ? {} : staggerFast}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                { value: '10K+', label: 'Active Listings', gradient: 'from-primary-500 to-primary-700' },
                { value: '5K+', label: 'Happy Clients', gradient: 'from-secondary-500 to-secondary-600' },
                { value: '200+', label: 'Expert Agents', gradient: 'from-yellow-400 to-yellow-600' },
                { value: '98%', label: 'Satisfaction Rate', gradient: 'from-purple-500 to-purple-700' },
              ].map(({ value, label, gradient }) => (
                <motion.div
                  key={label}
                  variants={shouldReduce ? {} : fadeUp}
                  whileHover={shouldReduce ? {} : { y: -4, scale: 1.02 }}
                  className="card p-6 text-center cursor-default"
                >
                  <div className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br ${gradient}`}>
                    {value}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── 6. Testimonials ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">What Our Clients Say</h2>
              <p className="text-gray-500 dark:text-gray-400">Thousands of happy clients trust PropertySmart</p>
            </AnimatedItem>
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={shouldReduce ? {} : staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={shouldReduce ? {} : fadeUp}
                whileHover={shouldReduce ? {} : { y: -6, boxShadow: '0 16px 32px -8px rgba(0,0,0,0.10)' }}
                className="card p-6 flex flex-col transition-shadow cursor-default"
                custom={i}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <motion.span
                      key={idx}
                      initial={shouldReduce ? false : { opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * 0.06, type: 'spring', stiffness: 500, damping: 20 }}
                    >
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    </motion.span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1 mb-4">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── 7. Stats Banner ───── */}
      <section className="py-12 px-4 bg-primary-600 dark:bg-primary-800 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            variants={shouldReduce ? {} : staggerFast}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { icon: Building, value: '10,000+', label: 'Properties Listed' },
              { icon: Users, value: '5,000+', label: 'Registered Buyers' },
              { icon: CheckCircle, value: '3,500+', label: 'Deals Closed' },
              { icon: Star, value: '4.9/5', label: 'Average Rating' },
            ].map(({ icon: Icon, value, label }) => (
              <motion.div
                key={label}
                variants={shouldReduce ? {} : fadeUp}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <Icon size={22} />
                </div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-primary-100 text-sm mt-1">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── 8. FAQ ───── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <AnimatedItem>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
              <p className="text-gray-500 dark:text-gray-400">Everything you need to know about PropertySmart</p>
            </AnimatedItem>
          </AnimatedSection>

          <AnimatedSection stagger className="space-y-3">
            {faqs.map((faq, idx) => (
              <AnimatedItem key={idx}>
                <div className="card overflow-hidden">
                  <button
                    className="flex items-center justify-between w-full p-5 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    {faq.q}
                    <motion.span
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 ml-3 text-gray-400"
                    >
                      <ChevronDown size={18} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: bezier }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t dark:border-gray-700 pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ───── 9. Contact CTA ───── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <AnimatedSection variants={fadeLeft}>
              <AnimatedItem variants={fadeLeft}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Find Your Home?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Join thousands of happy homeowners who found their dream property through PropertySmart.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <motion.div whileHover={shouldReduce ? {} : { scale: 1.04 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
                    <Link href="/register" className="btn-primary flex items-center gap-2">
                      Get Started Free <ChevronRight size={16} />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={shouldReduce ? {} : { scale: 1.04 }} whileTap={shouldReduce ? {} : { scale: 0.97 }}>
                    <Link href="/contact" className="btn-secondary flex items-center gap-2">
                      <MessageSquare size={16} /> Contact an Agent
                    </Link>
                  </motion.div>
                </div>
              </AnimatedItem>
            </AnimatedSection>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={shouldReduce ? {} : staggerFast}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                { href: 'tel:+8809611234567', icon: Phone, label: 'আমাদের কল করুন', value: '+880 961-123-4567', iconBg: 'bg-primary-50 dark:bg-primary-900/30', iconColor: 'text-primary-600 dark:text-primary-400' },
                { href: 'mailto:hello@propertysmart.com.bd', icon: Mail, label: 'ইমেইল করুন', value: 'hello@propertysmart.com.bd', iconBg: 'bg-secondary-50 dark:bg-secondary-900/20', iconColor: 'text-secondary-600 dark:text-secondary-400' },
              ].map(({ href, icon: Icon, label, value, iconBg, iconColor }) => (
                <motion.a
                  key={href}
                  href={href}
                  variants={shouldReduce ? {} : fadeUp}
                  whileHover={shouldReduce ? {} : { y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.1)' }}
                  className="card p-5 flex items-center gap-4 transition-shadow"
                >
                  <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
                    <Icon size={22} className={iconColor} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
