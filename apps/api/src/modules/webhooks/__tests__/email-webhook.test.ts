import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailWebhookController } from '../controllers/email-webhook.controller';
import { FastifyRequest, FastifyReply } from 'fastify';

// Mocks
const prismaMock = vi.hoisted(() => ({
  emailIntegration: {
    findFirst: vi.fn(),
  },
  emailEvent: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  user: {
    updateMany: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('../../../lib/prisma', () => ({
  prisma: prismaMock,
}));

vi.mock('../../../utils/secure-logger', () => ({
  secureLog: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../../lib/crypto/encryption', () => ({
  decrypt: vi.fn((val) => 'secret-123'),
}));

vi.mock('../../../lib/webhooks/hmac-validator', () => ({
  validateResendSignature: vi.fn(),
  validateHmacSignature: vi.fn(),
}));

vi.mock('../../observability/services/business-metrics.service', () => ({
  businessMetricsService: {
    trackEmailBounce: vi.fn(),
    trackEmailComplaint: vi.fn(),
  },
}));

// Import mocked modules for assertion
import { validateResendSignature } from '../../../lib/webhooks/hmac-validator';
import { businessMetricsService } from '../../observability/services/business-metrics.service';

describe('EmailWebhookController', () => {
  let controller: EmailWebhookController;
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new EmailWebhookController();

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
  });

  describe('handle (Resend)', () => {
    it('should process bounce event correctly', async () => {
      // Arrange
      mockRequest = {
        params: { provider: 'resend' },
        headers: { 'resend-signature': 'sig-123' },
        body: {
          type: 'email.bounced',
          data: {
            email_id: 'msg-123',
            to: ['bounced@example.com'],
          },
        },
      };

      prismaMock.emailIntegration.findFirst.mockResolvedValue({
        id: 'int-1',
        provider: 'RESEND',
        webhookSecret: 'encrypted-secret',
      });

      (validateResendSignature as any).mockReturnValue(true);

      // Act
      await controller.handle(mockRequest as FastifyRequest, mockReply as FastifyReply);

      // Assert
      expect(prismaMock.emailEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
            eventType: 'BOUNCE',
            email: 'bounced@example.com',
            provider: 'RESEND',
        })
      }));

      expect(prismaMock.user.updateMany).toHaveBeenCalledWith({
        where: { email: 'bounced@example.com' },
        data: expect.objectContaining({
          emailBounced: true,
          emailBounceType: 'SOFT', // Default logic
        }),
      });

      expect(businessMetricsService.trackEmailBounce).toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(200);
    });

    it('should reject invalid signature', async () => {
      // Arrange
      mockRequest = {
        params: { provider: 'resend' },
        headers: { 'resend-signature': 'bad-sig' },
        body: {},
      };

      prismaMock.emailIntegration.findFirst.mockResolvedValue({
        webhookSecret: 'encrypted-secret',
      });

      (validateResendSignature as any).mockReturnValue(false);

      // Act
      await controller.handle(mockRequest as FastifyRequest, mockReply as FastifyReply);

      // Assert
      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Invalid signature' });
    });
  });

  describe('handle (Postmark)', () => {
    it('should process spam complaint correctly', async () => {
      // Arrange
      mockRequest = {
        params: { provider: 'postmark' },
        headers: { 'x-postmark-secret': 'secret-123' }, // Matches decrypted secret
        body: {
          RecordType: 'SpamComplaint',
          MessageID: 'msg-456',
          Recipient: 'complaint@example.com',
          Type: 'SpamComplaint',
        },
      };

      prismaMock.emailIntegration.findFirst.mockResolvedValue({
        id: 'int-2',
        provider: 'POSTMARK',
        webhookSecret: 'encrypted-secret',
      });

      // Act
      await controller.handle(mockRequest as FastifyRequest, mockReply as FastifyReply);

      // Assert
      expect(prismaMock.emailEvent.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
            eventType: 'COMPLAINT',
            email: 'complaint@example.com',
            provider: 'POSTMARK',
        })
      }));

      expect(prismaMock.user.updateMany).toHaveBeenCalledWith({
        where: { email: 'complaint@example.com' },
        data: expect.objectContaining({
          emailOptOut: true,
        }),
      });

      expect(businessMetricsService.trackEmailComplaint).toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(200);
    });
  });

  describe('unsubscribe (RFC 8058)', () => {
    it('should unsubscribe user with valid token', async () => {
      // Arrange
      const token = 'valid-token';
      mockRequest = {
        params: { token },
      };

      prismaMock.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        unsubscribeToken: token,
      });

      // Act
      await controller.unsubscribe(mockRequest as FastifyRequest, mockReply as FastifyReply);

      // Assert
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          emailOptOut: true,
        }),
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 for invalid token', async () => {
       // Arrange
       mockRequest = { params: { token: 'invalid' } };
       prismaMock.user.findFirst.mockResolvedValue(null);

       // Act
       await controller.unsubscribe(mockRequest as FastifyRequest, mockReply as FastifyReply);

       // Assert
       expect(mockReply.status).toHaveBeenCalledWith(404);
       expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
  });
});
