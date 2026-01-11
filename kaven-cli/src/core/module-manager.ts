import path from 'path';
import { logger } from '../lib/logger.js';
import { fsUtils } from '../lib/fs.js';
import { ModuleOptions, KavenConfig } from '../types/index.js';

export class ModuleManager {
  private readonly projectRoot: string;
  private readonly modulesPath: string;
  private injections: Record<string, { 
    appImports: string; 
    appRegistration: string; 
    appHooks?: string;
    serverImports?: string;
    serverStartup?: string;
    authControllerInjections?: {
        import: string;
        registerTrack: string;
        loginSuccessTrack: string;
        loginFailTrack: string;
    }
  }> = {
    'payments': {
      appImports: "import { paymentRoutes, webhookRoutes } from './modules/payments/routes/payment.routes';\nimport { invoiceRoutes } from './modules/invoices/routes/invoice.routes';\nimport { orderRoutes } from './modules/orders/routes/order.routes';",
      appRegistration: "app.register(paymentRoutes, { prefix: '/api/payments' });\napp.register(invoiceRoutes, { prefix: '/api/invoices' });\napp.register(orderRoutes, { prefix: '/api/orders' });\napp.register(webhookRoutes, { prefix: '/api/webhooks' });"
    },
    'observability': {
      appImports: "import { observabilityRoutes } from './modules/observability/routes/observability.routes';\nimport { diagnosticsRoutes } from './modules/observability/routes/diagnostics.routes';\nimport { advancedMetricsMiddleware, onResponseMetricsHook } from './modules/observability/middleware/advanced-metrics.middleware';",
      appHooks: "app.addHook('onRequest', advancedMetricsMiddleware);\napp.addHook('onResponse', onResponseMetricsHook);",
      appRegistration: "app.register(observabilityRoutes, { prefix: '/api/observability' });\napp.register(diagnosticsRoutes, { prefix: '/api/diagnostics' });",
      serverImports: "import { metricsUpdaterService } from './modules/observability/services/metrics-updater.service';",
      serverStartup: "metricsUpdaterService.start();",
      authControllerInjections: {
          import: "import { businessMetricsService } from '../../observability/services/business-metrics.service';",
          registerTrack: "      // 📊 Track user registration\n      if ('user' in result) {\n        businessMetricsService.trackUserRegistration(result.user.id, 'email');\n      }",
          loginSuccessTrack: "      // 📊 Track successful login\n      businessMetricsService.trackLogin(true, 'email');",
          loginFailTrack: "      // 📊 Track failed login\n      businessMetricsService.trackLogin(false, 'email');"
      }
    }
  };

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
   * Inject routes and hooks into app.ts and startup into server.ts
   */
  private async injectRoutes(name: string): Promise<void> {
    const appTsPath = path.join(this.projectRoot, 'apps/api/src/app.ts');
    const serverTsPath = path.join(this.projectRoot, 'apps/api/src/server.ts');
    const authControllerPath = path.join(this.projectRoot, 'apps/api/src/modules/auth/controllers/auth.controller.ts');
    
    let appContent = await fsUtils.readFile(appTsPath);
    let serverContent = await fsUtils.readFile(serverTsPath);

    const injection = this.injections[name];
    if (!injection) return;

    // 1. App Injections
    if (!appContent.includes(injection.appImports)) {
        appContent = appContent.replace('// [KAVEN_MODULE_IMPORTS]', `${injection.appImports}\n// [KAVEN_MODULE_IMPORTS]`);
    }
    if (injection.appHooks && !appContent.includes(injection.appHooks)) {
        appContent = appContent.replace('// [KAVEN_MODULE_HOOKS]', `${injection.appHooks}\n// [KAVEN_MODULE_HOOKS]`);
    }
    if (!appContent.includes(injection.appRegistration)) {
        appContent = appContent.replace('// [KAVEN_MODULE_REGISTRATION]', `${injection.appRegistration}\n// [KAVEN_MODULE_REGISTRATION]`);
    }

    // 2. Server Injections
    if (injection.serverImports && !serverContent.includes(injection.serverImports)) {
        serverContent = serverContent.replace('// [KAVEN_SERVER_IMPORTS]', `${injection.serverImports}\n// [KAVEN_SERVER_IMPORTS]`);
    }
    if (injection.serverStartup && !serverContent.includes(injection.serverStartup)) {
        serverContent = serverContent.replace('// [KAVEN_SERVER_STARTUP]', `${injection.serverStartup}\n// [KAVEN_SERVER_STARTUP]`);
    }

    // 3. AuthController Injections (Special case)
    if (injection.authControllerInjections && await fsUtils.exists(authControllerPath)) {
        let authContent = await fsUtils.readFile(authControllerPath);
        if (!authContent.includes(injection.authControllerInjections.import)) {
            authContent = authContent.replace("import { sanitizer } from '../../../utils/sanitizer';", `${injection.authControllerInjections.import}\nimport { sanitizer } from '../../../utils/sanitizer';`);
            authContent = authContent.replace("const result = await authService.register(data);", `const result = await authService.register(data);\n\n${injection.authControllerInjections.registerTrack}`);
            authContent = authContent.replace("const result = await authService.login(data, ip, userAgent);", `const result = await authService.login(data, ip, userAgent);\n\n${injection.authControllerInjections.loginSuccessTrack}`);
            authContent = authContent.replace("} catch (error: any) {", `} catch (error: any) {\n${injection.authControllerInjections.loginFailTrack}`);
            
            await fsUtils.writeFile(authControllerPath, authContent);
        }
    }

    await fsUtils.writeFile(appTsPath, appContent);
    await fsUtils.writeFile(serverTsPath, serverContent);
  }

