import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Conforme especificação Phase 0

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
