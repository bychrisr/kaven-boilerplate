import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CredentialManager } from '../credential-manager.js';
import fs from 'fs-extra';

// Mock fs-extra
vi.mock('fs-extra', () => ({
  default: {
    ensureDir: vi.fn(),
    writeJson: vi.fn(),
    readJson: vi.fn(),
    pathExists: vi.fn(),
    remove: vi.fn(),
    chmod: vi.fn(),
  }
}));

// Mock dynamic import of keytar using vitest's doMock or simple spy on prototyp
// Since CredentialManager uses `await import('keytar')`, we can mock the module registry?
// Or better, we can mock the private getKeytar method if we access it as any, or construct a testable subclass.
// Or we can use `vi.mock('keytar', ...)` which should handle it if vitest intercepts imports.

const mockSetPassword = vi.fn();
const mockGetPassword = vi.fn();
const mockDeletePassword = vi.fn();

vi.mock('keytar', () => ({
    default: {
         setPassword: mockSetPassword,
         getPassword: mockGetPassword,
         deletePassword: mockDeletePassword,
    }
}));

describe('CredentialManager', () => {
  let manager: CredentialManager;

  beforeEach(() => {
    vi.clearAllMocks();
    manager = new CredentialManager();
  });

  it('should save to keychain successfully when keytar is available', async () => {
    const tokens = { accessToken: 'abc', refreshToken: 'def' };
    await manager.saveCredentials(tokens);

    expect(mockSetPassword).toHaveBeenCalledWith('kaven-cli', 'kaven-user', JSON.stringify(tokens));
    // Implementation details: it might verify fs fallback cleanup if keychain works
  });

  it('should fallback to file if keychain fails', async () => {
    const tokens = { accessToken: 'abc', refreshToken: 'def' };
    
    mockSetPassword.mockRejectedValueOnce(new Error('Keychain error'));
    
    await manager.saveCredentials(tokens);

    expect(fs.writeJson).toHaveBeenCalled();
    expect(fs.chmod).toHaveBeenCalled();
  });

  it('should read from keychain', async () => {
    const tokens = { accessToken: 'abc', refreshToken: 'def' };
    mockGetPassword.mockResolvedValueOnce(JSON.stringify(tokens));

    const result = await manager.getCredentials();
    expect(result).toEqual(tokens);
  });
});
