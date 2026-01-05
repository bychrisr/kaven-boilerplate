/**
 * Interface agnóstica para providers de pagamento PIX
 * Permite trocar de provider (PagueBit, Mercado Pago, etc) sem alterar código
 */

export interface IPixProvider {
  /**
   * Criar QR Code Dinâmico para pagamento
   */
  createDynamicQRCode(params: CreateQRCodeParams): Promise<QRCodeResponse>;

  /**
   * Buscar status de um pagamento
   */
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;

  /**
   * Validar assinatura de webhook
   */
  validateWebhook(signature: string, body: string, timestamp: string): boolean;

  /**
   * Processar webhook recebido
   */
  processWebhook(payload: WebhookPayload): Promise<void>;
}

export interface CreateQRCodeParams {
  amount: number;
  description: string;
  externalId: string; // ID do Purchase/Subscription no nosso sistema
  metadata?: Record<string, any>;
}

export interface QRCodeResponse {
  paymentId: string;
  qrCode: string; // Base64 ou URL da imagem
  qrCodeText: string; // Código PIX copia-e-cola
  expiresAt: Date;
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'review' | 'approved' | 'not_approved';
  amount: number;
  paidAt?: Date;
  metadata?: Record<string, any>;
}

export interface WebhookPayload {
  id: string;
  external_id: string;
  status: 'pending' | 'review' | 'approved' | 'not_approved';
  value: number;
  paid_at?: string;
  metadata?: Record<string, any>;
}
