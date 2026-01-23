import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../auth-service.js';
import { ICredentialManager } from '../credential-manager.js';
import { ILogger } from '../logger.js';
import 'reflect-metadata';

describe('AuthService', () => {
    let authService: AuthService;
    let mockCredManager: ICredentialManager;
    let mockLogger: ILogger;

    beforeEach(() => {
        mockCredManager = {
            saveCredentials: vi.fn(),
            getCredentials: vi.fn(),
            deleteCredentials: vi.fn(),
        };
        mockLogger = {
            startSpinner: vi.fn(),
            stopSpinner: vi.fn(),
            succeedSpinner: vi.fn(),
            failSpinner: vi.fn(),
            box: vi.fn(),
            info: vi.fn(),
            success: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
            debug: vi.fn(),
        };

        authService = new AuthService(mockLogger, mockCredManager);
    });

    it('should prevent login if already authenticated', async () => {
        // Setup
        vi.mocked(mockCredManager.getCredentials).mockResolvedValue({
            accessToken: 'valid', refreshToken: 'valid', user: { id: '1', email: 'test@kaven.dev' }
        });

        // Execute
        await authService.login();

        // Assert
        expect(mockLogger.info).toHaveBeenCalledWith(expect.stringContaining('já está logado'));
        expect(mockCredManager.saveCredentials).not.toHaveBeenCalled();
    });

    it('should logout by deleting credentials', async () => {
        await authService.logout();
        expect(mockCredManager.deleteCredentials).toHaveBeenCalled();
    });

    it('should return null current user if no tokens', async () => {
        vi.mocked(mockCredManager.getCredentials).mockResolvedValue(null);
        const user = await authService.getCurrentUser();
        expect(user).toBeNull();
    });

    it('should return user from credentials', async () => {
        vi.mocked(mockCredManager.getCredentials).mockResolvedValue({
            accessToken: 'x', refreshToken: 'y',
            user: { id: '123', email: 'me@kaven.dev' }
        });
        const user = await authService.getCurrentUser();
        expect(user?.email).toBe('me@kaven.dev');
    });
});
