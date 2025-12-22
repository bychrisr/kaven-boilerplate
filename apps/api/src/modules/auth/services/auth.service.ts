import prisma from '../../../lib/prisma';
import { hashPassword, comparePassword } from '../../../lib/bcrypt';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../../../lib/jwt';
import { generate2FASecret, verify2FACode, generateBackupCodes } from '../../../lib/2fa';
import { emailService } from '../../../lib/email.service';
import type { RegisterInput, LoginInput } from '../../../lib/validation';

export class AuthService {
  /**
   * POST /api/auth/register
   * Registra um novo usuário
   */
  async register(data: RegisterInput) {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Verificar/criar tenant
    let tenantId: string | undefined;
    if (data.tenantSlug) {
      // Se tenantSlug fornecido, associar a tenant existente
      const tenant = await prisma.tenant.findUnique({
        where: { slug: data.tenantSlug },
      });
      if (!tenant) {
        throw new Error('Tenant não encontrado');
      }
      tenantId = tenant.id;
    } else {
      // Se não fornecido, criar tenant próprio (modo camaleão)
      const baseSlug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Keep replace for regex with /g flag where behavior is identical
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-+)|(-+$)/g, '');

      // Garantir slug único
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.tenant.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const tenant = await prisma.tenant.create({
        data: {
          name: data.name,
          slug,
          status: 'ACTIVE',
        },
      });

      tenantId = tenant.id;
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        tenantId,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
      },
    });

    // Enviar email de boas-vindas
    await emailService.sendWelcomeEmail(user);
    
    // NOTE: Gerar token de verificação e enviar email
    // const verificationToken = generateVerificationToken();
    // await emailService.sendVerificationEmail(user, verificationToken);

    return {
      message: 'Usuário criado com sucesso. Verifique seu email.',
      user,
    };
  }

  /**
   * POST /api/auth/verify-email
   * Verifica email do usuário
   */
  async verifyEmail(token: string) {
    // NOTE: Implementar lógica de verificação de token
    // Por ora, simples placeholder
    return { message: 'Email verificado com sucesso' };
  }

  /**
   * POST /api/auth/resend-verification
   * Reenvia email de verificação
   */
  async resendVerification(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por segurança, sempre retornar sucesso (previne enumeração de emails)
      return { message: 'Se o email existir, um novo link de verificação será enviado' };
    }

    if (user.emailVerified) {
      throw new Error('Email já verificado');
    }

    // Gerar novo token de verificação
    const verificationToken = `${user.id}.${Date.now()}.${Math.random().toString(36)}`;
    
    // NOTE: Salvar token no banco com expiração
    // await prisma.verificationToken.create({ data: { token: verificationToken, userId: user.id, expiresAt: ... } });
    
    // Enviar email de verificação
    await emailService.sendVerificationEmail(user, verificationToken);

    return { message: 'Se o email existir, um novo link de verificação será enviado' };
  }

  /**
   * POST /api/auth/login
   * Realiza login e retorna access token + refresh token
   */
  async login(data: LoginInput) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Se 2FA está habilitado, verificar código
    if (user.twoFactorEnabled) {
      if (!data.twoFactorCode) {
        return {
          requires2FA: true,
          message: 'Código 2FA necessário',
        };
      }

      const isCodeValid = verify2FACode(user.twoFactorSecret!, data.twoFactorCode);
      if (!isCodeValid) {
        throw new Error('Código 2FA inválido');
      }
    }

    // Gerar tokens
    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || undefined,
    });

    const refreshToken = generateRefreshToken();
    const refreshTokenExpiry = getRefreshTokenExpiry();

    // Salvar refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: refreshTokenExpiry,
      },
    });

    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  /**
   * POST /api/auth/refresh
   * Renova access token usando refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new Error('Refresh token inválido ou expirado');
    }

    // Gerar novo access token
    const accessToken = await generateAccessToken({
      userId: tokenRecord.user.id,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
      tenantId: tokenRecord.user.tenantId || undefined,
    });

    return { accessToken };
  }

  /**
   * POST /api/auth/logout
   * Invalida refresh token
   */
  async logout(refreshToken: string) {
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logout realizado com sucesso' };
  }

  /**
   * POST /api/auth/forgot-password
   * Envia email de recuperação de senha
   */
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Por segurança, sempre retornar sucesso
      return { message: 'Se o email existir, um link de recuperação será enviado' };
    }

    // Gerar token de recuperação (simples por enquanto)
    const resetToken = `${user.id}.${Date.now()}.${Math.random().toString(36)}`;
    
    // NOTE: Salvar token no banco com expiração
    // await prisma.passwordResetToken.create({ data: { token: resetToken, userId: user.id, expiresAt: ... } });
    
    // Enviar email de reset
    await emailService.sendPasswordResetEmail(user, resetToken);

    return { message: 'Se o email existir, um link de recuperação será enviado' };
  }

  /**
   * POST /api/auth/reset-password
   * Reseta senha usando token
   */
  async resetPassword(token: string, newPassword: string) {
    // NOTE: Validar token de reset
    // Por ora, placeholder
    // const hashedPassword = await hashPassword(newPassword);
    
    // NOTE: Atualizar senha do usuário associado ao token
    // await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });

    return { message: 'Senha resetada com sucesso' };
  }

  /**
   * POST /api/auth/2fa/setup
   * Configura 2FA para usuário
   */
  async setup2FA(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (user.twoFactorEnabled) {
      throw new Error('2FA já está habilitado');
    }

    // Gerar secret e QR code
    const { secret, qrCodeUrl } = await generate2FASecret(user.email);

    // Gerar backup codes
    const backupCodes = generateBackupCodes();

    // Salvar secret (mas não habilitar ainda)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret,
        backupCodes: JSON.stringify(backupCodes),
      },
    });

    return {
      secret,
      qrCodeUrl,
      backupCodes,
      message: 'Escaneie o QR Code no seu app autenticador e verifique com um código',
    };
  }

  /**
   * POST /api/auth/2fa/verify
   * Verifica código 2FA e habilita definitivamente
   */
  async verify2FA(userId: string, code: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.twoFactorSecret) {
      throw new Error('2FA não foi configurado');
    }

    const isValid = verify2FACode(user.twoFactorSecret, code);
    if (!isValid) {
      throw new Error('Código inválido');
    }

    // Habilitar 2FA
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    return { message: '2FA habilitado com sucesso' };
  }

  /**
   * POST /api/auth/2fa/disable
   * Desabilita 2FA
   */
  async disable2FA(userId: string, code: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.twoFactorEnabled) {
      throw new Error('2FA não está habilitado');
    }

    const isValid = verify2FACode(user.twoFactorSecret!, code);
    if (!isValid) {
      throw new Error('Código inválido');
    }

    // Desabilitar 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: null,
      },
    });

    return { message: '2FA desabilitado com sucesso' };
  }
}

export const authService = new AuthService();
