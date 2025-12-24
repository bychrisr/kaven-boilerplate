import nodemailer, { Transporter } from 'nodemailer';
import type { User, Invoice } from '@prisma/client';
import { env } from '../config/env';
import { secureLog } from '../utils/secure-logger';

/**
 * Email Service - Envio de emails transacionais
 * 
 * Suporta:
 * - Welcome emails
 * - Email verification
 * - Password reset
 * - Invoice notifications
 * 
 * Usa Nodemailer com SMTP ou SendGrid
 */

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: Transporter;
  private from: string;
  private isConfigured: boolean;

  constructor() {
    this.from = env.EMAIL_FROM;
    this.isConfigured = this.checkConfiguration();

    if (this.isConfigured) {
      this.transporter = this.createTransporter();
    } else {
      secureLog.warn('Email service não configurado. Emails não serão enviados.');
      // Criar transporter fake para desenvolvimento
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }

  /**
   * Verifica se variáveis de ambiente estão configuradas
   */
  private checkConfiguration(): boolean {
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
      secureLog.warn('Variáveis de email (SMTP) faltando.');
      return false;
    }
    return true;
  }

  /**
   * Cria transporter do Nodemailer
   */
  private createTransporter(): Transporter {
    const config: EmailConfig = {
      host: env.SMTP_HOST!,
      port: env.SMTP_PORT, // Already number
      secure: env.SMTP_SECURE, // Already boolean
      auth: {
        user: env.SMTP_USER!,
        pass: env.SMTP_PASS!,
      },
    };

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

      if (!this.isConfigured) {
        secureLog.info('[DEV] Email que seria enviado:', {
          to,
          subject,
          messageId: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
        });
      } else {
        secureLog.info('Email enviado:', { to, subject, messageId: info.messageId });
      }
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
    const html = this.getWelcomeTemplate(user.name);
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de verificação
   */
  async sendVerificationEmail(user: Pick<User, 'email' | 'name'>, token: string): Promise<void> {
    const subject = 'Verifique seu email';
    const verificationUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = this.getVerificationTemplate(user.name, verificationUrl);
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Envia email de reset de senha
   */
  async sendPasswordResetEmail(user: Pick<User, 'email' | 'name'>, token: string): Promise<void> {
    const subject = 'Redefinir sua senha';
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = this.getPasswordResetTemplate(user.name, resetUrl);
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
    const html = this.getInvoiceTemplate(user.name, invoice);
    await this.sendEmail(user.email, subject, html);
  }

  /**
   * Template: Welcome Email
   */
  private getWelcomeTemplate(name: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao Kaven</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px;">Bem-vindo ao Kaven!</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>${name}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso.
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Agora você pode aproveitar todos os recursos da nossa plataforma.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${env.FRONTEND_URL}/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Acessar Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0;">
                Kaven - Multi-Tenant SaaS Platform
              </p>
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                © 2025 Kaven. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Template: Email Verification
   */
  private getVerificationTemplate(name: string, verificationUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifique seu email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Verifique seu email</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>${name}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Para completar seu cadastro, por favor verifique seu endereço de email clicando no botão abaixo:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${verificationUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Verificar Email
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Se você não criou esta conta, pode ignorar este email.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                © 2025 Kaven. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Template: Password Reset
   */
  private getPasswordResetTemplate(name: string, resetUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinir senha</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Redefinir Senha</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>${name}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Redefinir Senha
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                Este link expira em 1 hora. Se você não solicitou esta alteração, ignore este email.
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                © 2025 Kaven. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Template: Invoice
   */
  private getInvoiceTemplate(
    name: string,
    invoice: Pick<Invoice, 'invoiceNumber' | 'amountDue' | 'dueDate'>
  ): string {
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(invoice.amountDue));

    const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(invoice.dueDate));

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Nova Invoice</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá <strong>${name}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Uma nova invoice foi gerada para sua conta:
              </p>
              
              <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #6c757d; font-size: 14px;">Número:</td>
                  <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right;">${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="color: #6c757d; font-size: 14px;">Valor:</td>
                  <td style="color: #333333; font-size: 18px; font-weight: bold; text-align: right;">${formattedAmount}</td>
                </tr>
                <tr>
                  <td style="color: #6c757d; font-size: 14px;">Vencimento:</td>
                  <td style="color: #333333; font-size: 14px; font-weight: bold; text-align: right;">${formattedDate}</td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${env.FRONTEND_URL}/invoices/${invoice.invoiceNumber}" 
                       style="display: inline-block; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold;">
                      Ver Invoice
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                © 2025 Kaven. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }
}

export const emailService = new EmailService();
