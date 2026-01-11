import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

export interface InfrastructureService {
  name: string;
  type: 'database' | 'cache' | 'queue' | 'storage';
  priority: number;
  enabled: boolean;
}

export interface InfrastructureServiceStatus extends InfrastructureService {
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  lastCheck: number;
  errorCount: number;
  successRate: number;
}

export class InfrastructureMonitorService {
  private prisma: PrismaClient;
  private redis: Redis;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  private services: InfrastructureService[] = [
    {
      name: 'PostgreSQL',
      type: 'database',
      priority: 1,
      enabled: true
    },
    {
      name: 'Redis',
      type: 'cache',
      priority: 1,
      enabled: true
    }
  ];

  async checkAll(): Promise<InfrastructureServiceStatus[]> {
    console.log('[InfrastructureMonitor] 🔍 Verificando todos os serviços de infraestrutura...');
    const startTime = Date.now();
    
    const results = await Promise.all(
      this.services.map(service => this.checkService(service))
    );

    const healthyCount = results.filter(r => r.status === 'healthy').length;
    const totalTime = Date.now() - startTime;
    
    console.log(`[InfrastructureMonitor] ✅ Verificação completa em ${totalTime}ms:`, {
      total: results.length,
      healthy: healthyCount,
      degraded: results.filter(r => r.status === 'degraded').length,
      unhealthy: results.filter(r => r.status === 'unhealthy').length,
      services: results.map(r => `${r.name}:${r.status}(${r.latency}ms)`).join(', ')
    });

    return results;
  }

  private async checkService(service: InfrastructureService): Promise<InfrastructureServiceStatus> {
    console.log(`[InfrastructureMonitor] 🔌 Verificando ${service.name} (${service.type})...`);
    const start = Date.now();
    
    try {
      await this.ping(service);
      const latency = Date.now() - start;
      const status = this.getStatus(latency);
      
      const statusEmoji = status === 'healthy' ? '✅' : status === 'degraded' ? '⚠️' : '❌';
      console.log(`[InfrastructureMonitor] ${statusEmoji} ${service.name}: ${status} (${latency}ms)`);
      
      return {
        ...service,
        status,
        latency,
        lastCheck: Date.now(),
        errorCount: 0,
        successRate: 100
      };
    } catch (error: any) {
      const latency = Date.now() - start;
      console.error(`[InfrastructureMonitor] ❌ ${service.name}: FALHOU após ${latency}ms -`, error.message);
      
      return {
        ...service,
        status: 'unhealthy',
        latency,
        lastCheck: Date.now(),
        errorCount: 1,
        successRate: 0
      };
    }
  }

  private async ping(service: InfrastructureService): Promise<void> {
    if (service.type === 'database') {
      // Check PostgreSQL
      await this.prisma.$queryRaw`SELECT 1`;
    } else if (service.type === 'cache') {
      // Check Redis
      await this.redis.ping();
    }
  }

  private getStatus(latency: number): 'healthy' | 'degraded' | 'unhealthy' {
    if (latency < 100) return 'healthy';
    if (latency < 500) return 'degraded';
    return 'unhealthy';
  }

  async close() {
    await this.prisma.$disconnect();
    await this.redis.quit();
  }
}

export const infrastructureMonitorService = new InfrastructureMonitorService();
