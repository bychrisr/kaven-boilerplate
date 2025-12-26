import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from './auth.service';

// Mocks
const prismaMock = vi.hoisted(() => ({
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  tenant: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  refreshToken: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  securityAuditLog: {
    create: vi.fn(),
  },
}));

vi.mock('../../../lib/prisma', () => ({
  default: prismaMock,
}));

vi.mock('../../../lib/password', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed_password'),
  comparePassword: vi.fn(),
  validatePasswordStrength: vi.fn().mockReturnValue({ isValid: true }),
}));

vi.mock('../../../lib/jwt', () => ({
  generateAccessToken: vi.fn().mockResolvedValue('access_token'),
  generateRefreshToken: vi.fn().mockReturnValue('refresh_token'),
  getRefreshTokenExpiry: vi.fn().mockReturnValue(new Date()),
}));

vi.mock('../../../lib/email.service', () => ({
  emailService: {
    sendWelcomeEmail: vi.fn(),
    sendVerificationEmail: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  },
}));

import { hashPassword, comparePassword } from '../../../lib/password';
import { emailService } from '../../../lib/email.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      prismaMock.user.findUnique.mockResolvedValue(null); // No existing user
      prismaMock.user.create.mockResolvedValue({
        id: 'user-123',
        email: input.email,
        name: input.name,
        role: 'USER',
        tenantId: null,
      });
      prismaMock.tenant.create.mockResolvedValue({ id: 'tenant-123' });

      // Act
      const result = await authService.register(input);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(hashPassword).toHaveBeenCalledWith(input.password);
      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(emailService.sendWelcomeEmail).toHaveBeenCalled();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(input.email);
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const input = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      // Act & Assert
      await expect(authService.register(input)).rejects.toThrow('Email já cadastrado');
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 'user-123',
        email: input.email,
        password: 'hashed_password',
        name: 'Test User',
        role: 'USER',
        tenantId: null,
        twoFactorEnabled: false,
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      (comparePassword as any).mockResolvedValue(true);

      // Act
      const result = await authService.login(input);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } });
      expect(comparePassword).toHaveBeenCalledWith(input.password, user.password);
      expect(prismaMock.refreshToken.create).toHaveBeenCalled();
      expect(result.accessToken).toBe('access_token');
      expect(result.user?.email).toBe(input.email);
    });

    it('should throw error with invalid password', async () => {
      // Arrange
      const input = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      const user = {
        id: 'user-123',
        email: input.email,
        password: 'hashed_password',
      };

      prismaMock.user.findUnique.mockResolvedValue(user);
      (comparePassword as any).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(input)).rejects.toThrow('Credenciais inválidas');
    });
  });
});
