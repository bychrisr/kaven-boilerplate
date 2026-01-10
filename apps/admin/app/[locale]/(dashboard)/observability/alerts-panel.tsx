'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observabilityApi, type Alert, type AlertThreshold } from '@/lib/api/observability';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info, 
  Clock, 
  RefreshCw,
  Filter,
  Search,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AlertsPanel() {
  const t = useTranslations('Observability.alerts');
  const queryClient = useQueryClient();
  
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [showThresholds, setShowThresholds] = useState(false);

  // Queries
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: observabilityApi.getAlerts,
    refetchInterval: 10000,
    retry: false
  });

  // Mutations
  const resolveMutation = useMutation({
    mutationFn: observabilityApi.resolveAlert,
    onSuccess: () => {
      toast.success(t('resolveSuccess'));
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: () => {
      toast.error(t('resolveError'));
    }
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  // Ensure data structure compatibility
  const allAlerts = (data.alerts || data.active || []) as Alert[];
  const thresholds = (data.thresholds || []) as AlertThreshold[];

  const activeAlerts = allAlerts.filter(a => !a.resolved);
  const resolvedAlerts = allAlerts.filter(a => a.resolved);
  const criticalCount = allAlerts.filter(a => a.severity === 'critical').length;

  const filteredAlerts = allAlerts.filter(alert => {
    // Filter by status (visual toggle overrides status filter logic if needed, but let's follow Axisor logic)
    if (filter === 'active' && alert.resolved) return false;
    if (filter === 'resolved' && !alert.resolved) return false;
    
    // "Show resolved" toggle logic interaction
    if (!showResolved && alert.resolved && filter !== 'resolved') return false;

    // Filter by severity
    if (severityFilter !== 'all' && alert.severity !== severityFilter) return false;
    
    // Filter by search term
    if (searchTerm && !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    return true;
  }).sort((a, b) => b.timestamp - a.timestamp); // Newest first

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatTimeAgo = (timestamp: number) => {
    // Usar timestamp do servidor para cálculo relativo
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-900/50 dark:text-orange-400';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/50 dark:text-yellow-400';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20 mr-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{allAlerts.length}</div>
              <div className="text-sm text-muted-foreground">{t('totalAlerts') || 'Total Alerts'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
           <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20 mr-4">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{activeAlerts.length}</div>
              <div className="text-sm text-muted-foreground">{t('active') || 'Active'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
           <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 mr-4">
               <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{resolvedAlerts.length}</div>
              <div className="text-sm text-muted-foreground">{t('resolved') || 'Resolved'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
           <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 mr-4">
               <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{criticalCount}</div>
              <div className="text-sm text-muted-foreground">{t('critical') || 'Critical'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-sm font-medium text-muted-foreground mr-2">
              <Filter className="w-4 h-4 mr-2" />
              Filters:
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'resolved')}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Alerts</option>
              <option value="active">Active Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as 'all' | 'critical' | 'high' | 'medium' | 'low')}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <button
              onClick={() => setShowResolved(!showResolved)}
              className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border ${
                showResolved 
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50' 
                  : 'bg-background hover:bg-accent hover:text-accent-foreground border-input'
              }`}
            >
              {showResolved ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
              {showResolved ? 'Hide Resolved' : 'Show Resolved'}
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-full md:w-[200px] rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            
            <button
              onClick={() => refetch()}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowThresholds(!showThresholds)}
              className={`inline-flex h-9 items-center justify-center rounded-md border border-input px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${showThresholds ? 'bg-accent text-accent-foreground' : 'bg-background'}`}
              title="Configure Thresholds"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Alerts List */}
        <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center justify-between p-6 pb-2">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Alerts ({filteredAlerts.length})
            </h3>
            {data && (
              <span className="text-xs text-muted-foreground">
                Updated: {new Date().toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="p-6 pt-4">
             {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">{t('noActiveAlerts') || 'No alerts found'}</h3>
                <p className="text-sm max-w-sm mt-1">
                  {filter === 'active' 
                    ? 'Great! There are no active alerts at the moment.' 
                    : 'Try adjusting your filters to see more results.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`relative flex items-start justify-between rounded-lg border p-4 transition-all hover:bg-accent/5 ${
                      alert.resolved ? 'bg-muted/30 border-border opacity-70' : 'bg-card border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                       <div className="mt-1">
                        {getSeverityIcon(alert.severity)}
                       </div>
                       
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="font-semibold text-foreground">{alert.message}</span>
                             <Badge variant="outline" className={`text-xs capitalize ${getSeverityColor(alert.severity)}`}>
                                {alert.severity}
                             </Badge>
                             {alert.resolved && (
                               <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                 Resolved
                               </Badge>
                             )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                             <span>
                               <strong>ID:</strong> {alert.thresholdId || 'unknown'}
                             </span>
                             <span className="hidden sm:inline">•</span>
                             <span title={formatTimestamp(alert.timestamp)}>
                                Created {formatTimeAgo(alert.timestamp)}
                             </span>
                             {alert.resolved && alert.resolvedAt && (
                               <>
                                 <span className="hidden sm:inline">•</span>
                                 <span title={formatTimestamp(alert.resolvedAt)}>
                                    Resolved {formatTimeAgo(alert.resolvedAt)}
                                 </span>
                               </>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!alert.resolved && (
                        <button
                          onClick={() => resolveMutation.mutate(alert.id)}
                          disabled={resolveMutation.isPending}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-8 px-3"
                        >
                          {resolveMutation.isPending ? 'Resolving...' : 'Resolve'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thresholds Configuration (Conditional) */}
        {showThresholds && (
          <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Configuration Rules</h3>
              <p className="text-sm text-muted-foreground">Manage alert thresholds and sensitivity</p>
            </div>
            <div className="p-6 pt-0">
               <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">Metric Name</th>
                      <th className="px-4 py-3 font-medium">Condition</th>
                      <th className="px-4 py-3 font-medium">Severity</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {thresholds.map(t => (
                      <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-3 font-medium">{t.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {t.metric} {t.operator} {t.value}
                        </td>
                        <td className="px-4 py-3">
                           <Badge variant="outline" className={`capitalize ${getSeverityColor(t.severity)}`}>
                             {t.severity}
                           </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className={t.enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500'}>
                            {t.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
