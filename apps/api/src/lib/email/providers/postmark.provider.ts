// ============================================
// POSTMARK EMAIL PROVIDER
// ============================================

import * as postmark from 'postmark';
import type {
  IEmailProvider,
  EmailPayload,
  EmailSendResult,
  EmailWebhookEvent,
  EmailIntegrationConfig,
  EmailEventType,
  BounceType,
} from '../types';
import { EmailProvider, EmailType } from '../types';
import { secureLog } from '../../../utils/secure-logger';
import crypto from 'crypto';

/**
 * Postmark Email Provider
 * 
 * Docs: https://postmarkapp.com/developer
 * Features:
 * - Industry-leading deliverability (83%+ inbox placement)
 * - Automatic DKIM signing
 * - Message streams (transactional vs broadcast)
 * - Comprehensive webhook support
 * - DMARC monitoring
 */
export class PostmarkProvider implements IEmailProvider {
  private client: postmark.ServerClient;
  private config: EmailIntegrationConfig;

  constructor(config: EmailIntegrationConfig) {
    if (!config.apiKey) {
      throw new Error('Postmark server token is required');
    }

    this.config = config;
    this.client = new postmark.ServerClient(config.apiKey);
  }

  /**
   * Send email via Postmark
   */
  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      // Determine message stream based on email type
      const messageStream = payload.type === EmailType.MARKETING
        ? (this.config.marketingStream || 'broadcasts')
        : (this.config.transactionalStream || 'outbound');

      // Determine domain based on email type
      const domain = payload.type === EmailType.MARKETING
        ? this.config.marketingDomain
        : this.config.transactionalDomain;

      // Construct from address
      const fromEmail = payload.from || this.config.fromEmail || `noreply@${domain}`;
      const fromName = payload.fromName || this.config.fromName || 'Kaven Platform';
      const from = `${fromName} <${fromEmail}>`;

