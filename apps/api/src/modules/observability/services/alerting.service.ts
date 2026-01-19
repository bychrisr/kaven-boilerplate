
// Use shared types from the shared library
// import { AlertThreshold, Alert } from '../../../../admin/lib/api/observability';
// Redefining here to avoid relative import hell across monorepo packages for now
// Ideally this should be in a shared package
import { prisma } from '../../../lib/prisma';
import { notificationService } from '../../notifications/services/notification.service';

export interface AlertThreshold {
  id: string;
  name: string;
  metric: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
  value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

export interface Alert {
  id: string;
  thresholdId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
}

// Nova interface para canais de notificação
export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook';
  config: Record<string, any>;
  enabled: boolean;
}

export class AlertingService {
  private thresholds: AlertThreshold[] = [
    {
      id: 'cpu_high',
      name: 'CPU Usage High',
      metric: 'cpu_usage',
      operator: 'gt',
      value: 80,
      severity: 'high',
      enabled: true
    },
    {
      id: 'memory_high',
      name: 'Memory Usage High',
      metric: 'memory_usage',
      operator: 'gt',
      value: 85,
      severity: 'high',
      enabled: true
    },
    {
      id: 'disk_high',
      name: 'Disk Usage High',
      metric: 'disk_usage',
      operator: 'gt',
      value: 90,
      severity: 'critical',
      enabled: true
    },
    {
      id: 'error_rate_high',
      name: 'Error Rate High',
      metric: 'error_rate',
      operator: 'gt',
      value: 5,
      severity: 'critical',
      enabled: true
    },
    {
      id: 'event_loop_lag_high',
      name: 'Event Loop Lag High',
      metric: 'event_loop_lag',
      operator: 'gt',
      value: 50,
      severity: 'high',
      enabled: true
    },
    {
      id: 'response_time_high',
      name: 'Response Time High',
      metric: 'response_time',
      operator: 'gt',
      value: 2000,
      severity: 'high',
      enabled: true
    },
    {
      id: 'database_slow',
      name: 'Database Slow',
      metric: 'database_latency',
      operator: 'gt',
      value: 1000,
      severity: 'high',
      enabled: true
    },
    {
      id: 'redis_slow',
      name: 'Redis Slow',
      metric: 'redis_latency',
      operator: 'gt',
      value: 500,
      severity: 'medium',
      enabled: true
    },
    // Service DOWN thresholds (0 = unhealthy, 1 = healthy)
    {
      id: 'redis_down',
      name: 'Redis Down',
      metric: 'redis_status',
      operator: 'eq',
      value: 0,
      severity: 'critical',
      enabled: true
    },
    {
      id: 'database_down',
      name: 'Database Down',
      metric: 'database_status',
      operator: 'eq',
      value: 0,
      severity: 'critical',
      enabled: true
    },
    {
      id: 'prometheus_down',
      name: 'Prometheus Down',
      metric: 'prometheus_status',
      operator: 'eq',
      value: 0,
      severity: 'high',
      enabled: true
    },
    {
      id: 'grafana_down',
      name: 'Grafana Down',
      metric: 'grafana_status',
      operator: 'eq',
      value: 0,
      severity: 'medium',
      enabled: true
    },
    {
      id: 'loki_down',
      name: 'Loki Down',
      metric: 'loki_status',
      operator: 'eq',
      value: 0,
      severity: 'medium',
      enabled: true
    },
    {
      id: 'mailhog_down',
      name: 'MailHog Down',
      metric: 'mailhog_status',
      operator: 'eq',
      value: 0,
      severity: 'low',
      enabled: true
    },
  ];

  // Armazena histórico completo de alertas (ativos e resolvidos)
  private alerts: Alert[] = [];

  // Canais de notificação (Mock/Configuração inicial)
  private notificationChannels: NotificationChannel[] = [
    {
      id: 'default_email',
      name: 'Admin Email',
      type: 'email',
      config: { to: 'admin@kaven.com' },
      enabled: true
    },
    {
      id: 'devops_slack',
      name: 'DevOps Slack',
      type: 'slack',
      config: { webhookUrl: process.env.SLACK_WEBHOOK_URL || '' },
      enabled: false // Desabilitado por padrão para evitar spam em dev
    }
  ];
  
  constructor() {
    // Limpar alertas antigos a cada hora
    setInterval(() => this.cleanupOldAlerts(), 60 * 60 * 1000);
  }

