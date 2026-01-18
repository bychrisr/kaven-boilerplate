import crypto from 'crypto';
import { secureLog } from '../../utils/secure-logger';

/**
 * Valida assinatura HMAC SHA-256 para webhooks
 */
export function validateHmacSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');

    if (checksum.length !== digest.length) {
      return false;
    }

    return crypto.timingSafeEqual(digest, checksum);
  } catch (error) {
    secureLog.error('[WebhookValidator] Error validating HMAC signature:', error);
    return false;
  }
}

/**
 * Valida assinatura do Resend (Svix)
 * O Resend usa um formato específico: v1,timestamp,signature
 */
export function validateResendSignature(
  payload: string,
  headers: Record<string, string | string[] | undefined>,
  secret: string
): boolean {
  const svixId = headers['svix-id'] as string;
  const svixTimestamp = headers['svix-timestamp'] as string;
  const svixSignature = headers['svix-signature'] as string;

  if (!svixId || !svixTimestamp || !svixSignature || !secret) {
    return false;
  }

  try {
    const signedPayload = `${svixId}.${svixTimestamp}.${payload}`;
    const hmac = crypto.createHmac('sha256', secret.split('_')[1] || secret);
    const digest = hmac.update(signedPayload).digest('base64');

    const signatures = svixSignature.split(' ');
    for (const signature of signatures) {
      const [version, sign] = signature.split(',');
      if (version === 'v1' && sign === digest) {
        return true;
      }
    }
    return false;
  } catch (error) {
    secureLog.error('[WebhookValidator] Error validating Resend signature:', error);
    return false;
  }
}
