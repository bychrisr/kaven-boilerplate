import { FastifyInstance } from 'fastify';
import pino from 'pino';

/**
 * Structured logging utilities for security and audit
 */

export interface SecurityLogData {
  userId?: string;
  tenantId?: string;
  ip?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  error?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogData {
  event: string;
  userId?: string;
  tenantId?: string;
  resourceId?: string;
  resourceType?: string;
  action: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

/**
 * Create a security logger instance
 */
export function createSecurityLogger(fastify: FastifyInstance) {
  const logger = fastify.log.child({ component: 'security' });
  
  return {
    /**
     * Log security events
     */
    logSecurityEvent: (level: 'info' | 'warn' | 'error', message: string, data: SecurityLogData) => {
      const logData = {
        ...data,
        timestamp: new Date().toISOString(),
        component: 'security',
      };
      
      logger[level](logData, message);
    },
    
    /**
     * Log authentication events
     */
    logAuthEvent: (event: 'login' | 'logout' | 'token_refresh' | 'failed_login', data: SecurityLogData) => {
      logger.info({
        ...data,
        event,
        component: 'auth',
        timestamp: new Date().toISOString(),
      }, `Authentication event: ${event}`);
    },
    
    /**
     * Log authorization events
     */
    logAuthzEvent: (event: 'access_granted' | 'access_denied', data: SecurityLogData) => {
      logger.info({
        ...data,
        event,
        component: 'authorization',
        timestamp: new Date().toISOString(),
      }, `Authorization event: ${event}`);
    },
    
    /**
     * Log rate limiting events
     */
    logRateLimit: (data: SecurityLogData) => {
      logger.warn({
        ...data,
        event: 'rate_limit_exceeded',
        component: 'rate_limiting',
        timestamp: new Date().toISOString(),
      }, 'Rate limit exceeded');
    },
    
    /**
     * Log suspicious activity
     */
    logSuspiciousActivity: (activity: string, data: SecurityLogData) => {
      logger.error({
        ...data,
        activity,
        event: 'suspicious_activity',
        component: 'security',
        timestamp: new Date().toISOString(),
      }, `Suspicious activity detected: ${activity}`);
    },
  };
}

/**
 * Create an audit logger instance
 */
export function createAuditLogger(fastify: FastifyInstance) {
  const logger = fastify.log.child({ component: 'audit' });
  
  return {
    /**
     * Log audit events
     */
    logAuditEvent: (data: AuditLogData) => {
      logger.info({
        ...data,
        timestamp: data.timestamp || new Date().toISOString(),
        component: 'audit',
      }, `Audit event: ${data.event}`);
    },
    
    /**
     * Log user actions
     */
    logUserAction: (action: string, data: Omit<AuditLogData, 'event' | 'action'>) => {
      logger.info({
        ...data,
        event: 'user_action',
        action,
        timestamp: new Date().toISOString(),
        component: 'audit',
      }, `User action: ${action}`);
    },
    
    /**
     * Log data access
     */
    logDataAccess: (resourceType: string, resourceId: string, action: string, data: Omit<AuditLogData, 'event' | 'resourceType' | 'resourceId' | 'action'>) => {
      logger.info({
        ...data,
        event: 'data_access',
        resourceType,
        resourceId,
        action,
        timestamp: new Date().toISOString(),
        component: 'audit',
      }, `Data access: ${action} ${resourceType} ${resourceId}`);
    },
    
    /**
     * Log configuration changes
     */
    logConfigChange: (configType: string, action: string, data: Omit<AuditLogData, 'event' | 'action'>) => {
      logger.info({
        ...data,
        event: 'config_change',
        action,
        metadata: { configType, ...data.metadata },
        timestamp: new Date().toISOString(),
        component: 'audit',
      }, `Configuration change: ${action} ${configType}`);
    },
  };
}

/**
 * Sanitize sensitive data from logs
 */
export function sanitizeLogData(data: Record<string, any>): Record<string, any> {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'key',
    'authorization',
    'cookie',
    'session',
    'ssn',
    'creditCard',
    'bankAccount',
  ];
  
  const sanitized = { ...data };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  // Recursively sanitize nested objects
  for (const [key, value] of Object.entries(sanitized)) {
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    }
  }
  
