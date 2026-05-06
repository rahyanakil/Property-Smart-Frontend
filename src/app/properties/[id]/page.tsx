'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Bed, Bath, Maximize, MapPin, Phone, Mail, Calendar,
  Star, Heart, Share2, ChevronLeft, ChevronRight, Eye, CheckCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate, getStatusColor, cn, TIME_SLOTS } from '@/lib/utils';
import { bookingApi, reviewApi } from '@/lib/api';
import { fadeUp, fadeRight, staggerFast } from '@/lib/animations';
import toast from 'react-hot-toast';

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, refetch } = useProperty(id);
  const { user } = useAuth();
  const shouldReduce = useReducedMotion();

  const [imgIdx, setImgIdx] = useState(0);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  if (isLoading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="lg" /></div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Property not found</h2>
        <Link href="/properties" className="btn-primary mt-4">Back to Properties</Link>
      </div>
    </div>
  );

  const images = property.images?.length ? property.images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'];

  const handleBooking = async () => {
    if (!user) return toast.error('Please login to book a viewing');
    if (user.role !== 'BUYER') return toast.error('Only buyers can book viewings');
    if (!bookingDate || !bookingTime) return toast.error('Select date and time');
    setBookingLoading(true);
    try {
      await bookingApi.create({ propertyId: id, date: new Date(bookingDate).toISOString(), timeSlot: bookingTime, notes: bookingNotes });
      toast.success('Viewing booked successfully!');
      setBookingDate(''); setBookingTime(''); setBookingNotes('');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Booking failed');
    } finally { setBookingLoading(false); }
  };

  const handleReview = async () => {
    if (!user) return toast.error('Please login to leave a review');
    if (!reviewComment.trim()) return toast.error('Please write a comment');
    setReviewLoading(true);
    try {
      await reviewApi.create(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      refetch();
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit review');
    } finally { setReviewLoading(false); }
  };

  const changeImage = (next: number) => setImgIdx((next + images.length) % images.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Breadcrumb */}
          <motion.nav
            className="text-sm text-gray-500 mb-4"
            initial={shouldReduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/properties" className="hover:text-primary-600 transition-colors">Properties</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 dark:text-gray-200 line-clamp-1">{property.title}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left column ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Image gallery with crossfade */}
              <motion.div
                className="card overflow-hidden"
                initial={shouldReduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease }}
              >
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={imgIdx}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.42, ease }}
                    >
                      <Image
                        src={images[imgIdx]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Nav arrows */}
                  {images.length > 1 && (
                    <>
                      {[
                        { dir: -1, Icon: ChevronLeft, side: 'left-3' },
                        { dir: 1, Icon: ChevronRight, side: 'right-3' },
                      ].map(({ dir, Icon, side }) => (
                        <motion.button
                          key={dir}
                          onClick={() => changeImage(imgIdx + dir)}
                          className={`absolute ${side} top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white z-10`}
                          whileHover={shouldReduce ? {} : { scale: 1.15, backgroundColor: 'rgba(0,0,0,0.8)' }}
                          whileTap={shouldReduce ? {} : { scale: 0.9 }}
                        >
                          <Icon size={20} />
                        </motion.button>
                      ))}
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                        {imgIdx + 1} / {images.length}
                      </div>
                    </>
                  )}

                  {/* Badges */}
                  <motion.div
                    className="absolute top-3 left-3 flex gap-2 z-10"
                    initial={shouldReduce ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.35, ease }}
                  >
                    <span className={cn('badge', getStatusColor(property.status))}>{property.status}</span>
                    {property.isFeatured && <span className="badge bg-yellow-100 text-yellow-800">Featured</span>}
                  </motion.div>
                  <motion.div
                    className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-10"
                    initial={shouldReduce ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.35, ease }}
                  >
                    <Eye size={12} /> {property.viewCount} views
                  </motion.div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img: string, i: number) => (
                      <motion.button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={cn('shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors', i === imgIdx ? 'border-primary-500' : 'border-transparent')}
                        whileHover={shouldReduce ? {} : { scale: 1.08 }}
                        whileTap={shouldReduce ? {} : { scale: 0.95 }}
                        initial={shouldReduce ? false : { opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Main info card */}
              <motion.div
                className="card p-6"
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
              >
                <div className="flex items-start justify-between mb-2">
                  <motion.span
                    className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider"
                    initial={shouldReduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                  >
                    {property.type}
                  </motion.span>
                  <div className="flex gap-2">
                    {[
                      { Icon: Share2, label: 'Share' },
                      ...(user ? [{ Icon: Heart, label: 'Save' }] : []),
                    ].map(({ Icon, label }) => (
                      <motion.button
                        key={label}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        whileHover={shouldReduce ? {} : { scale: 1.15 }}
                        whileTap={shouldReduce ? {} : { scale: 0.88 }}
                      >
                        <Icon size={18} className="text-gray-500" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.h1
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={shouldReduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.45, ease }}
                >
                  {property.title}
                </motion.h1>

                <motion.div
                  className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-4"
                  initial={shouldReduce ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28, duration: 0.4, ease }}
                >
                  <MapPin size={15} />
                  <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                </motion.div>

                {/* Animated price */}
                <motion.div
                  className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6 relative inline-block"
                  initial={shouldReduce ? false : { opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.32, type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {formatPrice(property.price)}
                  {/* Underline shimmer */}
                  {!shouldReduce && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.6, duration: 0.6, ease }}
                    />
                  )}
                </motion.div>

                {/* Stats row — each pops in with spring */}
                <motion.div
                  className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-6"
                  variants={shouldReduce ? {} : staggerFast}
                  initial="hidden"
                  animate="show"
                >
                  {[
                    property.bedrooms > 0 && { icon: Bed, value: property.bedrooms, label: 'Bedrooms' },
                    property.bathrooms > 0 && { icon: Bath, value: property.bathrooms, label: 'Bathrooms' },
                    { icon: Maximize, value: `${property.area.toLocaleString()}`, label: 'Sq Ft' },
                  ].filter(Boolean).map((stat) => {
                    const s = stat as { icon: React.ElementType; value: number | string; label: string };
                    return (
                      <motion.div
                        key={s.label}
                        className="text-center"
                        variants={shouldReduce ? {} : {
                          hidden: { opacity: 0, scale: 0.6, y: 12 },
                          show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 22 } },
                        }}
                        whileHover={shouldReduce ? {} : { scale: 1.06 }}
                      >
                        <s.icon size={20} className="mx-auto text-primary-500 mb-1" />
                        <div className="font-semibold text-gray-800 dark:text-gray-200">{s.value}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{s.label}</div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={shouldReduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.45, ease }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{property.description}</p>
                </motion.div>

                {/* Feature tags — stagger */}
                {property.features.length > 0 && (
                  <motion.div
                    className="mt-6"
                    initial={shouldReduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
                    <motion.div
                      className="flex flex-wrap gap-2"
                      variants={shouldReduce ? {} : staggerFast}
                      initial="hidden"
                      animate="show"
                    >
                      {property.features.map((f: string, i: number) => (
                        <motion.span
                          key={f}
                          className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full border border-primary-100 dark:border-primary-800"
                          variants={shouldReduce ? {} : {
                            hidden: { opacity: 0, scale: 0.7 },
                            show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 500, damping: 22, delay: i * 0.04 } },
                          }}
                          whileHover={shouldReduce ? {} : { scale: 1.07, y: -2 }}
                        >
                          <CheckCircle size={12} />
                          {f}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                <motion.div
                  className="mt-4 text-xs text-gray-400 dark:text-gray-500"
                  initial={shouldReduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Listed on {formatDate(property.createdAt)}
                </motion.div>
              </motion.div>

              {/* Reviews */}
              <motion.div
                className="card p-6"
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reviews</h3>

                {user?.role === 'BUYER' && (
                  <motion.div
                    className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    initial={shouldReduce ? false : { opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Leave a review</h4>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <motion.button
                          key={n}
                          onClick={() => setReviewRating(n)}
                          whileHover={shouldReduce ? {} : { scale: 1.3 }}
                          whileTap={shouldReduce ? {} : { scale: 0.85 }}
                        >
                          <Star size={22} className={cn(n <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600', 'transition-colors')} />
                        </motion.button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this property..."
                      rows={3}
                      className="input resize-none mb-3"
                    />
                    <motion.button
                      onClick={handleReview}
                      disabled={reviewLoading}
                      className="btn-primary"
                      whileHover={shouldReduce ? {} : { scale: 1.03, boxShadow: '0 6px 20px rgba(37,99,235,0.35)' }}
                      whileTap={shouldReduce ? {} : { scale: 0.97 }}
                    >
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </motion.button>
                  </motion.div>
                )}

                {property.reviews?.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No reviews yet.</p>
                ) : (
                  <motion.div
                    className="space-y-4"
                    variants={shouldReduce ? {} : { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {property.reviews?.map((review: import('@/types').Review) => (
                      <motion.div
                        key={review.id}
                        className="flex gap-3"
                        variants={shouldReduce ? {} : { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                          <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">{review.user.name?.[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{review.user.name}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star key={n} size={12} className={cn(n <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-600')} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* ── Right sidebar ── */}
            <motion.div
              className="space-y-6"
              variants={shouldReduce ? {} : fadeRight}
              initial="hidden"
              animate="show"
            >
              {/* Agent card */}
              {property.agent && (
                <motion.div
                  className="card p-5"
                  whileHover={shouldReduce ? {} : { y: -4, boxShadow: '0 16px 32px -8px rgba(37,99,235,0.14)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Listed by</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center"
                      whileHover={shouldReduce ? {} : { scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{property.agent.name[0]}</span>
                    </motion.div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{property.agent.name}</div>
                      <div className="text-xs text-primary-600 dark:text-primary-400">Property Agent</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><Mail size={14} /> {property.agent.email}</div>
                    {property.agent.phone && <div className="flex items-center gap-2"><Phone size={14} /> {property.agent.phone}</div>}
                  </div>
                </motion.div>
              )}

              {/* Booking card */}
              {property.status === 'AVAILABLE' && (
                <motion.div
                  className="card p-5"
                  initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5, ease }}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar size={18} className="text-primary-500" /> Book a Viewing
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Time Slot</label>
                      <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="input">
                        <option value="">Select time slot</option>
                        {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes (optional)</label>
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Any special requests?"
                        rows={2}
                        className="input resize-none"
                      />
                    </div>
                    <motion.button
                      onClick={handleBooking}
                      disabled={bookingLoading || !bookingDate || !bookingTime}
                      className="btn-primary w-full relative overflow-hidden"
                      whileHover={shouldReduce ? {} : { scale: 1.02, boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}
                      whileTap={shouldReduce ? {} : { scale: 0.97 }}
                    >
                      {!shouldReduce && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '200%' }}
                          transition={{ duration: 0.55, ease: 'easeInOut' }}
                        />
                      )}
                      <span className="relative flex items-center justify-center gap-2">
                        <Calendar size={16} />
                        {bookingLoading ? 'Booking...' : 'Book Viewing'}
                      </span>
                    </motion.button>
                    {!user && (
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        <Link href="/login" className="text-primary-600 hover:underline">Login</Link> to book a viewing
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Property details */}
              <motion.div
                className="card p-5"
                initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Property Details</h3>
                <dl className="space-y-2 text-sm">
                  {[
                    { label: 'Type', value: property.type },
                    { label: 'Status', value: property.status },
                    { label: 'City', value: property.city },
                    { label: 'Division', value: property.state },
                    { label: 'Postal Code', value: property.zipCode },
                    { label: 'Country', value: property.country },
                    { label: 'Views', value: property.viewCount.toString() },
                  ].map(({ label, value }, i) => (
                    <motion.div
                      key={label}
                      className="flex justify-between py-1 border-b border-gray-50 dark:border-gray-800 last:border-0"
                      initial={shouldReduce ? false : { opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.3, ease }}
                    >
                      <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                      <dd className="font-medium text-gray-800 dark:text-gray-200">{value}</dd>
                    </motion.div>
                  ))}
                </dl>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
