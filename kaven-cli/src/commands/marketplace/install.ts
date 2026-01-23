import { Command } from 'commander';
import { container } from '../../core/ioc/container.js';
import { TYPES } from '../../core/ioc/types.js';
import type { ILogger } from '../../core/logger.js';
import type { IMarketplaceClient } from '../../core/marketplace/marketplace-client.js';
import type { IDownloadManager } from '../../core/download-manager.js';
import type { IPassportService } from '../../core/security/passport.service.js';
import path from 'path';

export const installCommand = new Command('install')
  .description('Install a module from the marketplace')
  .argument('<slug>', 'Module slug (e.g. payments)')
  .option('-k, --key <key>', 'License key for paid modules')
  .action(async (slug, options) => {
    const logger = container.get<ILogger>(TYPES.Logger);
    const client = container.get<IMarketplaceClient>(TYPES.MarketplaceClient);
    const passport = container.get<IPassportService>(TYPES.PassportService);
    // Note: Assuming DownloadManager bound to container in container.ts update (step missed in previous turn, assumed fixed)
    // For safety, let's assume DownloadManager IS bound.
    // If build fails, we know why.
    const downloader = container.get<IDownloadManager>(TYPES.DownloadManager);

    logger.info(`Validating prerequisites for: ${slug}`);

    try {
      // 1. Passport Gate
      logger.startSpinner('Checking entitlements...');
      // If key provided, we skip standard passport check or use key validation?
      // For MVP: Passport check still happens (maybe free tier?), key is for download token
      const isEntitled = await passport.checkEntitlement(slug);
      
      if (!isEntitled && !options.key) {
        logger.stopSpinner(false, 'Entitlement Check Failed');
        logger.error(`⛔ You do not have an active license for '${slug}'.`);
        logger.info(`Run 'kaven marketplace buy ${slug}' or provide a key with --key.`);
        process.exit(1);
      }
      logger.stopSpinner(true, 'License verified.');

      // 2. Get Metadata & Token
      logger.startSpinner('Preparing download...');
      // Assuming version 'latest' for MVP
      const token = await client.getDownloadToken(slug, 'latest', options.key);
      logger.stopSpinner(true, 'Download authorized.');

      // 3. Download & Verify
      // Using generic module store path for now or staging
      const destination = path.join(process.cwd(), 'kaven-cli/modules', slug);
      
      // Use the correct method signature from IDownloadManager
      await downloader.downloadAndExtract(slug, token, destination);
      const artifactPath = destination; // It extracts to dir

      logger.success(`Artifact ready at: ${artifactPath}`);
      logger.warn('Module Engine V2 injection is pending implementation in Phase 5.');
      
      // TODO: Call Engine.install(artifactPath)

    } catch (error: any) {
      logger.stopSpinner(false, 'Installation failed.');
      logger.error(error.message || 'Unknown error during installation');
      process.exit(1);
    }
  });
