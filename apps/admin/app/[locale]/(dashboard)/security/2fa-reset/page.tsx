'use client';

// import { useTranslations } from 'next-intl';
import { 
  Shield, 
  History, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Plus
} from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCapabilities } from '@/hooks/use-capabilities';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * 2FA Reset Management Page
 * 
 * Permite que administradores solicitem e executem o reset de 2FA.
 * Segue o protocolo de duas etapas (Request + Execute).
 */
export default function TwoFactorResetPage() {
  // const t = useTranslations('Security.TwoFactorReset');
  const queryClient = useQueryClient();
  const { check } = useCapabilities();
  
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [justification, setJustification] = useState('');

  // Capabilities check
  const canRequest = check('auth.2fa_reset.request');
  const canExecute = check('auth.2fa_reset.execute');

  // Buscar solicitações pendentes
  const { data: requests, isLoading } = useQuery({
    queryKey: ['security', 'requests', 'pending'],
    queryFn: async () => {
      const response = await api.get('/api/security/requests/pending');
      return response.data;
    },
    enabled: canRequest
  });

  // Mutação para criar solicitação
  const createRequestMutation = useMutation({
    mutationFn: async () => {
        // Primeiro buscar o usuário pelo email
        const userRes = await api.get(`/api/users?search=${targetUserEmail}`);
        const user = userRes.data.users[0];
        
        if (!user) throw new Error('Usuário não encontrado');

        return api.post('/api/security/requests', {
            type: '2FA_RESET',
            targetUserId: user.id,
            justification
        });
    },
    onSuccess: () => {
        toast.success('Solicitação de reset criada com sucesso');
        queryClient.invalidateQueries({ queryKey: ['security', 'requests', 'pending'] });
        setIsRequestDialogOpen(false);
        setTargetUserEmail('');
        setJustification('');
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
        toast.error(`Falha ao criar solicitação: ${error.response?.data?.error || error.message}`);
    }
  });

  // Mutação para executar reset
  const executeResetMutation = useMutation({
    mutationFn: (requestId: string) => api.post(`/api/security/requests/${requestId}/execute`),
    onSuccess: () => {
        toast.success('Reset de 2FA executado com sucesso');
        queryClient.invalidateQueries({ queryKey: ['security', 'requests', 'pending'] });
    },
    onError: (error: Error & { response?: { data?: { error?: string } } }) => {
        toast.error(`Falha ao executar reset: ${error.response?.data?.error || error.message}`);
    }
  });

  // Mutação para rejeitar solicitação
  const rejectRequestMutation = useMutation({
    mutationFn: (requestId: string) => api.post(`/api/security/requests/${requestId}/review`, {
        action: 'REJECT',
        reason: 'Rejeitado pelo administrador'
    }),
    onSuccess: () => {
        toast.success('Solicitação rejeitada');
        queryClient.invalidateQueries({ queryKey: ['security', 'requests', 'pending'] });
    }
  });

  // Mutação para aprovar solicitação (Review)
  const approveRequestMutation = useMutation({
    mutationFn: (requestId: string) => api.post(`/api/security/requests/${requestId}/review`, {
        action: 'APPROVE'
    }),
    onSuccess: () => {
        toast.success('Solicitação aprovada para execução');
        queryClient.invalidateQueries({ queryKey: ['security', 'requests', 'pending'] });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recuperação de Conta (2FA Reset)</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de solicitações para reset de autenticação de dois fatores.
          </p>
        </div>
        
        {canRequest && (
            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
                        <Plus className="w-4 h-4" />
                        Nova Solicitação
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Solicitar Reset de 2FA</DialogTitle>
                        <DialogDescription>
                            Esta ação será auditada e requer aprovação superior para ser executada.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email do Usuário</label>
                            <Input 
                                placeholder="usuario@email.com" 
                                value={targetUserEmail}
                                onChange={(e) => setTargetUserEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Justificativa</label>
                            <Textarea 
                                placeholder="Motivo da solicitação de reset..." 
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancelar</Button>
                        <Button 
                            onClick={() => createRequestMutation.mutate()}
                            disabled={createRequestMutation.isPending || !targetUserEmail || justification.length < 10}
                        >
                            {createRequestMutation.isPending ? 'Enviando...' : 'Enviar Solicitação'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-amber-500/5 to-transparent border-amber-500/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Solicitações Pendentes</p>
              <h3 className="text-2xl font-bold">{requests?.length || 0}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Protocolo Ativo</p>
              <h3 className="text-xl font-bold mt-1">2-Step Multi-Approval</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Segurança</p>
                <h3 className="text-xl font-bold mt-1">Audit Trail Ativo</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-border/40 shadow-xl">
        <div className="p-6 border-b border-border/40 bg-muted/30">
            <h2 className="text-lg font-bold">Solicitações em Aberto</h2>
            <p className="text-sm text-muted-foreground">Gerencie o fluxo de recuperação de conta</p>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="bg-muted/50 text-muted-foreground font-medium uppercase text-[11px] tracking-wider">
                        <th className="px-6 py-4">Usuário Alvo</th>
                        <th className="px-6 py-4">Solicitante</th>
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                    {isLoading ? (
                        <tr><td colSpan={5} className="p-10 text-center text-muted-foreground underline">Carregando solicitações...</td></tr>
                    ) : requests?.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 text-center text-muted-foreground italic">Nenhuma solicitação pendente encontrada.</td></tr>
                    ) : requests?.map((request: { id: string; targetUser: { name: string; email: string }; requester: { name: string }; justification: string; createdAt: string; status: string }) => (
                        <tr key={request.id} className="hover:bg-muted/20 transition-colors group">
                            <td className="px-6 py-5">
                                <div className="font-semibold text-foreground">{request.targetUser.name}</div>
                                <div className="text-xs text-muted-foreground">{request.targetUser.email}</div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="text-foreground">{request.requester.name}</div>
                                <div className="text-xs text-muted-foreground italic">&quot;{request.justification}&quot;</div>
                            </td>
                            <td className="px-6 py-5 text-muted-foreground">
                                {new Date(request.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-5">
                                <Badge variant={request.status === 'PENDING' ? 'warning' : 'secondary'} className="font-bold">
                                    {request.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {request.status === 'PENDING' && canExecute && (
                                        <>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="h-8 text-red-500 hover:text-red-600 border-red-500/20 hover:bg-red-500/10"
                                                onClick={() => rejectRequestMutation.mutate(request.id)}
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Rejeitar
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => approveRequestMutation.mutate(request.id)}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                                Aprovar
                                            </Button>
                                        </>
                                    )}
                                    {request.status === 'APPROVED' && canExecute && (
                                        <Button 
                                            size="sm" 
                                            className="h-8 shadow-md"
                                            onClick={() => executeResetMutation.mutate(request.id)}
                                        >
                                            <PlayCircle className="w-4 h-4 mr-1" />
                                            Executar Reset
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
      
      <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
        <div className="text-sm">
            <p className="font-bold text-primary">Atenção sobre Resets de 2FA</p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
                O reset de 2FA é um procedimento de alta criticidade. Uma vez executado, o usuário perderá 
                todos os métodos de autenticação de dois fatores e precisará reconfigurá-los no próximo login. 
                Sempre verifique a identidade do solicitante através de canais fora do sistema antes de aprovar.
            </p>
        </div>
      </div>
    </div>
  );
}
