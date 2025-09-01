import { Address, Order } from '../types';
import { apiService } from './api';
import { cartService } from './cartService';

interface CreateOrderData {
  items: {
    soupId: number;
    quantity: number;
  }[];
  shippingAddress: Address;
}

export const orderService = {
  createOrder: async (shippingAddress: Address): Promise<Order> => {
    const cart = cartService.getCart();
    
    const orderData: CreateOrderData = {
      items: cart.map(item => ({
        soupId: item.soup.id,
        quantity: item.quantity
      })),
      shippingAddress
    };

    const response = await apiService.post<Order>('/orders', orderData);
    cartService.clearCart();
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await apiService.get<Order[]>('/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await apiService.get<Order>(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: number): Promise<Order> => {
    const response = await apiService.put<Order>(`/orders/${id}/cancel`);
    return response.data;
  }
};