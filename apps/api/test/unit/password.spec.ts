import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validatePasswordStrength } from '../../src/lib/password';

describe('Password Validation Logic', () => {
    it('should reject short passwords', () => {
        const result = validatePasswordStrength('Short1!');
        assert.strictEqual(result.isValid, false, 'Should fail < 8 chars');
        assert.ok(result.message?.includes('menos 8 caracteres'));
    });

    it('should reject passwords without uppercase', () => {
        const result = validatePasswordStrength('weakpassword1!');
        assert.strictEqual(result.isValid, false, 'Should fail no uppercase');
    });

    it('should reject passwords without lowercase', () => {
        const result = validatePasswordStrength('WEAKPASSWORD1!');
        assert.strictEqual(result.isValid, false, 'Should fail no lowercase');
    });

    it('should reject passwords without numbers', () => {
        const result = validatePasswordStrength('WeakPassword!');
        assert.strictEqual(result.isValid, false, 'Should fail no numbers');
    });

    it('should reject passwords without special characters', () => {
        const result = validatePasswordStrength('WeakPassword1');
        assert.strictEqual(result.isValid, false, 'Should fail no special chars');
    });

    it('should reject common passwords (blacklist)', () => {
        const result = validatePasswordStrength('Admin@123'); // Case insensitive check in lib
        assert.strictEqual(result.isValid, false, 'Should reject Admin@123');
        assert.ok(result.message?.includes('muito comum'));
    });

    it('should accept strong passwords', () => {
        const result = validatePasswordStrength('C0rr3ct$StrongP@ss');
        assert.strictEqual(result.isValid, true);
    });
});
