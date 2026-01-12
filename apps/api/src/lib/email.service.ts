import { emailTheme } from './email-theme';
import { getTranslations, interpolate, type Locale } from '@kaven/shared';
import nodemailer, { Transporter } from 'nodemailer';
import type { User, Invoice } from '@prisma/client';
import { env } from '../config/env';
import { secureLog } from '../utils/secure-logger';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Email Service - Envio de emails transacionais
 * 
 * Suporta:
 * - Welcome emails
 * - Email verification
 * - Password reset
 * - Invoice notifications
 * - Invite emails
 * 
 * Usa Nodemailer com SMTP (MailHog em Dev) ou SendGrid
 * Usa Handlebars para templates
 */

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  } | undefined;
}

export class EmailService {
  private transporter: Transporter;
  private from: string;
  private isConfigured: boolean;
  private templatesDir: string;

  constructor() {
    this.from = env.EMAIL_FROM;
    this.templatesDir = path.join(__dirname, '../templates/emails');
    this.isConfigured = this.checkConfiguration();
    
    // Register partials (layout)
    this.registerPartials();

    if (this.isConfigured) {
      this.transporter = this.createTransporter();
    } else {
      secureLog.warn('Email service não configurado corretamente. Tentando usar MailHog como fallback...');
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
      });
    }
  }

  private registerPartials() {
    try {
      // Register Layout
      const layoutPath = path.join(this.templatesDir, 'layouts/main.hbs');
      const layoutSource = fs.readFileSync(layoutPath, 'utf-8');
      handlebars.registerPartial('main', layoutSource);

      // Register UI Partials
      const partials = ['header', 'footer', 'button', 'alert'];
      for (const partial of partials) {
        const partialPath = path.join(this.templatesDir, `partials/${partial}.hbs`);
        const partialSource = fs.readFileSync(partialPath, 'utf-8');
        handlebars.registerPartial(partial, partialSource);
      }
    } catch (error) {
      secureLog.error('Erro ao registrar layouts/partials:', error);
    }
  }

  /**
   * Renderiza template Handlebars
   */
  private async renderTemplate(
    templateName: string, 
    context: Record<string, any>, 
    locale: Locale = 'pt'
  ): Promise<string> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      
      // Keep renderTemplate async as it's per-request
      const templateSource = fs.readFileSync(templatePath, 'utf-8'); 
      const template = handlebars.compile(templateSource);
      
      // Get translations for locale
      const translations = getTranslations(locale);

      // Create translation helper
      // Handlebars passes named parameters as 'hash' in the options object (last argument)
      const t = function(this: any, key: string, options?: any) {
         // Deep access to key, e.g. "emails.welcome.title"
         const keys = key.split('.');
         let value: any = translations;
         for (const k of keys) {
           value = value?.[k];
         }
         if (typeof value === 'string') {
           // options.hash contains named parameters like inviterName=inviterName
           const params = options?.hash || {};
           return interpolate(value, params);
         }
         return key; // Fallback to key if not found
      };

      // Register local helper for this render
      handlebars.registerHelper('t', t);
      handlebars.registerHelper('eq', (a, b) => a === b);
      handlebars.registerHelper('concat', (...args) => args.slice(0, -1).join(''));

      // Inject theme and translations into context
      return template({ 
        ...context, 
        theme: emailTheme,
        locale,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      secureLog.error(`Erro ao renderizar template ${templateName}:`, error);
      throw new Error(`Falha ao renderizar template de email: ${templateName}`);
    }
  }

  /**
   * Verifica se variáveis de ambiente estão configuradas
   */
  private checkConfiguration(): boolean {
    // Se estiver em desenvolvimento, permite usar defaults do MailHog
    if (env.NODE_ENV === 'development') {
      return true;
    }

    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
      secureLog.warn('Variáveis de email (SMTP) faltando em produção.');
      return false;
    }
    return true;
  }

  /**
   * Cria transporter do Nodemailer
   */
  private createTransporter(): Transporter {
    // Configuração padrão para MailHog se vars não existirem e for Dev
    const host = env.SMTP_HOST || (env.NODE_ENV === 'development' ? 'localhost' : '');
    const port = env.SMTP_PORT || (env.NODE_ENV === 'development' ? 1025 : 587);
    const secure = env.SMTP_SECURE || false;
    
    // Auth apenas se usuário/senha existirem
    let auth = undefined;
    if (env.SMTP_USER && env.SMTP_PASS) {
      auth = {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      };
    }

    const config: EmailConfig = {
      host,
      port: Number(port),
      secure: Boolean(secure),
      auth,
    };

    secureLog.info('Configurando email transporter:', { host, port, secure });

    return nodemailer.createTransport(config);
  }

  /**
   * Envia email genérico
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.from,
        to,
        subject,
        html,
      });

      secureLog.info('Email enviado:', { to, subject, messageId: info.messageId });
    } catch (error) {
      secureLog.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email');
    }
  }

  /**
   * Envia email de boas-vindas
   */
  async sendWelcomeEmail(user: Pick<User, 'email' | 'name'>, locale: Locale = 'pt'): Promise<void> {
    const translations = getTranslations(locale);
    const subject = translations.emails.welcome.subject;
    
    const html = await this.renderTemplate('welcome', {
      name: user.name,
      frontendUrl: env.FRONTEND_URL,
    }, locale);
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de verificação
   */
  async sendVerificationEmail(user: Pick<User, 'email' | 'name'>, token: string, locale: Locale = 'pt'): Promise<void> {
    const translations = getTranslations(locale);
    const subject = translations.emails.verification.subject;
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = await this.renderTemplate('verification', {
      name: user.name,
      verificationUrl,
    }, locale);
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de reset de senha
   */
  async sendPasswordResetEmail(user: Pick<User, 'email' | 'name'>, token: string, locale: Locale = 'pt'): Promise<void> {
    const translations = getTranslations(locale);
    const subject = translations.emails.resetPassword.subject;
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = await this.renderTemplate('reset-password', {
      name: user.name,
      resetUrl,
    }, locale);
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de invoice
   */
  async sendInvoiceEmail(
    user: Pick<User, 'email' | 'name'>,
    invoice: Pick<Invoice, 'invoiceNumber' | 'amountDue' | 'dueDate'>,
    locale: Locale = 'pt'
  ): Promise<void> {
    const translations = getTranslations(locale);
    const subject = interpolate(translations.emails.invoice.subject, { invoiceNumber: invoice.invoiceNumber });
    
    // Formatting currency and date based on locale
    const currencyLocale = locale === 'pt' ? 'pt-BR' : 'en-US';
    const currency = locale === 'pt' ? 'BRL' : 'USD';

    const formattedAmount = new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency: currency,
    }).format(Number(invoice.amountDue));

    const formattedDate = new Intl.DateTimeFormat(currencyLocale).format(new Date(invoice.dueDate));

    const html = await this.renderTemplate('invoice', {
      name: user.name,
      invoiceNumber: invoice.invoiceNumber,
      amount: formattedAmount, // Using 'amount' simplified key for template
      dueDate: formattedDate, // Using 'dueDate' simplified key for template
      frontendUrl: env.FRONTEND_URL,
    }, locale);
    
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de convite para Tenant
   */
  async sendInviteEmail(
    email: string,
    inviteUrl: string,
    tenantName: string,
    inviterName: string,
    locale: Locale = 'pt'
  ): Promise<void> {
    const translations = getTranslations(locale);
    const subject = interpolate(translations.emails.invite.subject, { tenantName });
    const html = await this.renderTemplate('invite', {
      inviteUrl,
      tenantName,
      inviterName,
    }, locale);
    await this.sendEmail(email, subject, html);
  }

  /**
   * Envia email de OTP
   */
  async sendOtpEmail(user: Pick<User, 'email' | 'name'>, code: string, locale: Locale = 'pt'): Promise<void> {
    const translations = getTranslations(locale);
    const subject = interpolate(translations.emails.otp.subject, { code });
    
    const html = await this.renderTemplate('otp', {
      name: user.name,
      code,
    }, locale);
    
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia alerta de segurança
   */
  async sendSecurityAlertEmail(
    user: Pick<User, 'email' | 'name'>,
    details: { device: string; location: string; ip: string },
    locale: Locale = 'pt'
  ): Promise<void> {
    const translations = getTranslations(locale);
    const subject = translations.emails.security.subject;
    const blockUrl = `${env.FRONTEND_URL}/settings/security`;

    const html = await this.renderTemplate('security-alert', {
      name: user.name,
      device: details.device,
      location: details.location,
      ip: details.ip,
      blockUrl
    }, locale);
    
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia aviso de falha no pagamento
   */
  async sendPaymentFailedEmail(user: Pick<User, 'email' | 'name'>, locale: Locale = 'pt'): Promise<void> {
    const translations = getTranslations(locale);
    const subject = translations.emails.paymentFailed.subject;
    const billingUrl = `${env.FRONTEND_URL}/settings/billing`;

    const html = await this.renderTemplate('payment-failed', {
      name: user.name,
      billingUrl
    }, locale);
    
    await this.sendEmail(user.email, subject, html);
  }
}

export const emailService = new EmailService();
