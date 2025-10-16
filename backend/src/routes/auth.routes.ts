import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { 
  LoginSchema, 
  ForgotPasswordSchema, 
  RefreshTokenSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
} from '../types/auth.schemas.js';

export default async function authRoutes(fastify: FastifyInstance) {
  // Initialize auth service and controller
  const authService = new AuthService(
    fastify.prisma,
    fastify,
    fastify.redis
  );
  const authController = new AuthController(authService);

  // POST /api/auth/login
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 1 },
        },
      },
    },
  }, authController.login.bind(authController));

  // GET /api/auth/me
  fastify.get('/me', {
    preHandler: [authenticateUser],
  }, authController.me.bind(authController));

  // POST /api/auth/refresh
  fastify.post('/refresh', {
    schema: {
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', minLength: 1 },
        },
      },
    },
  }, authController.refresh.bind(authController));

  // POST /api/auth/logout
  fastify.post('/logout', {
    preHandler: [authenticateUser],
  }, authController.logout.bind(authController));

  // POST /api/auth/forgot-password
  fastify.post('/forgot-password', {
    schema: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
  }, authController.forgotPassword.bind(authController));

  // POST /api/auth/reset-password
  fastify.post('/reset-password', {
    schema: {
      body: {
        type: 'object',
        required: ['token', 'password'],
        properties: {
          token: { type: 'string', minLength: 1 },
          password: { type: 'string', minLength: 8 },
        },
      },
    },
  }, authController.resetPassword.bind(authController));

  // POST /api/auth/change-password
  fastify.post('/change-password', {
    schema: {
      body: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', minLength: 1 },
          newPassword: { type: 'string', minLength: 8 },
        },
      },
    },
    preHandler: [authenticateUser],
  }, authController.changePassword.bind(authController));
}
