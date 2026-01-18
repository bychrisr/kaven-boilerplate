import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '../config/env';
import { secureLog } from '../utils/secure-logger';

/**
 * CSRF Middleware
 * Verifica se a requisição vem de uma origem confiável.
 * Importante mesmo com JWT se houver persistência automática ou para evitar requisições forjadas de outros sites.
 */
export async function csrfMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Pular verificação para métodos seguros ou webhooks
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method) || request.url.startsWith('/api/webhooks')) {
    return;
  }

  const origin = request.headers.origin;
  const referer = request.headers.referer;

  // Permitir requisições sem origin/referer (apps mobile/desktop, testes)
  // Mas em browser rigoroso, origin deve estar presente.
  if (!origin && !referer) {
    // Se quiser ser estrito:
    // throw new Error('Missing Origin/Referer header');
    return;
  }

  const allowedOrigins = [env.FRONTEND_URL, env.CORS_ORIGIN].filter(Boolean) as string[];
  
  // Normalizar origens (remover trailing slash)
  // Garantir que todos os valores são strings antes de usar .replace()
  const normalizedOrigins = new Set(
    allowedOrigins
      .filter((url): url is string => typeof url === 'string')
      .map(url => url.replace(/\/$/, ''))
  );
  
  const requestOrigin = origin ? origin.replace(/\/$/, '') : null;
  const requestReferer = referer ? new URL(referer).origin.replace(/\/$/, '') : null;

  const isOriginAllowed = requestOrigin && normalizedOrigins.has(requestOrigin);
  const isRefererAllowed = requestReferer && normalizedOrigins.has(requestReferer);

  if (!isOriginAllowed && !isRefererAllowed) {
    // Verificar se é localhost para desenvolvimento
    if (env.NODE_ENV === 'development' && (requestOrigin?.includes('localhost') || requestReferer?.includes('localhost'))) {
        return;
    }

    secureLog.warn('[MW_BLOCK: CSRF]', { 
        reqId: request.id, 
        reason: 'CSRF Token Mismatch',
        origin: requestOrigin,
        referer: requestReferer
    });

    reply.status(403).send({
      error: 'CSRF Token Mismatch',
      message: 'Origem da requisição não permitida',
    });
  }
}
