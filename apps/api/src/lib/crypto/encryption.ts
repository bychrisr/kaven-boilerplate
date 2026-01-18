import crypto from 'crypto';
import { env } from '../../config/env';

// A ENCRYPTION_KEY deve ter 32 bytes (64 caracteres hex) para o aes-256-gcm
const ENCRYPTION_KEY = env.ENCRYPTION_KEY || '0'.repeat(64); 
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Criptografa um texto usando AES-256-GCM
 * @param text Texto puro para criptografar
 * @returns String formatada iv:authTag:encryptedText
 */
export function encrypt(text: string): string {
  if (!text) return '';
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Descriptografa um texto usando AES-256-GCM
 * @param encryptedText String formatada iv:authTag:encryptedText
 * @returns Texto puro original
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Formato de texto criptografado inválido');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Erro na descriptografia:', error);
    throw new Error('Falha ao descriptografar dados. Verifique a chave de criptografia.');
  }
}
