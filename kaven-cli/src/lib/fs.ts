/**
 * File system utilities
 */

import fs from 'fs-extra';
import path from 'path';
import { KavenConfig } from '../types/index.js';

export class FileSystemUtils {
  /**
   * Check if directory exists and is empty
   */
  async isDirectoryEmpty(dirPath: string): Promise<boolean> {
    try {
      const files = await fs.readdir(dirPath);
      return files.length === 0;
    } catch {
      return true; // Directory doesn't exist, so it's "empty"
    }
  }

  /**
   * Ensure directory exists
   */
  async ensureDir(dirPath: string): Promise<void> {
    await fs.ensureDir(dirPath);
  }

  /**
   * Read JSON file
   */
  async readJSON<T = any>(filePath: string): Promise<T> {
    return await fs.readJSON(filePath);
  }

  /**
   * Write JSON file
   */
  async writeJSON(filePath: string, data: any): Promise<void> {
    await fs.writeJSON(filePath, data, { spaces: 2 });
  }

  /**
   * Read Kaven config
   */
  async readKavenConfig(projectPath: string): Promise<KavenConfig> {
    const configPath = path.join(projectPath, 'kaven.config.json');
    return await this.readJSON<KavenConfig>(configPath);
  }

  /**
   * Write Kaven config
   */
  async writeKavenConfig(projectPath: string, config: KavenConfig): Promise<void> {
    const configPath = path.join(projectPath, 'kaven.config.json');
    await this.writeJSON(configPath, config);
  }

  /**
   * Copy file
   */
  async copy(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest);
  }

  /**
   * Remove file or directory
   */
  async remove(path: string): Promise<void> {
    await fs.remove(path);
  }

  /**
   * Check if file exists
   */
  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read file as string
   */
  async readFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf-8');
  }

  /**
   * Write file
   */
  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content, 'utf-8');
  }

  /**
   * Create .env file from template
   */
  async createEnvFile(projectPath: string, options: any): Promise<void> {
    const envPath = path.join(projectPath, '.env');
    const envExamplePath = path.join(projectPath, '.env.example');

    if (await this.exists(envExamplePath)) {
      let envContent = await this.readFile(envExamplePath);

      // Replace placeholders based on options
      envContent = envContent.replace(
        /DATABASE_URL=.*/,
        `DATABASE_URL="${this.getDatabaseUrl(options.database)}"`
      );

      if (options.payment) {
        envContent = envContent.replace(
          /PAYMENT_PROVIDER=.*/,
          `PAYMENT_PROVIDER="${options.payment}"`
        );
      }

      await this.writeFile(envPath, envContent);
    }
  }

  /**
   * Get default database URL based on type
   */
  private getDatabaseUrl(database: string): string {
    switch (database) {
      case 'postgresql':
        return 'postgresql://postgres:password@localhost:5432/kaven';
      case 'mysql':
        return 'mysql://root:password@localhost:3306/kaven';
      case 'mongodb':
        return 'mongodb://localhost:27017/kaven';
      default:
        return 'postgresql://postgres:password@localhost:5432/kaven';
    }
  }
}

export const fsUtils = new FileSystemUtils();
