import { Command } from 'commander';
import { container } from '../../core/ioc/container.js';
import { TYPES } from '../../core/ioc/types.js';
import type { IAuthService } from '../../core/auth/auth.service.js';
import type { ILogger } from '../../core/logger.js';

export const loginCommand = new Command('login')
  .description('Authenticate with Kaven Cloud using Device Flow')
  .option('--host <url>', 'Kaven API URL', 'https://api.kaven.dev')
  .action(async (options) => {
    const logger = container.get<ILogger>(TYPES.Logger);
    const auth = container.get<IAuthService>(TYPES.AuthService);

    try {
      logger.info(`Conectando a ${options.host}...`);
      const user = await auth.login(options.host);
      
      logger.success(`Bem-vindo, ${user.name || user.email}!`);
      logger.info(`ID: ${user.id}`);
    } catch (error: any) {
      // Error handled inside service logger usually, but top level catch ensures clean exit
      process.exit(1);
    }
  });
