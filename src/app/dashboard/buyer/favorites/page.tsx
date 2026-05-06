'use client';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Bed, Bath, Maximize, Trash2 } from 'lucide-react';
import { userApi } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface FavoriteItem {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
    price: number;
    city: string;
    state: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
  };
}

export default function BuyerFavoritesPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => (await userApi.favorites()).data.data,
  });

  const removeFavorite = useMutation({
    mutationFn: (propertyId: string) => userApi.toggleFavorite(propertyId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites');
    },
    onError: () => toast.error('Failed to remove'),
  });

  const favorites: FavoriteItem[] = useMemo(() => data || [], [data]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Properties</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          {favorites.length} saved propert{favorites.length !== 1 ? 'ies' : 'y'}
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-20" />
      ) : favorites.length === 0 ? (
        <div className="card p-16 text-center text-gray-500 dark:text-gray-400">
          <Heart size={52} className="mx-auto mb-4 opacity-20" />
          <p className="font-medium text-lg mb-1 text-gray-700 dark:text-gray-300">No saved properties yet</p>
          <p className="text-sm mb-6">Click the heart icon on any listing to save it here.</p>
          <Link href="/properties" className="btn-primary inline-flex">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((fav) => {
            const p = fav.property;
            return (
              <div
                key={fav.id}
                className="card overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  {p?.images?.[0] ? (
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart size={32} className="text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  {/* Remove button */}
                  <button
                    onClick={() => removeFavorite.mutate(p?.id)}
                    disabled={removeFavorite.isPending}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                    title="Remove from favorites"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                  {p?.type && (
                    <span className={cn(
                      'absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full',
                      'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200'
                    )}>
                      {p.type.charAt(0) + p.type.slice(1).toLowerCase()}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <Link
                    href={`/properties/${p?.id}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1 block mb-1"
                  >
                    {p?.title}
                  </Link>

                  {p?.city && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
                      <MapPin size={11} />
                      {p.city}{p.state ? `, ${p.state}` : ''}
                    </p>
                  )}

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {p?.bedrooms != null && (
                      <span className="flex items-center gap-1">
                        <Bed size={12} /> {p.bedrooms} bed
                      </span>
                    )}
                    {p?.bathrooms != null && (
                      <span className="flex items-center gap-1">
                        <Bath size={12} /> {p.bathrooms} bath
                      </span>
                    )}
                    {p?.area && (
                      <span className="flex items-center gap-1">
                        <Maximize size={12} /> {p.area.toLocaleString()} sqft
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 dark:text-primary-400 font-bold">
                      {formatPrice(p?.price)}
                    </span>
                    <Link
                      href={`/properties/${p?.id}`}
                      className="text-xs btn-secondary py-1 px-3"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
