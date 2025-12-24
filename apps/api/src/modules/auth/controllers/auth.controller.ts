import { FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth.service';
import { sanitizer } from '../../../utils/sanitizer';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema,
  verifyEmailSchema,
  setup2FASchema,
  verify2FASchema,
  disable2FASchema
} from '../../../lib/validation';

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = registerSchema.parse(request.body);
      
      // 🛡️ SECURITY: Sanitize inputs against XSS
      if (data.name) data.name = sanitizer.clean(data.name);
      
      const result = await authService.register(data);
      reply.status(201).send(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors });
      }
      reply.status(400).send({ error: error.message || 'Erro ao registrar usuário' });
    }
  }

  /**
   * POST /api/auth/verify-email
   */
  async verifyEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token } = verifyEmailSchema.parse(request.body);
      const result = await authService.verifyEmail(token);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao verificar email' });
    }
  }

  /**
   * POST /api/auth/resend-verification
   */
  async resendVerification(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = forgotPasswordSchema.parse(request.body); // Usa mesmo schema (só email)
      const result = await authService.resendVerification(email);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao reenviar verificação' });
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = loginSchema.parse(request.body);
      
      const ip = request.ip;
      const userAgent = request.headers['user-agent'];

      const result = await authService.login(data, ip, userAgent);
      
      if ('requires2FA' in result) {
        return reply.status(200).send(result);
      }

      reply.send(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ error: 'Dados inválidos', details: error.errors });
      }
      reply.status(401).send({ error: error.message || 'Erro ao fazer login' });
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = request.body as { refreshToken: string };
      
      if (!refreshToken) {
        return reply.status(400).send({ error: 'Refresh token é obrigatório' });
      }

      const result = await authService.refreshAccessToken(refreshToken);
      reply.send(result);
    } catch (error: any) {
      reply.status(401).send({ error: error.message || 'Erro ao renovar token' });
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = request.body as { refreshToken: string };
      
      if (!refreshToken) {
        return reply.status(400).send({ error: 'Refresh token é obrigatório' });
      }

      const result = await authService.logout(refreshToken);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao fazer logout' });
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = forgotPasswordSchema.parse(request.body);
      const result = await authService.forgotPassword(email);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao processar recuperação de senha' });
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = resetPasswordSchema.parse(request.body);
      const result = await authService.resetPassword(data.token, data.password);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao resetar senha' });
    }
  }

  /**
   * POST /api/auth/2fa/setup
   */
  async setup2FA(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = setup2FASchema.parse(request.body);
      const result = await authService.setup2FA(userId);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao configurar 2FA' });
    }
  }

  /**
   * POST /api/auth/2fa/verify
   */
  async verify2FA(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = verify2FASchema.parse(request.body);
      const result = await authService.verify2FA(data.userId, data.code);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao verificar 2FA' });
    }
  }

  /**
   * POST /api/auth/2fa/disable
   */
  async disable2FA(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = disable2FASchema.parse(request.body);
      const result = await authService.disable2FA(data.userId, data.code);
      reply.send(result);
    } catch (error: any) {
      reply.status(400).send({ error: error.message || 'Erro ao desabilitar 2FA' });
    }
  }
}

export const authController = new AuthController();
