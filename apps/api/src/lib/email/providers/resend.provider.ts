// ============================================
// RESEND EMAIL PROVIDER
// ============================================

import { Resend } from 'resend';
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
 * Resend Email Provider
 * 
 * Docs: https://resend.com/docs
 * Features:
 * - Modern API with excellent DX
 * - Built-in DKIM signing
 * - Webhook support for events
 * - React Email template support
 */
export class ResendProvider implements IEmailProvider {
  private client: Resend;
  private config: EmailIntegrationConfig;

  constructor(config: EmailIntegrationConfig) {
    if (!config.apiKey) {
      throw new Error('Resend API key is required');
    }

    this.config = config;
    this.client = new Resend(config.apiKey);
  }

  /**
   * Send email via Resend
   */
  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      // Determine domain based on email type
      const domain = payload.type === EmailType.MARKETING
        ? this.config.marketingDomain
        : this.config.transactionalDomain;

      // Construct from address
      const fromEmail = payload.from || this.config.fromEmail || `noreply@${domain}`;
      const fromName = payload.fromName || this.config.fromName || 'Kaven Platform';
      const from = `${fromName} <${fromEmail}>`;

      // Prepare recipients
      const to = Array.isArray(payload.to) ? payload.to : [payload.to];
      const cc = payload.cc ? (Array.isArray(payload.cc) ? payload.cc : [payload.cc]) : undefined;
      const bcc = payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc : [payload.bcc]) : undefined;

      // Send email
      const result = await this.client.emails.send({
        from,
        to,
        cc,
        bcc,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo: payload.replyTo,
        tags: [
          { name: 'type', value: payload.type || EmailType.TRANSACTIONAL },
          { name: 'template', value: payload.template || 'custom' },
          ...(payload.tenantId ? [{ name: 'tenant_id', value: payload.tenantId }] : []),
          ...(payload.userId ? [{ name: 'user_id', value: payload.userId }] : []),
        ],
        headers: {
          'X-Idempotency-Key': payload.idempotencyKey || this.generateIdempotencyKey(payload),
          ...(payload.metadata && { 'X-Metadata': JSON.stringify(payload.metadata) }),
        },
      });

      if (result.error) {
        secureLog.error('[Resend] Error sending email:', result.error);
        return {
          success: false,
          error: result.error.message,
          provider: EmailProvider.RESEND,
        };
      }

      secureLog.info('[Resend] Email sent successfully:', {
        messageId: result.data?.id,
        to: payload.to,
        subject: payload.subject,
      });

      return {
        success: true,
        messageId: result.data?.id,
        provider: EmailProvider.RESEND,
      };
    } catch (error: any) {
      secureLog.error('[Resend] Exception sending email:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
        provider: EmailProvider.RESEND,
      };
    }
  }

  /**
   * Validate Resend webhook signature
   * 
   * Resend uses HMAC SHA-256 for webhook validation
   * Signature is sent in the 'svix-signature' header
   */
  validateWebhook(rawBody: string, signature: string): boolean {
    if (!this.config.webhookSecret) {
      secureLog.warn('[Resend] Webhook secret not configured');
      return false;
    }

    try {
      // Resend uses Svix for webhooks
      // Format: v1,timestamp,signature
      const parts = signature.split(',');
      if (parts.length !== 3) {
        return false;
      }

      const [version, timestamp, sig] = parts;
      
      // Check timestamp (prevent replay attacks - 5 min window)
      const now = Math.floor(Date.now() / 1000);
      const timestampNum = parseInt(timestamp, 10);
      if (Math.abs(now - timestampNum) > 300) {
        secureLog.warn('[Resend] Webhook timestamp too old');
        return false;
      }

      // Compute expected signature
      const signedPayload = `${timestamp}.${rawBody}`;
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(signedPayload)
        .digest('base64');

      // Timing-safe comparison
      return crypto.timingSafeEqual(
        Buffer.from(sig),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      secureLog.error('[Resend] Error validating webhook:', error);
      return false;
    }
  }

  /**
   * Parse Resend webhook event
   * 
   * Event types: email.sent, email.delivered, email.bounced, email.complained, email.opened, email.clicked
   */
  parseWebhookEvent(body: any): EmailWebhookEvent | null {
    try {
      const { type, data } = body;

      // Map Resend event types to our EmailEventType
      const eventTypeMap: Record<string, EmailEventType> = {
        'email.sent': 'SENT' as EmailEventType,
        'email.delivered': 'DELIVERED' as EmailEventType,
        'email.bounced': 'BOUNCE' as EmailEventType,
        'email.complained': 'COMPLAINT' as EmailEventType,
        'email.opened': 'OPEN' as EmailEventType,
        'email.clicked': 'CLICK' as EmailEventType,
      };

      const eventType = eventTypeMap[type];
      if (!eventType) {
        secureLog.warn('[Resend] Unknown event type:', type);
        return null;
      }

      // Extract common fields
      const event: EmailWebhookEvent = {
        eventType,
        messageId: data.email_id || data.id,
        email: data.to || data.email,
        timestamp: new Date(data.created_at || Date.now()),
      };

      // Add bounce-specific fields
      if (eventType === 'BOUNCE') {
        event.bounceType = this.mapBounceType(data.bounce_type);
        event.bounceReason = data.bounce_reason || data.description;
      }

      // Add complaint-specific fields
      if (eventType === 'COMPLAINT') {
        event.complaintFeedbackType = data.feedback_type;
      }

      // Add tracking fields
      if (eventType === 'OPEN' || eventType === 'CLICK') {
        event.userAgent = data.user_agent;
        event.ipAddress = data.ip_address;
      }

      // Add click-specific fields
      if (eventType === 'CLICK') {
        event.linkClicked = data.link || data.url;
      }

      // Add metadata
      event.metadata = {
        tags: data.tags,
        headers: data.headers,
      };

      return event;
    } catch (error) {
      secureLog.error('[Resend] Error parsing webhook event:', error);
      return null;
    }
  }

  /**
   * Map Resend bounce type to our BounceType enum
   */
  private mapBounceType(resendBounceType?: string): BounceType {
    if (!resendBounceType) return 'SOFT' as BounceType;

    const lowerType = resendBounceType.toLowerCase();
    
    if (lowerType.includes('hard') || lowerType.includes('permanent')) {
      return 'HARD' as BounceType;
    }
    
    if (lowerType.includes('transient') || lowerType.includes('temporary')) {
      return 'TRANSIENT' as BounceType;
    }
    
    return 'SOFT' as BounceType;
  }

  /**
   * Health check - validates API key and tests connectivity
   */
  async healthCheck(): Promise<{ healthy: boolean; message?: string; details?: Record<string, any> }> {
    try {
      // Check if API key exists
      if (!this.config.apiKey) {
        return {
          healthy: false,
          message: 'API key not configured',
          details: { reason: 'missing_credentials' },
        };
      }

      // Test API key by fetching domains (lightweight API call)
      // This validates the key without sending an actual email
      const response = await fetch('https://api.resend.com/domains', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return {
          healthy: false,
          message: `API key validation failed: ${response.statusText}`,
          details: {
            status: response.status,
            error: error,
            reason: response.status === 401 ? 'invalid_credentials' : 'api_error',
          },
        };
      }

      const data = await response.json();
      
      return {
        healthy: true,
        message: 'Resend API key is valid and working',
        details: {
          domains: data.data?.length || 0,
          verified_domains: data.data?.filter((d: any) => d.status === 'verified').length || 0,
        },
      };
    } catch (error: any) {
      secureLog.error('[Resend] Health check failed:', error);
      return {
        healthy: false,
        message: `Health check failed: ${error.message}`,
        details: { reason: 'network_error', error: error.message },
      };
    }
  }

  /**
   * Generate idempotency key for email
   */
  private generateIdempotencyKey(payload: EmailPayload): string {
    const data = `${payload.to}-${payload.subject}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
