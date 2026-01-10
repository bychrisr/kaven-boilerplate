import { app } from './app';
import { env } from './config/env';
import { metricsUpdaterService } from './modules/observability/services/metrics-updater.service';

// Start server
const start = async () => {
  try {
    const port = env.PORT;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/docs`);
    console.log(`📊 Metrics endpoint: http://localhost:${port}/metrics`);
    
    // Start automatic metrics updates
    metricsUpdaterService.start();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
