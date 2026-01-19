// ============================================
// EMAIL SERVICE V2 - Multi-Provider Support
// ============================================

import type { Locale } from '@kaven/shared';

/**
 * Email Provider Types
 */
export enum EmailProvider {
  POSTMARK = 'POSTMARK',
  RESEND = 'RESEND',
  AWS_SES = 'AWS_SES',
  SMTP = 'SMTP',
}

export enum EmailType {
  TRANSACTIONAL = 'TRANSACTIONAL',  // Emails transacionais (confirmação, reset senha, etc)
  MARKETING = 'MARKETING',          // Emails de marketing (newsletters, promoções)
  BILLING = 'BILLING',              // Emails de faturamento (faturas, cobranças, recibos)
  TEST = 'TEST',                    // Emails de teste (desenvolvimento, QA)
  NOTIFICATION = 'NOTIFICATION',    // Notificações do sistema (alertas, avisos)
  SECURITY = 'SECURITY',            // Alertas de segurança (login suspeito, mudança de senha)
}

export enum EmailEventType {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  BOUNCE = 'BOUNCE',
  COMPLAINT = 'COMPLAINT',
  OPEN = 'OPEN',
  CLICK = 'CLICK',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export enum BounceType {
  HARD = 'HARD',
  SOFT = 'SOFT',
  TRANSIENT = 'TRANSIENT',
}

/**
 * Email Payload Interface
 */
export interface EmailPayload {
  // Recipients
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];

  // Content
  subject: string;
  html?: string;
  text?: string;
  template?: string; // Template code
  templateData?: Record<string, any>;

  // Configuration
  type?: EmailType;
  from?: string;
  fromName?: string;
  replyTo?: string;
  locale?: Locale;

  // Tracking
  userId?: string;
  tenantId?: string;

  // Scheduling
  scheduledAt?: Date;

  // Headers (RFC 8058 support)
  metadata?: Record<string, any>;
  idempotencyKey?: string;
  provider?: EmailProvider;
  headers?: Record<string, any>;
}

/**
 * Email Provider Interface
 */
export interface IEmailProvider {
  /**
    * Send email via provider
    */
  send(payload: EmailPayload): Promise<EmailSendResult>;

  /**
    * Validate webhook signature
    */
  validateWebhook(rawBody: string, signature: string): boolean;

  /**
    * Parse webhook event
    */
  parseWebhookEvent(body: any): EmailWebhookEvent | null;
  
  /**
   * Health check - validates credentials and tests connectivity
   * @returns Object with status and optional error message
   */
  healthCheck(): Promise<{
    healthy: boolean;
    message?: string;
    details?: Record<string, any>;
  }>;
}

/**
 * Email Send Result
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: EmailProvider;
}

/**
 * Email Webhook Event
 */
export interface EmailWebhookEvent {
  eventType: EmailEventType;
  messageId: string;
  email: string;
  timestamp: Date;
  bounceType?: BounceType;
  bounceReason?: string;
  complaintFeedbackType?: string;
  userAgent?: string;
  ipAddress?: string;
  linkClicked?: string;
  metadata?: Record<string, any>;
}

/**
 * Email Integration Configuration
 */
export interface EmailIntegrationConfig {
  id: string;
  provider: EmailProvider;
  isActive: boolean;
  isPrimary: boolean;

  // Provider-specific credentials
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;

  // SMTP Configuration
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPassword?: string;

  // Domain Configuration
  transactionalDomain?: string;
  marketingDomain?: string;
  fromName?: string;
  fromEmail?: string;

  // Message Streams (Postmark)
  transactionalStream?: string;
  marketingStream?: string;

  // Features
  trackOpens?: boolean;
  trackClicks?: boolean;
  enableDkim?: boolean;
  enableBimi?: boolean;

  // Rate Limiting
  dailyLimit?: number;
  hourlyLimit?: number;

  // Metadata
  metadata?: Record<string, any>;
}

/**
 * Email Template
 */
export interface EmailTemplate {
  code: string;
  name: string;
  type: EmailType;
  subjectPt: string;
  subjectEn?: string;
  htmlContentPt: string;
  htmlContentEn?: string;
  textContentPt?: string;
  textContentEn?: string;
  variables?: string[];
}

/**
 * Email Queue Item
 */
export interface EmailQueueItem {
  id: string;
  to: string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlBody?: string;
  textBody?: string;
  templateCode?: string;
  templateData?: Record<string, any>;
  emailType: EmailType;
  provider?: EmailProvider;
  status: 'PENDING' | 'PROCESSING' | 'SENT' | 'FAILED' | 'RETRY';
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  messageId?: string;
  userId?: string;
  tenantId?: string;
  idempotencyKey?: string;
  scheduledAt?: Date;
  sentAt?: Date;
  metadata?: Record<string, any>;
  headers?: Record<string, any>;
}

/**
 * Email Metrics
 */
export interface EmailMetrics {
  date: Date;
  hour?: number;
  tenantId?: string;
  emailType?: EmailType;
  provider?: EmailProvider;
  templateCode?: string;

  // Counts
  sentCount: number;
  deliveredCount: number;
  bounceCount: number;
  hardBounceCount: number;
  softBounceCount: number;
  complaintCount: number;
  openCount: number;
  uniqueOpenCount: number;
  clickCount: number;
  uniqueClickCount: number;
  unsubscribeCount: number;

  // Rates
  deliveryRate?: number;
  bounceRate?: number;
  openRate?: number;
  clickRate?: number;
}

/**
 * Email Service Options
 */
export interface EmailServiceOptions {
  dryRun?: boolean; // Don't actually send emails (for testing)
  useQueue?: boolean; // Send via queue (async) or directly (sync)
  maxRetries?: number; // Max retry attempts for failed sends
}

/**
 * Provider Factory Options
 */
export interface ProviderFactoryOptions {
  provider: EmailProvider;
  config: EmailIntegrationConfig;
}

/**
 * Sending options for a specific message
 */
export interface SendOptions {
  useQueue?: boolean;
}
