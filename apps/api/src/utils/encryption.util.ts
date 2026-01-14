import * as crypto from 'node:crypto';
import { env } from '../config/env';

/**
 * Utilitário para criptografia/descriptografia de dados sensíveis
 * Usa AES-256-GCM para criptografia simétrica
 */
export class EncryptionUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;

  /**
   * Obter chave de criptografia do ambiente
   */
  private static getKey(): Buffer {
    const key = env.ENCRYPTION_KEY || env.JWT_SECRET;
    
    if (!key) {
      throw new Error('ENCRYPTION_KEY or JWT_SECRET must be set');
    }

    // Garantir que a chave tenha 32 bytes (256 bits)
    return crypto.createHash('sha256').update(key).digest();
  }

  /**
   * Criptografar texto
   */
  static encrypt(text: string): string {
    if (!text) return '';

    const key = this.getKey();
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Retornar: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Descriptografar texto
   */
  static decrypt(encryptedText: string): string {
    if (!encryptedText) return '';

    try {
      const key = this.getKey();
      const parts = encryptedText.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted format');
      }

      const [ivHex, authTagHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');

      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }

  /**
   * Verificar se um texto está criptografado
   */
  static isEncrypted(text: string): boolean {
    if (!text) return false;
    const parts = text.split(':');
    return parts.length === 3 && parts.every(part => /^[0-9a-f]+$/i.test(part));
  }
}
