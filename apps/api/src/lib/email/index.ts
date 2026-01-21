// ============================================
// EMAIL SERVICE V2 - Multi-Provider Manager
// ============================================

import type {
  IEmailProvider,
  EmailPayload,
  EmailSendResult,
  EmailIntegrationConfig,
  EmailServiceOptions,
  SendOptions,
} from './types';
import { EmailProvider, EmailType } from './types';
import { ResendProvider } from './providers/resend.provider';
import { PostmarkProvider } from './providers/postmark.provider';
import { SMTPProvider } from './providers/smtp.provider';
import { secureLog } from '../../utils/secure-logger';
import { prisma } from '../prisma';
import { encrypt, decrypt } from '../crypto/encryption';
import { emailTemplateEngine } from './templates/engine';
import { addEmailJobV2 } from '../../queues/email.queue';
import { businessMetricsService } from '../../modules/observability/services/business-metrics.service';

/**
 * Email Service V2
 * 
 * Features:
 * - Multi-provider support (Resend, Postmark, AWS SES, SMTP)
 * - Configuration via database (UI-configurable)
 * - Automatic provider selection
 * - Queue support for async sending
 * - Idempotency
 * - Rate limiting
 * - Metrics tracking
 */
export class EmailServiceV2 {
  private static instance: EmailServiceV2;
  private providers: Map<string, IEmailProvider> = new Map();
  private primaryProvider: IEmailProvider | null = null;
  private options: EmailServiceOptions;

