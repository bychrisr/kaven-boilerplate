import path from 'path';
import { logger } from '../lib/logger.js';
import { fsUtils } from '../lib/fs.js';
import { ModuleOptions, KavenConfig, ModuleManifest, ModuleManifestSchema, ModuleInjection } from '../types/index.js';

export class ModuleManager {
  private readonly projectRoot: string;
  private readonly modulesStorePath: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.modulesStorePath = path.join(projectRoot, 'kaven-cli/modules');
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

  private async loadManifest(name: string): Promise<ModuleManifest> {
      // 1. Try Local (Dev Mode / Cached)
      const manifestPath = path.join(this.modulesStorePath, name, 'module.json');
      if (await fsUtils.exists(manifestPath)) {
          try {
              const content = await fsUtils.readJSON(manifestPath);
              return ModuleManifestSchema.parse(content);
          } catch (error: any) {
              throw new Error(`Invalid manifest for module "${name}": ${error.message}`);
          }
      }

      // 2. Try Local Cache (Downloaded)
      // TODO: Implement cache dir logic explicitly if not using modulesStorePath as cache
      
      throw new Error(`Module "${name}" not found locally. Support for automatic remote download is active in addModule flow.`);
  }

  /**
   * Add a module to the project
   */
  private async addModule(name: string): Promise<void> {
    logger.startSpinner(`Adding module "${name}"...`);

    try {
      // 1. Resolve Manifest source
      let manifest: ModuleManifest;
      let modulePath = path.join(this.modulesStorePath, name);
      
      if (!await fsUtils.exists(modulePath)) {
          // Attempt Remote Download
          logger.info(`Module undefined locally, attempting download from Marketplace...`);
          
          // Lazy resolve dependencies to avoid circular imports if any, or just get from container/global
          // In this non-DI class (it's new'd manually in current CLI), we need to access container or pass deps.
          // For Phase 2 refactor, we should move ModuleManager to container.
          // But strict update: let's try to get from container instance if exported
          try {
              const { container } = await import('./ioc/container.js');
              const { TYPES } = await import('./ioc/types.js');
              const marketplace = container.get<any>(TYPES.MarketplaceClient);
              const downloadManager = container.get<any>(TYPES.DownloadManager);
              
              const moduleInfo = await marketplace.getModule(name);
              // TODO: Version selection
              const downloadToken = await marketplace.getDownloadToken(name, moduleInfo.version);
              
              // Target: modulesStorePath (acts as cache)
              await downloadManager.downloadAndExtract(name, downloadToken, modulePath);
          } catch (e: any) {
             throw new Error(`Failed to download module "${name}": ${e.message}`);
          }
      }

      manifest = await this.loadManifest(name);
      
      const config = await fsUtils.readKavenConfig(this.projectRoot);
      const storePath = path.join(this.modulesStorePath, name);

      // 2. Copy Files
      for (const file of manifest.files) {
          const sourcePath = path.join(storePath, file.path);
          const targetPath = path.join(this.projectRoot, file.target);
          if (await fsUtils.exists(sourcePath)) {
              await fsUtils.copy(sourcePath, targetPath);
          }
      }

      // 3. Inject Code
      await this.injectCode(manifest);

      // 4. Update Config
      await this.updateConfig(config, manifest.slug, true);

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
      // Try to load manifest, if fails (e.g. stores missing), try to cleanup via config if possible?
      // For Phase 0, we assume manifest exists to guide removal.
      const manifest = await this.loadManifest(name);
      const config = await fsUtils.readKavenConfig(this.projectRoot);
      
      if (!this.isModuleInstalled(config, manifest.slug)) {
        logger.warning(`Module "${name}" is not installed.`);
        logger.stopSpinner();
        return;
      }

      // 1. Remove Files
      for (const file of manifest.files) {
          // Careful: Only remove if it's a directory? 
          // Previous logic removed the whole target directory. 
          // If target is specific file, remove file. If dir, remove dir.
          // In previous implementation: path.join(this.modulesPath, name) -> removed dir.
          const targetPath = path.join(this.projectRoot, file.target);
          if (await fsUtils.exists(targetPath)) {
             await fsUtils.remove(targetPath);
          }
      }

      // 2. Eject Code
      await this.ejectCode(manifest);

      // 3. Update config
      await this.updateConfig(config, manifest.slug, false);

      logger.succeedSpinner(`Module "${name}" removed successfully!`);
    } catch (error: any) {
      logger.failSpinner(`Failed to remove module "${name}": ${error.message}`);
      throw error;
    }
  }

