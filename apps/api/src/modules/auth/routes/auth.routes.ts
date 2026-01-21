import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';
import { PasswordResetController } from '../controllers/password-reset.controller';
import { PasswordResetService } from '../services/password-reset.service';
import { prisma } from '../../../lib/prisma';
import { impersonationController } from '../controllers/impersonation.controller';
import { authMiddleware } from '../../../middleware/auth.middleware';
import { requireCapability } from '../../../middleware/requireCapability';

export async function authRoutes(fastify: FastifyInstance) {
  const passwordResetService = new PasswordResetService(prisma);
  const passwordResetController = new PasswordResetController(passwordResetService);

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
    handler: passwordResetController.requestReset.bind(passwordResetController),
  });
  
  fastify.post('/reset-password', passwordResetController.resetPassword.bind(passwordResetController));
  
  // 2FA
  fastify.post('/2fa/setup', authController.setup2FA.bind(authController));
  fastify.post('/2fa/verify', authController.verify2FA.bind(authController));
  fastify.post('/2fa/disable', authController.disable2FA.bind(authController));

  // Impersonation
  fastify.post('/impersonate/start', {
    preHandler: [authMiddleware, requireCapability('impersonation.start')],
    handler: impersonationController.start.bind(impersonationController),
  });

  fastify.post('/impersonate/stop', {
    preHandler: [authMiddleware],
    handler: impersonationController.stop.bind(impersonationController),
  });

  fastify.get('/impersonate/status', {
    preHandler: [authMiddleware],
    handler: impersonationController.getStatus.bind(impersonationController),
  });
}
