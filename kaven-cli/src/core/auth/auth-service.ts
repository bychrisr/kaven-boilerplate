import { injectable, inject } from 'inversify';
import { TYPES } from '../ioc/types.js';
import type { ILogger } from '../logger.js';
import type { ICredentialManager, AuthTokens } from '../credential-manager.js';
import axios from 'axios';
import open from 'open';
import { setTimeout } from 'timers/promises';

// Mock Constants for Phase 1
const AUTH_API_URL = 'https://api.kaven.dev/auth'; // Placeholder
const CLIENT_ID = 'kaven-cli';

@injectable()
export class AuthService {
    constructor(
        @inject(TYPES.Logger) private logger: ILogger,
        @inject(TYPES.CredentialManager) private credentialManager: ICredentialManager
    ) {}

    /**
     * Start login flow (Device Code Flow)
     */
    async login(): Promise<void> {
        this.logger.startSpinner('Iniciando autenticação...');
        
        try {
            // 1. Check if already logged in
            const current = await this.getCurrentUser();
            if (current) {
                this.logger.stopSpinner(true);
                this.logger.info(`Você já está logado como ${current.email}`);
                return;
            }

            // 2. Request Device Code (Mocked for Phase 1)
            // In real impl: POST /oauth/device/code
            const deviceCode = await this.mockDeviceCodeRequest();
            
            this.logger.stopSpinner(true);
            this.logger.box('Autenticação Necessária', [
                'Para continuar, autorize este dispositivo no navegador:',
                '',
                `  URL:   ${deviceCode.verification_uri}`,
                `  Code:  ${deviceCode.user_code}`,
                '',
                'O navegador será aberto automaticamente...'
            ]);

            // Open Browser
            await open(deviceCode.verification_uri_complete);

            // 3. Poll for Token
            this.logger.startSpinner('Aguardando autorização...');
            const tokens = await this.pollForToken(deviceCode.device_code, deviceCode.interval);
            
            // 4. Save Tokens
            await this.credentialManager.saveCredentials(tokens);
            
            this.logger.succeedSpinner(`Login realizado com sucesso! Bem-vindo, ${tokens.user?.email}`);

        } catch (error: any) {
            this.logger.failSpinner('Falha na autenticação.');
            this.logger.error(error.message);
        }
    }

    /**
     * Logout
     */
    async logout(): Promise<void> {
        this.logger.startSpinner('Saindo...');
        await this.credentialManager.deleteCredentials();
        this.logger.succeedSpinner('Logout realizado com sucesso.');
    }

    /**
     * Get current user info
     */
    async whoami(): Promise<void> {
        const tokens = await this.credentialManager.getCredentials();
        if (!tokens || !tokens.user) {
            this.logger.info('Não autenticado.');
            return;
        }

        this.logger.box('Kaven CLI Identity', [
            `User:  ${tokens.user.name || 'N/A'}`,
            `Email: ${tokens.user.email}`,
            `ID:    ${tokens.user.id}`,
            `Scope: ${tokens.scope || 'basic'}`
        ]);
    }

    /**
     * Get validated user or null
     */
    async getCurrentUser() {
        const tokens = await this.credentialManager.getCredentials();
        return tokens?.user || null;
    }

    /**
     * Get access token for internal use
     */
    async getAccessToken(): Promise<string | null> {
        const tokens = await this.credentialManager.getCredentials();
        return tokens?.accessToken || null;
    }

    // --- MOCKS (To be replaced by real API client in Phase 2) ---

    private async mockDeviceCodeRequest() {
        // Simulates https://github.com/login/device/code response
        return {
            device_code: 'mock-device-code-123',
            user_code: 'KAVEN-1234',
            verification_uri: 'https://kaven.dev/activate',
            verification_uri_complete: 'https://kaven.dev/activate?user_code=KAVEN-1234',
            expires_in: 900,
            interval: 1 // Fast polling for demo
        };
    }

    private async pollForToken(deviceCode: string, interval: number): Promise<AuthTokens> {
        // Simulates polling. In real life, loop until success or timeout.
        // Here we just wait 2 seconds and verify.
        
        await setTimeout(2000); 

        // Mock Token Response
        return {
            accessToken: 'mock-access-token-jwt',
            refreshToken: 'mock-refresh-token',
            expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
            scope: 'read:modules write:modules',
            user: {
                id: 'usr_123',
                email: 'dev@kaven.dev',
                name: 'Kaven Developer'
            }
        };
    }
}