  return sanitized;
}

/**
 * Create a request logger middleware
 */
export function createRequestLogger(fastify: FastifyInstance) {
  const securityLogger = createSecurityLogger(fastify);
  
  return {
    /**
     * Log incoming request
     */
    logRequest: (request: any, reply: any) => {
      const startTime = Date.now();
      
      // Log request start
      securityLogger.logSecurityEvent('info', 'Request started', {
        method: request.method,
        endpoint: request.url,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        userId: request.user?.id,
        tenantId: request.user?.tenantId,
        metadata: {
          headers: sanitizeLogData(request.headers),
          query: request.query,
        },
      });
      
      // Override reply.send to log response
      const originalSend = reply.send;
      reply.send = function(payload: any) {
        const duration = Date.now() - startTime;
        
        // Log request completion
        securityLogger.logSecurityEvent('info', 'Request completed', {
          method: request.method,
          endpoint: request.url,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
          userId: request.user?.id,
          tenantId: request.user?.tenantId,
          statusCode: reply.statusCode,
          duration,
          metadata: {
            responseSize: JSON.stringify(payload).length,
          },
        });
        
        return originalSend.call(this, payload);
      };
    },
    
    /**
     * Log error
     */
    logError: (error: Error, request: any) => {
      securityLogger.logSecurityEvent('error', 'Request error', {
        method: request.method,
        endpoint: request.url,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        userId: request.user?.id,
        tenantId: request.user?.tenantId,
        error: error.message,
        metadata: {
          stack: error.stack,
          name: error.name,
        },
      });
    },
  };
}

/**
 * Create a performance logger
 */
export function createPerformanceLogger(fastify: FastifyInstance) {
  const logger = fastify.log.child({ component: 'performance' });
  
  return {
    /**
     * Log performance metrics
     */
    logPerformance: (operation: string, duration: number, metadata?: Record<string, any>) => {
      logger.info({
        operation,
        duration,
        metadata,
        timestamp: new Date().toISOString(),
        component: 'performance',
      }, `Performance: ${operation} took ${duration}ms`);
    },
    
    /**
     * Log slow operations
     */
    logSlowOperation: (operation: string, duration: number, threshold: number, metadata?: Record<string, any>) => {
      logger.warn({
        operation,
        duration,
        threshold,
        metadata,
        timestamp: new Date().toISOString(),
        component: 'performance',
      }, `Slow operation: ${operation} took ${duration}ms (threshold: ${threshold}ms)`);
    },
  };
}

/**
 * Create a health check logger
 */
export function createHealthLogger(fastify: FastifyInstance) {
  const logger = fastify.log.child({ component: 'health' });
  
  return {
    /**
     * Log health check results
     */
    logHealthCheck: (service: string, status: 'healthy' | 'unhealthy', metadata?: Record<string, any>) => {
      const level = status === 'healthy' ? 'info' : 'error';
      
      logger[level]({
        service,
        status,
        metadata,
        timestamp: new Date().toISOString(),
        component: 'health',
      }, `Health check: ${service} is ${status}`);
    },
    
    /**
     * Log system metrics
     */
    logSystemMetrics: (metrics: Record<string, number>) => {
      logger.info({
        metrics,
        timestamp: new Date().toISOString(),
        component: 'health',
      }, 'System metrics collected');
    },
  };
}

/**
 * Export all logger creators
 */
export const loggers = {
  createSecurityLogger,
  createAuditLogger,
  createRequestLogger,
  createPerformanceLogger,
  createHealthLogger,
  sanitizeLogData,
};
