import axios from 'axios';

export interface ExternalAPI {
  name: string;
  provider: 'stripe' | 'google_maps' | 'pagbit' | 'sendgrid' | 'openai' | 'custom';
  endpoint?: string;
  priority: number;
  enabled: boolean;
  requiresAuth: boolean;
  metadata?: Record<string, any>;
}

export interface ExternalAPIStatus extends ExternalAPI {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
  latency: number;
  lastCheck: number;
  errorCount: number;
  successRate: number;
  errorMessage?: string;
}

export class ExternalAPIMonitorService {
  private apis: ExternalAPI[] = [
    {
      name: 'Stripe',
      provider: 'stripe',
      endpoint: 'https://api.stripe.com/v1/charges',
      priority: 1,
      enabled: !!process.env.STRIPE_SECRET_KEY,
      requiresAuth: true
    },
    {
      name: 'Google Maps',
      provider: 'google_maps',
      endpoint: 'https://maps.googleapis.com/maps/api/geocode/json',
      priority: 2,
      enabled: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      requiresAuth: true
    },
    {
      name: 'PagBit',
      provider: 'pagbit',
      endpoint: process.env.PAGBIT_API_URL,
      priority: 1,
      enabled: !!process.env.PAGBIT_API_KEY,
      requiresAuth: true
    }
  ];

  async checkAll(): Promise<ExternalAPIStatus[]> {
    console.log('[ExternalAPIMonitor] 🔍 Verificando todas as APIs externas...');
    const startTime = Date.now();
    
    // Carregar integrações de email do banco de dados
    const emailIntegrations = await this.loadEmailIntegrations();
    
    // Combinar APIs fixas com integrações de email
    const allAPIs = [...this.apis, ...emailIntegrations];
    
    const results = await Promise.all(
      allAPIs.map(api => this.checkAPI(api))
    );

    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const notConfiguredCount = results.filter(r => r.status === 'not_configured').length;
    const totalTime = Date.now() - startTime;
    
    console.log(`[ExternalAPIMonitor] ✅ Verificação completa em ${totalTime}ms:`, {
      total: results.length,
      healthy: healthyCount,
      degraded: results.filter(r => r.status === 'degraded').length,
      unhealthy: results.filter(r => r.status === 'unhealthy').length,
      notConfigured: notConfiguredCount,
      apis: results.map(r => `${r.name}:${r.status}`).join(', ')
    });

    return results;
  }

  /**
   * Carrega integrações de email do banco de dados
   */
  private async loadEmailIntegrations(): Promise<ExternalAPI[]> {
    try {
      const { prisma } = await import('../../../lib/prisma');
      
      const integrations = await (prisma as any).emailIntegration.findMany({
        select: {
          id: true,
          provider: true,
          isActive: true,
          isPrimary: true,
          fromEmail: true,
          healthStatus: true,
          healthMessage: true,
          lastHealthCheck: true,
        }
      });

      return integrations.map((integration: any) => ({
        name: `Email - ${integration.provider}${integration.isPrimary ? ' (Primary)' : ''}`,
        provider: 'custom' as const,
        endpoint: this.getEmailProviderEndpoint(integration.provider),
        priority: integration.isPrimary ? 1 : 2,
        enabled: integration.isActive,
        requiresAuth: true,
        metadata: {
          integrationId: integration.id,
          emailProvider: integration.provider,
          fromEmail: integration.fromEmail,
          healthStatus: integration.healthStatus,
          healthMessage: integration.healthMessage,
          lastHealthCheck: integration.lastHealthCheck,
        }
      }));
    } catch (error) {
      console.error('[ExternalAPIMonitor] ❌ Erro ao carregar integrações de email:', error);
      return [];
    }
  }

  /**
   * Retorna endpoint de health check para cada provedor de email
   */
  private getEmailProviderEndpoint(provider: string): string {
    switch (provider) {
      case 'RESEND':
        return 'https://api.resend.com/emails';
      case 'POSTMARK':
        return 'https://api.postmarkapp.com/server';
      case 'AWS_SES':
        return 'https://email.us-east-1.amazonaws.com';
      case 'SMTP':
        return 'smtp://localhost'; // SMTP não tem endpoint HTTP
      default:
        return '';
    }
  }