  private constructor(options: EmailServiceOptions = {}) {
    this.options = {
      dryRun: options.dryRun || false,
      useQueue: options.useQueue !== false, // Default to true
      maxRetries: options.maxRetries || 3,
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(options?: EmailServiceOptions): EmailServiceV2 {
    if (!EmailServiceV2.instance) {
      EmailServiceV2.instance = new EmailServiceV2(options);
    }
    return EmailServiceV2.instance;
  }

  /**
   * Initialize providers from database
   */
  async initialize(): Promise<void> {
    try {
      // Load active integrations from database
      const integrations = await (prisma as any).emailIntegration.findMany({
        where: { isActive: true },
      });

      if (integrations.length === 0) {
        secureLog.warn('[EmailService] No active email integrations found');
        return;
      }

      this.providers.clear();
      this.primaryProvider = null;

      // Initialize providers
      for (const integration of integrations) {
        const config = this.decryptConfig(integration);
        const provider = this.createProvider(config);

        if (provider) {
          this.providers.set(integration.id, provider);

          if (integration.isPrimary) {
            this.primaryProvider = provider;
          }
        }
      }

      // If no primary explicitly set, take the first active one
      if (!this.primaryProvider && integrations.length > 0) {
        this.primaryProvider = this.providers.get(integrations[0].id) || null;
      }

      secureLog.info('[EmailService] Initialized with providers:', {
        count: this.providers.size,
        hasPrimary: !!this.primaryProvider,
      });
    } catch (error) {
      secureLog.error('[EmailService] Error initializing providers:', error);
      throw error;
    }
  }

  /**
   * Send email
   */
  async send(payload: EmailPayload, options?: SendOptions): Promise<EmailSendResult> {
    console.log('[EmailService] 🚀 send() chamado com payload:', {
      to: payload.to,
      subject: payload.subject,
      provider: payload.provider,
      useQueue: options?.useQueue,
    });

    try {
      // Merge options
      const sendOptions = { ...this.options, ...options };
      console.log('[EmailService] ⚙️ sendOptions:', sendOptions);

      // Initialize if not already (safeguard)
      if (this.providers.size === 0) {
        console.log('[EmailService] 🔄 Inicializando providers...');
        await this.initialize();
      }

      // Validate payload
      console.log('[EmailService] ✅ Validando payload...');
      this.validatePayload(payload);

      // Handle Compliance (Unsubscribe, Opt-out)
      console.log('[EmailService] 📋 Verificando compliance...');
      await this.handleCompliance(payload);

      // Dry run mode (for testing)
      if (this.options.dryRun) {
        console.log('[EmailService] 🧪 DRY RUN mode ativo');
        secureLog.info('[EmailService] DRY RUN - Would send email:', {
          to: payload.to,
          subject: payload.subject,
        });
        return {
          success: true,
          messageId: `dry-run-${Date.now()}`,
          provider: EmailProvider.SMTP,
        };
      }

      // Check if should use queue
      if (sendOptions.useQueue) {
        console.log('[EmailService] 📬 Usando QUEUE para envio');
        return await this.sendViaQueue(payload);
      }

      // Send directly
      console.log('[EmailService] 🎯 Chamando sendDirect()...');
      const result = await this.sendDirect(payload);
      console.log('[EmailService] ✅ sendDirect() retornou:', result);
      return result;
    } catch (error: any) {
      console.error('[EmailService] ❌ ERRO em send():', error);
      secureLog.error('[EmailService] Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Unknown error',
        provider: EmailProvider.SMTP,
      };
    }
  }

  private async sendDirect(payload: EmailPayload): Promise<EmailSendResult> {
    // If no providers are loaded, try to load them
    if (!this.primaryProvider && this.providers.size === 0) {
        await this.initialize();
    }

    // Get provider
    let provider = this.primaryProvider;

    // If a specific provider is requested, find it
    if (payload.provider) {
      const integration = await (prisma as any).emailIntegration.findFirst({
        where: { provider: payload.provider, isActive: true },
      });

      if (integration) {
        const config = this.decryptConfig(integration);
        const specificProvider = this.createProvider(config);
        if (specificProvider) {
          provider = specificProvider;
        }
      }
    }

    if (!provider) {
      throw new Error('Nenhum provedor de e-mail configurado ou ativo');
    }

    // Check rate limits
    await this.checkRateLimits(payload);

    // Generate idempotency key if not provided
    if (!payload.idempotencyKey) {
      payload.idempotencyKey = this.generateIdempotencyKey(payload);
    }

    // Check for duplicate (idempotency)
    const existing = await this.checkIdempotency(payload.idempotencyKey);
    if (existing) {
      secureLog.info('[EmailService] Duplicate email detected (idempotency):', {
        idempotencyKey: payload.idempotencyKey,
      });
      return {
        success: true,
        messageId: (existing as any).messageId || undefined,
        provider: (existing as any).provider as EmailProvider,
      };
    }

    // Check if using template
    if (payload.template) {
      const rendered = await emailTemplateEngine.render({
        templateCode: payload.template,
        data: {
          ...payload.templateData,
          frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
          companyName: 'Kaven',
        },
        locale: (payload.locale as any) || 'pt'
      });

      payload.html = rendered.html;
      payload.subject = rendered.subject;
    }

    // Send via provider
    const startTime = Date.now();
    const result = await provider.send(payload);
    const durationSeconds = (Date.now() - startTime) / 1000;

    console.log('[EmailService] 📧 Email enviado com sucesso:', {
      provider: result.provider,
      messageId: result.messageId,
      success: result.success,
    });

    // Record metrics (Prometheus - in-memory)
    console.log('[EmailService] 📊 Registrando métricas Prometheus...');
    businessMetricsService.trackEmailSent(
      result.provider, 
      payload.template || 'custom', 
      payload.type || EmailType.TRANSACTIONAL
    );
    businessMetricsService.trackEmailDeliveryDuration(result.provider, durationSeconds);
    console.log('[EmailService] ✅ Métricas Prometheus registradas');

    // Persist metrics to database (survives restarts)
    console.log('[EmailService] 💾 INICIANDO persistência no banco...');
    console.log('[EmailService] 📋 Parâmetros para persistência:', {
      provider: result.provider,
      emailType: payload.type || EmailType.TRANSACTIONAL,
      tenantId: payload.tenantId,
      templateCode: payload.template,
    });

    try {
      console.log('[EmailService] 🔄 Importando emailMetricsPersistence...');
      const { emailMetricsPersistence } = await import('./metrics-persistence.service');
      console.log('[EmailService] ✅ emailMetricsPersistence importado com sucesso');
      
      console.log('[EmailService] 🔄 Chamando recordEmailSent...');
      await emailMetricsPersistence.recordEmailSent({
        provider: result.provider as any,
        emailType: (payload.type === EmailType.MARKETING ? EmailType.MARKETING : EmailType.TRANSACTIONAL) as any,
        tenantId: payload.tenantId,
        templateCode: payload.template,
      });
      console.log('[EmailService] ✅ recordEmailSent concluído com sucesso!');
    } catch (error) {
      console.error('[EmailService] ❌ ERRO CRÍTICO ao persistir métricas:', error);
      console.error('[EmailService] 📋 Stack trace:', (error as Error).stack);
      console.error('[EmailService] 📋 Error name:', (error as Error).name);
      console.error('[EmailService] 📋 Error message:', (error as Error).message);
      // Don't fail email send if metrics persistence fails
    }

    console.log('[EmailService] 🎯 Continuando com tracking de evento...');

    // Track event
    if (result.success && result.messageId) {
      await this.trackEvent({
        eventType: 'SENT',
        messageId: result.messageId,
        email: Array.isArray(payload.to) ? payload.to[0] : payload.to,
        emailType: payload.type || EmailType.TRANSACTIONAL,
        template: payload.template,
        userId: payload.userId,
        tenantId: payload.tenantId,
        provider: result.provider,
      });
    }

    console.log('[EmailService] ✅ sendDirect concluído completamente');
    return result;
  }

  /**
   * Send email via queue (asynchronous)
   */
  private async sendViaQueue(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      // Generate idempotency key
      const idempotencyKey = payload.idempotencyKey || this.generateIdempotencyKey(payload);

      // Check for duplicate
      const existing = await this.checkIdempotency(idempotencyKey);
      if (existing) {
        return {
          success: true,
          messageId: (existing as any).messageId || undefined,
          provider: (existing as any).provider as EmailProvider,
        };
      }

      // Add to queue
      const queueItem = await (prisma as any).emailQueue.create({
        data: {
          to: Array.isArray(payload.to) ? payload.to[0] : payload.to,
          cc: payload.cc ? (Array.isArray(payload.cc) ? payload.cc : [payload.cc]) : [],
          bcc: payload.bcc ? (Array.isArray(payload.bcc) ? payload.bcc : [payload.bcc]) : [],
          subject: payload.subject,
          htmlBody: payload.html,
          textBody: payload.text,
          templateCode: payload.template,
          templateData: payload.templateData,
          emailType: payload.type || EmailType.TRANSACTIONAL,
          fromEmail: payload.from,
          fromName: payload.fromName,
          replyTo: payload.replyTo,
          userId: payload.userId,
          tenantId: payload.tenantId,
          idempotencyKey,
          scheduledAt: payload.scheduledAt,
          metadata: payload.metadata,
          status: 'PENDING',
          maxAttempts: this.options.maxRetries || 3,
          headers: payload.headers as any,
        } as any,
      });

      secureLog.info('[EmailService] Email queued:', {
        queueId: queueItem.id,
        to: payload.to,
        subject: payload.subject,
      });

      // Add to BullMQ for processing
      await addEmailJobV2(queueItem.id);

      return {
        success: true,
        messageId: queueItem.id,
        provider: EmailProvider.SMTP,
      };
    } catch (error: any) {
      secureLog.error('[EmailService] Error queueing email:', error);
      return {
        success: false,
        error: error.message,
        provider: EmailProvider.SMTP,
      };
    }
  }

  /**
   * Validate email payload
   */
  private validatePayload(payload: EmailPayload): void {
    if (!payload.to || (Array.isArray(payload.to) && payload.to.length === 0)) {
      throw new Error('Destinatário é obrigatório');
    }

    if (!payload.subject) {
      throw new Error('Assunto do e-mail é obrigatório');
    }

    if (!payload.html && !payload.text && !payload.template) {
      throw new Error('E-mail deve ter html, texto ou template');
    }

    // Check payload size (1MB limit for server actions)
    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > 1024 * 1024) {
      throw new Error('Payload do e-mail excede limite de 1MB');
    }
  }

