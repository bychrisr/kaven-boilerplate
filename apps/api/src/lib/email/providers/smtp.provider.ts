import nodemailer from 'nodemailer';
import type { 
  IEmailProvider, 
  EmailPayload, 
  EmailSendResult, 
  EmailIntegrationConfig,
  EmailWebhookEvent
} from '../types';
import { EmailProvider, EmailEventType } from '../types';
import { secureLog } from '../../../utils/secure-logger';

export class SMTPProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;
  public provider = EmailProvider.SMTP;

  constructor(private config: EmailIntegrationConfig) {
    const options: any = {
      host: config.smtpHost || 'localhost',
      port: config.smtpPort || 587,
      secure: config.smtpSecure || false,
      tls: {
        rejectUnauthorized: false,
      }
    };

    if (config.smtpUser) {
      options.auth = {
        user: config.smtpUser,
        pass: config.smtpPassword || '',
      };
    }

    this.transporter = nodemailer.createTransport(options);
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${payload.fromName || this.config.fromName || 'Kaven'}" <${payload.from || this.config.fromEmail}>`,
        to: Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
        cc: payload.cc,
        bcc: payload.bcc,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        headers: payload.headers,
        replyTo: payload.replyTo,
      });

      return {
        success: true,
        messageId: info.messageId,
        provider: EmailProvider.SMTP,
      };
    } catch (error: any) {
      secureLog.error('[SMTPProvider.send]', error);
      return {
        success: false,
        error: error.message,
        provider: EmailProvider.SMTP,
      };
    }
  }

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      secureLog.error('[SMTPProvider.verify]', error);
      return false;
    }
  }

  /**
   * Health check - validates SMTP configuration and tests connectivity
   */
  async healthCheck(): Promise<{ healthy: boolean; message?: string; details?: Record<string, any> }> {
    try {
      // Check if SMTP host is configured
      if (!this.config.smtpHost) {
        return {
          healthy: false,
          message: 'SMTP host not configured',
          details: { reason: 'missing_configuration' },
        };
      }

      // Test SMTP connection
      const isVerified = await this.verify();
      
      if (!isVerified) {
        return {
          healthy: false,
          message: 'SMTP connection failed',
          details: {
            reason: 'connection_failed',
            host: this.config.smtpHost,
            port: this.config.smtpPort,
          },
        };
      }

      return {
        healthy: true,
        message: 'SMTP connection successful',
        details: {
          host: this.config.smtpHost,
          port: this.config.smtpPort,
          secure: this.config.smtpSecure,
          auth: !!this.config.smtpUser,
        },
      };
    } catch (error: any) {
      secureLog.error('[SMTPProvider.healthCheck]', error);
      return {
        healthy: false,
        message: `Health check failed: ${error.message}`,
        details: { reason: 'error', error: error.message },
      };
    }
  }

  validateWebhook(rawBody: string, signature: string): boolean {
    return true; 
  }

  parseWebhookEvent(body: any): EmailWebhookEvent | null {
    return {
      eventType: EmailEventType.SENT,
      messageId: 'unknown',
      email: 'unknown',
      timestamp: new Date(),
    };
  }
}
