import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { 
  LoginSchema, 
  ForgotPasswordSchema, 
  RefreshTokenSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  LoginInput,
  ForgotPasswordInput,
  RefreshTokenInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '../types/auth.schemas.js';

export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  /**
   * POST /api/auth/login
   */
  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      const { email, password } = body;

      if (!email || !password) {
        reply.code(400).send({
          success: false,
          error: 'MISSING_CREDENTIALS',
          message: 'Email e senha são obrigatórios',
        });
        return;
      }

      // Authenticate user
      const user = await this.authService.authenticateUser(email, password);
      
      if (!user) {
        reply.code(400).send({
          success: false,
          error: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas',
        });
        return;
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.authService.generateTokens(user);

      reply.code(200).send({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isAdm: user.is_adm,
            tenantId: user.tenant_id,
            tenant: {
              id: (user as any).tenant.id,
              name: (user as any).tenant.name,
              subdomain: (user as any).tenant.subdomain,
            },
          },
        },
      });

    } catch (error) {
      request.server.log.error({ error, stack: (error as any).stack }, 'Login error');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const user = await this.authService.getUserById((request.user as any).id);
      
      if (!user) {
        reply.code(404).send({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        });
        return;
      }

      reply.code(200).send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdm: user.is_adm,
          tenantId: user.tenant_id,
          tenant: {
            id: (user as any).tenant.id,
            name: (user as any).tenant.name,
            subdomain: (user as any).tenant.subdomain,
          },
          createdAt: user.created_at,
        },
      });

    } catch (error) {
      request.server.log.error({ error }, 'Get user error');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { refreshToken } = request.body as RefreshTokenInput;

      const payload = await this.authService.verifyRefreshToken(refreshToken);
      
      if (!payload) {
        reply.code(401).send({
          success: false,
          error: 'INVALID_REFRESH_TOKEN',
          message: 'Refresh token inválido ou expirado',
        });
        return;
      }

      const user = await this.authService.getUserById(payload.userId);
      
      if (!user) {
        reply.code(404).send({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
        });
        return;
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = await this.authService.generateTokens(user);

      reply.code(200).send({
        success: true,
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });

    } catch (error) {
      request.server.log.error({ error }, 'Refresh token error');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      await this.authService.logout((request.user as any).id);

      reply.code(200).send({
        success: true,
        message: 'Logout realizado com sucesso',
      });

    } catch (error) {
      request.server.log.error({ error }, 'Logout error');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email } = request.body as ForgotPasswordInput;

      const resetToken = await this.authService.createPasswordResetToken(email);
      
      // Always return success to prevent email enumeration
      reply.code(200).send({
        success: true,
        message: 'Se o email estiver registrado, um link de redefinição foi enviado.',
      });

      // In a real application, you would send an email here
      if (resetToken) {
        request.server.log.info(`Password reset token for ${email}: ${resetToken}`);
      }

    } catch (error) {
      request.server.log.error({ error }, 'Forgot password error');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { token, password } = request.body as ResetPasswordInput;

      const success = await this.authService.resetPassword(token, password);
      
      if (!success) {
        reply.code(400).send({
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Token inválido ou expirado',
        });
        return;
      }

      reply.code(200).send({
        success: true,
        message: 'Senha redefinida com sucesso',
      });

    } catch (error) {
      request.server.log.error({ error }, 'Reset password error');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }

  /**
   * POST /api/auth/change-password
   */
  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.user) {
        reply.code(401).send({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Usuário não autenticado',
        });
        return;
      }

      const { currentPassword, newPassword } = request.body as ChangePasswordInput;

      const success = await this.authService.changePassword(
        (request.user as any).id,
        currentPassword,
        newPassword
      );
      
      if (!success) {
        reply.code(400).send({
          success: false,
          error: 'INVALID_CURRENT_PASSWORD',
          message: 'Senha atual incorreta',
        });
        return;
      }

      reply.code(200).send({
        success: true,
        message: 'Senha alterada com sucesso',
      });

    } catch (error) {
      request.server.log.error({ error }, 'Change password error');
      reply.code(500).send({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Erro interno do servidor',
      });
    }
  }
}
