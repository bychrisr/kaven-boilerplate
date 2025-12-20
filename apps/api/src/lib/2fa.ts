import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Gera um secret 2FA (TOTP) e retorna o secret + URL para QR Code
 */
export async function generate2FASecret(userEmail: string): Promise<{ secret: string; qrCodeUrl: string }> {
  const secret = speakeasy.generateSecret({
    name: `Kaven (${userEmail})`,
    issuer: 'Kaven Boilerplate',
  });

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    secret: secret.base32,
    qrCodeUrl,
  };
}

/**
 * Verifica um código TOTP
 */
export function verify2FACode(secret: string, code: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: code,
    window: 2, // Aceita códigos de até 1 minuto antes/depois
  });
}

/**
 * Gera backup codes (10 códigos de 8 caracteres cada)
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
  }
  return codes;
}
