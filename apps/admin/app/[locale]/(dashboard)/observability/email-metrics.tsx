'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { observabilityApi } from '@/lib/api/observability';
import { Mail, ShieldCheck, AlertCircle, Clock, CheckCircle2, Search, Filter } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { InfoTooltip } from '@/components/ui/info-tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';

export function EmailMetrics() {
  const t = useTranslations('Observability.email');
  
  // Estados de filtro - ANTES de qualquer early return
  const [selectedProvider, setSelectedProvider] = useState<string | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['email-metrics'],
    queryFn: observabilityApi.getEmailMetrics,
    refetchInterval: 5000,
  });

  // 🔍 DEBUG: Log completo dos dados recebidos
  console.log('=== EMAIL METRICS DEBUG ===');
  console.log('isLoading:', isLoading);
  console.log('data:', JSON.stringify(data, null, 2));
  
  if (data) {
    console.log('overview.sent:', data.overview.sent);
    console.log('overview.deliveryRate:', data.overview.deliveryRate);
    console.log('byProvider:', data.byProvider);
    console.log('byProvider keys:', Object.keys(data.byProvider));
    Object.entries(data.byProvider).forEach(([provider, stats]) => {
      console.log(`Provider ${provider}:`, stats);
    });
  }

  // useMemo ANTES do early return
  const filteredProviders = useMemo(() => {
    if (!data?.byProvider) return [];
    
    return Object.entries(data.byProvider)
      .filter(([provider, stats]) => {
        // Filtro por provider selecionado
        if (selectedProvider !== 'all' && provider !== selectedProvider) return false;
        
        // Filtro por status
        if (statusFilter !== 'all') {
          if (statusFilter === 'healthy' && stats.deliveryRate < 98) return false;
          if (statusFilter === 'warning' && (stats.deliveryRate < 95 || stats.deliveryRate >= 98)) return false;
          if (statusFilter === 'critical' && stats.deliveryRate >= 95) return false;
        }
        
        // Filtro por busca
        if (searchTerm && !provider.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        
        return true;
      })
      .sort(([, a], [, b]) => b.sent - a.sent);
  }, [data, selectedProvider, statusFilter, searchTerm]);

  // AGORA sim, early return APÓS todos os hooks
  if (isLoading || !data) {
    console.log('🔄 Loading state or no data...');
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const { overview, health, byProvider } = data;

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'healthy': return 'default';  // verde/success
      case 'warning': return 'secondary';  // amarelo/warning
      case 'critical': return 'destructive';  // vermelho/error
      default: return 'outline';
    }
  };

  const providersList = Object.keys(byProvider);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <Badge variant={getStatusVariant(health.status)}>
          {health.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          variant="outline"
          title={t('sent')}
          value={overview.sent.toLocaleString()}
          subtitle={overview.sent > 0 ? 'Live telemetry' : 'No data collected'}
          icon={Mail}
          iconClassName="bg-blue-100 dark:bg-blue-900/20 text-blue-600"
          menuAction={<InfoTooltip content={t('sentTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('deliveryRate')}
          value={`${overview.deliveryRate}%`}
          subtitle={`${overview.sent - overview.bounced} successfully delivered`}
          icon={CheckCircle2}
          iconClassName={`${overview.deliveryRate > 98 ? 'bg-green-100 dark:bg-green-900/20 text-green-600' : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'}`}
          menuAction={<InfoTooltip content={t('deliveryRateTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('bounces')}
          value={`${overview.bounced}`}
          subtitle={`${health.indicators.bounceRate}% bounce rate`}
          icon={AlertCircle}
          iconClassName={`${health.indicators.bounceRate > 2 ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-slate-100 dark:bg-slate-900/20 text-slate-600'}`}
          menuAction={<InfoTooltip content={t('bouncesTooltip')} />}
        />
        <StatCard
          variant="outline"
          title={t('latency')}
          value={`${overview.avgLatencySeconds.toFixed(2)}s`}
          subtitle="Avg Provider Response"
          icon={Clock}
          iconClassName="bg-purple-100 dark:bg-purple-900/20 text-purple-600"
          menuAction={<InfoTooltip content={t('latencyTooltip')} />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {t('reputation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('complaintRate')}</span>
              <span className={`text-sm font-bold ${health.indicators.complaintRate > 0.1 ? 'text-error-main' : 'text-success-main'}`}>
                {health.indicators.complaintRate}%
              </span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${health.indicators.complaintRate > 0.1 ? 'bg-error-main' : 'bg-success-main'}`}
                style={{ width: `${Math.min(health.indicators.complaintRate * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t('complaintsTooltip')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t('byProvider')}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="text-xs">
                {filteredProviders.length} / {providersList.length}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Filtros */}
            <div className="space-y-3">
             {/* Busca */}
             <div className="relative">
               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search providers..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-8 h-9 text-sm"
               />
             </div>

             {/* Filtro por Status */}
             <div className="flex gap-2 flex-wrap">
               <Button
                 size="xs"
                 variant={statusFilter === 'all' ? 'contained' : 'outlined'} color="primary"
                 onClick={() => setStatusFilter('all')}
               >
                 All
               </Button>
               <Button
                 size="xs"
                 variant={statusFilter === 'healthy' ? 'contained' : 'outlined'}
                  color="success"
                 onClick={() => setStatusFilter('healthy')}
               >
                 Healthy
               </Button>
               <Button
                 size="xs"
                 variant={statusFilter === 'warning' ? 'contained' : 'outlined'}
                  color="warning"
                 onClick={() => setStatusFilter('warning')}
               >
                 Warning
               </Button>
               <Button
                 size="xs"
                 variant={statusFilter === 'critical' ? 'contained' : 'outlined'}
                  color="error"
                 onClick={() => setStatusFilter('critical')}
               >
                 Critical
               </Button>
             </div>

             {/* Filtro por Provider */}
             {providersList.length > 1 && (
               <div className="flex gap-2 flex-wrap">
                 <Button
                   size="xs"
                   variant={selectedProvider === 'all' ? 'contained' : 'outlined'}
                    color="primary"
                   onClick={() => setSelectedProvider('all')}
                 >
                   All Providers
                 </Button>
                 {providersList.map(provider => (
                   <Button
                     key={provider}
                     size="xs"
                     variant={selectedProvider === provider ? 'contained' : 'outlined'}
                      color="primary"
                     onClick={() => setSelectedProvider(provider)}
                   >
                     {provider}
                   </Button>
                 ))}
               </div>
             )}
           </div>

           {/* Lista de Providers */}
           <div className="space-y-4 max-h-96 overflow-y-auto">
             {filteredProviders.length === 0 ? (
               <div className="text-center py-8 text-sm text-muted-foreground">
                 <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                 No providers match your filters
               </div>
             ) : (
               filteredProviders.map(([provider, stats]) => (
                 <div key={provider} className="space-y-2">
                   <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                       <span className="text-sm font-bold uppercase">{provider}</span>
                       <span className="text-xs text-muted-foreground">
                         {stats.sent} sent · {stats.bounced} bounced
                       </span>
                     </div>
                     <div className="text-right">
                       <div className={`text-sm font-medium ${
                         stats.sent === 0 
                           ? 'text-muted-foreground' 
                           : stats.deliveryRate >= 98 
                           ? 'text-green-500' 
                           : stats.deliveryRate >= 95 
                           ? 'text-yellow-500' 
                           : 'text-red-500'
                       }`}>
                         {stats.sent === 0 ? 'N/A' : `${stats.deliveryRate.toFixed(1)}%`}
                       </div>
                       <div className="text-xs text-muted-foreground">delivery rate</div>
                     </div>
                   </div>
                   {/* Barra de progresso visual */}
                   {stats.sent > 0 && (
                     <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all ${
                           stats.deliveryRate >= 98 
                             ? 'bg-green-500' 
                             : stats.deliveryRate >= 95 
                             ? 'bg-yellow-500' 
                             : 'bg-red-500'
                         }`}
                         style={{ width: `${stats.deliveryRate}%` }}
                       />
                     </div>
                   )}
                   {stats.sent === 0 && (
                     <div className="text-xs text-muted-foreground text-center py-1">
                       No emails sent yet
                     </div>
                   )}
                 </div>
               ))
             )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
