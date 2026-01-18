import client from 'prom-client';
import { env } from '../config/env';

// Criar registry
const register = new client.Registry();

// Labels padrão
register.setDefaultLabels({
  app: 'kaven-api',
  env: env.NODE_ENV,
});

// Collect default metrics (process, nodejs, etc)
client.collectDefaultMetrics({ register });

// ============================================
// HARDWARE METRICS
// ============================================

export const cpuUsageGauge = new client.Gauge({
  name: 'kaven_hardware_cpu_usage_percent',
  help: 'CPU usage percentage',
  registers: [register]
});

export const cpuCoresGauge = new client.Gauge({
  name: 'kaven_hardware_cpu_cores',
  help: 'Number of CPU cores',
  registers: [register]
});

export const cpuTemperatureGauge = new client.Gauge({
  name: 'kaven_hardware_cpu_temperature_celsius',
  help: 'CPU temperature in Celsius',
  registers: [register]
});

export const memoryUsageGauge = new client.Gauge({
  name: 'kaven_hardware_memory_usage_percent',
  help: 'Memory usage percentage',
  registers: [register]
});

export const memoryTotalGauge = new client.Gauge({
  name: 'kaven_hardware_memory_total_bytes',
  help: 'Total memory in bytes',
  registers: [register]
});

export const memoryUsedGauge = new client.Gauge({
  name: 'kaven_hardware_memory_used_bytes',
  help: 'Used memory in bytes',
  registers: [register]
});

export const swapUsageGauge = new client.Gauge({
  name: 'kaven_hardware_swap_usage_percent',
  help: 'Swap memory usage percentage',
  registers: [register]
});

export const diskUsageGauge = new client.Gauge({
  name: 'kaven_hardware_disk_usage_percent',
  help: 'Disk usage percentage',
  registers: [register]
});

export const diskTotalGauge = new client.Gauge({
  name: 'kaven_hardware_disk_total_bytes',
  help: 'Total disk space in bytes',
  registers: [register]
});

export const diskUsedGauge = new client.Gauge({
  name: 'kaven_hardware_disk_used_bytes',
  help: 'Used disk space in bytes',
  registers: [register]
});

export const diskReadSpeedGauge = new client.Gauge({
  name: 'kaven_hardware_disk_read_bytes_per_sec',
  help: 'Disk read speed in bytes per second',
  registers: [register]
});

export const diskWriteSpeedGauge = new client.Gauge({
  name: 'kaven_hardware_disk_write_bytes_per_sec',
  help: 'Disk write speed in bytes per second',
  registers: [register]
});

export const networkReceiveSpeedGauge = new client.Gauge({
  name: 'kaven_hardware_network_receive_bytes_per_sec',
  help: 'Network receive speed in bytes per second',
  registers: [register]
});

export const networkTransmitSpeedGauge = new client.Gauge({
  name: 'kaven_hardware_network_transmit_bytes_per_sec',
  help: 'Network transmit speed in bytes per second',
  registers: [register]
});

export const systemUptimeGauge = new client.Gauge({
  name: 'kaven_hardware_uptime_seconds',
  help: 'System uptime in seconds',
  registers: [register]
});

// ============================================
// HTTP METRICS
// ============================================

