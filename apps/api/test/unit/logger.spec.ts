import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { secureLog } from '../../src/utils/secure-logger';

describe('Secure Logger Utility', () => {
  let originalLog: typeof console.log;
  let originalWarn: typeof console.warn;
  let originalError: typeof console.error;
  let logOutput: string[] = [];

  beforeEach(() => {
    originalLog = console.log;
    originalWarn = console.warn;
    originalError = console.error;
    logOutput = [];

    // Mock console methods
    console.log = (...args) => logOutput.push(args.map(a => String(a)).join(' '));
    console.warn = (...args) => logOutput.push(args.map(a => String(a)).join(' '));
    console.error = (...args) => logOutput.push(args.map(a => String(a)).join(' '));
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  });

  it('should redact sensitive password field', () => {
    secureLog.info('Test login', { password: 'secret123', email: 'valid@email.com' });
    
    // Check if output contains log
    assert.strictEqual(logOutput.length, 1);
    const log = logOutput[0];
    
    assert.ok(log.includes('[REDACTED]'), 'Should contain [REDACTED]');
    assert.ok(!log.includes('secret123'), 'Should NOT contain secret123');
    assert.ok(log.includes('valid@email.com'), 'Should contain email');
  });

  it('should redact sensitive keys recursively', () => {
    const data = {
      user: {
        name: 'John',
        apiKey: 'abcdef123456',
        details: {
          token: 'jwt-token-here'
        }
      }
    };
    
    secureLog.info('Recursion test', data);
    const log = logOutput[0];
    
    assert.ok(log.includes('[REDACTED]'), 'Should contain redacted fields');
    assert.ok(!log.includes('abcdef123456'), 'Should verify apiKey is redacted');
    assert.ok(!log.includes('jwt-token-here'), 'Should verify token is redacted');
    assert.ok(log.includes('John'), 'Should keep name');
  });

  it('should handle arrays', () => {
      const data = [
          { password: '123' },
          { email: 'a@b.com' }
      ];
      secureLog.info('Array test', data);
      const log = logOutput[0];
      assert.ok(log.includes('[REDACTED]'));
      assert.ok(log.includes('a@b.com'));
  });
  
  it('should handle null/undefined', () => {
      secureLog.info('Null test', null);
      assert.ok(logOutput[0].includes('[INFO] Null test'));
  });
});
