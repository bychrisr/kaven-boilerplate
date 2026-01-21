import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import fastifyHelmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { env } from './config/env';
import { initSentry, Sentry } from './lib/sentry';
import { healthRoutes } from './routes/health.routes';
import { metricsMiddleware } from './middleware/metrics.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';
import { rateLimitConfig } from './middleware/rate-limit.middleware';
import { csrfMiddleware } from './middleware/csrf.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import { secureLog } from './utils/secure-logger';

// [KAVEN_MODULE_IMPORTS_START]
import { authRoutes } from './modules/auth/routes/auth.routes';
import { userRoutes } from './modules/users/routes/user.routes';
import { inviteRoutes } from './modules/users/routes/invite.routes';
import { tenantRoutes } from './modules/tenants/routes/tenant.routes';
import { fileRoutes } from './modules/files/routes/file.routes';
import { auditRoutes } from './modules/audit/routes/audit.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { planRoutes } from './modules/plans/routes/plan.routes';
import { featureRoutes } from './modules/plans/routes/feature.routes';
import { productRoutes } from './modules/products/routes/product.routes';
import { subscriptionRoutes } from './modules/subscriptions/routes/subscription.routes';
import { notificationRoutes } from './modules/notifications/routes/notification.routes';
import { invoiceRoutes } from './modules/invoices/routes/invoice.routes';
import { orderRoutes } from './modules/orders/routes/order.routes';
import { platformRoutes } from './modules/platform/routes/platform.routes';
import { emailIntegrationRoutes } from './modules/platform/routes/email-integration.routes';
import { observabilityRoutes } from './modules/observability/routes/observability.routes';
import { projectsRoutes } from './modules/app/projects/projects.routes';
import { tasksRoutes } from './modules/app/tasks/tasks.routes';
import { currenciesRoutes } from './modules/currencies/routes/currencies.routes';
import { emailWebhookRoutes } from './modules/webhooks/routes/email-webhook.routes';
import { unsubscribeRoutes } from './modules/webhooks/routes/unsubscribe.routes';
import { diagnosticsRoutes } from './modules/observability/routes/diagnostics.routes';
import { advancedMetricsMiddleware, onResponseMetricsHook } from './modules/observability/middleware/advanced-metrics.middleware';
// [KAVEN_MODULE_IMPORTS]
// [KAVEN_MODULE_IMPORTS_END]

import { roleRoutes } from './modules/roles/routes/role.routes';
import { grantRequestRoutes } from './modules/grants/routes/grant-request.routes';
import { policyRoutes } from './modules/policies/routes/policy.routes';
import { exportRoutes } from './modules/export/routes/export.routes';

// Initialize Sentry for error tracking
initSentry();

const app = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Swagger Documentation
app.register(swagger, {
  openapi: {
    info: {
      title: 'Kaven API',
      description: 'Multi-tenant SaaS Boilerplate - Complete REST API',
      version: '0.6.0',
    },
    servers: [
      { url: `http://localhost:${env.PORT}`, description: 'Development' },
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
      { name: 'Plans', description: 'Gerenciamento de planos de assinatura' },
      { name: 'Products', description: 'Gerenciamento de produtos one-time' },
      { name: 'Features', description: 'Gerenciamento de features e quotas' },
      { name: 'Subscriptions', description: 'Gerenciamento de subscriptions e entitlement' },
    ],
  },
});

app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Plugins
app.register(fastifyHelmet, {
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

app.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'x-space-id'],
});

// Multipart (file upload)
app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Static files (uploads)
app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'uploads'),
  prefix: '/uploads/',
  decorateReply: false, // Não decorar reply para evitar conflitos
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
});

// Rate Limiting (global) - SOLUÇÃO ROBUSTA COM REDIS
app.register(rateLimit, rateLimitConfig);

// Metrics middleware (aplicado globalmente)
app.addHook('onRequest', metricsMiddleware);

app.addHook('onRequest', advancedMetricsMiddleware);
app.addHook('onResponse', onResponseMetricsHook);
// [KAVEN_MODULE_HOOKS]
// [KAVEN_MODULE_HOOKS_END]

