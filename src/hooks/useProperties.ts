'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '@/lib/api';
import type { PropertyFilters } from '@/types';
import toast from 'react-hot-toast';

export const useProperties = (filters: PropertyFilters = {}) =>
  useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const { data } = await propertyApi.list(filters);
      return data.data;
    },
  });

export const useProperty = (id: string) =>
  useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data } = await propertyApi.get(id);
      return data.data;
    },
    enabled: !!id,
  });

export const useFeaturedProperties = () =>
  useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const { data } = await propertyApi.featured();
      return data.data;
    },
  });

export const useMyProperties = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: ['myProperties', params],
    queryFn: async () => {
      const { data } = await propertyApi.myProperties(params);
      return data.data;
    },
  });

export const useCreateProperty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => propertyApi.create(formData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties'] });
      qc.invalidateQueries({ queryKey: ['myProperties'] });
      toast.success('Property created successfully');
    },
    onError: () => toast.error('Failed to create property'),
  });
};

export const useDeleteProperty = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties'] });
      qc.invalidateQueries({ queryKey: ['myProperties'] });
      toast.success('Property deleted');
    },
    onError: () => toast.error('Failed to delete property'),
  });
};

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => {
      const { userApi } = require('@/lib/api');
      return userApi.toggleFavorite(propertyId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  });
};
