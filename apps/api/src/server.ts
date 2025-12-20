import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authRoutes } from './modules/auth/routes/auth.routes';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Plugins
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Rotas
fastify.register(authRoutes, { prefix: '/api/auth' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8000');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/auth`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
