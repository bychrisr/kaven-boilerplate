import { Command } from 'commander';
import { container } from '../../core/ioc/container.js';
import { TYPES } from '../../core/ioc/types.js';
import type { IMarketplaceClient } from '../../core/marketplace/marketplace-client.js';
import type { ILogger } from '../../core/logger.js';
import chalk from 'chalk';

export const listCommand = new Command('list')
  .description('List available modules in the marketplace')
  .option('-q, --query <text>', 'Search term')
  .action(async (options) => {
    const logger = container.get<ILogger>(TYPES.Logger);
    const client = container.get<IMarketplaceClient>(TYPES.MarketplaceClient);

    try {
      logger.startSpinner('Fetching modules...');
      const modules = await client.listModules(options.query);
      logger.stopSpinner(true, `Found ${modules.length} modules.`);

      if (modules.length === 0) {
        logger.info('No modules found matching your criteria.');
        return;
      }

      console.log(chalk.bold('\n📦 Available Modules:\n'));
      
      // Simple list output suitable for CLI 
      // (In a real scenario, use cli-table3 for better formatting)
      modules.forEach(mod => {
        const price = mod.pricing?.type === 'free' ? chalk.green('FREE') : chalk.yellow('PAID');
        console.log(`${chalk.cyan(mod.slug)} v${mod.version} [${price}]`);
        console.log(`  ${chalk.gray(mod.description)}\n`);
      });

    } catch (error: any) {
      logger.stopSpinner(false, 'Failed to list modules.');
      logger.error('Error fetching marketplace data');
    }
  });
