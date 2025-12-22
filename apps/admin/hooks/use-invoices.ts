import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  subscriptionId?: string | null;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
  tenant?: {
    name: string;
  };
}

export interface InvoicesResponse {
  invoices: Invoice[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateInvoiceDTO {
  tenantId: string;
  subscriptionId?: string;
  amountDue: number;
  currency?: string;
  dueDate: string | Date; // Aceita ambos: string do form ou Date convertido
  metadata?: Record<string, unknown>;
}

export interface UpdateInvoiceDTO {
  amountDue?: number;
  dueDate?: string | Date;
  status?: InvoiceStatus;
  amountPaid?: number;
  paidAt?: string;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface InvoiceStats {
  total: { count: number; amount: number };
  paid: { count: number; amount: number };
  pending: { count: number; amount: number };
  overdue: { count: number; amount: number };
  draft: { count: number; amount: number };
  canceled: { count: number; amount: number };
}

export function useInvoiceStats() {
  return useQuery<InvoiceStats>({
    queryKey: ['invoice-stats'],
    queryFn: async () => {
      const response = await api.get('/api/invoices/stats');
      return response.data;
    },
  });
}

export interface InvoicesParams {
  page?: number;
  limit?: number;
  tenantId?: string;
  status?: InvoiceStatus;
  search?: string;
}

export function useInvoices(params?: InvoicesParams) {
  const queryClient = useQueryClient();

  const queryParams = params ?? { page: 1, limit: 10 };

  const {
    data,
    isLoading,
    error,
  } = useQuery<InvoicesResponse>({
    queryKey: ['invoices', queryParams],
    queryFn: async () => {
      const response = await api.get('/api/invoices', { params: queryParams });
      return response.data;
    },
  });

  const createInvoice = useMutation({
    mutationFn: async (data: CreateInvoiceDTO) => {
      const response = await api.post('/api/invoices', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Fatura criada com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvoiceDTO }) => {
      const response = await api.put(`/api/invoices/${id}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.id] });
      toast.success('Fatura atualizada com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const sendInvoice = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/api/invoices/${id}/send`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Fatura enviada por email!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/api/invoices/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Fatura excluída com sucesso!');
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    invoices: data?.invoices || [],
    pagination: data?.pagination,
    isLoading,
    error,
    createInvoice,
    updateInvoice,
    sendInvoice,
    deleteInvoice,
  };
}

export function useInvoice(id: string) {
  return useQuery<Invoice>({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const response = await api.get(`/api/invoices/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
