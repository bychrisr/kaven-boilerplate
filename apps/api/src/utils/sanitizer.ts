import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

/**
 * Sanitiza inputs para prevenir XSS e Injection
 */
export const sanitizer = {
  /**
   * Limpa strings de HTML malicioso (XSS)
   */
  clean: (input: string): string => {
    return DOMPurify.sanitize(input);
  },

  /**
   * Escapa caracteres perigosos para HTML
   */
  escape: (input: string): string => {
    return validator.escape(input);
  },

  /**
   * Normaliza email
   */
  normalizeEmail: (email: string): string => {
    return validator.normalizeEmail(email) || email;
  },

  /**
   * Sanitiza objeto recursivamente
   */
  sanitizeObject: <T>(obj: T): T => {
    if (typeof obj === 'string') {
      return DOMPurify.sanitize(obj) as unknown as T;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => sanitizer.sanitizeObject(item)) as unknown as T;
    }

    if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Pula campos de senha/token para não corromper hashes (mas valida na entrada)
        if (['password', 'token', 'hash'].includes(key)) {
          result[key] = value;
        } else {
          result[key] = sanitizer.sanitizeObject(value);
        }
      }
      return result as T;
    }

    return obj;
  },
};
