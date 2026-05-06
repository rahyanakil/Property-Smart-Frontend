'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Bed, Bath, Maximize, MapPin, Heart, Eye } from 'lucide-react';
import { Property } from '@/types';
import { formatPrice, getStatusColor, cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useToggleFavorite } from '@/hooks/useProperties';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const { user } = useAuth();
  const toggleFavorite = useToggleFavorite();
  const shouldReduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const image = property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600';

  // 3D tilt — raw mouse values
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring-smoothed tilt
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn('card overflow-hidden group cursor-pointer', className)}
      style={shouldReduce ? {} : {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={shouldReduce ? {} : {
        y: -6,
        boxShadow: '0 20px 40px -12px rgba(37,99,235,0.18), 0 8px 16px -8px rgba(0,0,0,0.12)',
        transition: { type: 'spring', stiffness: 400, damping: 28 },
      }}
      whileTap={shouldReduce ? {} : { scale: 0.985 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('badge', getStatusColor(property.status))}>
            {property.status}
          </span>
          {property.isFeatured && (
            <span className="badge bg-yellow-100 text-yellow-800">Featured</span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          {user && (
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite.mutate(property.id);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.85 }}
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
              <Heart size={15} className="text-gray-600 hover:text-red-500 transition-colors" />
            </motion.button>
          )}
        </div>

        {/* View count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5 text-white text-xs">
          <Eye size={11} /> {property.viewCount}
        </div>
      </div>

      {/* Content */}
      <Link href={`/properties/${property.id}`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">{property.type}</span>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-3">
            <MapPin size={12} />
            <span className="truncate">{property.address}, {property.city}, {property.state}</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms} bd</span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms} ba</span>
            )}
            <span className="flex items-center gap-1"><Maximize size={13} /> {property.area.toLocaleString()} sqft</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(property.price)}</span>
            {property.agent && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-xs">{property.agent.name[0]}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{property.agent.name}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
