'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { propertyApi } from '@/lib/api';
import toast from 'react-hot-toast';

const PROPERTY_TYPES = ['HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL'];
const COMMON_FEATURES = ['Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Fireplace', 'Air Conditioning', 'Elevator', 'Pet Friendly', 'Security', 'Rooftop', 'Storage'];

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  type: z.enum(['HOUSE', 'APARTMENT', 'CONDO', 'TOWNHOUSE', 'LAND', 'COMMERCIAL']),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zipCode: z.string().min(3, 'ZIP required'),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().positive('Area must be positive'),
  isFeatured: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export default function NewPropertyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'HOUSE', bedrooms: 3, bathrooms: 2, area: 1500, isFeatured: false },
  });

  if (user?.role !== 'AGENT' && user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 10));
  };

  const toggleFeature = (f: string) =>
    setFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const addCustomFeature = () => {
    if (customFeature.trim() && !features.includes(customFeature.trim())) {
      setFeatures((prev) => [...prev, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, String(v)));
      features.forEach((f) => fd.append('features', f));
      images.forEach((img) => fd.append('images', img));
      await propertyApi.create(fd);
      toast.success('Property listed successfully!');
      router.push('/dashboard/agent');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">List New Property</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Fill in the details to list your property</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input {...register('title')} className="input" placeholder="e.g. Modern Downtown Apartment" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
            <textarea {...register('description')} rows={4} className="input resize-none" placeholder="Describe the property in detail..." />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select {...register('type')} className="input">
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($) *</label>
              <input {...register('price')} type="number" className="input" placeholder="450000" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input {...register('isFeatured')} type="checkbox" id="featured" className="rounded" />
            <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">Mark as featured listing</label>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address *</label>
            <input {...register('address')} className="input" placeholder="123 Main Street" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
              <input {...register('city')} className="input" placeholder="New York" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State *</label>
              <input {...register('state')} className="input" placeholder="NY" />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP *</label>
              <input {...register('zipCode')} className="input" placeholder="10001" />
              {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms</label>
              <input {...register('bedrooms')} type="number" min={0} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms</label>
              <input {...register('bathrooms')} type="number" min={0} step={0.5} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area (sqft) *</label>
              <input {...register('area')} type="number" className="input" />
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Features & Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {COMMON_FEATURES.map((f) => (
              <button key={f} type="button" onClick={() => toggleFeature(f)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  features.includes(f)
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:border-primary-400'
                }`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={customFeature} onChange={(e) => setCustomFeature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
              placeholder="Add custom feature..." className="input flex-1" />
            <button type="button" onClick={addCustomFeature} className="btn-secondary"><Plus size={16} /></button>
          </div>
          {features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <span key={f} className="flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                  {f} <button type="button" onClick={() => toggleFeature(f)}><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Photos (up to 10)</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 cursor-pointer hover:border-primary-400 transition-colors">
            <Upload size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload images (JPEG, PNG, WebP)</span>
            <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="sr-only" />
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square">
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1">
            {submitting ? 'Listing Property...' : 'List Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
