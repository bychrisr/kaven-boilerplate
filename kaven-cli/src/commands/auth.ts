import { Command } from 'commander';
import { container } from '../core/ioc/container.js';
import { TYPES } from '../core/ioc/types.js';
import { IAuthService } from '../core/auth/auth.service.js';

export function registerAuthCommands(program: Command) {
  const authService = container.get<IAuthService>(TYPES.AuthService);

  const authCommand = program.command('auth').description('Manage authentication');

  authCommand
    .command('login')
    .description('Log in to Kaven')
    .action(async () => {
      // API Base URL might come from config or env, hardcoded for now or use default in service
      await authService.login('https://api.kaven.dev/auth');
    });

  authCommand
    .command('logout')
    .description('Log out')
    .action(async () => {
      await authService.logout();
    });

  authCommand
    .command('whoami')
    .description('Show current user')
    .action(async () => {
      // Use default base URL for whoami
      await authService.whoami('https://api.kaven.dev/auth');
    });
}
