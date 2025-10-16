import { config } from 'dotenv';
import { createApp } from './app.js';

// Load environment variables
config();

async function start() {
  try {
    const app = await createApp();
    
    const port = parseInt(process.env.PORT || '3010');
    const host = process.env.HOST || '0.0.0.0';
    
    await app.listen({ port, host });
    
    app.log.info(`🚀 Server is running on http://${host}:${port}`);
    app.log.info(`📊 Health check: http://${host}:${port}/health`);
    app.log.info(`📈 Metrics: http://${host}:${port}/metrics`);
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
