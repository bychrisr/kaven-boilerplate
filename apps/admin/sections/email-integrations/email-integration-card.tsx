'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation } from '@tanstack/react-query';
import {
  // Card,
  // CardDescription,
  // CardHeader,
  // CardTitle,
  // CardContent,
  // CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Mail, Check, Shield, Activity, Trash2, Pencil, Loader2, Send, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { emailIntegrationsApi, EmailIntegration } from '@/lib/api/email-integrations';
import { api } from '@/lib/api';
import { EmailIntegrationDialog } from './email-integration-dialog';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

interface EmailIntegrationCardProps {
  integration: EmailIntegration;
}

const ProviderLogo = ({ provider }: { provider: string }) => {
  switch (provider) {
    case 'SMTP':
      return <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Mail className="h-5 w-5" /></div>;
    case 'RESEND':
      return <div className="h-10 w-10 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center font-bold text-lg">R</div>;
    case 'POSTMARK':
      return <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-600 font-bold"><Mail className="h-5 w-5" /></div>;
    case 'AWS_SES':
      return <div className="h-10 w-10 rounded-lg bg-[#FF9900]/10 flex items-center justify-center text-[#FF9900] font-bold text-xs">AWS</div>;
    default:
      return <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Mail className="h-5 w-5" /></div>;
  }
};

export function EmailIntegrationCard({ integration }: EmailIntegrationCardProps) {
  const t = useTranslations('EmailIntegrations');
  const queryClient = useQueryClient();
  const [isTesting, setIsTesting] = useState(false);
  const [isTestingConnectivity, setIsTestingConnectivity] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: emailIntegrationsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-integrations'] });
      toast.success(t('deleteSuccess'));
    },
    onError: (error: Error) => {
      toast.error(error.message || t('deleteFailed'));
    },
  });

  // Mutation para testar conectividade (health check)
  const testConnectivityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.get(`/api/settings/email/${id}/health`);
      return data;
    },
    onMutate: () => setIsTestingConnectivity(true),
    onSettled: () => setIsTestingConnectivity(false),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['email-integrations'] });
      if (data.healthy) {
        toast.success('Connectivity test successful!', {
          description: data.message || 'Connection to email provider is working',
        });
      } else {
        toast.info('Connectivity test completed', {
          description: data.message || 'Provider responded but credentials may need configuration',
          duration: 8000,
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Connectivity test failed', {
        description: error.message || 'Could not connect to email provider',
      });
    },
  });

  // Mutation para enviar email de teste (teste real)
  const testMutation = useMutation({
    mutationFn: ({ id, mode }: { id: string; mode?: 'sandbox' | 'custom' }) => emailIntegrationsApi.test(id, mode),
    onMutate: () => setIsTesting(true),
    onSettled: () => setIsTesting(false),
    onSuccess: (data) => {
      if (data.success) {
        // Se tem flag isInfo, é uma mensagem informativa (não erro)
        if (data.isInfo) {
          toast.info(data.message || t('testSuccess'), {
            duration: 8000, // Mais tempo para ler a mensagem informativa
          });
        } else {
          toast.success(data.message || t('testSuccess'));
        }
      } else {
        toast.error(data.error || t('testFailed'));
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || t('testError'));
    },
  });

  const handleTestConnectivity = () => {
    testConnectivityMutation.mutate(integration.id);
  };

  const handleTestSend = (mode: 'sandbox' | 'custom' = 'custom') => {
    testMutation.mutate({ id: integration.id, mode });
  };

  return (
    <div className={cn(
      "group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md",
      integration.isPrimary && "ring-1 ring-primary/20 bg-primary/5 border-primary/20",
      !integration.isActive && "opacity-75 grayscale-[0.5] hover:grayscale-0 hover:opacity-100"
    )}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-4">
          <ProviderLogo provider={integration.provider} />
          <div>
            <h4 className="font-semibold text-base flex items-center gap-2">
              {t(`providers.${integration.provider}`)}
              {integration.isPrimary && (
                <Badge variant="default" className="text-[10px] h-5 px-2 bg-primary/90 hover:bg-primary/90 shadow-sm">
                  {t('primary')}
                </Badge>
              )}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("flex h-2 w-2 rounded-full", integration.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-slate-300")} />
              <span className="text-xs text-muted-foreground font-medium">
                {integration.isActive ? t('active') : t('inactive')}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <EmailIntegrationDialog mode="edit" integration={integration} asMenuItem />
            <DropdownMenuItem onClick={() => handleTestSend()}>
               <Send className="mr-2 h-4 w-4" />
               {t('test')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('delete')}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('deleteConfirm')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(integration.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">From Address</span>
            <div className="text-sm font-medium truncate" title={integration.fromEmail || ''}>
              {integration.fromEmail || '-'}
            </div>
         </div>
         <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Daily Limit</span>
            <div className="text-sm font-medium">
              {integration.dailyLimit ? integration.dailyLimit.toLocaleString() : 'Unlimited'}
            </div>
         </div>
         {(integration.transactionalDomain || integration.marketingDomain) && (
            <div className="col-span-2 space-y-1.5 pt-2 border-t border-border/50">
               <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Verified Domains</span>
               <div className="flex flex-wrap gap-2">
                  {integration.transactionalDomain && (
                      <Badge variant="secondary" className="font-normal bg-secondary/50 text-secondary-foreground">
                        <Shield className="w-3 h-3 mr-1 opacity-50" />
                        {integration.transactionalDomain}
                      </Badge>
                  )}
                  {integration.marketingDomain && (
                      <Badge variant="secondary" className="font-normal bg-secondary/50 text-secondary-foreground">
                        <Check className="w-3 h-3 mr-1 opacity-50" />
                        {integration.marketingDomain}
                      </Badge>
                  )}
               </div>
            </div>
         )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-auto">
         <div className="w-full">
            <EmailIntegrationDialog mode="edit" integration={integration} trigger={
               <Button variant="outline" className="w-full h-9 text-xs font-medium hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors">
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  {t('edit')}
               </Button>
            } />
         </div>
         
          {/* Test Connectivity Button */}
          <Button 
            variant="ghost" 
            size="icon"
            type="button"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={handleTestConnectivity}
            disabled={isTestingConnectivity}
            title="Test Connectivity - Validates credentials and connection"
          >
            {isTestingConnectivity ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wifi className="h-4 w-4" />}
          </Button>

          {/* Send Test Email Buttons - Show dropdown for Resend/Postmark, single button for others */}
         {/* Test Buttons - Show two buttons for Resend/Postmark, one for others */}
         {(integration.provider === 'RESEND' || integration.provider === 'POSTMARK') ? (
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button 
                 variant="ghost" 
                 size="icon"
                  type="button"
                 className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                 disabled={isTesting}
                 title={t('test')}
               >
                 {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-[200px]">
               <DropdownMenuItem onSelect={() => handleTestSend('sandbox')} disabled={isTesting}>
                 <Send className="mr-2 h-4 w-4" />
                 Testar Sandbox
               </DropdownMenuItem>
               <DropdownMenuItem onSelect={() => handleTestSend('custom')} disabled={isTesting}>
                 <Send className="mr-2 h-4 w-4" />
                 Testar Domínio
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         ) : (
           <Button 
             variant="ghost" 
             size="icon"
              type="button"
             className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
             onClick={() => handleTestSend('custom')}
             disabled={isTesting}
             title={t('test')}
           >
             {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
           </Button>
         )}
      </div>
    </div>
  );
}