  /**
   * Remove routes and hooks from core files
   */
  private async ejectRoutes(name: string): Promise<void> {
    const appTsPath = path.join(this.projectRoot, 'apps/api/src/app.ts');
    const serverTsPath = path.join(this.projectRoot, 'apps/api/src/server.ts');
    const authControllerPath = path.join(this.projectRoot, 'apps/api/src/modules/auth/controllers/auth.controller.ts');
    
    let appContent = await fsUtils.readFile(appTsPath);
    let serverContent = await fsUtils.readFile(serverTsPath);

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
            "import { advancedMetricsMiddleware, onResponseMetricsHook } from './modules/observability/middleware/advanced-metrics.middleware';",
            "app.addHook('onRequest', advancedMetricsMiddleware);",
            "app.addHook('onResponse', onResponseMetricsHook);",
            "app.register(observabilityRoutes, { prefix: '/api/observability' });",
            "app.register(diagnosticsRoutes, { prefix: '/api/diagnostics' });",
            "import { metricsUpdaterService } from './modules/observability/services/metrics-updater.service';",
            "metricsUpdaterService.start();",
            "import { businessMetricsService } from '../../observability/services/business-metrics.service';",
            "businessMetricsService.trackUserRegistration",
            "businessMetricsService.trackLogin"
        ]
    };

    const targets = routesToRemove[name];
    if (targets) {
        targets.forEach(target => {
            // Se for observabilidade, tratar AuthController especialmente antes do RegExp genérico
            if (name === 'observability' && target.startsWith('businessMetricsService.track')) {
                // Skip for generic core replacement - will handle explicitly
                return;
            }
            appContent = appContent.replace(new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
            serverContent = serverContent.replace(new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
        });
        
        // Cleanup para AuthController
        if (name === 'observability' && await fsUtils.exists(authControllerPath)) {
            let authContent = await fsUtils.readFile(authControllerPath);
            
            const authInjection = this.injections['observability'].authControllerInjections;
            if (authInjection) {
                authContent = authContent.replace(authInjection.import, '');
                authContent = authContent.replace(authInjection.registerTrack, '');
                authContent = authContent.replace(authInjection.loginSuccessTrack, '');
                authContent = authContent.replace(authInjection.loginFailTrack, '');
            }

            // Fallback for duplicates or partials
            authContent = authContent.replace(/import { businessMetricsService } from .*/g, '');
            authContent = authContent.replace(/\/\/ 📊 Track .*/g, '');
            authContent = authContent.replace(/businessMetricsService\.trackUserRegistration\(.*/g, '');
            authContent = authContent.replace(/businessMetricsService\.trackLogin\(.*/g, '');
            authContent = authContent.replace(/\(result\.user\.id, 'email'\);/g, '');
            authContent = authContent.replace(/\(true, 'email'\);/g, '');
            authContent = authContent.replace(/\(false, 'email'\);/g, '');

            // Clean up empty lines
            authContent = authContent.replace(/\n\s*\n\s*\n/g, '\n\n');
            await fsUtils.writeFile(authControllerPath, authContent);
        }

        // Clean up empty lines for app/server
        appContent = appContent.replace(/\n\s*\n\s*\n/g, '\n\n');
        serverContent = serverContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    }

    await fsUtils.writeFile(appTsPath, appContent);
    await fsUtils.writeFile(serverTsPath, serverContent);
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
