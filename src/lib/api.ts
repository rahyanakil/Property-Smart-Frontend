import api from './axios';
import type { Property, PropertyFilters, User } from '@/types';

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/api/v1/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', data),
  logout: () => api.post('/api/v1/auth/logout'),
  refresh: () => api.post('/api/v1/auth/refresh'),
  me: () => api.get('/api/v1/auth/me'),
};

// Properties
export const propertyApi = {
  list: (filters: PropertyFilters = {}) =>
    api.get('/api/v1/properties', { params: filters }),
  get: (id: string) => api.get(`/api/v1/properties/${id}`),
  featured: () => api.get('/api/v1/properties/featured'),
  create: (data: FormData) =>
    api.post('/api/v1/properties', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData | Partial<Property>) =>
    api.patch(`/api/v1/properties/${id}`, data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    ),
  delete: (id: string) => api.delete(`/api/v1/properties/${id}`),
  myProperties: (params?: { page?: number; limit?: number }) =>
    api.get('/api/v1/properties/my', { params }),
  stats: () => api.get('/api/v1/properties/stats'),
  removeImage: (id: string, imageUrl: string) =>
    api.delete(`/api/v1/properties/${id}/images`, { data: { imageUrl } }),
};

// Users
export const userApi = {
  profile: () => api.get('/api/v1/users/profile'),
  updateProfile: (data: Partial<User>) => api.patch('/api/v1/users/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/api/v1/users/password', data),
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return api.post('/api/v1/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  favorites: () => api.get('/api/v1/users/favorites'),
  toggleFavorite: (propertyId: string) => api.post(`/api/v1/users/favorites/${propertyId}`),
  list: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get('/api/v1/users', { params }),
  updateRole: (id: string, role: string) => api.patch(`/api/v1/users/${id}/role`, { role }),
  toggleStatus: (id: string) => api.patch(`/api/v1/users/${id}/status`),
};

// Bookings
export const bookingApi = {
  create: (data: { propertyId: string; date: string; timeSlot: string; notes?: string }) =>
    api.post('/api/v1/bookings', data),
  myBookings: (params?: { page?: number; limit?: number }) =>
    api.get('/api/v1/bookings/my', { params }),
  agentBookings: (params?: { page?: number; limit?: number }) =>
    api.get('/api/v1/bookings/agent', { params }),
  adminBookings: (params?: { page?: number; limit?: number }) =>
    api.get('/api/v1/bookings/admin', { params }),
  updateStatus: (id: string, status: string) => api.patch(`/api/v1/bookings/${id}`, { status }),
};

// Payments
export const paymentApi = {
  createIntent: (data: { propertyId: string; amount: number; currency?: string }) =>
    api.post('/api/v1/payments/intent', data),
  myPayments: (params?: { page?: number; limit?: number }) =>
    api.get('/api/v1/payments/my', { params }),
  adminPayments: (params?: { page?: number; limit?: number }) =>
    api.get('/api/v1/payments', { params }),
  stats: () => api.get('/api/v1/payments/stats'),
};

// Reviews
export const reviewApi = {
  list: (propertyId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/api/v1/properties/${propertyId}/reviews`, { params }),
  create: (propertyId: string, data: { rating: number; comment: string }) =>
    api.post(`/api/v1/properties/${propertyId}/reviews`, data),
  delete: (propertyId: string, reviewId: string) =>
    api.delete(`/api/v1/properties/${propertyId}/reviews/${reviewId}`),
};
