import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Enable default metrics collection
collectDefaultMetrics();

// Custom metrics
export const metrics = {
  // Request metrics
  httpRequestsTotal: new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code', 'tenant_id'],
  }),

  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'tenant_id'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  }),

  // Application metrics
  activeUsers: new Gauge({
    name: 'active_users_total',
    help: 'Total number of active users',
    labelNames: ['tenant_id'],
  }),

  apiErrors: new Counter({
    name: 'api_errors_total',
    help: 'Total number of API errors',
    labelNames: ['error_type', 'tenant_id', 'route'],
  }),

  // Database metrics
  databaseConnections: new Gauge({
    name: 'database_connections_active',
    help: 'Number of active database connections',
  }),

  databaseQueryDuration: new Histogram({
    name: 'database_query_duration_seconds',
    help: 'Database query duration in seconds',
    labelNames: ['operation', 'table'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  }),

  // Redis metrics
  redisConnections: new Gauge({
    name: 'redis_connections_active',
    help: 'Number of active Redis connections',
  }),

  redisOperations: new Counter({
    name: 'redis_operations_total',
    help: 'Total number of Redis operations',
    labelNames: ['operation', 'status'],
  }),

  // Queue metrics
  queueLength: new Gauge({
    name: 'queue_length_total',
    help: 'Current queue length',
    labelNames: ['queue_name', 'tenant_id'],
  }),

  queueProcessingDuration: new Histogram({
    name: 'queue_processing_duration_seconds',
    help: 'Queue processing duration in seconds',
    labelNames: ['queue_name', 'tenant_id', 'job_type'],
    buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
  }),

  // Custom business metrics
  tenantMetrics: new Gauge({
    name: 'tenant_metrics_total',
    help: 'Total metrics per tenant',
    labelNames: ['tenant_id', 'metric_type'],
  }),

  userRegistrations: new Counter({
    name: 'user_registrations_total',
    help: 'Total number of user registrations',
    labelNames: ['tenant_id'],
  }),

  authenticationAttempts: new Counter({
    name: 'authentication_attempts_total',
    help: 'Total number of authentication attempts',
    labelNames: ['tenant_id', 'status'],
  }),
};

/**
 * Middleware to instrument HTTP requests
 */
export function createMetricsMiddleware(fastify: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const startTime = Date.now();
    const route = request.routerPath || request.url;
    const method = request.method;
    const tenantId = (request.user as any)?.tenantId || 'unknown';

    // Record request start
    const timer = metrics.httpRequestDuration.startTimer({
      method,
      route,
      tenant_id: tenantId,
    });

    // Override reply.send to capture status code
    const originalSend = reply.send;
    reply.send = function(payload: any) {
      const statusCode = reply.statusCode;
      const duration = (Date.now() - startTime) / 1000;

      // Record metrics
      metrics.httpRequestsTotal.inc({
        method,
        route,
        status_code: statusCode.toString(),
        tenant_id: tenantId,
      });

      timer();

      return originalSend.call(this, payload);
    };

    // Note: Error handling will be done at the global error handler level
  };
}

/**
 * Record database operation metrics
 */
export function recordDatabaseMetric(
  operation: string,
  table: string,
  duration: number
) {
  metrics.databaseQueryDuration.observe(
    { operation, table },
    duration
  );
}

/**
 * Record Redis operation metrics
 */
export function recordRedisMetric(operation: string, success: boolean) {
  metrics.redisOperations.inc({
    operation,
    status: success ? 'success' : 'error',
  });
}

/**
 * Update active users metric
 */
export function updateActiveUsers(tenantId: string, count: number) {
  metrics.activeUsers.set({ tenant_id: tenantId }, count);
}

/**
 * Record user registration
 */
export function recordUserRegistration(tenantId: string) {
  metrics.userRegistrations.inc({ tenant_id: tenantId });
}

/**
 * Record authentication attempt
 */
export function recordAuthenticationAttempt(tenantId: string, success: boolean) {
  metrics.authenticationAttempts.inc({
    tenant_id: tenantId,
    status: success ? 'success' : 'failure',
  });
}

/**
 * Update tenant metrics count
 */
export function updateTenantMetrics(tenantId: string, metricType: string, count: number) {
  metrics.tenantMetrics.set(
    { tenant_id: tenantId, metric_type: metricType },
    count
  );
}

/**
 * Update queue metrics
 */
export function updateQueueMetrics(
  queueName: string,
  tenantId: string,
  length: number
) {
  metrics.queueLength.set(
    { queue_name: queueName, tenant_id: tenantId },
    length
  );
}

/**
 * Record queue processing duration
 */
export function recordQueueProcessing(
  queueName: string,
  tenantId: string,
  jobType: string,
  duration: number
) {
  metrics.queueProcessingDuration.observe(
    { queue_name: queueName, tenant_id: tenantId, job_type: jobType },
    duration
  );
}

/**
 * Get metrics endpoint handler
 */
export async function getMetricsHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    reply.type('text/plain');
    const metricsData = await register.metrics();
    return metricsData;
  } catch (error) {
    request.server.log.error({ error }, 'Error getting metrics');
    reply.code(500).send('Error getting metrics');
    return;
  }
}

/**
 * Initialize metrics for the application
 */
export function initializeMetrics(fastify: FastifyInstance) {
  // Register metrics middleware
  fastify.addHook('preHandler', createMetricsMiddleware(fastify));

  // Add metrics endpoint
  fastify.get('/metrics', getMetricsHandler);

  fastify.log.info('📊 Prometheus metrics initialized');
}