      // Prepare recipients
      const to = Array.isArray(payload.to) ? payload.to.join(',') : payload.to;
      const cc = payload.cc ? (Array.isArray(payload.cc) ? payload.cc.join(',') : payload.cc) : undefined;
      const bcc = payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc.join(',') : payload.bcc) : undefined;

      // Send email
      const result = await this.client.sendEmail({
        From: from,
        To: to,
        Cc: cc,
        Bcc: bcc,
        Subject: payload.subject,
        HtmlBody: payload.html,
        TextBody: payload.text,
        ReplyTo: payload.replyTo,
        MessageStream: messageStream,
        Tag: payload.template || 'custom',
        Metadata: {
          type: payload.type || EmailType.TRANSACTIONAL,
          tenantId: payload.tenantId || '',
          userId: payload.userId || '',
          idempotencyKey: payload.idempotencyKey || this.generateIdempotencyKey(payload),
          ...(payload.metadata || {}),
        },
        TrackOpens: this.config.trackOpens !== false,
        TrackLinks: (this.config.trackClicks !== false ? 'HtmlAndText' : 'None') as any,
      });

      secureLog.info('[Postmark] Email sent successfully:', {
        messageId: result.MessageID,
        to: payload.to,
        subject: payload.subject,
      });

      return {
        success: true,
        messageId: result.MessageID,
        provider: EmailProvider.POSTMARK,
      };
    } catch (error: any) {
      secureLog.error('[Postmark] Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
        provider: EmailProvider.POSTMARK,
      };
    }
  }

  /**
   * Validate Postmark webhook signature
   * 
   * Postmark uses HMAC SHA-256 for webhook validation
   * Signature is sent in the 'X-Postmark-Signature' header
   */
  validateWebhook(rawBody: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      secureLog.warn('[Postmark] Webhook secret not configured');
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(rawBody)
        .digest('base64');

      // Timing-safe comparison
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      secureLog.error('[Postmark] Error validating webhook:', error);
      return false;
    }
  }

  /**
   * Parse Postmark webhook event
   * 
   * Event types: Bounce, SpamComplaint, Delivery, Open, Click, SubscriptionChange
   */
  parseWebhookEvent(body: any): EmailWebhookEvent | null {
    try {
      const { RecordType } = body;

      // Map Postmark record types to our EmailEventType
      const eventTypeMap: Record<string, EmailEventType> = {
        'Delivery': 'DELIVERED' as EmailEventType,
        'Bounce': 'BOUNCE' as EmailEventType,
        'SpamComplaint': 'COMPLAINT' as EmailEventType,
        'Open': 'OPEN' as EmailEventType,
        'Click': 'CLICK' as EmailEventType,
        'SubscriptionChange': 'UNSUBSCRIBE' as EmailEventType,
      };

      const eventType = eventTypeMap[RecordType];
      if (!eventType) {
        secureLog.warn('[Postmark] Unknown record type:', RecordType);
        return null;
      }

      // Extract common fields
      const event: EmailWebhookEvent = {
        eventType,
        messageId: body.MessageID,
        email: body.Email || body.Recipient,
        timestamp: new Date(body.ReceivedAt || body.BouncedAt || Date.now()),
      };

      // Add bounce-specific fields
      if (eventType === 'BOUNCE') {
        event.bounceType = this.mapBounceType(body.Type, body.TypeCode);
        event.bounceReason = body.Description || body.Details;
      }

      // Add complaint-specific fields
      if (eventType === 'COMPLAINT') {
        event.complaintFeedbackType = body.Type;
      }

      // Add tracking fields
      if (eventType === 'OPEN' || eventType === 'CLICK') {
        event.userAgent = body.UserAgent;
        event.ipAddress = body.Geo?.IP;
      }

      // Add click-specific fields
      if (eventType === 'CLICK') {
        event.linkClicked = body.OriginalLink;
      }

      // Add metadata
      event.metadata = {
        tag: body.Tag,
        metadata: body.Metadata,
        serverID: body.ServerID,
      };

      return event;
    } catch (error) {
      secureLog.error('[Postmark] Error parsing webhook event:', error);
      return null;
    }
  }

  /**
   * Map Postmark bounce type to our BounceType enum
   * 
   * Postmark TypeCode:
   * - 1 = Hard bounce
   * - 2 = Soft bounce (message too large, mailbox full, etc.)
   * - 16 = Soft bounce (DNS error)
   * - 32 = Soft bounce (spam notification)
   * - 64 = Soft bounce (spam blocking)
   * - 128 = Soft bounce (auto-responder)
   * - 256 = Soft bounce (transient)
   * - 512 = Soft bounce (DNS error)
   * - 1024 = Soft bounce (open relay)
   * - 2048 = Soft bounce (unknown)
   * - 4096 = Soft bounce (soft)
   * - 8192 = Soft bounce (virus notification)
   * - 16384 = Soft bounce (challenge verification)
   * - 32768 = Soft bounce (bad email address)
   * - 65536 = Soft bounce (spam complaint)
   * - 131072 = Soft bounce (manually deactivated)
   * - 262144 = Soft bounce (unconfirmed)
   * - 524288 = Soft bounce (blocked)
   * - 1048576 = Soft bounce (SMTP API error)
   * - 2097152 = Soft bounce (InboundError)
   * - 4194304 = Soft bounce (DMARCPolicy)
   * - 8388608 = Soft bounce (TemplateRenderingFailed)
   */
  private mapBounceType(type: string, typeCode: number): BounceType {
    // Hard bounce
    if (typeCode === 1) {
      return 'HARD' as BounceType;
    }

    // Transient bounces (temporary issues)
    if ([16, 256, 512].includes(typeCode)) {
      return 'TRANSIENT' as BounceType;
    }

    // All others are soft bounces
    return 'SOFT' as BounceType;
  }

  /**
   * Generate idempotency key for email
   */
  private generateIdempotencyKey(payload: EmailPayload): string {
    const data = `${payload.to}-${payload.subject}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