  async checkMetrics(metrics: any): Promise<Alert[]> {
    // console.log('[AlertingService] 🚨 Verificando thresholds de alertas...');
    const newAlerts: Alert[] = [];
    let evaluatedCount = 0;
    let triggeredCount = 0;

    for (const threshold of this.thresholds) {
      if (!threshold.enabled) continue;
      evaluatedCount++;

      const value = this.getMetricValue(metrics, threshold.metric);
      
      const isTriggered = this.evaluate(value, threshold);
      const activeAlert = this.getActiveAlertByThresholdId(threshold.id);

      if (isTriggered) {
        if (!activeAlert) {
          // Novo alerta
          const alert = this.createAlert(threshold, value);
          this.alerts.unshift(alert); // Adiciona no início (mais recente)
          newAlerts.push(alert);
          triggeredCount++;
          console.log(`[AlertingService] ⚠️  ALERTA DISPARADO: ${alert.message}`);
          
          // 🔥 Dispara notificações
          console.log(`[AlertingService] 🚀 Disparando notificações para alerta ${alert.id}...`);
          try {
             await this.processNotifications(alert);
             console.log(`[AlertingService] ✅ Notificações processadas para alerta ${alert.id}`);
          } catch (err) {
             console.error(`[AlertingService] ❌ Falha crítica ao processar notificações:`, err);
          }

        } else {
          // Alerta já existe
          // Opcional: Atualizar valor ou timestamp do alerta existente?
        }
      } else {
        // Resolve alerta se existir e não estiver resolvido (auto-resolve)
        if (activeAlert) {
          this.resolveAlertInternal(activeAlert);
          console.log(`[AlertingService] ✅ Auto-resolução: ${activeAlert.message}`);
        }
      }
    }

    if (triggeredCount > 0) {
      console.log(`[AlertingService] ✅ ${triggeredCount} novos alertas disparados`);
    }
    return newAlerts;
  }

  private getMetricValue(metrics: any, metric: string): number {
    switch (metric) {
      case 'cpu_usage':
        return metrics.cpu?.usage || 0;
      case 'memory_usage':
        return metrics.memory?.usagePercent || 0;
      case 'disk_usage':
        return metrics.disk?.usagePercent || 0;
      case 'error_rate':
        return metrics.goldenSignals?.errors?.errorRate || 0;
      case 'event_loop_lag':
        return metrics.nodejs?.eventLoopLag || 0;
      case 'response_time':
        return metrics.goldenSignals?.latency?.p95 || 0;
      case 'database_latency':
        const dbService = metrics.infrastructure?.find((svc: any) => svc.name === 'PostgreSQL');
        return dbService?.latency || 0;
      case 'redis_latency':
        const redisService = metrics.infrastructure?.find((svc: any) => svc.name === 'Redis');
        return redisService?.latency || 0;
      
      // Service status checks (0 = unhealthy, 1 = healthy)
      case 'redis_status':
        const redis = metrics.infrastructure?.find((svc: any) => svc.name === 'Redis');
        return redis?.status === 'healthy' ? 1 : 0;
      case 'database_status':
        const db = metrics.infrastructure?.find((svc: any) => svc.name === 'PostgreSQL');
        return db?.status === 'healthy' ? 1 : 0;
      case 'prometheus_status':
        const prom = metrics.infrastructure?.find((svc: any) => svc.name === 'Prometheus');
        return prom?.status === 'healthy' ? 1 : 0;
      case 'grafana_status':
        const grafana = metrics.infrastructure?.find((svc: any) => svc.name === 'Grafana');
        return grafana?.status === 'healthy' ? 1 : 0;
      case 'loki_status':
        const loki = metrics.infrastructure?.find((svc: any) => svc.name === 'Loki');
        return loki?.status === 'healthy' ? 1 : 0;
      case 'mailhog_status':
        const mailhog = metrics.infrastructure?.find((svc: any) => svc.name === 'MailHog');
        return mailhog?.status === 'healthy' ? 1 : 0;
        
      default:
        return 0;
    }
  }

  private evaluate(value: number, threshold: AlertThreshold): boolean {
    switch (threshold.operator) {
      case 'gt': return value > threshold.value;
      case 'gte': return value >= threshold.value;
      case 'lt': return value < threshold.value;
      case 'lte': return value <= threshold.value;
      case 'eq': return value === threshold.value;
      default: return false;
    }
  }

  private createAlert(threshold: AlertThreshold, value: number): Alert {
    return {
      id: `${threshold.id}_${Date.now()}`,
      thresholdId: threshold.id,
      severity: threshold.severity,
      message: `${threshold.name}: ${value.toFixed(2)} (threshold: ${threshold.value})`,
      value,
      threshold: threshold.value,
      timestamp: Date.now(),
      resolved: false
    };
  }

  // --- Notification Logic ---

