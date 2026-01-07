import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  httpRequestDuration,
  httpRequestsTotal,
  activeRequests,
  httpRequestSize,
  httpResponseSize,
} from '../lib/metrics';

/**
 * Middleware para coletar métricas de requests HTTP
 */
export function metricsMiddleware(request: FastifyRequest, reply: FastifyReply, done: () => void) {
  const start = Date.now();
  
  // Incrementar requests ativos
  activeRequests.inc();

  // Coletar tamanho do request
  const requestSize = request.headers['content-length'] 
    ? Number.parseInt(request.headers['content-length'], 10) 
    : 0;
  
  if (requestSize > 0) {
    const route = request.routeOptions?.url || request.url;
    httpRequestSize.observe(
      { method: request.method, route },
      requestSize
    );
  }

  // Registrar quando response for enviado
  reply.raw.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = request.routeOptions?.url || request.url;
    const status = reply.statusCode.toString();

    // Registrar duração
    httpRequestDuration.observe(
      { method: request.method, route, status },
      duration
    );

    // Incrementar contador
    httpRequestsTotal.inc({
      method: request.method,
      route,
      status,
    });

    // Decrementar requests ativos
    activeRequests.dec();
  });

  done();
}