  private async checkAPI(api: ExternalAPI): Promise<ExternalAPIStatus> {
    console.log(`[ExternalAPIMonitor] 🌐 Verificando ${api.name} (${api.provider})...`);
    
    // Se é uma integração de email, usar health status do banco ao invés de ping
    if (api.metadata?.emailProvider) {
      const healthStatus = api.metadata.healthStatus;
      const healthMessage = api.metadata.healthMessage;
      const lastHealthCheck = api.metadata.lastHealthCheck;
      
      // Mapear healthStatus para status do observability
      let status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured';
      
      if (!healthStatus || healthStatus === 'unconfigured') {
        status = 'not_configured';
      } else if (healthStatus === 'healthy') {
        status = 'healthy';
      } else {
        status = 'unhealthy';
      }
      
      const statusEmoji = status === 'healthy' ? '✅' : status === 'not_configured' ? '⚙️' : '❌';
      console.log(`[ExternalAPIMonitor] ${statusEmoji} ${api.name}: ${status} (health check from DB)`);
      
      return {
        ...api,
        status,
        latency: 0, // Health check não mede latência de rede
        lastCheck: lastHealthCheck ? new Date(lastHealthCheck).getTime() : Date.now(),
        errorCount: status === 'unhealthy' ? 1 : 0,
        successRate: status === 'healthy' ? 100 : 0,
        errorMessage: status !== 'healthy' ? (healthMessage || 'Health check failed') : undefined,
      };
    }
    
    // Lógica original para outras APIs (Stripe, Google Maps, etc)
    // Se não está habilitado (sem API key), retornar not_configured
    if (!api.enabled) {
      console.log(`[ExternalAPIMonitor] ⚙️  ${api.name}: NÃO CONFIGURADO (API key ausente)`);
      return {
        ...api,
        status: 'not_configured',
        latency: 0,
        lastCheck: Date.now(),
        errorCount: 0,
        successRate: 0,
        errorMessage: 'API key not configured'
      };
    }

    const start = Date.now();
    
    try {
      await this.ping(api);
      const latency = Date.now() - start;
      const status = this.getStatus(latency);
      
      const statusEmoji = status === 'healthy' ? '✅' : status === 'degraded' ? '⚠️' : '❌';
      console.log(`[ExternalAPIMonitor] ${statusEmoji} ${api.name}: ${status} (${latency}ms)`);
      
      return {
        ...api,
        status,
        latency,
        lastCheck: Date.now(),
        errorCount: 0,
        successRate: 100
      };
    } catch (error: any) {
      const latency = Date.now() - start;
      console.error(`[ExternalAPIMonitor] ❌ ${api.name}: FALHOU após ${latency}ms -`, error.message);
      
      return {
        ...api,
        status: 'unhealthy',
        latency,
        lastCheck: Date.now(),
        errorCount: 1,
        successRate: 0,
        errorMessage: error.message
      };
    }
  }

  private async ping(api: ExternalAPI): Promise<void> {
    if (!api.endpoint) {
      throw new Error('Endpoint not configured');
    }

    // SMTP não tem endpoint HTTP, considerar como "healthy" se configurado
    if (api.endpoint.startsWith('smtp://')) {
      // Para SMTP, apenas verificamos se está configurado
      return;
    }

    const headers: Record<string, string> = {};

    // Adicionar autenticação conforme o provider
    if (api.requiresAuth) {
      switch (api.provider) {
        case 'stripe':
          if (process.env.STRIPE_SECRET_KEY) {
            headers['Authorization'] = `Bearer ${process.env.STRIPE_SECRET_KEY}`;
          }
          break;
        case 'pagbit':
          if (process.env.PAGBIT_API_KEY) {
            headers['Authorization'] = `Bearer ${process.env.PAGBIT_API_KEY}`;
          }
          break;
        case 'google_maps':
          // Google Maps usa query param, não header
          break;
        case 'custom':
          // Email providers - não fazemos ping real para não consumir quota
          // Apenas verificamos se está configurado
          return;
      }
    }

    // Health check simples (HEAD request ou GET com timeout curto)
    const response = await axios.head(api.endpoint, {
      headers,
      timeout: 5000,
      validateStatus: (status) => status < 500 // Aceitar 4xx como "API está respondendo"
    });

    if (response.status >= 500) {
      throw new Error(`API returned ${response.status}`);
    }
  }

  private getStatus(latency: number): 'healthy' | 'degraded' | 'unhealthy' {
    if (latency < 500) return 'healthy';
    if (latency < 2000) return 'degraded';
    return 'unhealthy';
  }
}

export const externalAPIMonitorService = new ExternalAPIMonitorService();
