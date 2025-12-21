import prisma from '../../lib/prisma';
import crypto from 'crypto';

/**
 * Pix Service - Integração com Pix usando modelo Payment
 * Em produção, integrar com gateway de pagamento (Mercado Pago, PagSeguro, etc)
 */
export class PixService {
  /**
   * POST /api/payments/pix/create - Criar pagamento Pix
   */
  async createPixPayment(params: {
    tenantId: string;
    amount: number;
    description: string;
    invoiceId?: string;
    orderId?: string;
  }) {
    // Gerar código Pix (simulado - em produção usar API do gateway)
    const pixCode = this.generatePixCode(params.amount);
    const pixQrCodeUrl = this.generateQRCode(pixCode);

    // Criar registro de Payment no banco
    const payment = await prisma.payment.create({
      data: {
        amount: params.amount,
        currency: 'BRL',
        method: 'PIX',
        status: 'PENDING',
        pixQrCode: pixCode,
        pixQrCodeUrl,
        invoiceId: params.invoiceId,
        orderId: params.orderId,
        metadata: {
          description: params.description,
          tenantId: params.tenantId,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
        },
      },
    });

    return {
      id: payment.id,
      pixCode: payment.pixQrCode,
      qrCodeUrl: payment.pixQrCodeUrl,
      amount: Number(payment.amount),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      status: payment.status,
    };
  }

  /**
   * GET /api/payments/pix/:id/status - Verificar status do pagamento Pix
   */
  async checkPixPaymentStatus(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new Error('Pagamento Pix não encontrado');
    }

    return {
      id: payment.id,
      status: payment.status,
      amount: Number(payment.amount),
      confirmedAt: payment.confirmedAt,
      metadata: payment.metadata,
    };
  }

  /**
   * POST /api/webhooks/pix - Webhook para notificações de pagamento Pix
   */
  async handlePixWebhook(data: {
    paymentId: string;
    status: 'COMPLETED' | 'FAILED';
    transactionId?: string;
  }) {
    const payment = await prisma.payment.findUnique({
      where: { id: data.paymentId },
    });

    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    // Atualizar status do pagamento
    await prisma.payment.update({
      where: { id: data.paymentId },
      data: {
        status: data.status,
        transactionId: data.transactionId,
        confirmedAt: data.status === 'COMPLETED' ? new Date() : null,
      },
    });

    // Se pago e vinculado a invoice, atualizar invoice
    if (data.status === 'COMPLETED' && payment.invoiceId) {
      await prisma.invoice.update({
        where: { id: payment.invoiceId },
        data: {
          status: 'PAID',
          amountPaid: payment.amount,
          paidAt: new Date(),
        },
      });
    }

    return { message: 'Webhook processado com sucesso' };
  }

  /**
   * Helper: Gerar código Pix (simulado)
   */
  private generatePixCode(amount: number): string {
    // Em produção, usar API do gateway para gerar código real
    const randomCode = crypto.randomBytes(32).toString('base64url');
    return `00020126580014br.gov.bcb.pix${randomCode}${amount}`;
  }

  /**
   * Helper: Gerar QR Code URL (simulado)
   */
  private generateQRCode(pixCode: string): string {
    // Em produção, usar biblioteca de QR code (qrcode, qr-image, etc)
    // ou API do gateway que retorna URL do QR code
    return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==`;
  }
}

export const pixService = new PixService();
