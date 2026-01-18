import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../lib/prisma';
import { secureLog } from '../../../utils/secure-logger';
import { decrypt } from '../../../lib/crypto/encryption';
import { validateResendSignature, validateHmacSignature } from '../../../lib/webhooks/hmac-validator';
import { EmailProvider } from '../../../lib/email/types';
import { businessMetricsService } from '../../observability/services/business-metrics.service';

export class EmailWebhookController {
  /**
   * Handle Webhooks from different providers
   */
  async handle(req: FastifyRequest, reply: FastifyReply) {
    const { provider } = req.params as { provider: string };
    const rawBody = JSON.stringify(req.body);
    const body = req.body as any;

    secureLog.info(`[EmailWebhook] Received webhook from ${provider}`);

    try {
      // 1. Get integration config from DB to get webhook secret
      const integration = await (prisma as any).emailIntegration.findFirst({
        where: { 
          provider: provider.toUpperCase() as any,
          isActive: true
        }
      });

      if (!integration || !integration.webhookSecret) {
        secureLog.warn(`[EmailWebhook] No active integration or webhook secret found for ${provider}`);
        return reply.status(404).send({ error: 'Integration not found or missing secret' });
      }

      const webhookSecret = decrypt(integration.webhookSecret);

      // 2. Validate Signature
      let isValid = false;
      if (provider.toLowerCase() === 'resend') {
        isValid = validateResendSignature(rawBody, req.headers, webhookSecret);
      } else if (provider.toLowerCase() === 'postmark') {
        // Postmark custom header or simple token
        const token = req.headers['x-postmark-secret'] as string;
        isValid = token === webhookSecret;
      }

      if (!isValid) {
        secureLog.warn(`[EmailWebhook] Invalid signature for ${provider}`);
        return reply.status(401).send({ error: 'Invalid signature' });
      }

      // 3. Process Events
      if (provider.toLowerCase() === 'resend') {
        await this.processResendEvent(body);
      } else if (provider.toLowerCase() === 'postmark') {
        await this.processPostmarkEvent(body);
      }

      return reply.status(200).send({ success: true });
    } catch (error) {
      secureLog.error(`[EmailWebhook] Error processing webhook for ${provider}:`, error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }

  /**
   * Process Resend Events
   */
  private async processResendEvent(payload: any) {
    const { type, data, created_at } = payload;
    const messageId = data.email_id;

    secureLog.info(`[EmailWebhook:Resend] Event: ${type}`, { messageId });

    // Map Resend types to our EmailEventType
    const eventTypeMap: Record<string, string> = {
      'email.sent': 'SENT',
      'email.delivered': 'DELIVERED',
      'email.delivery_delayed': 'DELAYED',
      'email.complained': 'COMPLAINT',
      'email.bounced': 'BOUNCE',
      'email.opened': 'OPEN',
      'email.clicked': 'CLICK',
    };

    const ourType = eventTypeMap[type];
    if (!ourType) return;

    await this.recordEvent({
      messageId,
      eventType: ourType,
      email: data.to?.[0],
      provider: 'RESEND',
      metadata: payload
    });

    // Handle Bounces and Complaints
    if (ourType === 'BOUNCE' || ourType === 'COMPLAINT') {
      await this.handleReputationIssue(data.to?.[0], ourType, payload);
    }
  }

  /**
   * Process Postmark Events
   */
  private async processPostmarkEvent(payload: any) {
    const { RecordType, MessageID, Recipient, Metadata } = payload;

    secureLog.info(`[EmailWebhook:Postmark] Event: ${RecordType}`, { MessageID });

    // Map Postmark types
    const eventTypeMap: Record<string, string> = {
      'Delivery': 'DELIVERED',
      'Bounce': 'BOUNCE',
      'SpamComplaint': 'COMPLAINT',
      'Open': 'OPEN',
      'Click': 'CLICK',
    };

    const ourType = eventTypeMap[RecordType];
    if (!ourType) return;

    await this.recordEvent({
      messageId: MessageID,
      eventType: ourType,
      email: Recipient,
      provider: 'POSTMARK',
      metadata: payload
    });

    if (ourType === 'BOUNCE' || ourType === 'COMPLAINT') {
      await this.handleReputationIssue(Recipient, ourType, payload);
    }
  }

  /**
   * Record event in database
   */
  private async recordEvent(data: {
    messageId: string;
    eventType: string;
    email: string;
    provider: string;
    metadata: any;
  }) {
    try {
      // Find the original sent event to get userId and tenantId
      const originalEvent = await (prisma as any).emailEvent.findFirst({
        where: { messageId: data.messageId },
        select: { userId: true, tenantId: true, emailType: true, template: true }
      });

      await (prisma as any).emailEvent.create({
        data: {
          eventType: data.eventType as any,
          messageId: data.messageId,
          email: data.email,
          emailType: originalEvent?.emailType || 'TRANSACTIONAL',
          template: originalEvent?.template,
          userId: originalEvent?.userId,
          tenantId: originalEvent?.tenantId,
          provider: data.provider as any,
          metadata: data.metadata
        }
      });
    } catch (error) {
      secureLog.error('[EmailWebhook] Error recording event:', error);
    }
  }

  /**
   * Handle Bounces and Complaints
   */
  private async handleReputationIssue(email: string, type: string, metadata: any) {
    if (!email) return;

    try {
      if (type === 'BOUNCE') {
        const bounceType = metadata.bounceType === 'Hard' ? 'HARD' : 'SOFT';
        
        await (prisma.user as any).updateMany({
          where: { email },
          data: {
            emailBounced: true,
            emailBouncedAt: new Date(),
            emailBounceType: bounceType
          }
        });
        
        secureLog.warn(`[EmailWebhook] User email bounced: ${email}`, { bounceType });
        
        // Record Metrics
        businessMetricsService.trackEmailBounce(type, bounceType);
      } else if (type === 'COMPLAINT') {
        await (prisma.user as any).updateMany({
          where: { email },
          data: {
            emailOptOut: true,
            emailOptOutDate: new Date(),
            emailComplaintCount: { increment: 1 }
          }
        });

        secureLog.warn(`[EmailWebhook] User reported SPAM: ${email}`);
        
        // Record Metrics
        businessMetricsService.trackEmailComplaint(type);
      }
    } catch (error) {
      secureLog.error('[EmailWebhook] Error handling reputation issue:', error);
    }
  }

  /**
   * Handle RFC 8058 One-Click Unsubscribe
   * POST /api/webhooks/email/unsubscribe/:token
   */
  async unsubscribe(req: FastifyRequest, reply: FastifyReply) {
    const { token } = req.params as { token: string };

    secureLog.info(`[EmailWebhook] Unsubscribe request received via RFC 8058`, { token });

    try {
      // Find user by unsubscribe token
      const user = await (prisma as any).user.findFirst({
        where: { unsubscribeToken: token }
      });

      if (!user) {
        secureLog.warn(`[EmailWebhook] Invalid unsubscribe token: ${token}`);
        return reply.status(404).send({ error: 'Invalid token' });
      }

      // Update user preference
      await (prisma as any).user.update({
        where: { id: user.id },
        data: {
          emailOptOut: true,
          emailOptOutDate: new Date(),
        }
      });

      secureLog.info(`[EmailWebhook] User unsubscribed via One-Click: ${user.email}`);

      return reply.status(200).send({ success: true, message: 'Unsubscribed successfully' });
    } catch (error) {
      secureLog.error('[EmailWebhook] Error handling unsubscribe:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  }
}

export const emailWebhookController = new EmailWebhookController();
