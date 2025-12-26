import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
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
    console.log = vi.fn((...args) => logOutput.push(args.map(a => String(a)).join(' ')));
    console.warn = vi.fn((...args) => logOutput.push(args.map(a => String(a)).join(' ')));
    console.error = vi.fn((...args) => logOutput.push(args.map(a => String(a)).join(' ')));
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
    vi.restoreAllMocks();
  });

  it('should redact sensitive password field', () => {
    secureLog.info('Test login', { password: 'secret123', email: 'valid@email.com' });
    
    // Check if output contains log
    expect(logOutput.length).toBe(1);
    const log = logOutput[0];
    
    expect(log).toContain('[REDACTED]');
    expect(log).not.toContain('secret123');
    expect(log).toContain('valid@email.com');
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
    const log = logOutput[0] || '';
    
    expect(log).toContain('[REDACTED]');
    expect(log).not.toContain('abcdef123456');
    expect(log).not.toContain('jwt-token-here');
    expect(log).toContain('John');
  });

  it('should handle arrays', () => {
      const data = [
          { password: '123' },
          { email: 'a@b.com' }
      ];
      secureLog.info('Array test', data);
      const log = logOutput[0] || '';
      expect(log).toContain('[REDACTED]');
      expect(log).toContain('a@b.com');
  });
  
  it('should handle null/undefined', () => {
      secureLog.info('Null test', null);
      expect(logOutput[0]).toContain('[INFO] Null test');
  });
});
