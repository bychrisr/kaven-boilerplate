import client from 'prom-client';

// Criar registry
const register = new client.Registry();

// Labels padrão
register.setDefaultLabels({
  app: 'kaven-api',
  env: process.env.NODE_ENV || 'development',
});

// Coletar métricas padrão do Node.js
client.collectDefaultMetrics({ register });

// Métrica: Duração de requests HTTP
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

// Métrica: Total de requests HTTP
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Métrica: Requests ativos
export const activeRequests = new client.Gauge({
  name: 'http_requests_active',
  help: 'Number of HTTP requests currently being processed',
  registers: [register],
});

// Métrica: Tamanho de request
export const httpRequestSize = new client.Histogram({
  name: 'http_request_size_bytes',
  help: 'Size of HTTP requests in bytes',
  labelNames: ['method', 'route'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000],
  registers: [register],
});

// Métrica: Tamanho de response
export const httpResponseSize = new client.Histogram({
  name: 'http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [100, 1000, 5000, 10000, 50000, 100000, 500000],
  registers: [register],
});

// Métrica customizada: Login attempts
export const loginAttemptsCounter = new client.Counter({
  name: 'auth_login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['status'], // 'success' or 'failure'
  registers: [register],
});

// Métrica customizada: Database queries
export const databaseQueryDuration = new client.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['operation'],
  buckets: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [register],
});

export { register };
