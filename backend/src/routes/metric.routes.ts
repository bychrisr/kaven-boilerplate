import { FastifyInstance } from 'fastify';
import { MetricService } from '../services/metric.service.js';
import { MetricController } from '../controllers/metric.controller.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.middleware.js';
import { 
  RecordMetricSchema,
  RecordMetricsBatchSchema,
  GetMetricsQuerySchema,
  GetGroupedMetricsQuerySchema,
  DeleteOldMetricsSchema,
} from '../types/metric.schemas.js';

export default async function metricRoutes(fastify: FastifyInstance) {
  // Initialize service and controller
  const metricService = new MetricService(
    fastify.prisma,
    fastify
  );
  const metricController = new MetricController(metricService);

  // GET /api/metrics - Get metrics for current tenant
  fastify.get('/', {
    preHandler: [authenticateUser],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          metricName: { type: 'string' },
          from: { type: 'string', format: 'date-time' },
          to: { type: 'string', format: 'date-time' },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 1000, default: 100 },
          groupBy: { type: 'string', enum: ['hour', 'day', 'week', 'month'] },
        },
      },
    },
  }, metricController.getMetrics.bind(metricController));

  // GET /api/metrics/stats - Get metric statistics for current tenant
  fastify.get('/stats', {
    preHandler: [authenticateUser],
    schema: {
      querystring: {
        type: 'object',
        properties: {
          metricName: { type: 'string' },
        },
      },
    },
  }, metricController.getMetricStats.bind(metricController));

  // GET /api/metrics/grouped - Get metrics grouped by time period
  fastify.get('/grouped', {
    preHandler: [authenticateUser],
    schema: {
      querystring: {
        type: 'object',
        required: ['metricName', 'groupBy'],
        properties: {
          metricName: { type: 'string', minLength: 1 },
          groupBy: { type: 'string', enum: ['hour', 'day', 'week', 'month'] },
          from: { type: 'string', format: 'date-time' },
          to: { type: 'string', format: 'date-time' },
        },
      },
    },
  }, metricController.getGroupedMetrics.bind(metricController));

  // POST /api/metrics - Record a single metric
  fastify.post('/', {
    preHandler: [authenticateUser],
    schema: {
      body: {
        type: 'object',
        required: ['name', 'value'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          value: { type: 'number' },
          labels: { 
            type: 'object',
            additionalProperties: { type: 'string' }
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  }, metricController.recordMetric.bind(metricController));

  // POST /api/metrics/batch - Record multiple metrics in batch
  fastify.post('/batch', {
    preHandler: [authenticateUser],
    schema: {
      body: {
        type: 'object',
        required: ['metrics'],
        properties: {
          metrics: {
            type: 'array',
            minItems: 1,
            maxItems: 1000,
            items: {
              type: 'object',
              required: ['name', 'value'],
              properties: {
                name: { type: 'string', minLength: 1, maxLength: 100 },
                value: { type: 'number' },
                labels: { 
                  type: 'object',
                  additionalProperties: { type: 'string' }
                },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  }, metricController.recordMetricsBatch.bind(metricController));

  // POST /api/metrics/health - Record health check metrics
  fastify.post('/health', {
    preHandler: [authenticateUser],
  }, metricController.recordHealthMetric.bind(metricController));

  // DELETE /api/metrics/cleanup - Delete old metrics (admin only)
  fastify.delete('/cleanup', {
    preHandler: [authenticateUser, requireAdmin],
    schema: {
      body: {
        type: 'object',
        required: ['olderThan'],
        properties: {
          olderThan: { type: 'string', format: 'date-time' },
          tenantId: { type: 'string', format: 'uuid' },
        },
      },
    },
  }, metricController.deleteOldMetrics.bind(metricController));
}