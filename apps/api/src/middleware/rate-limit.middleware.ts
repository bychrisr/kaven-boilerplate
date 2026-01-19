import { FastifyPluginOptions } from 'fastify';
import { env } from '../config/env';

/**
 * Configuração do Rate Limit (Redis)
 */
export const rateLimitConfig: FastifyPluginOptions = {
  max: 100, // 100 requests
  timeWindow: 60000, // 1 minuto em ms
  cache: 10000, // cache de 10k IPs
  allowList: ['127.0.0.1'], // whitelist localhost
  // Redis para rate limiting distribuído (produção)
  redis: env.REDIS_URL 
    ? (() => {
        const Redis = require('ioredis');
        const client = new Redis(env.REDIS_URL, {
          family: 4, // Força IPv4 (evita tentativa de IPv6)
          enableOfflineQueue: false,
          maxRetriesPerRequest: 1,
        });
        
        client.on('error', (err: Error) => {
          console.warn('⚠️  Redis rate limit error:', err.message);
        });
        
        return client;
      })()
    : undefined,
  keyGenerator: (req: any) => {
    // Usar IP ou user ID se autenticado
    return req.user?.id || req.ip || 'anonymous';
  },
  errorResponseBuilder: (req: any, context: any) => {
    // 🕵️ FORENSIC AUDIT
    const secureLog = require('../utils/secure-logger').secureLog;
    secureLog.warn('[MW_BLOCK: RateLimit]', { 
        reqId: req.id, 
        ip: req.ip, 
        userId: req.user?.id, 
        reason: 'Rate Limit Exceeded',
        after: context.after
    });

    return {
      error: 'Rate limit excedido',
      message: `Muitas requisições. Tente novamente em ${Math.ceil(Number(context.after) / 1000)} segundos.`,
      retryAfter: context.after,
    };
  },
};
