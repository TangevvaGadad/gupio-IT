import axios from 'axios';
import { Product, Order, CreateOrderData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getProducts: () => api.get<{ success: boolean; data: Product[] }>('/products'),
  getProductById: (id: string) =>
    api.get<{ success: boolean; data: Product }>(`/products/${id}`),
  createProduct: (product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) =>
    api.post<{ success: boolean; data: Product }>('/products', product),
};

export const orderApi = {
  getOrders: () => api.get<{ success: boolean; data: Order[] }>('/orders'),
  getOrderById: (id: string) =>
    api.get<{ success: boolean; data: Order }>(`/orders/${id}`),
  createOrder: (orderData: CreateOrderData) =>
    api.post<{ success: boolean; data: Order }>('/orders', orderData),
};

export default api;

