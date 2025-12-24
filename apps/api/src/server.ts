import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import fastifyHelmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './config/env';
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
import { auditRoutes } from './modules/audit/routes/audit.routes';
import { observabilityRoutes } from './modules/observability/routes/observability.routes';
import { advancedMetricsMiddleware, onResponseMetricsHook } from './middleware/advanced-metrics.middleware';

const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
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
fastify.register(fastifyHelmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Necessário para Swagger UI
    },
  },
  global: true,
});

fastify.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:3002', // Frontend admin panel
    env.FRONTEND_URL,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
});

// Multipart (file upload)
fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Rate Limiting (global) - SOLUÇÃO ROBUSTA COM REDIS
import { rateLimitConfig } from './middleware/rate-limit.middleware';
fastify.register(rateLimit, rateLimitConfig);

// Metrics middleware (aplicado globalmente)
fastify.addHook('onRequest', metricsMiddleware);

// Advanced metrics middleware (coleta latência e status codes)
fastify.addHook('onRequest', advancedMetricsMiddleware);
fastify.addHook('onResponse', onResponseMetricsHook);

// Tenant detection middleware (Camaleão)
fastify.addHook('onRequest', tenantMiddleware);

// CSRF Protection (Global)
import { csrfMiddleware } from './middleware/csrf.middleware';
fastify.addHook('onRequest', csrfMiddleware);

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
fastify.register(auditRoutes, { prefix: '/api/audit-logs' });
fastify.register(observabilityRoutes, { prefix: '/api/observability' });

// 🕵️ FORENSIC AUDIT: Global Request Tracer
import { randomUUID } from 'node:crypto';
import { secureLog } from './utils/secure-logger';

fastify.addHook('onRequest', async (request, reply) => {
  const reqId = (request.headers['x-request-id'] as string) || randomUUID();
  request.id = reqId; // Override Fastify's default ID with our UUID
  request.headers['x-request-id'] = reqId;
  
  secureLog.info('[REQ_START]', {
    reqId,
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  });
});

// 🕵️ FORENSIC AUDIT: Global Error Interceptor
fastify.setErrorHandler((error: any, request, reply) => {
  const reqId = request.id;
  
  secureLog.error('[FATAL_ERROR]', {
    reqId,
    error: error.message,
    statusCode: error.statusCode,
    validation: error.validation,
    stack: env.NODE_ENV !== 'production' ? error.stack : undefined,
    // input: request.body // Body might not be parsed yet or could be huge. Use with caution.
    // SecureLog will redact sensitive fields if present.
    input: request.body
  });

  // Default Fastify error response
  reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    error: error.name || 'Internal Server Error',
    message: error.message,
    validation: error.validation
  });
});


// Start server
const start = async () => {
  try {
    const port = env.PORT;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/auth`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
