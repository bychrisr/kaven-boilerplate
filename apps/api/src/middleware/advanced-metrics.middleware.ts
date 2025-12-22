import type { FastifyRequest, FastifyReply } from 'fastify';
import { advancedMetricsService } from '../modules/observability/services/advanced-metrics.service';

/**
 * Middleware para coletar métricas avançadas automaticamente
 * Registra latência e status codes de cada requisição
 */
export async function advancedMetricsMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const start = Date.now();

  // Hook para capturar quando a resposta é enviada
  reply.addHook('onSend', async () => {
    const duration = Date.now() - start;
    
    // Registra latência
    advancedMetricsService.recordLatency(duration);
    
    // Registra status code
    advancedMetricsService.recordStatusCode(reply.statusCode);
  });
}
