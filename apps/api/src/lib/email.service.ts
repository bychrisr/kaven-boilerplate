import nodemailer, { Transporter } from 'nodemailer';
import type { User, Invoice } from '@prisma/client';
import { env } from '../config/env';
import { secureLog } from '../utils/secure-logger';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
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

class EmailService {
  private transporter: Transporter;
  private from: string;
  private isConfigured: boolean;
  private templatesDir: string;

  constructor() {
    this.from = env.EMAIL_FROM;
    this.templatesDir = path.join(__dirname, '../templates/emails');
    this.isConfigured = this.checkConfiguration();

    if (this.isConfigured) {
      this.transporter = this.createTransporter();
    } else {
      secureLog.warn('Email service não configurado corretamente. Tentando usar MailHog como fallback...');
      // Fallback para MailHog se não configurado
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025,
        secure: false,
      });
    }
  }

  /**
   * Renderiza template Handlebars
   */
  private async renderTemplate(templateName: string, context: Record<string, any>): Promise<string> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      
      // Cache de template poderia ser implementado aqui em produção
      const templateSource = await fs.readFile(templatePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      
      return template(context);
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
  async sendWelcomeEmail(user: Pick<User, 'email' | 'name'>): Promise<void> {
    const subject = 'Bem-vindo ao Kaven!';
    const html = await this.renderTemplate('welcome', {
      name: user.name,
      frontendUrl: env.FRONTEND_URL,
    });
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de verificação
   */
  async sendVerificationEmail(user: Pick<User, 'email' | 'name'>, token: string): Promise<void> {
    const subject = 'Verifique seu email';
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = await this.renderTemplate('verification', {
      name: user.name,
      verificationUrl,
    });
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de reset de senha
   */
  async sendPasswordResetEmail(user: Pick<User, 'email' | 'name'>, token: string): Promise<void> {
    const subject = 'Redefinir sua senha';
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = await this.renderTemplate('reset-password', {
      name: user.name,
      resetUrl,
    });
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de invoice
   */
  async sendInvoiceEmail(
    user: Pick<User, 'email' | 'name'>,
    invoice: Pick<Invoice, 'invoiceNumber' | 'amountDue' | 'dueDate'>
  ): Promise<void> {
    const subject = `Invoice ${invoice.invoiceNumber} - Kaven`;
    
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(invoice.amountDue));

    const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(invoice.dueDate));

    const html = await this.renderTemplate('invoice', {
      name: user.name,
      invoiceNumber: invoice.invoiceNumber,
      formattedAmount,
      formattedDate,
      frontendUrl: env.FRONTEND_URL,
    });
    
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de convite para Tenant
   */
  async sendInviteEmail(
    email: string,
    inviteUrl: string,
    tenantName: string,
    inviterName: string
  ): Promise<void> {
    const subject = `Convite para participar de ${tenantName}`;
    const html = await this.renderTemplate('invite', {
      inviteUrl,
      tenantName,
      inviterName,
    });
    await this.sendEmail(email, subject, html);
  }
}

export const emailService = new EmailService();
