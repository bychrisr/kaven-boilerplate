import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Hash password usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara password com hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Valida força da senha
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 */
export function validatePasswordStrength(password: string): ValidationResult {
  if (password.length < 8) {
    return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Senha deve conter pelo menos um número' };
  }

  // Caracteres especiais (pontuação, símbolos, etc)
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: 'Senha deve conter pelo menos um caractere especial' };
  }

  // Common passwords blacklist
  const BLACKLIST = [
    'admin@123', 'password', '12345678', 'qwertyuiop', 'admin123', 
    'password123', 'changeme', 'secret', 'developer'
  ];
  
  if (BLACKLIST.includes(password.toLowerCase())) {
      return { isValid: false, message: 'Senha muito comum. Escolha uma senha mais forte.' };
  }

  return { isValid: true };
}
