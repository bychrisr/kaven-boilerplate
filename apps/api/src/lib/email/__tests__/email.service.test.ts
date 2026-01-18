import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailServiceV2 } from '../index';
import { EmailType, EmailProvider } from '../types';

// Mocks
const prismaMock = vi.hoisted(() => ({
  emailIntegration: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
  },
  emailEvent: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
  emailQueue: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
}));

vi.mock('../../prisma', () => ({
  prisma: prismaMock,
}));

vi.mock('../templates/engine', () => ({
  emailTemplateEngine: {
    render: vi.fn().mockResolvedValue({ html: '<p>Hello</p>', subject: 'Hello Subject' }),
  },
}));

vi.mock('../../../modules/observability/services/business-metrics.service', () => ({
  businessMetricsService: {
    trackEmailSent: vi.fn(),
    trackEmailDeliveryDuration: vi.fn(),
  },
}));

vi.mock('../../crypto/encryption', () => ({
  decrypt: vi.fn((val) => val), // Mock simple decryption
  encrypt: vi.fn((val) => val),
}));

// Mock Resend and Postmark with proper constructor structure
vi.mock('resend', () => {
  return {
    Resend: class {
      emails = {
        send: vi.fn().mockResolvedValue({ data: { id: 'resend-123' }, error: null }),
      };
    },
  };
});

vi.mock('postmark', () => {
  return {
    ServerClient: class {
      sendEmail = vi.fn().mockResolvedValue({ MessageID: 'postmark-123' });
    },
  };
});

describe('EmailServiceV2', () => {
  let emailService: EmailServiceV2;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Disable queue to test direct sending provider logic
    emailService = new (EmailServiceV2 as any)({ useQueue: false });
    
    // Setup default primary provider for initialization
    prismaMock.emailIntegration.findMany = vi.fn().mockResolvedValue([
      {
        id: 'int-1',
        provider: 'RESEND',
        apiKey: 'key-123',
        isPrimary: true,
        isActive: true,
      }
    ]);

    await emailService.initialize();
  });

  describe('send', () => {
    it('should return error if recipient email is missing', async () => {
      const payload = {
        to: '',
        subject: 'Test',
        template: 'welcome',
      };

      const result = await emailService.send(payload);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Destinatário é obrigatório');
    });

    it('should use primary provider if none specified', async () => {
      // Act
      const payload = {
        to: 'test@example.com',
        subject: 'Test',
        template: 'welcome',
      };
      
      const result = await emailService.send(payload);

      // Assert
      expect(result.success).toBe(true);
      expect(result.provider).toBe('RESEND');
    });

    it('should use specified provider', async () => {
       // Arrange
       prismaMock.emailIntegration.findFirst.mockResolvedValue({
        id: 'int-2',
        provider: 'POSTMARK',
        apiKey: 'key-456',
        isActive: true,
        isPrimary: false,
      });

      const payload = {
        to: 'test@example.com',
        subject: 'Test',
        template: 'welcome',
        provider: 'POSTMARK' as any
      };

      // Act
      const result = await emailService.send(payload);

      // Assert
      expect(prismaMock.emailIntegration.findFirst).toHaveBeenCalledWith({
        where: { provider: 'POSTMARK', isActive: true }
      });
      expect(result.provider).toBe('POSTMARK');
    });

    it('should handle opt-out check', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        emailOptOut: true,
      });

      const payload = {
        to: 'optout@example.com',
        subject: 'Marketing Offer',
        template: 'marketing-template',
        type: EmailType.MARKETING,
        userId: 'user-1',
      };

      // Act
      const result = await emailService.send(payload);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Usuário optou por não receber e-mails de marketing');
    });
  });
});
