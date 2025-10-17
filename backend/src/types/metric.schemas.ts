import { z } from 'zod';

// Record Metric Schema
export const RecordMetricSchema = z.object({
  name: z.string().min(1, 'Nome da métrica é obrigatório').max(100, 'Nome muito longo'),
  value: z.number().finite('Valor deve ser um número válido'),
  labels: z.record(z.string(), z.string()).optional(),
  timestamp: z.date().optional(),
});

// Record Multiple Metrics Schema
export const RecordMetricsBatchSchema = z.object({
  metrics: z.array(z.object({
    name: z.string().min(1, 'Nome da métrica é obrigatório').max(100, 'Nome muito longo'),
    value: z.number().finite('Valor deve ser um número válido'),
    labels: z.record(z.string(), z.string()).optional(),
    timestamp: z.date().optional(),
  })).min(1, 'Pelo menos uma métrica é obrigatória').max(1000, 'Máximo de 1000 métricas por lote'),
});

// Get Metrics Query Schema
export const GetMetricsQuerySchema = z.object({
  metricName: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(1000).default(100),
  groupBy: z.enum(['hour', 'day', 'week', 'month']).optional(),
});

// Get Grouped Metrics Query Schema
export const GetGroupedMetricsQuerySchema = z.object({
  metricName: z.string().min(1, 'Nome da métrica é obrigatório'),
  groupBy: z.enum(['hour', 'day', 'week', 'month']),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

// Metric Response Schema
export const MetricResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string(),
  value: z.number(),
  timestamp: z.date(),
  labels: z.record(z.string(), z.string()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Metric Aggregations Schema
export const MetricAggregationsSchema = z.object({
  average: z.number(),
  min: z.number(),
  max: z.number(),
  sum: z.number(),
  count: z.number(),
});

// Paginated Metrics Response Schema
export const PaginatedMetricsResponseSchema = z.object({
  metrics: z.array(MetricResponseSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  aggregations: MetricAggregationsSchema.optional(),
});

// Metric Stats Schema
export const MetricStatsSchema = z.object({
  totalMetrics: z.number(),
  uniqueMetricNames: z.array(z.string()),
  timeRange: z.object({
    earliest: z.date().nullable(),
    latest: z.date().nullable(),
  }),
  topMetrics: z.array(z.object({
    name: z.string(),
    count: z.number(),
    averageValue: z.number(),
    latestValue: z.number(),
  })),
});

// Grouped Metric Schema
export const GroupedMetricSchema = z.object({
  period: z.string(),
  average: z.number(),
  min: z.number(),
  max: z.number(),
  sum: z.number(),
  count: z.number(),
});

// Grouped Metrics Response Schema
export const GroupedMetricsResponseSchema = z.object({
  metricName: z.string(),
  groupBy: z.enum(['hour', 'day', 'week', 'month']),
  from: z.date().optional(),
  to: z.date().optional(),
  data: z.array(GroupedMetricSchema),
});

// Delete Old Metrics Schema
export const DeleteOldMetricsSchema = z.object({
  olderThan: z.coerce.date(),
  tenantId: z.string().uuid().optional(),
});

// Types
export type RecordMetricInput = z.infer<typeof RecordMetricSchema>;
export type RecordMetricsBatchInput = z.infer<typeof RecordMetricsBatchSchema>;
export type GetMetricsQuery = z.infer<typeof GetMetricsQuerySchema>;
export type GetGroupedMetricsQuery = z.infer<typeof GetGroupedMetricsQuerySchema>;
export type MetricResponse = z.infer<typeof MetricResponseSchema>;
export type MetricAggregations = z.infer<typeof MetricAggregationsSchema>;
export type PaginatedMetricsResponse = z.infer<typeof PaginatedMetricsResponseSchema>;
export type MetricStats = z.infer<typeof MetricStatsSchema>;
export type GroupedMetric = z.infer<typeof GroupedMetricSchema>;
export type GroupedMetricsResponse = z.infer<typeof GroupedMetricsResponseSchema>;
export type DeleteOldMetricsInput = z.infer<typeof DeleteOldMetricsSchema>;