export const httpRequestsTotal = new client.Counter({
  name: 'kaven_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

export const httpRequestDuration = new client.Histogram({
  name: 'kaven_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register]
});

export const httpRequestSize = new client.Histogram({
  name: 'kaven_http_request_size_bytes',
  help: 'HTTP request size in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
  registers: [register]
});

export const httpResponseSize = new client.Histogram({
  name: 'kaven_http_response_size_bytes',
  help: 'HTTP response size in bytes',
  labelNames: ['method', 'route', 'status'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
  registers: [register]
});

export const activeRequests = new client.Gauge({
  name: 'kaven_http_requests_active',
  help: 'Number of HTTP requests currently being processed',
  registers: [register],
});

// ============================================
// INFRASTRUCTURE METRICS
// ============================================

export const infrastructureLatency = new client.Gauge({
  name: 'kaven_infrastructure_latency_ms',
  help: 'Infrastructure service latency in milliseconds',
  labelNames: ['name', 'type'],
  registers: [register]
});

export const infrastructureStatus = new client.Gauge({
  name: 'kaven_infrastructure_status',
  help: 'Infrastructure service status (1=healthy, 0=unhealthy)',
  labelNames: ['name', 'type'],
  registers: [register]
});

// ============================================
// NODE.JS METRICS
// ============================================

export const nodejsEventLoopLag = new client.Gauge({
  name: 'kaven_nodejs_event_loop_lag_ms',
  help: 'Node.js event loop lag in milliseconds',
  registers: [register]
});

export const nodejsActiveHandles = new client.Gauge({
  name: 'kaven_nodejs_active_handles',
  help: 'Number of active handles',
  registers: [register]
});

export const nodejsActiveRequests = new client.Gauge({
  name: 'kaven_nodejs_active_requests',
  help: 'Number of active requests',
  registers: [register]
});

// ============================================
// BUSINESS METRICS
// ============================================

export const userRegistrations = new client.Counter({
  name: 'kaven_user_registrations_total',
  help: 'Total user registrations',
  labelNames: ['method'],
  registers: [register]
});

export const loginAttempts = new client.Counter({
  name: 'kaven_login_attempts_total',
  help: 'Total login attempts',
  labelNames: ['status', 'method'],
  registers: [register]
});

export const activeUsers = new client.Gauge({
  name: 'kaven_active_users',
  help: 'Number of currently active users',
  registers: [register]
});

export const paymentCounter = new client.Counter({
  name: 'kaven_payments_total',
  help: 'Total payments processed',
  labelNames: ['currency', 'status', 'provider'],
  registers: [register]
});

export const paymentAmount = new client.Histogram({
  name: 'kaven_payment_amount',
  help: 'Payment amount distribution',
  labelNames: ['currency', 'provider'],
  buckets: [10, 50, 100, 500, 1000, 5000, 10000, 50000],
  registers: [register]
});

export const apiUsageCounter = new client.Counter({
  name: 'kaven_api_usage_total',
  help: 'Total API calls per endpoint',
  labelNames: ['endpoint', 'tenant'],
  registers: [register]
});

// ============================================
// CIRCUIT BREAKER METRICS (for future use)
// ============================================

export const circuitBreakerState = new client.Gauge({
  name: 'kaven_circuit_breaker_state',
  help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
  labelNames: ['service'],
  registers: [register]
});

export const circuitBreakerFailures = new client.Counter({
  name: 'kaven_circuit_breaker_failures_total',
  help: 'Total circuit breaker failures',
  labelNames: ['service'],
  registers: [register]
});

// ============================================
// PROTECTION SYSTEMS METRICS
// ============================================

export const cacheHitsTotal = new client.Counter({
  name: 'kaven_cache_hits_total',
  help: 'Total cache hits',
  registers: [register]
});

export const cacheMissesTotal = new client.Counter({
  name: 'kaven_cache_misses_total',
  help: 'Total cache misses',
  registers: [register]
});

export const cacheHitRate = new client.Gauge({
  name: 'kaven_cache_hit_rate',
  help: 'Cache hit rate percentage',
  registers: [register]
});

export const rateLimitViolationsTotal = new client.Counter({
  name: 'kaven_rate_limit_violations_total',
  help: 'Total rate limit violations',
  labelNames: ['ip'],
  registers: [register]
});

export const rateLimitRequestsTotal = new client.Counter({
  name: 'kaven_rate_limit_requests_total',
  help: 'Total requests monitored by rate limiter',
  registers: [register]
});

export const rateLimitViolationRate = new client.Gauge({
  name: 'kaven_rate_limit_violation_rate',
  help: 'Rate limit violation rate percentage',
  registers: [register]
});

// ============================================
// EMAIL INFRASTRUCTURE METRICS
// ============================================

export const emailSentTotal = new client.Counter({
  name: 'kaven_email_sent_total',
  help: 'Total emails sent',
  labelNames: ['provider', 'template', 'type'],
  registers: [register]
});

export const emailBouncedTotal = new client.Counter({
  name: 'kaven_email_bounced_total',
  help: 'Total email bounces',
  labelNames: ['provider', 'type'],
  registers: [register]
});

export const emailComplaintsTotal = new client.Counter({
  name: 'kaven_email_complaints_total',
  help: 'Total email spam complaints',
  labelNames: ['provider'],
  registers: [register]
});

export const emailDeliveryDuration = new client.Histogram({
  name: 'kaven_email_delivery_duration_seconds',
  help: 'Email delivery duration in seconds',
  labelNames: ['provider'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register]
});

// =[]
// DATABASE METRICS
// ============================================

export const databaseQueryDuration = new client.Histogram({
  name: 'kaven_database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [register],
});

export { register };
