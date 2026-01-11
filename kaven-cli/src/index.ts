/**
 * Kaven CLI
 * Main entry point
 */

import { Command } from 'commander';
import { updateCommand } from './commands/update.js';
import { moduleCommand } from './commands/module.js';
import { logger } from './lib/logger.js';

const program = new Command();

program
  .name('kaven')
  .description('Official CLI for Kaven Boilerplate')
  .version('2.0.0');

// kaven update
program
  .command('update')
  .description('Update Kaven to the latest version')
  .option('--check', 'Check for updates without installing')
  .option('--force', 'Force update even with uncommitted changes')
  .option('--skip-migrations', 'Skip running migrations')
  .action(async (options) => {
    try {
      await updateCommand(options);
    } catch (error) {
      logger.error(`Update failed: ${error}`);
      process.exit(1);
    }
  });

// kaven module
const moduleCmd = program
  .command('module')
  .description('Manage Kaven modules');

moduleCmd
  .command('add <name>')
  .description('Add a module')
  .action(async (name) => {
    try {
      await moduleCommand('add', name);
    } catch (error) {
      logger.error(`Failed to add module: ${error}`);
      process.exit(1);
    }
  });

moduleCmd
  .command('remove <name>')
  .description('Remove a module')
  .action(async (name) => {
    try {
      await moduleCommand('remove', name);
    } catch (error) {
      logger.error(`Failed to remove module: ${error}`);
      process.exit(1);
    }
  });

moduleCmd
  .command('list')
  .description('List all modules')
  .action(async () => {
    try {
      await moduleCommand('list');
    } catch (error) {
      logger.error(`Failed to list modules: ${error}`);
      process.exit(1);
    }
  });

// kaven db
import { dbCommand } from './commands/db.js';

const dbCmd = program
  .command('db')
  .description('Database management commands');

dbCmd
  .command('generate')
  .description('Generate final schema.prisma from base and extended files')
  .action(async () => {
    try {
      await dbCommand('generate');
    } catch (error) {
      logger.error(`Failed to generate schema: ${error}`);
      process.exit(1);
    }
  });


export async function run(): Promise<void> {
  await program.parseAsync(process.argv);
}