  /**
   * Inject code based on manifest
   */
  private async injectCode(manifest: ModuleManifest): Promise<void> {
      for (const injection of manifest.injections) {
          const absPath = path.join(this.projectRoot, injection.targetFile);
          if (!await fsUtils.exists(absPath)) continue;

          let content = await fsUtils.readFile(absPath);
          
          // Marker Logic
          const markerStart = `// [KAVEN:${manifest.slug}:${injection.dedupeKey || 'GENERIC'}:START]`;
          const markerEnd = `// [KAVEN:${manifest.slug}:${injection.dedupeKey || 'GENERIC'}:END]`;
          
          if (content.includes(markerStart)) continue; // Already injected

          const wrappedContent = `${markerStart}\n${injection.content}\n${markerEnd}`;

          if (injection.type === 'anchor' && injection.anchor) {
              const anchorTag = `// [${injection.anchor}]`;
              if (content.includes(anchorTag)) {
                  // Append strategy by default for anchors (inject BEFORE the anchor tag to keep anchor at the end of block)
                  // Wait, original logic replaced anchor with "new content + \n + anchor".
                  // This effectively "pushes" the anchor down.
                  content = content.replace(anchorTag, `${wrappedContent}\n${anchorTag}`);
                  await fsUtils.writeFile(absPath, content);
              }
          } else if (injection.type === 'patch' && injection.pattern) {
             const pattern = injection.pattern; 
             // Simple string match for Phase 0
             if (content.includes(pattern)) {
                 if (injection.strategy === 'before') {
                     content = content.replace(pattern, `${wrappedContent}\n${pattern}`);
                 } else if (injection.strategy === 'after') {
                     content = content.replace(pattern, `${pattern}\n${wrappedContent}`);
                 }
                 await fsUtils.writeFile(absPath, content);
             }
          }
      }
  }

  /**
   * Eject code based on manifest markers
   */
  private async ejectCode(manifest: ModuleManifest): Promise<void> {
      for (const injection of manifest.injections) {
          const absPath = path.join(this.projectRoot, injection.targetFile);
          if (!await fsUtils.exists(absPath)) continue;

          let content = await fsUtils.readFile(absPath);
          
          const markerStart = `// [KAVEN:${manifest.slug}:${injection.dedupeKey || 'GENERIC'}:START]`;
          const markerEnd = `// [KAVEN:${manifest.slug}:${injection.dedupeKey || 'GENERIC'}:END]`;

          // Regex to match everything between markers including markers
          // Escape special chars in markers
          const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`${escapeRegExp(markerStart)}[\\s\\S]*?${escapeRegExp(markerEnd)}\\n?`, 'g');
          
          if (regex.test(content)) {
              content = content.replace(regex, '');
              // Clean up potential double newlines left behind
              content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
              await fsUtils.writeFile(absPath, content);
          }
      }
  }

  /**
   * List installed and available modules
   */
  private async listModules(): Promise<void> {
    try {
        const config = await fsUtils.readKavenConfig(this.projectRoot);
        const installed = Object.keys(config.kaven.modules.optional).filter(k => config.kaven.modules.optional[k]);
        
        // Scan store directory for available modules
        const available: string[] = [];
        if (await fsUtils.exists(this.modulesStorePath)) {
            const items = await import('fs').then(fs => fs.promises.readdir(this.modulesStorePath));
            for (const item of items) {
                if (await fsUtils.exists(path.join(this.modulesStorePath, item, 'module.json'))) {
                    available.push(item);
                }
            }
        }
        
        logger.box('Kaven Modules', [
            'Installed:',
            ...installed.map(m => `  ✅ ${m}`),
            '',
            'Available:',
            ...available.map(m => `  📦 ${m}`),
        ]);
    } catch (error) {
        logger.error(`Failed to read config: ${error}`);
    }
  }

  private isModuleInstalled(config: KavenConfig, name: string): boolean {
    return !!config.kaven.modules.optional[name];
  }

  private async updateConfig(config: KavenConfig, name: string, installed: boolean): Promise<void> {
    // Normalizing naming: If old "payments-stripe" exists, remove it?
    // For Phase 0, we use new slug from module.json (e.g. "payments")
    
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
