export type Role = 'BUYER' | 'AGENT' | 'ADMIN';
export type PropertyType = 'HOUSE' | 'APARTMENT' | 'CONDO' | 'TOWNHOUSE' | 'LAND' | 'COMMERCIAL';
export type PropertyStatus = 'AVAILABLE' | 'PENDING' | 'SOLD' | 'RENTED' | 'INACTIVE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  bio?: string;
  isVerified: boolean;
  isActive?: boolean;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  lat?: number;
  lng?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  images: string[];
  videoUrl?: string;
  isFeatured: boolean;
  viewCount: number;
  agentId: string;
  agent: Agent;
  createdAt: string;
  updatedAt: string;
  _count?: { bookings: number; favorites: number; reviews: number };
}

export interface Booking {
  id: string;
  propertyId: string;
  buyerId: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  notes?: string;
  property: Partial<Property>;
  buyer?: Partial<User>;
  createdAt: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  property?: Partial<Property>;
  buyer?: Partial<User>;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: Partial<User>;
  property?: Partial<Property>;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  type?: PropertyType;
  status?: PropertyStatus;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  search?: string;
  isFeatured?: boolean;
  sortBy?: 'price' | 'createdAt' | 'area' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}