// Tenant detection middleware (Camaleão)
app.addHook('onRequest', tenantMiddleware);

// CSRF Protection (Global)
app.addHook('onRequest', csrfMiddleware);

// Health check
app.register(healthRoutes);

// Sentry Error Handler
app.setErrorHandler((error, request, reply) => {
  // Log error to Sentry
  Sentry.captureException(error, {
    contexts: {
      request: {
        method: request.method,
        url: request.url,
        headers: request.headers,
      },
    },
    user: {
      id: (request as any).user?.id,
      email: (request as any).user?.email,
    },
    tags: {
      tenant: (request as any).tenantId,
    },
  });

  // Log to console in development
  if (env.NODE_ENV !== 'production') {
    app.log.error(error);
  }

  // Return error response
  const statusCode = (error as any).statusCode || 500;
  reply.status(statusCode).send({
    error: env.NODE_ENV === 'production' ? 'Internal Server Error' : (error as Error).message,
    statusCode,
  });
});

// Core and Module Registration
// [KAVEN_MODULE_REGISTRATION_START]
app.register(authRoutes, { prefix: '/api/auth' });
app.register(userRoutes, { prefix: '/api/users' });
app.register(inviteRoutes, { prefix: '/api/users' });
app.register(tenantRoutes, { prefix: '/api/tenants' });
app.register(fileRoutes, { prefix: '/api/files' });
app.register(auditRoutes, { prefix: '/api/audit-logs' });
app.register(dashboardRoutes, { prefix: '/api/dashboard' });

// Plans & Products System
app.register(planRoutes, { prefix: '/api' });
app.register(productRoutes, { prefix: '/api' });
app.register(featureRoutes, { prefix: '/api' });
app.register(subscriptionRoutes, { prefix: '/api' });
app.register(invoiceRoutes, { prefix: '/api/invoices' });
app.register(orderRoutes, { prefix: '/api/orders' });
app.register(notificationRoutes, { prefix: '/api/notifications' });
app.register(platformRoutes, { prefix: '/api/settings/platform' });
app.register(emailIntegrationRoutes, { prefix: '/api/settings/email' });
app.register(observabilityRoutes, { prefix: '/api/observability' });
app.register(projectsRoutes, { prefix: '/api/app/projects' });
app.register(tasksRoutes, { prefix: '/api/app/tasks' });
app.register(roleRoutes, { prefix: '/api' });
app.register(grantRequestRoutes, { prefix: '/api' });
app.register(policyRoutes, { prefix: '/api' });
app.register(currenciesRoutes, { prefix: '/api/currencies' });
app.register(exportRoutes, { prefix: '/api/export' });

// Webhooks
app.register(emailWebhookRoutes, { prefix: '/api/webhooks/email' });
app.register(unsubscribeRoutes, { prefix: '/api/webhooks/email/unsubscribe' });

import { spaceRoutes } from './modules/spaces/routes/space.routes';

app.register(diagnosticsRoutes, { prefix: '/api/diagnostics' });
app.register(spaceRoutes, { prefix: '/api/spaces' });
// [KAVEN_MODULE_REGISTRATION]
// [KAVEN_MODULE_REGISTRATION_END]

// 🕵️ FORENSIC AUDIT: Global Request Tracer
app.addHook('onRequest', async (request, reply) => {
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
app.setErrorHandler((error: Error & { statusCode?: number; validation?: any }, request, reply) => {
  const reqId = request.id;
  
  secureLog.error('[FATAL_ERROR]', {
    reqId,
    error: error.message,
    statusCode: (error as any).statusCode,
    validation: (error as any).validation,
    stack: env.NODE_ENV !== 'production' ? error.stack : undefined,
    // input: request.body // Body might not be parsed yet or could be huge. Use with caution.
    // SecureLog will redact sensitive fields if present.
    input: request.body
  });

  // Default Fastify error response
  reply.status((error as any).statusCode || 500).send({
    statusCode: (error as any).statusCode || 500,
    error: error.name || 'Internal Server Error',
    message: error.message,
    validation: (error as any).validation
  });
});

export { app };
