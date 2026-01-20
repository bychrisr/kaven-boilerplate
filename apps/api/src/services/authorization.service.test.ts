/**
 * Authorization Service Tests
 * 
 * Testes unitários para o AuthorizationService.
 * Cobre:
 * - checkCapability (prioridades, grants, roles)
 * - Validação de políticas (MFA, IP, Device)
 * - Auditoria
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthorizationService } from './authorization.service';
import { PrismaClient, Role, CapabilitySensitivity, CapabilityScope, GrantType, AccessLevel } from '@prisma/client';
import { AuthorizationContext } from '../types/authorization.types';

// Mock do Prisma
const prismaMock = {
  user: {
    findUnique: vi.fn(),
  },
  capability: {
    findUnique: vi.fn(),
  },
  grant: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  userSpaceRole: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  policy: {
    findMany: vi.fn(),
  },
  capabilityAuditEvent: {
    create: vi.fn(),
  },
  policyDeviceTracking: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

// Mock do módulo @prisma/client para injetar o prismaMock
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => prismaMock),
  Role: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    USER: 'USER',
  },
  CapabilitySensitivity: {
    NORMAL: 'NORMAL',
    SENSITIVE: 'SENSITIVE',
  },
  CapabilityScope: {
    SPACE: 'SPACE',
  },
  GrantType: {
    ADD: 'ADD',
    DENY: 'DENY',
  },
  AccessLevel: {
    READ_ONLY: 'READ_ONLY',
    READ_WRITE: 'READ_WRITE',
  },
}));

describe('AuthorizationService', () => {
  let authService: AuthorizationService;
  const userId = 'user-123';
  const spaceId = 'space-123';
  const capabilityCode = 'tickets.read';
  const capabilityId = 'cap-123';

  const mockContext: AuthorizationContext = {
    userId,
    spaceId,
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    user: {
      id: userId,
      email: 'test@example.com',
      role: 'USER',
      twoFactorEnabled: true,
    },
    session: {
      id: 'session-123',
      mfaVerified: true,
      mfaVerifiedAt: new Date(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthorizationService();
  });

  describe('checkCapability', () => {
    it('deve permitir acesso para SUPER_ADMIN (bypass total)', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: userId,
        role: 'SUPER_ADMIN', // Role do type real
      });

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('SUPER_ADMIN');
      expect(prismaMock.capabilityAuditEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'SUPER_ADMIN',
          result: 'allowed',
        })
      );
    });

    it('deve negar acesso se usuário não existir', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('NO_PERMISSION');
    });

    it('deve negar acesso se capability não existir', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue(null);

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('CAPABILITY_NOT_FOUND');
    });

    it('deve negar acesso se capability estiver inativa', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({
        id: capabilityId,
        isActive: false,
      });

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('CAPABILITY_INACTIVE');
    });

    it('deve respeitar DENY grant (alta prioridade)', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({
        id: capabilityId,
        isActive: true,
      });
      // Mock DENY grant encontrado
      prismaMock.grant.findFirst.mockResolvedValueOnce({
        id: 'grant-deny-123',
        type: 'DENY',
        status: 'ACTIVE',
      });

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('DENY_GRANT');
    });

    it('deve permitir acesso via ADD grant', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({
        id: capabilityId,
        isActive: true,
        requiresMFA: false,
      });
      // Sem DENY grant
      prismaMock.grant.findFirst.mockResolvedValueOnce(null);
      // Mock ADD grant encontrado
      prismaMock.grant.findFirst.mockResolvedValueOnce({
        id: 'grant-add-123',
        type: 'ADD',
        status: 'ACTIVE',
        accessLevel: 'READ_WRITE',
      });
      // Sem policies extras
      prismaMock.policy.findMany.mockResolvedValue([]);

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('ADD_GRANT');
      expect(result.accessLevel).toBe('READ_WRITE');
    });

    it('deve permitir acesso via Role Capability', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({
        id: capabilityId,
        isActive: true,
        requiresMFA: false,
      });
      prismaMock.grant.findFirst.mockResolvedValue(null); // Sem grants
      prismaMock.policy.findMany.mockResolvedValue([]); // Sem policies
      
      // Mock role capability
      prismaMock.userSpaceRole.findFirst.mockResolvedValue({
        role: {
          capabilities: [
            {
              capability: {
                id: capabilityId,
                code: capabilityCode,
              },
            },
          ],
        },
      });

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        spaceId,
        context: mockContext,
      });

      expect(result.allowed).toBe(true);
      expect(result.reason).toBe('ROLE_CAPABILITY');
    });

    it('deve negar acesso por padrão (Default DENY)', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({
        id: capabilityId,
        isActive: true,
      });
      prismaMock.grant.findFirst.mockResolvedValue(null);
      prismaMock.userSpaceRole.findFirst.mockResolvedValue(null);

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('NO_PERMISSION');
    });
  });

  describe('validatePolicies (MFA)', () => {
    it('deve negar se capability requer MFA e user não tem ativado', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({
        id: capabilityId,
        isActive: true,
        requiresMFA: true,
      });
      prismaMock.grant.findFirst.mockResolvedValue({
        id: 'grant-add-123',
        type: 'ADD',
      });

      const contextNoMFA = { ...mockContext };
      contextNoMFA.user!.twoFactorEnabled = false;

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: contextNoMFA,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('MFA_NOT_ENABLED');
    });

    it('deve negar se capability requer MFA e user não verificou na sessão', async () => {
       prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({
        id: capabilityId,
        isActive: true,
        requiresMFA: true,
      });
      prismaMock.grant.findFirst.mockResolvedValue({
        id: 'grant-add-123',
        type: 'ADD',
      });

      const contextUnverified = { ...mockContext };
      contextUnverified.session!.mfaVerified = false;

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: contextUnverified,
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('MFA_NOT_VERIFIED');
    });
  });

  describe('validatePolicies (IP Restriction)', () => {
    it('deve bloquear IP não autorizado', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({ id: capabilityId, isActive: true });
      prismaMock.grant.findFirst.mockResolvedValue({ id: 'g1', type: 'ADD' });
      
      // Mock Policy IP RESTRICTION
      prismaMock.policy.findMany.mockResolvedValue([
        {
          id: 'p1',
          type: 'IP_RESTRICTION',
          enforcement: 'DENY',
          isActive: true,
          ipWhitelists: [
            { ipAddress: '10.0.0.1', isActive: true }, // IP diferente do contexto
          ],
        },
      ]);

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext, // IP no context é 192.168.1.1
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('IP_NOT_ALLOWED');
    });

    it('deve permitir IP autorizado', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: userId, role: 'USER' });
      prismaMock.capability.findUnique.mockResolvedValue({ id: capabilityId, isActive: true });
      prismaMock.grant.findFirst.mockResolvedValue({ id: 'g1', type: 'ADD' });
      
      prismaMock.policy.findMany.mockResolvedValue([
        {
          id: 'p1',
          type: 'IP_RESTRICTION',
          enforcement: 'DENY',
          isActive: true,
          ipWhitelists: [
            { ipAddress: '192.168.1.1', isActive: true }, // IP igual ao contexto
          ],
        },
      ]);

      const result = await authService.checkCapability({
        userId,
        capabilityCode,
        context: mockContext,
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe('getUserCapabilities', () => {
    it('deve retornar [*] para SUPER_ADMIN', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ role: 'SUPER_ADMIN' });
      const caps = await authService.getUserCapabilities(userId);
      expect(caps).toEqual(['*']);
    });

    it('deve retornar lista de capabilities do role + grants', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ role: 'USER' });
      
      // Mock user roles
      prismaMock.userSpaceRole.findMany.mockResolvedValue([
        {
          role: {
            capabilities: [
              { capability: { code: 'cap1', isActive: true } },
            ],
          },
        },
      ]);

      // Mock ADD grants
      prismaMock.grant.findMany
        .mockResolvedValueOnce([{ capability: { code: 'cap2' } }]) // grant add
        .mockResolvedValueOnce([]); // grant deny

      const caps = await authService.getUserCapabilities(userId, spaceId);
      expect(caps).toContain('cap1');
      expect(caps).toContain('cap2');
    });
  });
});
