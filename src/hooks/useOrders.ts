import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Address, Order } from '../types';
import { orderService } from '../services/orderService';

export const useOrders = () => {
  const queryClient = useQueryClient();

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  });

  const useOrderById = (id: number) => {
    return useQuery<Order>({
      queryKey: ['order', id],
      queryFn: () => orderService.getOrderById(id),
      initialData: () => {
        const existingOrder = queryClient.getQueryData<Order[]>(['orders'])?.find(order => order.id === id);
        return existingOrder;
      },
    });
  };

  const createOrderMutation = useMutation({
    mutationFn: (shippingAddress: Address) => orderService.createOrder(shippingAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) => orderService.cancelOrder(orderId),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(['order', updatedOrder.id], updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders,
    isLoading,
    error,
    useOrderById,
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
    createOrderError: createOrderMutation.error,
    cancelOrder: cancelOrderMutation.mutate,
    isCancellingOrder: cancelOrderMutation.isPending,
    cancelOrderError: cancelOrderMutation.error,
  };
};