import path from 'path';
import { logger } from '../lib/logger.js';
import { fsUtils } from '../lib/fs.js';
import { ModuleOptions, KavenConfig } from '../types/index.js';

export class ModuleManager {
  private readonly projectRoot: string;
  private readonly modulesPath: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.modulesPath = path.join(projectRoot, 'apps/api/src/modules');
  }

  /**
   * Execute module action
   */
  async execute(options: ModuleOptions): Promise<void> {
    switch (options.action) {
      case 'add':
        await this.addModule(options.name);
        break;
      case 'remove':
        await this.removeModule(options.name);
        break;
      case 'list':
        await this.listModules();
        break;
      default:
        logger.error(`Unknown action: ${options.action}`);
    }
  }

  /**
   * Add a module to the project
   */
  private async addModule(name: string): Promise<void> {
    logger.startSpinner(`Adding module "${name}"...`);

    try {
      // 1. Check if module exists in catalog (simulated for now)
      if (!this.isValidModule(name)) {
        throw new Error(`Module "${name}" not found in Kaven catalog.`);
      }

      // 2. Check if already installed
      const config = await fsUtils.readKavenConfig(this.projectRoot);
      if (this.isModuleInstalled(config, name)) {
         // Even if installed, we might want to "repair" or re-add, but for now just warn
         logger.warning(`Module "${name}" is already enabled in config.`);
         // Continue anyway to ensure files are present? For now, return.
         // return; 
      }

      // 3. Download/Copy module files (Simulated logic - in real CLI this would fetch from registry/repo)
      // For this implementation, we assume modules are locally available in templates or just toggled
      // Real implementation would copy from `kaven-cli/templates/modules/${name}` to `apps/api/src/modules/${name}`
      
      // Update Config
      await this.updateConfig(config, name, true);

      logger.succeedSpinner(`Module "${name}" added successfully!`);
    } catch (error) {
      logger.failSpinner('Failed to add module');
      throw error;
    }
  }

  /**
   * Remove a module from the project
   */
  private async removeModule(name: string): Promise<void> {
    logger.startSpinner(`Removing module "${name}"...`);

    try {
      const config = await fsUtils.readKavenConfig(this.projectRoot);
      
      if (!this.isModuleInstalled(config, name)) {
        logger.warning(`Module "${name}" is not installed.`);
        logger.stopSpinner();
        return;
      }

      // 1. Remove files (Be careful here! Only remove if unmodified? Or strictly enforce?)
      const modulePath = path.join(this.modulesPath, name);
      if (await fsUtils.exists(modulePath)) {
        await fsUtils.remove(modulePath);
      }

      // 2. Update config
      await this.updateConfig(config, name, false);

      logger.succeedSpinner(`Module "${name}" removed successfully!`);
    } catch (error) {
      logger.failSpinner('Failed to remove module');
      throw error;
    }
  }

  /**
   * List installed and available modules
   */
  private async listModules(): Promise<void> {
    try {
        const config = await fsUtils.readKavenConfig(this.projectRoot);
        const installed = Object.keys(config.kaven.modules.optional).filter(k => config.kaven.modules.optional[k]);
        
        logger.box('Kaven Modules', [
            'Installed:',
            ...installed.map(m => `  ✅ ${m}`),
            '',
            'Available:',
            '  📦 payments-stripe',
            '  📦 analytics',
            '  📦 notifications'
        ]);
    } catch (error) {
        logger.error(`Failed to read config: ${error}`);
    }
  }

  private isValidModule(name: string): boolean {
    const validModules = ['payments-stripe', 'payments-mercadopago', 'analytics', 'notifications', 'ai-assistant'];
    return validModules.includes(name);
  }

  private isModuleInstalled(config: KavenConfig, name: string): boolean {
    return !!config.kaven.modules.optional[name];
  }

  private async updateConfig(config: KavenConfig, name: string, installed: boolean): Promise<void> {
    config.kaven.modules.optional[name] = installed;
    
    // Also track in customizations array for history
    if (installed) {
        if (!config.kaven.customizations.addedModules.includes(name)) {
            config.kaven.customizations.addedModules.push(name);
        }
        // Remove from removedModules if present
        config.kaven.customizations.removedModules = config.kaven.customizations.removedModules.filter(m => m !== name);
    } else {
        if (!config.kaven.customizations.removedModules.includes(name)) {
            config.kaven.customizations.removedModules.push(name);
        }
        config.kaven.customizations.addedModules = config.kaven.customizations.addedModules.filter(m => m !== name);
    }

    await fsUtils.writeKavenConfig(this.projectRoot, config);
  }
}
