import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

/**
 * Factory function to create Fastify app instance for testing
 */
export async function createApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
    },
  });

  // Initialize Prisma
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || 'postgresql://kaven:kaven123@localhost:5433/kaven',
      },
    },
  });

  // Initialize Redis
  const redis = new Redis(process.env.REDIS_URL || process.env.TEST_REDIS_URL || 'redis://localhost:6379');

  // Register Prisma and Redis on Fastify instance
  fastify.decorate('prisma', prisma);
  fastify.decorate('redis', redis);

  // Register plugins
  await fastify.register(import('@fastify/cors'), {
    origin: process.env.FRONTEND_URL || 'http://localhost:3039',
    credentials: true,
  });

  await fastify.register(import('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'ws:', 'wss:'],
        fontSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' },
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  });

  await fastify.register(import('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
    redis,
  });

  await fastify.register(import('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'your-secret-here',
  });

  await fastify.register(import('@fastify/sensible'));

  // Initialize Prometheus metrics
  const { initializeMetrics } = await import('./utils/metrics.js');
  initializeMetrics(fastify);

  // Register security middlewares
  const { 
    securityHeaders, 
    sanitizeRequest, 
    requestSizeLimit,
    auditLog,
    apiVersioning,
    requestTimeout
  } = await import('./middleware/security.middleware.js');
  
  // Global security hooks
  fastify.addHook('preHandler', async (request, reply) => {
    // Apply security headers
    await securityHeaders(request, reply);
    
    // Sanitize request
    await sanitizeRequest(request, reply);
    
    // Check request size
    await requestSizeLimit(request, reply);
    
    // API versioning
    await apiVersioning(request, reply);
    
    // Request timeout
    await requestTimeout(request, reply);
  });

  // Audit logging hook
  fastify.addHook('onRequest', async (request, reply) => {
    await auditLog(request, reply);
  });

  // Register tenant context middleware
  fastify.addHook('preHandler', async (request, reply) => {
    // Set tenant context for all authenticated requests
    if (request.user) {
      try {
        await fastify.prisma.$executeRaw`SET app.current_tenant_id = ${(request.user as any).tenantId}`;
        await fastify.prisma.$executeRaw`SET app.current_user_id = ${(request.user as any).id}`;
        
        fastify.log.debug({ 
          tenantId: (request.user as any).tenantId, 
          userId: (request.user as any).id,
          isAdm: (request.user as any).isAdm 
        }, 'RLS context set successfully');
      } catch (error) {
        fastify.log.error({ error }, 'Error setting tenant context for RLS');
        // Continue without failing - RLS will be handled at database level
      }
    }
  });

  // Register routes
  await fastify.register(import('./routes/auth.routes'), { prefix: '/api/auth' });
  await fastify.register(import('./routes/user.routes'), { prefix: '/api/users' });
  await fastify.register(import('./routes/tenant.routes'), { prefix: '/api/tenants' });
  await fastify.register(import('./routes/metric.routes'), { prefix: '/api/metrics' });

  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      
      // Test Redis connection
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
        services: {
          database: 'disconnected',
          redis: 'disconnected',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Prometheus metrics endpoint
  fastify.get('/metrics', async (request, reply) => {
    const { register } = await import('prom-client');
    reply.type('text/plain');
    return register.metrics();
  });

  // Error handler
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error({ error }, 'Unhandled error');
    
    reply.code(500);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    };
  });

  return fastify;
}
