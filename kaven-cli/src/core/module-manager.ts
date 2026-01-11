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
      if (!this.isValidModule(name)) {
        throw new Error(`Module "${name}" not found in Kaven catalog.`);
      }

      const config = await fsUtils.readKavenConfig(this.projectRoot);
      const storePath = path.join(this.projectRoot, 'kaven-cli/modules', name);

      // 1. Copy API files
      const apiSource = path.join(storePath, 'api');
      if (await fsUtils.exists(apiSource)) {
        const apiTarget = path.join(this.modulesPath, name);
        await fsUtils.copy(apiSource, apiTarget);
      }

      // 2. Copy Admin files
      const adminSource = path.join(storePath, 'admin');
      if (await fsUtils.exists(adminSource)) {
        const adminTarget = path.join(this.projectRoot, 'apps/admin/app/[locale]/(dashboard)', name);
        await fsUtils.copy(adminSource, adminTarget);
      }

      // 3. Inject Routes in app.ts
      await this.injectRoutes(name);

      // 4. Update Config
      await this.updateConfig(config, name, true);

      logger.succeedSpinner(`Module "${name}" added successfully!`);
    } catch (error: any) {
      logger.failSpinner(`Failed to add module "${name}": ${error.message}`);
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

      // 1. Remove files
      const apiPath = path.join(this.modulesPath, name);
      if (await fsUtils.exists(apiPath)) {
        await fsUtils.remove(apiPath);
      }

      const adminPath = path.join(this.projectRoot, 'apps/admin/app/[locale]/(dashboard)', name);
      if (await fsUtils.exists(adminPath)) {
        await fsUtils.remove(adminPath);
      }

      // 2. Remove Routes from app.ts
      await this.ejectRoutes(name);

      // 3. Update config
      await this.updateConfig(config, name, false);

      logger.succeedSpinner(`Module "${name}" removed successfully!`);
    } catch (error: any) {
      logger.failSpinner(`Failed to remove module "${name}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Inject routes into app.ts
   */
  private async injectRoutes(name: string): Promise<void> {
    const appTsPath = path.join(this.projectRoot, 'apps/api/src/app.ts');
    let content = await fsUtils.readFile(appTsPath);

    const injections: Record<string, { imports: string; registration: string }> = {
      'payments': {
        imports: "import { paymentRoutes, webhookRoutes } from './modules/payments/routes/payment.routes';\nimport { invoiceRoutes } from './modules/invoices/routes/invoice.routes';\nimport { orderRoutes } from './modules/orders/routes/order.routes';",
        registration: "app.register(paymentRoutes, { prefix: '/api/payments' });\napp.register(invoiceRoutes, { prefix: '/api/invoices' });\napp.register(orderRoutes, { prefix: '/api/orders' });\napp.register(webhookRoutes, { prefix: '/api/webhooks' });"
      },
      'observability': {
        imports: "import { observabilityRoutes } from './modules/observability/routes/observability.routes';\nimport { diagnosticsRoutes } from './modules/observability/routes/diagnostics.routes';",
        registration: "app.register(observabilityRoutes, { prefix: '/api/observability' });\napp.register(diagnosticsRoutes, { prefix: '/api/diagnostics' });"
      }
    };

    const injection = injections[name];
    if (!injection) return;

    // Inject imports
    if (!content.includes(injection.imports)) {
        content = content.replace(
            '// [KAVEN_MODULE_IMPORTS]',
            `${injection.imports}\n// [KAVEN_MODULE_IMPORTS]`
        );
    }

    // Inject registration
    if (!content.includes(injection.registration)) {
        content = content.replace(
            '// [KAVEN_MODULE_REGISTRATION]',
            `${injection.registration}\n// [KAVEN_MODULE_REGISTRATION]`
        );
    }

    await fsUtils.writeFile(appTsPath, content);
  }

  /**
   * Remove routes from app.ts
   */
  private async ejectRoutes(name: string): Promise<void> {
    const appTsPath = path.join(this.projectRoot, 'apps/api/src/app.ts');
    let content = await fsUtils.readFile(appTsPath);

    // Simple replacement strategy - in a real world we might use AST
    const routesToRemove: Record<string, string[]> = {
        'payments': [
            "import { paymentRoutes, webhookRoutes } from './modules/payments/routes/payment.routes';",
            "import { invoiceRoutes } from './modules/invoices/routes/invoice.routes';",
            "import { orderRoutes } from './modules/orders/routes/order.routes';",
            "app.register(paymentRoutes, { prefix: '/api/payments' });",
            "app.register(invoiceRoutes, { prefix: '/api/invoices' });",
            "app.register(orderRoutes, { prefix: '/api/orders' });",
            "app.register(webhookRoutes, { prefix: '/api/webhooks' });"
        ],
        'observability': [
            "import { observabilityRoutes } from './modules/observability/routes/observability.routes';",
            "import { diagnosticsRoutes } from './modules/observability/routes/diagnostics.routes';",
            "app.register(observabilityRoutes, { prefix: '/api/observability' });",
            "app.register(diagnosticsRoutes, { prefix: '/api/diagnostics' });"
        ]
    };

    const targets = routesToRemove[name];
    if (targets) {
        targets.forEach(target => {
            content = content.replace(target, '');
        });
        // Clean up empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    }

    await fsUtils.writeFile(appTsPath, content);
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
            '  📦 payments',
            '  📦 observability',
            '  📦 ai-assistant (coming soon)',
            '  📦 analytics (coming soon)'
        ]);
    } catch (error) {
        logger.error(`Failed to read config: ${error}`);
    }
  }

  private isValidModule(name: string): boolean {
    const validModules = ['payments', 'observability', 'ai-assistant', 'analytics'];
    return validModules.includes(name);
  }

  private isModuleInstalled(config: KavenConfig, name: string): boolean {
    return !!config.kaven.modules.optional[name];
  }

  private async updateConfig(config: KavenConfig, name: string, installed: boolean): Promise<void> {
    config.kaven.modules.optional[name] = installed;
    
    // Fallback if customizations object is missing
    if (!config.kaven.customizations) {
        config.kaven.customizations = { addedModules: [], removedModules: [] };
    }
    if (!config.kaven.customizations.addedModules) config.kaven.customizations.addedModules = [];
    if (!config.kaven.customizations.removedModules) config.kaven.customizations.removedModules = [];

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
