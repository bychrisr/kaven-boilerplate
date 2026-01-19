import { app } from './app';
import { env } from './config/env';

// [KAVEN_SERVER_IMPORTS]
import { metricsUpdaterService } from './modules/observability/services/metrics-updater.service';
import { emailServiceV2 } from './lib/email';
import { emailHealthCheckCron } from './jobs/email-health-check-cron.service';
import './queues/email.worker'; // Importa para inicializar o worker
// [KAVEN_SERVER_IMPORTS_END]

// Start server
const start = async () => {
  try {
    const port = env.PORT;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/docs`);
    console.log(`📊 Metrics endpoint: http://localhost:${port}/metrics`);

// [KAVEN_SERVER_STARTUP]
    metricsUpdaterService.start();
    await emailServiceV2.initialize().catch(err => {
      console.error('❌ Error initializing EmailServiceV2:', err);
    });
    console.log('📧 Email Service and Observability initialized');
    
    // Inicializar cron job de health check automático
    await emailHealthCheckCron.start().catch(err => {
      console.error('❌ Error starting Email Health Check Cron:', err);
    });
    console.log('⏰ Email Health Check Cron initialized');
// [KAVEN_SERVER_STARTUP_END]
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
