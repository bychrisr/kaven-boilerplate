import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import { env } from '../config/env';

export function initSentry() {
  if (!env.SENTRY_DSN) {
    console.log('⚠️  Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Profiling
    profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    integrations: [
      new ProfilingIntegration(),
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    
    // Filter sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }
      }
      
      // Remove sensitive data from extra
      if (event.extra) {
        delete event.extra.password;
        delete event.extra.token;
        delete event.extra.apiKey;
      }
      
      return event;
    },
  });

  console.log('✅ Sentry initialized');
}

export { Sentry };
