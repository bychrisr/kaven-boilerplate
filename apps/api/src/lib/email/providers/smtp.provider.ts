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
