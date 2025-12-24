import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { sanitizer } from '../../src/utils/sanitizer';

describe('Sanitizer Utility', () => {
  it('should clean malicious HTML tags', () => {
    const input = '<script>alert(1)</script>';
    const output = sanitizer.clean(input);
    assert.strictEqual(output, '');
  });

  it('should allow safe HTML tags if configured (default strips script)', () => {
    const input = '<b>Bold</b>';
    const output = sanitizer.clean(input);
    assert.strictEqual(output, '<b>Bold</b>');
  });

  it('should sanitize nested objects', () => {
    const input = {
      safe: 'text',
      unsafe: {
        nested: '<img src=x onerror=alert(1)>'
      }
    };
    const output = sanitizer.sanitizeObject(input);
    assert.strictEqual(output.unsafe.nested, '<img src="x">');
  });

  it('should sanitize arrays', () => {
    const input = ['safe', '<script>alert(1)</script>'];
    const output = sanitizer.sanitizeObject(input);
    assert.strictEqual(output[1], '');
  });

  it('should handle non-string values gracefully', () => {
    const input = { val: 123, bool: true, nullVal: null };
    const output = sanitizer.sanitizeObject(input);
    assert.deepStrictEqual(output, input);
  });

  it('should escape HTML characters', () => {
    const input = '<script>';
    const output = sanitizer.escape(input);
    assert.strictEqual(output, '&lt;script&gt;');
  });

  it('should normalize emails', () => {
    const input = 'TEST@Example.com';
    const output = sanitizer.normalizeEmail(input);
    assert.strictEqual(output, 'test@example.com');
  });
});
