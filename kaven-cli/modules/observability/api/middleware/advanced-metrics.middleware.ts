import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { advancedMetricsService } from '../services/advanced-metrics.service';

/**
 * Middleware para coletar métricas avançadas automaticamente
 * Registra latência e status codes de cada requisição
 */
export async function advancedMetricsMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const start = Date.now();

  // Armazena o start time no request para usar no onResponse
  (request as any).startTime = start;
}

/**
 * Hook onResponse para capturar métricas após resposta
 */
export function onResponseMetricsHook(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  const startTime = (request as any).startTime;
  if (startTime) {
    const duration = Date.now() - startTime;
    
    // Registra latência
    advancedMetricsService.recordLatency(duration);
    
    // Registra status code
    advancedMetricsService.recordStatusCode(reply.statusCode);
  }
  
  done();
}
