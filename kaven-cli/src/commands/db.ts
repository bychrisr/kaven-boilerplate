import { SchemaManager } from '../core/schema-manager.js';

export async function dbCommand(action: string): Promise<void> {
  const schemaManager = new SchemaManager(process.cwd());

  if (action === 'generate') {
    await schemaManager.mergeSchemas();
  }
}
