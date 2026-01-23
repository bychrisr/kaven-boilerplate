#!/usr/bin/env node

import 'reflect-metadata';
import { Command } from 'commander';
// Ensure container logs are suppressed or handled? 
// Actually container is imported for side-effects (bindings)
import './core/ioc/container.js'; 

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Commands
import { registerAuthCommands } from './commands/auth.js';
import { registerMarketplaceCommands } from './commands/marketplace/index.js'; // Phase 2/3

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function run() {
  const program = new Command();

  // Load Package JSON for version
  // In build, src/index.ts -> dist/index.js. package.json is in ../package.json relative to dist?
  // If dist/index.js, then ../package.json is correct.
  const pkgPath = path.resolve(__dirname, '../package.json');
  let pkgVersion = '0.0.0';
  try {
      const pkg = await fs.readJson(pkgPath);
      pkgVersion = pkg.version;
  } catch (e) {
      // Ignored
  }

  program
    .name('kaven')
    .description('Kaven CLI - The Ultimate SaaS Boilerplate Tooling')
    .version(pkgVersion);

  // Register Commands
  registerAuthCommands(program);
  registerMarketplaceCommands(program);

  // Global Error Handler
  process.on('unhandledRejection', (err) => {
    console.error('CRITICAL ERROR:', err);
    process.exit(1);
  });

  await program.parseAsync(process.argv);
}

// Support direct execution if run as script
import { pathToFileURL } from 'url';
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