  private async processNotifications(alert: Alert) {
    // 1. Send to external channels (Email, Slack, etc)
    if (this.notificationChannels.length > 0) {
      console.log(`[AlertingService] 📨 Processando notificações para alerta [${alert.severity}]: ${alert.message}`);
      
      const notifications = this.notificationChannels
        .filter(channel => channel.enabled)
        .map(channel => this.sendNotification(alert, channel));

      await Promise.allSettled(notifications);
    }

    // 2. Send to In-App Notification System (Header)
    try {
      // Find all SUPER_ADMIN users to notify
      const admins = await prisma.user.findMany({
        where: { role: 'SUPER_ADMIN' },
        select: { id: true, email: true }
      });

      console.log(`[AlertingService] 🔍 Admins encontrados: ${admins.length}`, admins.map(a => a.email));

      if (admins.length === 0) {
        console.warn('[AlertingService] ⚠️ Nenhum SUPER_ADMIN encontrado para receber notificação in-app.');
        return;
      }

      console.log(`[AlertingService] 🔔 Criando notificações in-app para ${admins.length} admins.`);

      const notificationPromises = admins.map(admin => 
        notificationService.createNotification({
          userId: admin.id,
          type: 'system',
          priority: alert.severity, // matches 'low' | 'medium' | 'high' | 'critical'
          title: `Alerta: ${alert.severity.toUpperCase()}`,
          message: alert.message,
          metadata: {
            alertId: alert.id,
            thresholdId: alert.thresholdId,
            value: alert.value,
            threshold: alert.threshold
          },
          actionUrl: '/observability',
          actionText: 'Ver Detalhes'
        })
      );

      const results = await Promise.allSettled(notificationPromises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`[AlertingService] ✅ ${successCount}/${admins.length} notificações criadas com sucesso no DB.`);

    } catch (error) {
      console.error('[AlertingService] ❌ Falha ao criar notificações in-app:', error);
    }
  }

  private async sendNotification(alert: Alert, channel: NotificationChannel) {
    const timestampStr = new Date(alert.timestamp).toISOString();
    const message = `[ALERT] ${alert.severity.toUpperCase()} - ${alert.message} at ${timestampStr}`;

    try {
      switch (channel.type) {
        case 'email':
          // Simulação de envio de email
          console.log(`[Notificação::Email] Para: ${channel.config.to} | Assunto: Kaven Alert - ${alert.severity} | Corpo: ${message}`);
          break;
        case 'slack':
          // Simulação de envio para Slack
          console.log(`[Notificação::Slack] Webhook: ${channel.config.webhookUrl} | Payload: { text: "${message}" }`);
          break;
        case 'webhook':
          // Implementação real simplificada de webhook
          if (channel.config.webhookUrl) {
            console.log(`[Notificação::Webhook] POST ${channel.config.webhookUrl}`);
            // await fetch(channel.config.webhookUrl, { ... }) 
          }
          break;
        default:
          console.warn(`[AlertingService] Tipo de canal desconhecido: ${channel.type}`);
      }
    } catch (error) {
      console.error(`[AlertingService] Erro ao enviar notificação via ${channel.name}:`, error);
      throw error; // Re-throw para ser capturado pelo Promise.allSettled
    }
  }

  // --- End Notification Logic ---

  private resolveAlertInternal(alert: Alert) {
    if (!alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
    }
  }

  private getActiveAlertByThresholdId(thresholdId: string): Alert | undefined {
    return this.alerts.find(a => a.thresholdId === thresholdId && !a.resolved);
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(a => !a.resolved);
  }
  
  getAllAlerts(): Alert[] {
    return this.alerts;
  }

  getResolvedAlerts(): Alert[] {
    return this.alerts.filter(a => a.resolved);
  }

  getAllThresholds(): AlertThreshold[] {
    return this.thresholds;
  }

  getThreshold(id: string): AlertThreshold | null {
    return this.thresholds.find(t => t.id === id) || null;
  }

  updateThreshold(id: string, updates: Partial<AlertThreshold>): boolean {
    const threshold = this.thresholds.find(t => t.id === id);
    if (!threshold) return false;
    Object.assign(threshold, updates);
    return true;
  }

  resolveAlertById(alertId: string): Alert | null {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return null;

    if (!alert.resolved) {
      this.resolveAlertInternal(alert);
      console.log(`[AlertingService] ✅ Alerta resolvido manualmente: id=${alertId}`);
    }
    
    return alert;
  }

  getAlert(alertId: string): Alert | null {
    return this.alerts.find(a => a.id === alertId) || null;
  }

  // Limpa alertas resolvidos com mais de 24 horas
  cleanupOldAlerts(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const initialCount = this.alerts.length;
    
    this.alerts = this.alerts.filter(alert => {
      // Manter alertas ativos
      if (!alert.resolved) return true;
      // Manter alertas resolvidos recentes
      return (now - (alert.resolvedAt || 0)) < maxAgeMs;
    });

    const removedCount = initialCount - this.alerts.length;
    if (removedCount > 0) {
      console.log(`[AlertingService] 🧹 Limpeza: ${removedCount} alertas antigos removidos`);
    }
  }
}

export const alertingService = new AlertingService();
