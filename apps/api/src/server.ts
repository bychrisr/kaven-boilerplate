import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { authRoutes } from './modules/auth/routes/auth.routes';
import { userRoutes } from './modules/users/routes/user.routes';
import { tenantRoutes } from './modules/tenants/routes/tenant.routes';
import { paymentRoutes, webhookRoutes } from './modules/payments/routes/payment.routes';
import { healthRoutes } from './routes/health.routes';
import { metricsMiddleware } from './middleware/metrics.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Plugins
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

// Rate Limiting (global)
fastify.register(rateLimit, {
  max: 100, // 100 requests
  timeWindow: '1 minute', // por minuto
  cache: 10000, // cache de 10k IPs
  allowList: ['127.0.0.1'], // whitelist localhost
  redis: process.env.REDIS_URL ? require('ioredis').createClient(process.env.REDIS_URL) : undefined,
  keyGenerator: (req) => {
    // Usar IP ou user ID se autenticado
    return req.user?.id || req.ip || 'anonymous';
  },
  errorResponseBuilder: (req, context) => {
    return {
      error: 'Rate limit excedido',
      message: `Muitas requisições. Tente novamente em ${Math.ceil(context.after / 1000)} segundos.`,
      retryAfter: context.after,
    };
  },
});

// Metrics middleware (aplicado globalmente)
fastify.addHook('onRequest', metricsMiddleware);

// Tenant detection middleware (Camaleão)
fastify.addHook('onRequest', tenantMiddleware);

// Health checks e Metrics
fastify.register(healthRoutes);

// Rotas
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(userRoutes, { prefix: '/api/users' });
fastify.register(tenantRoutes, { prefix: '/api/tenants' });
fastify.register(paymentRoutes, { prefix: '/api/payments' });
fastify.register(webhookRoutes, { prefix: '/api/webhooks' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8000');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/auth`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
