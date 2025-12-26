import { describe, it, expect } from 'vitest';
import { validatePasswordStrength } from '../../src/lib/password';

describe('Password Validation Logic', () => {
    it('should reject short passwords', () => {
        const result = validatePasswordStrength('Short1!');
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('menos 8 caracteres');
    });

    it('should reject passwords without uppercase', () => {
        const result = validatePasswordStrength('weakpassword1!');
        expect(result.isValid).toBe(false);
    });

    it('should reject passwords without lowercase', () => {
        const result = validatePasswordStrength('WEAKPASSWORD1!');
        expect(result.isValid).toBe(false);
    });

    it('should reject passwords without numbers', () => {
        const result = validatePasswordStrength('WeakPassword!');
        expect(result.isValid).toBe(false);
    });

    it('should reject passwords without special characters', () => {
        const result = validatePasswordStrength('WeakPassword1');
        expect(result.isValid).toBe(false);
    });

    it('should reject common passwords (blacklist)', () => {
        const result = validatePasswordStrength('Admin@123'); // Case insensitive check in lib
        expect(result.isValid).toBe(false);
        expect(result.message).toContain('muito comum');
    });

    it('should accept strong passwords', () => {
        const result = validatePasswordStrength('C0rr3ct$StrongP@ss');
        expect(result.isValid).toBe(true);
    });
});
