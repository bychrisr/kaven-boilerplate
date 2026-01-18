import axios from 'axios';

export interface ExternalAPI {
  name: string;
  provider: 'stripe' | 'google_maps' | 'pagbit' | 'sendgrid' | 'openai' | 'custom';
  endpoint?: string;
  priority: number;
  enabled: boolean;
  requiresAuth: boolean;
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
    
    const results = await Promise.all(
      this.apis.map(api => this.checkAPI(api))
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

  private async checkAPI(api: ExternalAPI): Promise<ExternalAPIStatus> {
    console.log(`[ExternalAPIMonitor] 🌐 Verificando ${api.name} (${api.provider})...`);
    
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
