import crypto from 'node:crypto';
import { PagueBitClient } from './paguebit.client';
import type {
  IPixProvider,
  CreateQRCodeParams,
  QRCodeResponse,
  PaymentStatus,
  WebhookPayload,
} from '../pix.interface';
import type {
  PagueBitQRCodeRequest,
  PagueBitQRCodeResponse,
  PagueBitPaymentResponse,
} from './paguebit.types';

/**
 * Implementação do provider PagueBit
 */
export class PagueBitService implements IPixProvider {
  private client: PagueBitClient;

  constructor() {
    this.client = new PagueBitClient();
  }

  /**
   * Criar QR Code Dinâmico
   */
  async createDynamicQRCode(params: CreateQRCodeParams): Promise<QRCodeResponse> {
    const request: PagueBitQRCodeRequest = {
      value: params.amount,
      description: params.description,
      external_id: params.externalId,
      metadata: params.metadata,
    };

    const response = await this.client.post<PagueBitQRCodeResponse>(
      '/qrcode/dynamic',
      request
    );

    return {
      paymentId: response.id,
      qrCode: response.qr_code,
      qrCodeText: response.qr_code_text,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
    };
  }

  /**
   * Buscar status de pagamento
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const response = await this.client.get<PagueBitPaymentResponse>(
      `/payment/${paymentId}`
    );

    return {
      id: response.id,
      status: response.status,
      amount: response.value,
      paidAt: response.paid_at ? new Date(response.paid_at) : undefined,
      metadata: response.metadata,
    };
  }

  /**
   * Validar assinatura de webhook (HMAC-SHA256 Versão 2)
   */
  validateWebhook(signature: string, body: string, timestamp: string): boolean {
    const secret = process.env.PAGUEBIT_WEBHOOK_SECRET;

    if (!secret) {
      console.error('❌ PAGUEBIT_WEBHOOK_SECRET não configurado');
      return false;
    }

    // Versão 2: HMAC-SHA256(timestamp + body, secret)
    const payload = timestamp + body;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Comparação segura contra timing attacks
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }

  /**
   * Processar webhook
   * Implementação será feita no webhook handler
   */
  async processWebhook(payload: WebhookPayload): Promise<void> {
    // Implementado em paguebit.webhook.ts
    throw new Error('Use handlePagueBitWebhook() instead');
  }
}

export const pagueBitService = new PagueBitService();
