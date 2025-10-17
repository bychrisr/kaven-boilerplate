import { FastifyInstance } from 'fastify';
import { PrismaClient, Metric, Prisma } from '@prisma/client';

export class MetricService {
  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance
  ) {}

  /**
   * Get metrics by tenant with filters
   */
  async getMetricsByTenant(
    tenantId: string,
    filters: {
      metricName?: string;
      from?: Date;
      to?: Date;
      page?: number;
      limit?: number;
      groupBy?: 'hour' | 'day' | 'week' | 'month';
    } = {}
  ): Promise<{
    metrics: Metric[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    aggregations?: {
      average: number;
      min: number;
      max: number;
      sum: number;
      count: number;
    };
  }> {
    try {
      const { 
        metricName, 
        from, 
        to, 
        page = 1, 
        limit = 100, 
        groupBy 
      } = filters;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.MetricWhereInput = {
        tenant_id: tenantId,
      };

      if (metricName) {
        where.metric_name = metricName;
      }

      if (from || to) {
        where.timestamp = {};
        if (from) where.timestamp.gte = from;
        if (to) where.timestamp.lte = to;
      }

      // Get metrics and total count
      const [metrics, total] = await Promise.all([
        this.prisma.metric.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            timestamp: 'desc',
          },
        }),
        this.prisma.metric.count({ where }),
      ]);

      // Calculate aggregations
      const aggregations = await this.calculateAggregations(where);

      const totalPages = Math.ceil(total / limit);

      return {
        metrics,
        total,
        page,
        limit,
        totalPages,
        aggregations,
      };
    } catch (error) {
      this.fastify.log.error({ error, tenantId }, 'Error getting metrics by tenant');
      throw error;
    }
  }

  /**
   * Record a new metric
   */
  async recordMetric(
    tenantId: string,
    metricName: string,
    value: number,
    labels?: Record<string, string>,
    timestamp?: Date
  ): Promise<Metric> {
    try {
      const metric = await this.prisma.metric.create({
        data: {
          tenant_id: tenantId,
          metric_name: metricName,
          value,
          timestamp: timestamp || new Date(),
          labels: labels as any,
        },
      });

      this.fastify.log.info({ 
        tenantId, 
        metricName, 
        value, 
        metricId: metric.id 
      }, 'Metric recorded successfully');

      return metric;
    } catch (error) {
      this.fastify.log.error({ error, tenantId, metricName, value }, 'Error recording metric');
      throw error;
    }
  }

  /**
   * Record multiple metrics in batch
   */
  async recordMetricsBatch(
    tenantId: string,
    metrics: Array<{
      name: string;
      value: number;
      labels?: Record<string, string>;
      timestamp?: Date;
    }>
  ): Promise<Metric[]> {
    try {
      const metricsData = metrics.map(metric => ({
        tenant_id: tenantId,
        metric_name: metric.name,
        value: metric.value,
        timestamp: metric.timestamp || new Date(),
        labels: metric.labels as any,
      }));

      const createdMetrics = await this.prisma.metric.createMany({
        data: metricsData,
      });

      this.fastify.log.info({ 
        tenantId, 
        count: metrics.length, 
        created: createdMetrics.count 
      }, 'Batch metrics recorded successfully');

      // Return the created metrics (Note: createMany doesn't return the created records)
      // For now, we'll return an empty array, but in production you might want to fetch them
      return [];
    } catch (error) {
      this.fastify.log.error({ error, tenantId, count: metrics.length }, 'Error recording metrics batch');
      throw error;
    }
  }

  /**
   * Get metric statistics for a tenant
   */
  async getMetricStats(tenantId: string, metricName?: string): Promise<{
    totalMetrics: number;
    uniqueMetricNames: string[];
    timeRange: {
      earliest: Date | null;
      latest: Date | null;
    };
    topMetrics: Array<{
      name: string;
      count: number;
      averageValue: number;
      latestValue: number;
    }>;
  }> {
    try {
      const where: Prisma.MetricWhereInput = {
        tenant_id: tenantId,
      };

      if (metricName) {
        where.metric_name = metricName;
      }

      const [totalMetrics, uniqueNames, timeRange, topMetrics] = await Promise.all([
        this.prisma.metric.count({ where }),
        this.prisma.metric.findMany({
          where,
          select: { metric_name: true },
          distinct: ['metric_name'],
        }),
        this.prisma.metric.aggregate({
          where,
          _min: { timestamp: true },
          _max: { timestamp: true },
        }),
        this.prisma.metric.groupBy({
          by: ['metric_name'],
          where,
          _count: { metric_name: true },
          _avg: { value: true },
          _max: { 
            timestamp: true,
            value: true,
          },
        }),
      ]);

      return {
        totalMetrics,
        uniqueMetricNames: uniqueNames.map(m => m.metric_name),
        timeRange: {
          earliest: timeRange._min.timestamp,
          latest: timeRange._max.timestamp,
        },
        topMetrics: topMetrics.map(m => ({
          name: m.metric_name,
          count: m._count?.metric_name || 0,
          averageValue: m._avg?.value || 0,
          latestValue: m._max?.value || 0,
        })),
      };
    } catch (error) {
      this.fastify.log.error({ error, tenantId, metricName }, 'Error getting metric stats');
      throw error;
    }
  }

  /**
   * Get metrics grouped by time period
   */
  async getMetricsGroupedByTime(
    tenantId: string,
    metricName: string,
    groupBy: 'hour' | 'day' | 'week' | 'month',
    from?: Date,
    to?: Date
  ): Promise<Array<{
    period: string;
    average: number;
    min: number;
    max: number;
    sum: number;
    count: number;
  }>> {
    try {
      const where: Prisma.MetricWhereInput = {
        tenant_id: tenantId,
        metric_name: metricName,
      };

      if (from || to) {
        where.timestamp = {};
        if (from) where.timestamp.gte = from;
        if (to) where.timestamp.lte = to;
      }

      // Get all metrics for the time period
      const metrics = await this.prisma.metric.findMany({
        where,
        select: {
          value: true,
          timestamp: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      });

      // Group by time period
      const grouped = this.groupMetricsByTimePeriod(metrics, groupBy);

      return grouped;
    } catch (error) {
      this.fastify.log.error({ error, tenantId, metricName, groupBy }, 'Error getting grouped metrics');
      throw error;
    }
  }

  /**
   * Delete old metrics (cleanup)
   */
  async deleteOldMetrics(olderThan: Date, tenantId?: string): Promise<number> {
    try {
      const where: Prisma.MetricWhereInput = {
        timestamp: {
          lt: olderThan,
        },
      };

      if (tenantId) {
        where.tenant_id = tenantId;
      }

      const result = await this.prisma.metric.deleteMany({
        where,
      });

      this.fastify.log.info({ 
        deletedCount: result.count, 
        olderThan, 
        tenantId 
      }, 'Old metrics deleted successfully');

      return result.count;
    } catch (error) {
      this.fastify.log.error({ error, olderThan, tenantId }, 'Error deleting old metrics');
      throw error;
    }
  }

  /**
   * Calculate aggregations for metrics
   */
  private async calculateAggregations(where: Prisma.MetricWhereInput): Promise<{
    average: number;
    min: number;
    max: number;
    sum: number;
    count: number;
  }> {
    try {
      const aggregations = await this.prisma.metric.aggregate({
        where,
        _avg: { value: true },
        _min: { value: true },
        _max: { value: true },
        _sum: { value: true },
        _count: { value: true },
      });

      return {
        average: aggregations._avg.value || 0,
        min: aggregations._min.value || 0,
        max: aggregations._max.value || 0,
        sum: aggregations._sum.value || 0,
        count: aggregations._count.value || 0,
      };
    } catch (error) {
      this.fastify.log.error({ error }, 'Error calculating aggregations');
      return {
        average: 0,
        min: 0,
        max: 0,
        sum: 0,
        count: 0,
      };
    }
  }

  /**
   * Group metrics by time period
   */
  private groupMetricsByTimePeriod(
    metrics: Array<{ value: number; timestamp: Date }>,
    groupBy: 'hour' | 'day' | 'week' | 'month'
  ): Array<{
    period: string;
    average: number;
    min: number;
    max: number;
    sum: number;
    count: number;
  }> {
    const groups: Record<string, number[]> = {};

    metrics.forEach(metric => {
      const period = this.getTimePeriodKey(metric.timestamp, groupBy);
      if (!groups[period]) {
        groups[period] = [];
      }
      groups[period].push(metric.value);
    });

    return Object.entries(groups).map(([period, values]) => ({
      period,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      sum: values.reduce((a, b) => a + b, 0),
      count: values.length,
    })).sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Get time period key for grouping
   */
  private getTimePeriodKey(date: Date, groupBy: 'hour' | 'day' | 'week' | 'month'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');

    switch (groupBy) {
      case 'hour':
        return `${year}-${month}-${day} ${hour}:00`;
      case 'day':
        return `${year}-${month}-${day}`;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekYear = weekStart.getFullYear();
        const weekMonth = String(weekStart.getMonth() + 1).padStart(2, '0');
        const weekDay = String(weekStart.getDate()).padStart(2, '0');
        return `${weekYear}-${weekMonth}-${weekDay}`;
      case 'month':
        return `${year}-${month}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }
}
