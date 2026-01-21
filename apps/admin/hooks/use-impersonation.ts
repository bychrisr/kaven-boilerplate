import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface ImpersonationTarget {
  id: string;
  name: string | null;
  email: string;
}

export interface ImpersonationSession {
  id: string;
  impersonatorId: string;
  impersonatedId: string;
  justification: string;
  startedAt: string;
  expiresAt: string;
  status: string;
  impersonated: ImpersonationTarget;
}

export interface ImpersonationStatusData {
  isActive: boolean;
  session: ImpersonationSession | null;
}

export function useImpersonation() {
  const queryClient = useQueryClient();

  // Buscar status atual
  const { data: status, isLoading } = useQuery({
    queryKey: ['impersonation-status'],
    queryFn: async () => {
      const response = await api.get<ImpersonationStatusData>('/api/auth/impersonate/status');
      return response.data;
    },
    // Refetch a cada 5 minutos para garantir expiração
    refetchInterval: 5 * 60 * 1000,
  });

  // Iniciar impersonation
  const startImpersonation = useMutation({
    mutationFn: async (data: { targetUserId: string; justification: string }) => {
      const response = await api.post('/api/auth/impersonate/start', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impersonation-status'] });
      toast.success('Sessão de impersonation iniciada');
      // Recarregar a página para forçar o middleware a injetar o novo contexto
      window.location.reload();
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Falha ao iniciar impersonation';
      toast.error(errorMessage);
    }
  });

  // Parar impersonation
  const stopImpersonation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/auth/impersonate/stop');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['impersonation-status'] });
      toast.success('Sessão de impersonation encerrada');
      // Recarregar para voltar ao contexto original do admin
      window.location.reload();
    },
    onError: () => {
      toast.error('Falha ao encerrar impersonation');
    }
  });

  return {
    isActive: status?.isActive ?? false,
    session: status?.session,
    isLoading,
    startImpersonation,
    stopImpersonation,
  };
}
