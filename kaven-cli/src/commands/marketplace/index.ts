import { Command } from 'commander';
import { installCommand } from './install.js';
import { listCommand } from './list.js';

export function registerMarketplaceCommands(program: Command) {
  const marketplace = program.command('marketplace')
    .description('Manage marketplace modules');

  marketplace.addCommand(listCommand);
  marketplace.addCommand(installCommand);
}
