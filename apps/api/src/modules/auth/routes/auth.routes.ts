import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  // Registrar (3 req/min)
  fastify.post('/register', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: 60000, // 1 minuto em ms
      },
    },
    handler: authController.register.bind(authController),
  });
  
  // Verificar email
  fastify.post('/verify-email', authController.verifyEmail.bind(authController));
  
  // Reenviar verificação (3 req/min)
  fastify.post('/resend-verification', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: 60000, // 1 minuto em ms
      },
    },
    handler: authController.resendVerification.bind(authController),
  });
  
  // Login (5 req/min)
  fastify.post('/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60000, // 1 minuto em ms
      },
    },
    handler: authController.login.bind(authController),
  });
  
  // Refresh token
  fastify.post('/refresh', authController.refresh.bind(authController));
  
  // Logout
  fastify.post('/logout', authController.logout.bind(authController));
  
  // Recuperação de senha (3 req/min)
  fastify.post('/forgot-password', {
    config: {
      rateLimit: {
        max: 3,
        timeWindow: 60000, // 1 minuto em ms
      },
    },
    handler: authController.forgotPassword.bind(authController),
  });
  
  fastify.post('/reset-password', authController.resetPassword.bind(authController));
  
  // 2FA
  fastify.post('/2fa/setup', authController.setup2FA.bind(authController));
  fastify.post('/2fa/verify', authController.verify2FA.bind(authController));
  fastify.post('/2fa/disable', authController.disable2FA.bind(authController));
}
