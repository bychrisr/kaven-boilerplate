import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { authRoutes } from './modules/auth/routes/auth.routes';
import { userRoutes } from './modules/users/routes/user.routes';
import { tenantRoutes } from './modules/tenants/routes/tenant.routes';
import { paymentRoutes, webhookRoutes } from './modules/payments/routes/payment.routes';
import { invoiceRoutes } from './modules/invoices/routes/invoice.routes';
import { orderRoutes } from './modules/orders/routes/order.routes';
import { fileRoutes } from './modules/files/routes/file.routes';
import { healthRoutes } from './routes/health.routes';
import { metricsMiddleware } from './middleware/metrics.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Swagger Documentation
fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Kaven API',
      description: 'Multi-tenant SaaS Boilerplate - Complete REST API',
      version: '0.6.0',
    },
    servers: [
      { url: 'http://localhost:8000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token obtido via /api/auth/login',
        },
      },
    },
    tags: [
      { name: 'Authentication', description: 'Endpoints de autenticação e 2FA' },
      { name: 'Users', description: 'Gerenciamento de usuários' },
      { name: 'Tenants', description: 'Gerenciamento de tenants (multi-tenancy)' },
      { name: 'Payments', description: 'Sistema de pagamentos Stripe' },
      { name: 'Files', description: 'Upload e gerenciamento de arquivos' },
      { name: 'Health', description: 'Health checks e métricas' },
    ],
  },
});

fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Plugins
fastify.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:3002', // Frontend admin panel
    process.env.FRONTEND_URL || 'http://localhost:3000',
  ],
  credentials: true,
});

// Multipart (file upload)
fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Rate Limiting (global) - SOLUÇÃO ROBUSTA COM REDIS
fastify.register(rateLimit, {
  max: 100, // 100 requests
  timeWindow: 60000, // 1 minuto em ms
  cache: 10000, // cache de 10k IPs
  allowList: ['127.0.0.1'], // whitelist localhost
  // Redis para rate limiting distribuído (produção)
  redis: process.env.REDIS_URL 
    ? (() => {
        const Redis = require('ioredis');
        const client = new Redis(process.env.REDIS_URL, {
          enableOfflineQueue: false,
          maxRetriesPerRequest: 1,
        });
        
        client.on('error', (err: Error) => {
          console.warn('⚠️  Redis rate limit error:', err.message);
        });
        
        return client;
      })()
    : undefined,
  keyGenerator: (req) => {
    // Usar IP ou user ID se autenticado
    return req.user?.id || req.ip || 'anonymous';
  },
  errorResponseBuilder: (req, context) => {
    return {
      error: 'Rate limit excedido',
      message: `Muitas requisições. Tente novamente em ${Math.ceil(Number(context.after) / 1000)} segundos.`,
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
fastify.register(invoiceRoutes, { prefix: '/api/invoices' });
fastify.register(orderRoutes, { prefix: '/api/orders' });
fastify.register(webhookRoutes, { prefix: '/api/webhooks' });
fastify.register(fileRoutes, { prefix: '/api/files' });

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
