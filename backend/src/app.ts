import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

// Extend FastifyInstance with custom properties
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    redis: Redis;
  }
}

export async function createApp(): Promise<FastifyInstance> {
  const fastify = (await import('fastify')).default({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      ...(process.env.NODE_ENV === 'development' && {
        transport: { target: 'pino-pretty' }
      })
    }
  });

  // Register Prisma
  const prisma = new PrismaClient();
  await fastify.register(async (fastify) => {
    fastify.decorate('prisma', prisma);
  });

  // Register Redis
  const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  await fastify.register(async (fastify) => {
    fastify.decorate('redis', redis);
  });

  // Register security plugins
  await fastify.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });

  // Register CORS
  await fastify.register(import('@fastify/cors'), {
    origin: process.env.FRONTEND_URL || 'http://localhost:3039',
    credentials: true,
  });

  // Register sensible defaults
  await fastify.register(import('@fastify/sensible'));

  // Register JWT
  await fastify.register(import('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });

  // Register rate limiting
  await fastify.register(import('@fastify/rate-limit'), {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '60000'),
  });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;
      
      // Check Redis connection
      await redis.ping();

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          redis: 'connected',
        },
      };
    } catch (error) {
      reply.code(503);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Service unavailable',
      };
    }
  });

  // Metrics endpoint for Prometheus
  fastify.get('/metrics', async (request, reply) => {
    // This will be implemented later with prom-client
    reply.type('text/plain');
    return '# Metrics endpoint - to be implemented with prom-client\n';
  });

  // Register routes
  await fastify.register(import('./routes/auth.routes'), { prefix: '/api/auth' });
  await fastify.register(import('./routes/user.routes'), { prefix: '/api/users' });
  await fastify.register(import('./routes/tenant.routes'), { prefix: '/api/tenants' });
  await fastify.register(import('./routes/metric.routes'), { prefix: '/api/metrics' });

  // Global error handler
  fastify.setErrorHandler(async (error: any, request, reply) => {
    fastify.log.error(error);

    if (error.validation) {
      reply.code(400).send({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Erro de validação nos dados fornecidos',
        details: error.validation,
      });
      return;
    }

    if (error.statusCode) {
      reply.code(error.statusCode).send({
        success: false,
        error: error.code || 'INTERNAL_ERROR',
        message: error.message,
      });
      return;
    }

    reply.code(500).send({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Erro interno do servidor',
    });
  });

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    fastify.log.info(`Received ${signal}, shutting down gracefully...`);
    
    try {
      await fastify.close();
      await prisma.$disconnect();
      redis.disconnect();
      fastify.log.info('Server closed successfully');
      process.exit(0);
    } catch (error: any) {
      fastify.log.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  return fastify;
}
