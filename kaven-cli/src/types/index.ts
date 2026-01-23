/**
 * Kaven CLI Types
 */

export interface KavenConfig {
  name: string;
  version: string;
  kaven: {
    version: string;
    installedAt: string;
    repository: string;
    features: {
      multiTenant: boolean;
      database: 'postgresql' | 'mysql' | 'mongodb';
      payment?: 'stripe' | 'mercadopago' | 'none';
    };
    modules: {
      core: {
        auth: boolean;
        users: boolean;
        tenants: boolean;
      };
      optional: {
        [key: string]: boolean;
      };
    };
    customizations: {
      removedModules: string[];
      addedModules: string[];
    };
    migrations?: {
      applied: string[];
      custom: string[];
    };
  };
}

export interface InstallOptions {
  projectName: string;
  database: 'postgresql' | 'mysql' | 'mongodb';
  multiTenant: boolean;
  payment: 'stripe' | 'mercadopago' | 'none';
  modules: {
    analytics: boolean;
    aiAssistant: boolean;
    notifications: boolean;
  };
}

export interface UpdateOptions {
  check?: boolean;
  force?: boolean;
  skipMigrations?: boolean;
}

export interface ModuleOptions {
  name: string;
  action: 'add' | 'remove' | 'list';
}

export interface VersionInfo {
  current: string;
  latest: string;
  updateAvailable: boolean;
}

export interface SchemaDiff {
  addedModels: string[];
  removedModels: string[];
  addedFields: Array<{
    model: string;
    field: string;
    type: string;
  }>;
  removedFields: Array<{
    model: string;
    field: string;
  }>;
  modifiedFields: Array<{
    model: string;
    field: string;
    oldType: string;
    newType: string;
  }>;
}

export interface Migration {
  id: string;
  name: string;
  timestamp: string;
  sql: string;
  source: 'kaven' | 'dev';
}

export * from './module-manifest.js';
