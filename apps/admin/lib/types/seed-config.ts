/**
 * Configuração para o seed script dinâmico
 * Será populado pelo Setup Wizard no futuro
 */
export interface SeedConfig {
  /** Nome da empresa dona do SaaS (Admin Tenant) */
  companyName: string;
  
  /** Email do admin principal (ARCHITECT) */
  adminEmail: string;
  
  /** Senha do admin principal */
  adminPassword: string;
  
  /** Módulos/Personas a serem criados */
  modules: {
    /** Criar usuário Finance (CFO) */
    createFinance: boolean;
    
    /** Criar usuário Support (Customer Success) */
    createSupport: boolean;
    
    /** Criar usuário Marketing (Growth) */
    createMarketing: boolean;
    
    /** Criar usuário DevOps (System Health) */
    createDevOps: boolean;
  };
  
  /** Modo de arquitetura do sistema */
  mode: 'SINGLE_TENANT' | 'MULTI_TENANT';
}

/**
 * Configuração padrão para desenvolvimento
 * Usado quando nenhuma configuração é fornecida
 */
export const DEFAULT_SEED_CONFIG: SeedConfig = {
  companyName: 'Kaven HQ',
  adminEmail: 'admin@kaven.dev',
  adminPassword: 'Admin@123',
  modules: {
    createFinance: true,
    createSupport: true,
    createMarketing: true,
    createDevOps: true
  },
  mode: 'MULTI_TENANT'
};

/**
 * Configuração mínima (apenas ARCHITECT)
 * Útil para testes ou instalações simples
 */
export const MINIMAL_SEED_CONFIG: SeedConfig = {
  companyName: 'My SaaS',
  adminEmail: 'admin@example.com',
  adminPassword: 'Admin@123',
  modules: {
    createFinance: false,
    createSupport: false,
    createMarketing: false,
    createDevOps: false
  },
  mode: 'SINGLE_TENANT'
};
