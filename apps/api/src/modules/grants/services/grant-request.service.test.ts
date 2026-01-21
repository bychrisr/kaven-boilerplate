import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GrantRequestService } from './grant-request.service';
import { prisma } from '../../../lib/prisma';
import { GrantRequestStatus, AccessLevel, CapabilityScope } from '@prisma/client';

// Mock Prisma
vi.mock('../../../lib/prisma', () => ({
  prisma: {
    grantRequest: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    grant: {
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
    capability: {
      findUnique: vi.fn(),
    },
    space: {
      findUnique: vi.fn(),
    },
  },
}));

describe('GrantRequestService', () => {
  let service: GrantRequestService;

  beforeEach(() => {
    service = new GrantRequestService();
    vi.clearAllMocks();
  });

  describe('createRequest', () => {
    it('deve criar uma solicitação de grant com sucesso', async () => {
      const mockRequest = {
        id: 'req-123',
        requesterId: 'user-123',
        spaceId: 'space-123',
        capabilityId: 'cap-123',
        accessLevel: AccessLevel.READ_ONLY,
        scope: CapabilityScope.SPACE,
        justification: 'Preciso acessar para completar tarefa X',
        requestedDuration: 7,
        status: GrantRequestStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.grantRequest.create).mockResolvedValue(mockRequest as any);

      const result = await service.createRequest({
        requesterId: 'user-123',
        spaceId: 'space-123',
        capabilityId: 'cap-123',
        accessLevel: AccessLevel.READ_ONLY,
        justification: 'Preciso acessar para completar tarefa X',
        requestedDuration: 7,
      });

      expect(result).toEqual(mockRequest);
      expect(prisma.grantRequest.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          requesterId: 'user-123',
          spaceId: 'space-123',
          capabilityId: 'cap-123',
          accessLevel: AccessLevel.READ_ONLY,
          justification: 'Preciso acessar para completar tarefa X',
          requestedDuration: 7,
          status: GrantRequestStatus.PENDING,
        }),
      });
    });

    it('deve lançar erro se justificativa for muito curta', async () => {
      await expect(
        service.createRequest({
          requesterId: 'user-123',
          spaceId: 'space-123',
          capabilityId: 'cap-123',
          accessLevel: AccessLevel.READ_ONLY,
          justification: 'Curto',
          requestedDuration: 7,
        })
      ).rejects.toThrow('Justificativa deve ter no mínimo 10 caracteres');
    });

    it('deve lançar erro se duração for inválida', async () => {
      await expect(
        service.createRequest({
          requesterId: 'user-123',
          spaceId: 'space-123',
          capabilityId: 'cap-123',
          accessLevel: AccessLevel.READ_ONLY,
          justification: 'Justificativa válida com mais de 10 caracteres',
          requestedDuration: 400, // Maior que 365
        })
      ).rejects.toThrow('Duração deve ser entre 1 e 365 dias');
    });
  });

  describe('listRequests', () => {
    it('deve listar solicitações com paginação', async () => {
      const mockRequests = [
        {
          id: 'req-1',
          requesterId: 'user-123',
          status: GrantRequestStatus.PENDING,
          createdAt: new Date(),
        },
        {
          id: 'req-2',
          requesterId: 'user-123',
          status: GrantRequestStatus.APPROVED,
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.grantRequest.findMany).mockResolvedValue(mockRequests as any);
      vi.mocked(prisma.grantRequest.count).mockResolvedValue(2);

      const result = await service.listRequests({
        requesterId: 'user-123',
        page: 1,
        limit: 10,
      });

      expect(result.requests).toEqual(mockRequests);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('deve filtrar por status', async () => {
      vi.mocked(prisma.grantRequest.findMany).mockResolvedValue([]);
      vi.mocked(prisma.grantRequest.count).mockResolvedValue(0);

      await service.listRequests({
        status: GrantRequestStatus.PENDING,
        page: 1,
        limit: 10,
      });

      expect(prisma.grantRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: GrantRequestStatus.PENDING,
          }),
        })
      );
    });
  });

  describe('approveRequest', () => {
    it('deve aprovar solicitação e criar grant', async () => {
      const mockRequest = {
        id: 'req-123',
        requesterId: 'user-123',
        spaceId: 'space-123',
        capabilityId: 'cap-123',
        accessLevel: AccessLevel.READ_ONLY,
        scope: CapabilityScope.SPACE,
        requestedDuration: 7,
        status: GrantRequestStatus.PENDING,
      };

      const mockGrant = {
        id: 'grant-123',
        userId: 'user-123',
        capabilityId: 'cap-123',
        grantedBy: 'approver-123',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      vi.mocked(prisma.grantRequest.findUnique).mockResolvedValue(mockRequest as any);
      vi.mocked(prisma.grantRequest.update).mockResolvedValue({
        ...mockRequest,
        status: GrantRequestStatus.APPROVED,
        approvedBy: 'approver-123',
        approvedAt: new Date(),
      } as any);
      vi.mocked(prisma.grant.create).mockResolvedValue(mockGrant as any);

      const result = await service.approveRequest({
        requestId: 'req-123',
        approverId: 'approver-123',
      });

      expect(result.status).toBe(GrantRequestStatus.APPROVED);
      expect(prisma.grant.create).toHaveBeenCalled();
    });

    it('deve lançar erro se solicitação não estiver pendente', async () => {
      vi.mocked(prisma.grantRequest.findUnique).mockResolvedValue({
        id: 'req-123',
        status: GrantRequestStatus.APPROVED,
      } as any);

      await expect(
        service.approveRequest({
          requestId: 'req-123',
          approverId: 'approver-123',
        })
      ).rejects.toThrow('Solicitação não está pendente');
    });

    it('deve lançar erro se solicitação não existir', async () => {
      vi.mocked(prisma.grantRequest.findUnique).mockResolvedValue(null);

      await expect(
        service.approveRequest({
          requestId: 'req-999',
          approverId: 'approver-123',
        })
      ).rejects.toThrow('Solicitação não encontrada');
    });
  });

  describe('rejectRequest', () => {
    it('deve rejeitar solicitação com motivo', async () => {
      const mockRequest = {
        id: 'req-123',
        status: GrantRequestStatus.PENDING,
      };

      vi.mocked(prisma.grantRequest.findUnique).mockResolvedValue(mockRequest as any);
      vi.mocked(prisma.grantRequest.update).mockResolvedValue({
        ...mockRequest,
        status: GrantRequestStatus.REJECTED,
        rejectedBy: 'rejector-123',
        rejectedAt: new Date(),
        rejectionReason: 'Acesso não justificado',
      } as any);

      const result = await service.rejectRequest({
        requestId: 'req-123',
        rejecterId: 'rejector-123',
        reason: 'Acesso não justificado',
      });

      expect(result.status).toBe(GrantRequestStatus.REJECTED);
      expect(result.rejectionReason).toBe('Acesso não justificado');
    });

    it('deve lançar erro se motivo não for fornecido', async () => {
      vi.mocked(prisma.grantRequest.findUnique).mockResolvedValue({
        id: 'req-123',
        status: GrantRequestStatus.PENDING,
      } as any);

      await expect(
        service.rejectRequest({
          requestId: 'req-123',
          rejecterId: 'rejector-123',
          reason: '',
        })
      ).rejects.toThrow('Motivo da rejeição é obrigatório');
    });
  });

  describe('getRequestById', () => {
    it('deve retornar solicitação com detalhes completos', async () => {
      const mockRequest = {
        id: 'req-123',
        requesterId: 'user-123',
        requester: {
          id: 'user-123',
          name: 'João Silva',
          email: 'joao@example.com',
        },
        capability: {
          id: 'cap-123',
          code: 'users.read',
          description: 'Visualizar usuários',
        },
        space: {
          id: 'space-123',
          name: 'Admin',
        },
      };

      vi.mocked(prisma.grantRequest.findUnique).mockResolvedValue(mockRequest as any);

      const result = await service.getRequestById('req-123');

      expect(result).toEqual(mockRequest);
      expect(result.requester).toBeDefined();
      expect(result.capability).toBeDefined();
    });

    it('deve lançar erro se solicitação não existir', async () => {
      vi.mocked(prisma.grantRequest.findUnique).mockResolvedValue(null);

      await expect(service.getRequestById('req-999')).rejects.toThrow(
        'Solicitação não encontrada'
      );
    });
  });
});
