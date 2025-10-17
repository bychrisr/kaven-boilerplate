import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Security middleware for advanced protection
 */

/**
 * Rate limiting per user/tenant
 */
export async function rateLimitPerUser(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    return;
  }

  const userId = (request.user as any).id;
  const tenantId = (request.user as any).tenantId;
  const key = `rate_limit:${tenantId}:${userId}`;
  
  try {
    const redis = request.server.redis;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, 60); // 1 minute window
    }
    
    // Custom rate limits based on user role
    const isAdmin = (request.user as any).isAdm;
    const limit = isAdmin ? 1000 : 100; // Admins get higher limits
    
    if (current > limit) {
      reply.code(429).send({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Rate limit exceeded for user',
        retryAfter: 60,
      });
      return;
    }
    
    // Add rate limit headers
    reply.header('X-RateLimit-Limit', limit.toString());
    reply.header('X-RateLimit-Remaining', Math.max(0, limit - current).toString());
    reply.header('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString());
    
  } catch (error) {
    request.server.log.error({ error }, 'Rate limiting error');
    // Continue without rate limiting if Redis fails
  }
}

/**
 * IP-based rate limiting
 */
export async function rateLimitPerIP(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const clientIP = request.ip;
  const key = `rate_limit_ip:${clientIP}`;
  
  try {
    const redis = request.server.redis;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, 300); // 5 minute window
    }
    
    const limit = 200; // Requests per 5 minutes per IP
    
    if (current > limit) {
      reply.code(429).send({
        success: false,
        error: 'IP_RATE_LIMIT_EXCEEDED',
        message: 'Rate limit exceeded for IP address',
        retryAfter: 300,
      });
      return;
    }
    
  } catch (error) {
    request.server.log.error({ error }, 'IP rate limiting error');
    // Continue without rate limiting if Redis fails
  }
}

/**
 * Request size limiting
 */
export async function requestSizeLimit(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const contentLength = request.headers['content-length'];
  
  if (contentLength) {
    const size = parseInt(contentLength, 10);
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (size > maxSize) {
      reply.code(413).send({
        success: false,
        error: 'REQUEST_TOO_LARGE',
        message: 'Request payload too large',
        maxSize: maxSize,
      });
      return;
    }
  }
}

/**
 * Security headers middleware
 */
export async function securityHeaders(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Content Security Policy
  reply.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' ws: wss:; " +
    "font-src 'self' data:; " +
    "object-src 'none'; " +
    "media-src 'self'; " +
    "frame-src 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );
  
  // Strict Transport Security
  reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // X-Content-Type-Options
  reply.header('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  reply.header('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  reply.header('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  reply.header('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  // Cache Control for API responses
  if (request.url.startsWith('/api/')) {
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
  }
}

/**
 * Request sanitization middleware
 */
export async function sanitizeRequest(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Sanitize URL parameters
  if (request.params) {
    for (const [key, value] of Object.entries(request.params)) {
      if (typeof value === 'string') {
        // Remove potentially dangerous characters
        (request.params as any)[key] = value.replace(/[<>\"'%;()&+]/g, '');
      }
    }
  }
  
  // Sanitize query parameters
  if (request.query) {
    for (const [key, value] of Object.entries(request.query)) {
      if (typeof value === 'string') {
        // Remove potentially dangerous characters
        (request.query as any)[key] = value.replace(/[<>\"'%;()&+]/g, '');
      }
    }
  }
}

/**
 * Audit logging middleware
 */
export async function auditLog(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const startTime = Date.now();
  
  // Log request
  request.server.log.info({
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
    userId: request.user ? (request.user as any).id : null,
    tenantId: request.user ? (request.user as any).tenantId : null,
    timestamp: new Date().toISOString(),
  }, 'API request started');
  
  // Override reply.send to log response
  const originalSend = reply.send;
  reply.send = function(payload: any) {
    const duration = Date.now() - startTime;
    const statusCode = reply.statusCode;
    
    // Log response
    request.server.log.info({
      method: request.method,
      url: request.url,
      statusCode,
      duration,
      userId: request.user ? (request.user as any).id : null,
      tenantId: request.user ? (request.user as any).tenantId : null,
      timestamp: new Date().toISOString(),
    }, 'API request completed');
    
    return originalSend.call(this, payload);
  };
}

/**
 * Tenant validation middleware
 */
export async function validateTenantAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    return;
  }
  
  const userTenantId = (request.user as any).tenantId;
  const isAdmin = (request.user as any).isAdm;
  
  // Allow admins to access any tenant
  if (isAdmin) {
    return;
  }
  
  // Check if user is trying to access a different tenant
  const requestedTenantId = (request.params as any)?.tenantId || (request.query as any)?.tenantId;
  
  if (requestedTenantId && requestedTenantId !== userTenantId) {
    reply.code(403).send({
      success: false,
      error: 'TENANT_ACCESS_DENIED',
      message: 'Access denied: Cannot access resources from different tenant',
    });
    return;
  }
}

/**
 * Admin-only middleware
 */
export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    reply.code(401).send({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
    return;
  }
  
  const isAdmin = (request.user as any).isAdm;
  
  if (!isAdmin) {
    reply.code(403).send({
      success: false,
      error: 'ADMIN_REQUIRED',
      message: 'Admin privileges required',
    });
    return;
  }
}

/**
 * Resource ownership validation middleware
 */
export async function validateResourceOwnership(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if (!request.user) {
    return;
  }
  
  const userId = (request.user as any).id;
  const isAdmin = (request.user as any).isAdm;
  
  // Allow admins to access any resource
  if (isAdmin) {
    return;
  }
  
  // Check if user is trying to access their own resource
  const requestedUserId = (request.params as any)?.userId || (request.params as any)?.id;
  
  if (requestedUserId && requestedUserId !== userId) {
    reply.code(403).send({
      success: false,
      error: 'RESOURCE_ACCESS_DENIED',
      message: 'Access denied: Cannot access resources owned by other users',
    });
    return;
  }
}

/**
 * API versioning middleware
 */
export async function apiVersioning(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const apiVersion = request.headers['api-version'] || 'v1';
  const supportedVersions = ['v1'];
  
  if (!supportedVersions.includes(apiVersion as string)) {
    reply.code(400).send({
      success: false,
      error: 'UNSUPPORTED_API_VERSION',
      message: `Unsupported API version: ${apiVersion}. Supported versions: ${supportedVersions.join(', ')}`,
    });
    return;
  }
  
  // Add version to request context
  (request as any).apiVersion = apiVersion as string;
}

/**
 * Request timeout middleware
 */
export async function requestTimeout(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const timeout = 30000; // 30 seconds
  
  const timeoutId = setTimeout(() => {
    if (!reply.sent) {
      reply.code(408).send({
        success: false,
        error: 'REQUEST_TIMEOUT',
        message: 'Request timeout',
      });
    }
  }, timeout);
  
  // Clear timeout when request completes
  const originalSend = reply.send;
  reply.send = function(payload: any) {
    clearTimeout(timeoutId);
    return originalSend.call(this, payload);
  };
}
