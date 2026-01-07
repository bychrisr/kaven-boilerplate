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
    return Promise.all(
      this.services.map(service => this.checkService(service))
    );
  }

  private async checkService(service: InfrastructureService): Promise<InfrastructureServiceStatus> {
    const start = Date.now();
    
    try {
      await this.ping(service);
      const latency = Date.now() - start;
      
      return {
        ...service,
        status: this.getStatus(latency),
        latency,
        lastCheck: Date.now(),
        errorCount: 0,
        successRate: 100
      };
    } catch (error) {
      return {
        ...service,
        status: 'unhealthy',
        latency: Date.now() - start,
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
