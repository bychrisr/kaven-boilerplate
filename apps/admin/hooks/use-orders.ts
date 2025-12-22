import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED' | 'REFUNDED';

export interface Order {
  id: string;
  tenantId: string;
  customerId?: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items?: unknown[]; // Refinar se tivermos OrderItem type
  tenant?: {
    name: string;
  };
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

export interface OrdersParams {
  page?: number;
  limit?: number;
  tenantId?: string;
  status?: OrderStatus;
}

export function useOrders(params?: OrdersParams) {
  const queryClient = useQueryClient();
  const queryParams = params ?? { page: 1, limit: 10 };

  const {
    data,
    isLoading,
    error,
  } = useQuery<OrdersResponse>({
    queryKey: ['orders', queryParams],
    queryFn: async () => {
      const response = await api.get('/api/orders', { params: queryParams });
      return response.data;
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const response = await api.put(`/api/orders/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Status do pedido atualizado!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    orders: data?.orders || [],
    pagination: data?.pagination,
    isLoading,
    error,
    updateOrderStatus,
  };
}

export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
