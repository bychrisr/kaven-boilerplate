const SENSITIVE_KEYS = [
  'password', 'senha', 'apiKey', 'api_key', 'apiSecret', 'api_secret',
  'passphrase', 'token', 'jwt', 'secret', 'key', 'authorization',
  'cookie', 'session', 'refreshToken', 'accessToken', 'bearer',
  'credential', 'private', 'twoFactorSecret', 'backupCodes',
];

function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));
}

function sanitizeValue(value: any, depth: number = 0): any {
  if (depth > 10) return '[MAX_DEPTH]';

  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    // Redact strings que parecem tokens
    if (value.length > 20 && /^[A-Za-z0-9._-]+$/.test(value)) {
      return value.substring(0, 10) + '...[REDACTED]';
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, depth + 1));
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      if (isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeValue(val, depth + 1);
      }
    }
    // Handle Error objects specially
    if (value instanceof Error) {
      sanitized.message = value.message;
      sanitized.stack = value.stack;
      sanitized.name = value.name;
    }
    return sanitized;
  }

  return value;
}

export const secureLog = {
  info: (message: string, data?: any) => {
    const sanitized = data ? sanitizeValue(data) : undefined;
    console.log(`[INFO] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
  },

  warn: (message: string, data?: any) => {
    const sanitized = data ? sanitizeValue(data) : undefined;
    console.warn(`[WARN] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
  },

  error: (message: string, error?: any) => {
    const sanitized = error ? sanitizeValue(error) : undefined;
    console.error(`[ERROR] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      const sanitized = data ? sanitizeValue(data) : undefined;
      console.debug(`[DEBUG] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
    }
  },
};