  /**
   * Check rate limits
   */
  private async checkRateLimits(payload: EmailPayload): Promise<void> {
    // Get primary integration config
    const integration = await (prisma as any).emailIntegration.findFirst({
      where: { isPrimary: true },
    });

    if (!integration) return;

    // Check hourly limit
    if (integration.hourlyLimit) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const sentLastHour = await (prisma as any).emailEvent.count({
        where: {
          eventType: 'SENT',
          createdAt: { gte: oneHourAgo },
          ...(payload.tenantId && { tenantId: payload.tenantId }),
        },
      });

      if (sentLastHour >= integration.hourlyLimit) {
        throw new Error('Hourly email limit exceeded');
      }
    }

    // Check daily limit
    if (integration.dailyLimit) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const sentLastDay = await (prisma as any).emailEvent.count({
        where: {
          eventType: 'SENT',
          createdAt: { gte: oneDayAgo },
          ...(payload.tenantId && { tenantId: payload.tenantId }),
        },
      });

      if (sentLastDay >= integration.dailyLimit) {
        throw new Error('Daily email limit exceeded');
      }
    }
  }

  /**
   * Check idempotency (prevent duplicate sends)
   * @returns Email queue record if found, null otherwise
   */
  private async checkIdempotency(
    idempotencyKey: string
  ): Promise<{ messageId: string; provider: string } | null> {
    // Note: Using 'any' for Prisma client due to dynamic model access
    return await (prisma as any).emailQueue.findUnique({
      where: { idempotencyKey },
      select: { messageId: true, provider: true },
    });
  }

  /**
   * Track email event
   */
  private async trackEvent(data: {
    eventType: string;
    messageId: string;
    email: string;
    emailType: EmailType;
    template?: string;
    userId?: string;
    tenantId?: string;
    provider: EmailProvider;
  }): Promise<void> {
    try {
      await (prisma as any).emailEvent.create({
        data: {
          eventType: data.eventType as any,
          messageId: data.messageId,
          email: data.email,
          emailType: data.emailType as any,
          template: data.template,
          userId: data.userId,
          tenantId: data.tenantId,
          provider: data.provider as any,
        },
      });
    } catch (error) {
      secureLog.error('[EmailService] Error tracking event:', error);
    }
  }

  /**
   * Handle legal compliance (Opt-out and Unsubscribe)
   */
  private async handleCompliance(payload: EmailPayload): Promise<void> {
    if (!payload.userId) return;

    // Fetch user compliance data
    const user = await (prisma as any).user.findUnique({
      where: { id: payload.userId },
      select: { 
        emailOptOut: true, 
        unsubscribeToken: true,
        email: true,
      },
    });

    if (!user) return;

    // Check if user has opted out
    if (user.emailOptOut) {
      secureLog.info('[EmailService] Blocking email due to opt-out:', {
        userId: payload.userId,
        email: user.email,
      });
      throw new Error('Usuário optou por não receber e-mails');
    }

    // Ensure Unsubscribe Token exists
    let token = user.unsubscribeToken;
    if (!token) {
      token = Buffer.from(`${payload.userId}-${Date.now()}`).toString('hex');
      await (prisma as any).user.update({
        where: { id: payload.userId },
        data: { unsubscribeToken: token } as any,
      });
    }

    // Inject Unsubscribe URL into templateData
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const unsubscribeUrl = `${frontendUrl}/unsubscribe?token=${token}`;

    payload.templateData = {
      ...payload.templateData,
      unsubscribeUrl,
    };

    // Add RFC 8058 compliant headers
    payload.headers = {
      ...(payload.headers || {}),
      'List-Unsubscribe': `<${frontendUrl}/api/webhooks/email/unsubscribe/${token}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    };
  }

  /**
   * Generate idempotency key
   */
  private generateIdempotencyKey(payload: EmailPayload): string {
    const data = `${payload.to}-${payload.subject}-${payload.template || 'custom'}-${Date.now()}`;
    return Buffer.from(data).toString('base64');
  }

  /**
   * Create provider instance
   */
  private createProvider(config: EmailIntegrationConfig): IEmailProvider | null {
    try {
      switch (config.provider) {
        case EmailProvider.RESEND:
          return new ResendProvider(config);

        case EmailProvider.POSTMARK:
          return new PostmarkProvider(config);

        case EmailProvider.SMTP:
          return new SMTPProvider(config);

        default:
          secureLog.warn('[EmailService] Unknown provider:', config.provider);
          return null;
      }
    } catch (error) {
      secureLog.error('[EmailService] Error creating provider:', error);
      return null;
    }
  }

  /**
   * Decrypt integration config
   * @param integration - Raw integration from database
   * @returns Decrypted configuration
   * @note Using 'any' for integration parameter due to Prisma dynamic model access
   */
  private decryptConfig(integration: any): EmailIntegrationConfig {
    return {
      ...integration,
      apiKey: integration.apiKey ? decrypt(integration.apiKey) : undefined,
      apiSecret: integration.apiSecret ? decrypt(integration.apiSecret) : undefined,
      webhookSecret: integration.webhookSecret ? decrypt(integration.webhookSecret) : undefined,
      smtpPassword: integration.smtpPassword ? decrypt(integration.smtpPassword) : undefined,
    };
  }

  /**
   * Reload providers (call after updating config in UI)
   */
  async reload(): Promise<void> {
    await this.initialize();
  }
}

// Export singleton instance
export const emailServiceV2 = EmailServiceV2.getInstance();
