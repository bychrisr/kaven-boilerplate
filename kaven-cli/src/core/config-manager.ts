import { injectable } from 'inversify';
import { z } from 'zod';
import fs from 'fs-extra';
import path from 'path';
import 'reflect-metadata';

export const KavenConfigSchema = z.object({
  name: z.string().describe("Project name"),
  version: z.string().optional().describe("Project version"),
  kaven: z.object({
    version: z.string().describe("Kaven boilerplate version"),
    features: z.object({
      multiTenant: z.boolean().default(true),
      database: z.enum(['postgresql', 'mysql', 'sqlite']).default('postgresql'),
      payment: z.string().optional(),
    }),
    modules: z.object({
      core: z.record(z.string(), z.boolean()).describe("Core modules (always present)"),
      optional: z.record(z.string(), z.boolean()).describe("Optional modules status"),
    }),
    customizations: z.object({
      addedModules: z.array(z.string()),
      removedModules: z.array(z.string()),
    }).default({ addedModules: [], removedModules: [] }),
  }),
});

export type KavenConfig = z.infer<typeof KavenConfigSchema>;

export interface IConfigManager {
  load(): Promise<KavenConfig>;
  save(config: KavenConfig): Promise<void>;
  update(updater: (config: KavenConfig) => void): Promise<void>;
  getPath(): string;
}

@injectable()
export class ConfigManager implements IConfigManager {
  private configPath: string;

  // Assuming cwd is passed via DI or resolved some other way. 
  // For simplicity in CLI IoC, we might inject a 'ProjectRoot' symbol. 
  // But defaulting to process.cwd() is fine for CLI tool usually.
  constructor() {
    this.configPath = path.join(process.cwd(), 'kaven.config.json');
  }

  async load(): Promise<KavenConfig> {
    if (!await fs.pathExists(this.configPath)) {
      throw new Error(`Config file not found at ${this.configPath}`);
    }
    // ... logic same as before ...
    try {
      const raw = await fs.readJson(this.configPath);
      try {
        const parsed = KavenConfigSchema.parse(raw);
        return parsed;
      } catch (e) {
          if (e instanceof z.ZodError) {
             const issues = e.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
             throw new Error(`Invalid kaven.config.json: ${issues}`);
          }
          throw e;
      }
    } catch (error: any) {
        if (error instanceof SyntaxError) {
          throw new Error(`Failed to parse kaven.config.json: Invalid JSON syntax.`);
        }
        throw error;
    }
  }

  async save(config: KavenConfig): Promise<void> {
    const parsed = KavenConfigSchema.parse(config);
    await fs.writeJson(this.configPath, parsed, { spaces: 2 });
  }

  async update(updater: (config: KavenConfig) => void): Promise<void> {
    const config = await this.load();
    updater(config);
    await this.save(config);
  }

  getPath(): string {
    return this.configPath;
  }
}
