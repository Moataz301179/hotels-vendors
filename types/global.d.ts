/**
 * Global TypeScript types for HotelsVendors B2B Hospitality Marketplace
 */

import { ProductCategory } from '@prisma/client';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  subcategory: string | null;
  unitPrice: number;
  currency: string;
  stockQuantity: number;
  minOrderQty: number;
  unitOfMeasure: string;
  leadTimeDays: number;
  shelfLifeDays: number | null;
  temperatureReq: string | null;
  images: string[] | null;
  status: string;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  tier: 'CORE' | 'PREMIUM' | 'ENTERPRISE';
  rating: number | null;
  reviewCount: number | null;
  city: string;
  tenantId: string;
}

export interface Hotel {
  id: string;
  name: string;
  chainName: string | null;
  address: string;
  city: string;
  tenantId: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  id: string;
  customerId: string;
  supplierId: string;
  items: OrderItem[];
  total: number;
  status: 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  etaUuid: string | null;
  etaStatus: 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'VALIDATED' | 'FAILED';
  total: number;
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'CANCELLED';
  createdAt: Date;
  paidAt: Date | null;
}