import { Container } from 'inversify';
import { TYPES } from './types.js';

// Interfaces
import { ILogger, LoggerService } from '../logger.js';
import { IConfigManager, ConfigManager } from '../config-manager.js';
import { ICredentialManager, CredentialManager } from '../credential-manager.js';
import { IAuthService, AuthService } from '../auth/auth.service.js';
import { IPassportService, PassportService } from '../security/passport.service.js';
import { IMarketplaceClient, MarketplaceClient } from '../marketplace/marketplace-client.js';
import { IMarkerEngine, MarkerEngine } from '../engine/marker-engine.js';
import { IDownloadManager, DownloadManager } from '../download-manager.js';
import { ICryptoService, CryptoService } from '../security/crypto.service.js';

const container = new Container();

container.bind<ILogger>(TYPES.Logger).to(LoggerService).inSingletonScope();
container.bind<IConfigManager>(TYPES.ConfigManager).to(ConfigManager).inSingletonScope();
container.bind<ICredentialManager>(TYPES.CredentialManager).to(CredentialManager).inSingletonScope();
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<IPassportService>(TYPES.PassportService).to(PassportService).inSingletonScope();
container.bind<IMarketplaceClient>(TYPES.MarketplaceClient).to(MarketplaceClient).inSingletonScope();
container.bind<IMarkerEngine>(TYPES.MarkerEngine).to(MarkerEngine).inSingletonScope();

container.bind<ICryptoService>(TYPES.CryptoService).to(CryptoService).inSingletonScope();
container.bind<IDownloadManager>(TYPES.DownloadManager).to(DownloadManager).inSingletonScope();


export { container };
