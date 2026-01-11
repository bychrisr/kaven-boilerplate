export interface PagueBitQRCodeRequest {
  value: number;
  description: string;
  external_id: string;
  metadata?: Record<string, any>;
}

export interface PagueBitQRCodeResponse {
  id: string;
  qr_code: string; // Base64 da imagem
  qr_code_text: string; // Código copia-e-cola
  value: number;
  status: 'pending';
  created_at: string;
}

export interface PagueBitPaymentResponse {
  id: string;
  external_id: string;
  value: number;
  status: 'pending' | 'review' | 'approved' | 'not_approved';
  paid_at?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface PagueBitWebhookPayload {
  id: string;
  external_id: string;
  value: number;
  status: 'pending' | 'review' | 'approved' | 'not_approved';
  paid_at?: string;
  metadata?: Record<string, any>;
}
