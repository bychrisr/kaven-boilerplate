import { FastifyRequest, FastifyReply } from 'fastify';
import { MetricService } from '../services/metric.service.js';
import { 
  RecordMetricInput,
  RecordMetricsBatchInput,
  GetMetricsQuery,
  GetGroupedMetricsQuery,
  DeleteOldMetricsInput,
} from '../types/metric.schemas.js';

export class MetricController {
  constructor(
    private metricService: MetricService
  ) {}

  /**
   * GET /api/metrics - Get metrics for current tenant
   */
  async getMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const query = request.query as GetMetricsQuery;
      const result = await this.metricService.getMetricsByTenant(
        (request.user as any).tenantId, 
        query as any
      );

      reply.code(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting metrics');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/metrics/stats - Get metric statistics for current tenant
   */
  async getMetricStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const query = request.query as { metricName?: string };
      const stats = await this.metricService.getMetricStats(
        (request.user as any).tenantId,
        query.metricName
      );

      reply.code(200).send({
        success: true,
        data: stats,
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting metric stats');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/metrics/grouped - Get metrics grouped by time period
   */
  async getGroupedMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const query = request.query as GetGroupedMetricsQuery;
      
      if (!query.metricName) {
        reply.code(400).send({
          success: false,
          error: 'MISSING_METRIC_NAME',
          message: 'Nome da métrica é obrigatório',
        });
        return;
      }

      const groupedMetrics = await this.metricService.getMetricsGroupedByTime(
        (request.user as any).tenantId,
        query.metricName,
        query.groupBy,
        query.from,
        query.to
      );

      reply.code(200).send({
        success: true,
        data: {
          metricName: query.metricName,
          groupBy: query.groupBy,
          from: query.from,
          to: query.to,
          data: groupedMetrics,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error getting grouped metrics');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/metrics - Record a single metric
   */
  async recordMetric(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const body = request.body as RecordMetricInput;
      const metric = await this.metricService.recordMetric(
        (request.user as any).tenantId,
        body.name,
        body.value,
        body.labels,
        body.timestamp
      );

      reply.code(201).send({
        success: true,
        data: {
          id: metric.id,
          tenantId: metric.tenant_id,
          name: metric.metric_name,
          value: metric.value,
          timestamp: metric.timestamp,
          labels: metric.labels,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error recording metric');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/metrics/batch - Record multiple metrics in batch
   */
  async recordMetricsBatch(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const body = request.body as RecordMetricsBatchInput;
      const metrics = await this.metricService.recordMetricsBatch(
        (request.user as any).tenantId,
        body.metrics as any
      );

      reply.code(201).send({
        success: true,
        data: {
          count: body.metrics.length,
          metrics: metrics,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error recording metrics batch');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * DELETE /api/metrics/cleanup - Delete old metrics (admin only)
   */
  async deleteOldMetrics(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Only admins can delete old metrics
      if (!(request.user as any).isAdm) {
        reply.code(403).send({
          success: false,
          error: 'FORBIDDEN',
          message: 'Apenas administradores podem deletar métricas antigas',
        });
        return;
      }

      const body = request.body as DeleteOldMetricsInput;
      
      // If no tenantId is provided, only allow deletion for the current user's tenant
      const tenantId = body.tenantId || (request.user as any).tenantId;
      
      const deletedCount = await this.metricService.deleteOldMetrics(
        body.olderThan,
        tenantId
      );

      reply.code(200).send({
        success: true,
        data: {
          deletedCount,
          olderThan: body.olderThan,
          tenantId,
        },
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error deleting old metrics');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/metrics/health - Record health check metrics
   */
  async recordHealthMetric(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      // Record basic health metrics
      const timestamp = new Date();
      const metrics = [
        {
          name: 'api_request_count',
          value: 1,
          labels: {
            endpoint: 'health',
            method: request.method,
            tenant_id: (request.user as any).tenantId,
          },
          timestamp,
        },
        {
          name: 'api_response_time',
          value: Date.now() - (request.raw as any).startTime,
          labels: {
            endpoint: 'health',
            tenant_id: (request.user as any).tenantId,
          },
          timestamp,
        },
      ];

      await this.metricService.recordMetricsBatch(
        (request.user as any).tenantId,
        metrics as any
      );

      reply.code(200).send({
        success: true,
        message: 'Health metrics recorded successfully',
      });
    } catch (error) {
      request.server.log.error({ error }, 'Error recording health metrics');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }
}
