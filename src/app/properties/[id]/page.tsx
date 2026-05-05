'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Bed, Bath, Maximize, MapPin, Phone, Mail, Calendar,
  Star, Heart, Share2, ChevronLeft, ChevronRight, Eye,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useProperty } from '@/hooks/useProperties';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate, getStatusColor, cn, TIME_SLOTS } from '@/lib/utils';
import { bookingApi, reviewApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, refetch } = useProperty(id);
  const { user } = useAuth();

  const [imgIdx, setImgIdx] = useState(0);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-700">Property not found</h2>
          <Link href="/properties" className="btn-primary mt-4">Back to Properties</Link>
        </div>
      </div>
    );
  }

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
    } finally {
      setBookingLoading(false);
    }
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
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/properties" className="hover:text-primary-600">Properties</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{property.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image gallery */}
              <div className="card overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={images[imgIdx]}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {imgIdx + 1} / {images.length}
                      </div>
                    </>
                  )}
                  {/* Status badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={cn('badge', getStatusColor(property.status))}>{property.status}</span>
                    {property.isFeatured && <span className="badge bg-yellow-100 text-yellow-800">Featured</span>}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    <Eye size={12} /> {property.viewCount} views
                  </div>
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img: string, i: number) => (
                      <button key={i} onClick={() => setImgIdx(i)} className={cn('shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors', i === imgIdx ? 'border-primary-500' : 'border-transparent')}>
                        <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600 uppercase">{property.type}</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Share2 size={18} className="text-gray-500" /></button>
                    {user && <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Heart size={18} className="text-gray-500" /></button>}
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-1 text-gray-500 mb-4">
                  <MapPin size={15} />
                  <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                </div>

                <div className="text-3xl font-bold text-primary-600 mb-6">{formatPrice(property.price)}</div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  {property.bedrooms > 0 && (
                    <div className="text-center">
                      <Bed size={20} className="mx-auto text-primary-500 mb-1" />
                      <div className="font-semibold text-gray-800">{property.bedrooms}</div>
                      <div className="text-xs text-gray-500">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="text-center">
                      <Bath size={20} className="mx-auto text-primary-500 mb-1" />
                      <div className="font-semibold text-gray-800">{property.bathrooms}</div>
                      <div className="text-xs text-gray-500">Bathrooms</div>
                    </div>
                  )}
                  <div className="text-center">
                    <Maximize size={20} className="mx-auto text-primary-500 mb-1" />
                    <div className="font-semibold text-gray-800">{property.area.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Sq Ft</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>

                {property.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((f: string) => (
                        <span key={f} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-100">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-400">
                  Listed on {formatDate(property.createdAt)}
                </div>
              </div>

              {/* Reviews */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>

                {/* Add review */}
                {user?.role === 'BUYER' && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Leave a review</h4>
                    <div className="flex gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => setReviewRating(n)}>
                          <Star size={20} className={cn(n <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this property..."
                      rows={3}
                      className="input resize-none mb-3"
                    />
                    <button onClick={handleReview} disabled={reviewLoading} className="btn-primary">
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                )}

                {/* Review list */}
                {property.reviews?.length === 0 ? (
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {property.reviews?.map((review: import('@/types').Review) => (
                      <div key={review.id} className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                          <span className="text-primary-600 font-bold text-xs">{review.user.name?.[0]}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-gray-800">{review.user.name}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star key={n} size={12} className={cn(n <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200')} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Agent card */}
              {property.agent && (
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Listed by</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{property.agent.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{property.agent.name}</div>
                      <div className="text-xs text-primary-600">Property Agent</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Mail size={14} /> {property.agent.email}</div>
                    {property.agent.phone && (
                      <div className="flex items-center gap-2"><Phone size={14} /> {property.agent.phone}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Book viewing */}
              {property.status === 'AVAILABLE' && (
                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-4">Book a Viewing</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                      <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} className="input">
                        <option value="">Select time slot</option>
                        {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optional)</label>
                      <textarea
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Any special requests?"
                        rows={2}
                        className="input resize-none"
                      />
                    </div>
                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading || !bookingDate || !bookingTime}
                      className="btn-primary w-full"
                    >
                      <Calendar size={16} className="mr-2 inline" />
                      {bookingLoading ? 'Booking...' : 'Book Viewing'}
                    </button>
                    {!user && (
                      <p className="text-xs text-center text-gray-500">
                        <Link href="/login" className="text-primary-600 hover:underline">Login</Link> to book a viewing
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Property details */}
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
                <dl className="space-y-2 text-sm">
                  {[
                    { label: 'Type', value: property.type },
                    { label: 'Status', value: property.status },
                    { label: 'City', value: property.city },
                    { label: 'Division', value: property.state },
                    { label: 'Postal Code', value: property.zipCode },
                    { label: 'Country', value: property.country },
                    { label: 'Views', value: property.viewCount.toString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-gray-800">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
