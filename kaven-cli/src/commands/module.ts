import { ModuleManager } from '../core/module-manager.js';

export async function moduleCommand(action: 'add' | 'remove' | 'list', moduleName?: string): Promise<void> {
  const moduleManager = new ModuleManager(process.cwd());
  
  await moduleManager.execute({
    action,
    name: moduleName || ''
  });
}
