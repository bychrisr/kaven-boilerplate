import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/auth.controller';

export async function authRoutes(fastify: FastifyInstance) {
  // Registrar
  fastify.post('/register', authController.register.bind(authController));
  
  // Verificar email
  fastify.post('/verify-email', authController.verifyEmail.bind(authController));
  
  // Login
  fastify.post('/login', authController.login.bind(authController));
  
  // Refresh token
  fastify.post('/refresh', authController.refresh.bind(authController));
  
  // Logout
  fastify.post('/logout', authController.logout.bind(authController));
  
  // Recuperação de senha
  fastify.post('/forgot-password', authController.forgotPassword.bind(authController));
  fastify.post('/reset-password', authController.resetPassword.bind(authController));
  
  // 2FA
  fastify.post('/2fa/setup', authController.setup2FA.bind(authController));
  fastify.post('/2fa/verify', authController.verify2FA.bind(authController));
  fastify.post('/2fa/disable', authController.disable2FA.bind(authController));
}
