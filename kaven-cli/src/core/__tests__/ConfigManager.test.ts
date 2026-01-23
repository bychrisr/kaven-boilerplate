import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigManager } from '../config-manager';
import fs from 'fs-extra';
import path from 'path';

vi.mock('fs-extra');

describe('ConfigManager', () => {
  const configPath = path.join(process.cwd(), 'kaven.config.json');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate and load a correct config', async () => {
    const validConfig = {
      name: 'test-app',
      kaven: {
        version: '2.0.0',
        features: {
          multiTenant: true,
          database: 'postgresql',
        },
        modules: {
          core: { auth: true },
          optional: { payments: false }
        }
      }
    };

    // @ts-ignore
    fs.pathExists.mockResolvedValue(true);
    // @ts-ignore
    fs.readJson.mockResolvedValue(validConfig);

    const manager = new ConfigManager();
    const loaded = await manager.load();

    expect(loaded.name).toBe('test-app');
    expect(loaded.kaven.features.database).toBe('postgresql');
    expect(fs.readJson).toHaveBeenCalledWith(configPath);
  });

  it('should throw on invalid config structure', async () => {
    const invalidConfig = {
      name: 'test-app',
      kaven: {
        // missing features
        modules: {}
      }
    };

    // @ts-ignore
    fs.pathExists.mockResolvedValue(true);
    // @ts-ignore
    fs.readJson.mockResolvedValue(invalidConfig);

    const manager = new ConfigManager();
    await expect(manager.load()).rejects.toThrow('Invalid kaven.config.json');
  });

  it('should throw if file does not exist', async () => {
    // @ts-ignore
    fs.pathExists.mockResolvedValue(false);

    const manager = new ConfigManager();
    await expect(manager.load()).rejects.toThrow('Config file not found');
  });
});
