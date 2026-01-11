# 📊 RELATÓRIO TÉCNICO: Sistema de Atualização e Módulos Extensíveis

> **Versão:** 2.0.0  
> **Data:** 18 de Dezembro de 2025  
> **Autor:** Chris (@bychrisr)  
> **Tipo:** Architecture Decision Record (ADR)  
> **Status:** ✅ Aprovado

---

## 📋 SUMÁRIO EXECUTIVO

Este documento especifica a arquitetura do **Sistema de Atualização e Módulos Extensíveis** do Kaven Boilerplate, que permite:

1. **Instalação independente** do boilerplate sem clonar o repositório Git
2. **Atualizações não-destrutivas** que preservam customizações do desenvolvedor
3. **Sistema de módulos opcionais** que podem ser adicionados/removidos dinamicamente
4. **Migrations aditivas** que não quebram código existente

**Objetivo:** Criar um boilerplate "vivo" que evolui sem quebrar SaaS construídos em cima dele.

---

## 📋 ÍNDICE

1. [Problema a Resolver](#1-problema-a-resolver)
2. [Visão Geral da Solução](#2-visão-geral-da-solução)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Sistema de Instalação](#4-sistema-de-instalação)
5. [Sistema de Atualização](#5-sistema-de-atualização)
6. [Sistema de Módulos](#6-sistema-de-módulos)
7. [Estratégia de Migrations](#7-estratégia-de-migrations)
8. [Schema Extensível](#8-schema-extensível)
9. [Versionamento e Compatibilidade](#9-versionamento-e-compatibilidade)
10. [Implementação Técnica](#10-implementação-técnica)
11. [Exemplos de Uso](#11-exemplos-de-uso)
12. [Roadmap de Implementação](#12-roadmap-de-implementação)

---

## 1. PROBLEMA A RESOLVER

### 1.1. Problema do Clone Git

**Cenário atual (problemático):**

```bash
# Desenvolvedor clona o boilerplate
git clone https://github.com/bychrisr/kaven-boilerplate.git my-saas
cd my-saas

# Problemas:
# 1. Histórico Git do boilerplate (não quer)
git log  # ← Commits do Kaven, não do seu SaaS

# 2. Remote apontando pro boilerplate (não quer)
git remote -v
# origin https://github.com/bychrisr/kaven-boilerplate.git

# 3. Quando tentar fazer push:
git push origin main
# ❌ Tenta pushar pro repo do Kaven!

# 4. Como receber atualizações?
# ??? (sem solução clara)
```

### 1.2. Problema das Atualizações

**Cenário problemático:**

```prisma
// Kaven v1.0 - Schema original
model User {
  id    String @id
  email String @unique
  name  String
}

// Desenvolvedor customiza
model User {
  id      String @id
  email   String @unique
  name    String
  company String?  // ← Custom
  phone   String?  // ← Custom
}

// Kaven v2.0 lança update
model User {
  id    String @id
  email String @unique
  role  String  // ← Kaven renomeou "name" para "role"
}

// ❌ PROBLEMA: Como mergear?
// Se aplicar migration do Kaven v2.0:
// - Perde "company" e "phone" (custom)
// - "name" vira "role" (quebra código existente)
```

### 1.3. Problema dos Módulos

**Cenário problemático:**

```typescript
// Kaven v1.0 vem com Stripe
import Stripe from 'stripe';

// Desenvolvedor quer Mercado Pago
// ❌ Tem que remover código do Stripe manualmente
// ❌ Tem que adicionar código do Mercado Pago
// ❌ Kaven v2.0 atualiza Stripe... mas dev não usa!
```

---

## 2. VISÃO GERAL DA SOLUÇÃO

### 2.1. Princípios Fundamentais

```
┌─────────────────────────────────────────────────────────────┐
│ PRINCÍPIO 1: INSTALAÇÃO LIMPA                               │
├─────────────────────────────────────────────────────────────┤
│ • Baixar código sem histórico Git                           │
│ • Iniciar repositório próprio do desenvolvedor              │
│ • Sem remote para o boilerplate                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRINCÍPIO 2: NUNCA ALTERE, SEMPRE ADICIONE                  │
├─────────────────────────────────────────────────────────────┤
│ • Novos campos = sempre opcionais                           │
│ • Novas tabelas = sempre separadas                          │
│ • Alterações = criar nova coluna + migration                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRINCÍPIO 3: MÓDULOS SÃO OPCIONAIS                          │
├─────────────────────────────────────────────────────────────┤
│ • Core = sempre presente                                    │
│ • Plugins = habilitados via config                          │
│ • Fácil adicionar/remover módulos                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRINCÍPIO 4: MIGRATIONS ADITIVAS                            │
├─────────────────────────────────────────────────────────────┤
│ • Sempre usar ALTER TABLE ADD                               │
│ • Nunca usar DROP ou RENAME                                 │
│ • Idempotência (pode rodar múltiplas vezes)                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2. Arquitetura em Camadas

```
┌─────────────────────────────────────────────────────────────┐
│                    KAVEN CLI                                 │
│  • create-kaven-app (instalação)                            │
│  • kaven update (atualizações)                              │
│  • kaven module add/remove (gerenciamento)                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│               KAVEN CONFIG (kaven.config.json)              │
│  • Versão instalada                                         │
│  • Módulos habilitados                                      │
│  • Customizações do desenvolvedor                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────┬────────────────┬───────────────────────────┐
│  CORE (fixo)   │ MODULES (opt)  │  CUSTOM (dev)             │
├────────────────┼────────────────┼───────────────────────────┤
│ • auth         │ • payments-*   │ • Código do dev           │
│ • users        │ • analytics    │ • Módulos customizados    │
│ • tenants      │ • ai-assistant │ • Extensões de schema     │
└────────────────┴────────────────┴───────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  PRISMA SCHEMA SYSTEM                        │
│  • schema.base.prisma (Kaven - read-only)                   │
│  • schema.extended.prisma (Dev - editável)                  │
│  • schema.prisma (Merge automático - gerado)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. ARQUITETURA DO SISTEMA

### 3.1. Estrutura de Diretórios

```
kaven-boilerplate/
├── .kaven/                          # ← NOVO: Metadados do sistema
│   ├── version                      # Versão instalada
│   ├── modules/                     # Módulos disponíveis
│   │   ├── payments-stripe/
│   │   ├── payments-mercadopago/
│   │   ├── analytics/
│   │   └── ai-assistant/
│   └── cli/                         # Scripts do CLI
│       ├── install.js
│       ├── update.js
│       └── module.js
│
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── core/                # ← CORE (sempre presente)
│   │       │   ├── auth/
│   │       │   ├── users/
│   │       │   └── tenants/
│   │       │
│   │       ├── modules/             # ← MÓDULOS (opcionais)
│   │       │   ├── payments-stripe/
│   │       │   ├── analytics/
│   │       │   └── README.md
│   │       │
│   │       └── custom/              # ← CUSTOM (dev)
│   │           └── meu-modulo/
│   │
│   └── admin/
│       └── components/
│           ├── ui/                  # ← Kaven (shadcn)
│           └── custom/              # ← Dev custom
│
├── packages/
│   └── shared/                      # ← Kaven shared code
│       ├── types/
│       └── utils/
│
├── prisma/
│   ├── schema.base.prisma           # ← NOVO: Kaven base (read-only)
│   ├── schema.extended.prisma       # ← NOVO: Dev extensions
│   ├── schema.prisma                # ← GERADO: Merge automático
│   └── migrations/
│       ├── 001_kaven_init/          # ← Kaven core
│       ├── 002_dev_custom/          # ← Dev custom
│       └── 003_kaven_2fa/           # ← Kaven feature
│
├── kaven.config.json                # ← NOVO: Configuração
└── package.json
```

### 3.2. Separação de Responsabilidades

| Camada | Responsável | Pode Editar? | Atualizado Por |
|--------|-------------|--------------|----------------|
| **Core** (`apps/api/src/core/`) | Kaven | ❌ Não | `kaven update` |
| **Modules** (`apps/api/src/modules/`) | Kaven | ⚠️ Não recomendado | `kaven update` |
| **Custom** (`apps/api/src/custom/`) | Dev | ✅ Sim | Dev |
| **Shared** (`packages/shared/`) | Kaven | ❌ Não | `kaven update` |
| **Schema Base** (`schema.base.prisma`) | Kaven | ❌ Não | `kaven update` |
| **Schema Extended** (`schema.extended.prisma`) | Dev | ✅ Sim | Dev |
| **Migrations Kaven** (`migrations/00X_kaven_*`) | Kaven | ❌ Não | `kaven update` |
| **Migrations Custom** (`migrations/00X_dev_*`) | Dev | ✅ Sim | Dev |

---

## 4. SISTEMA DE INSTALAÇÃO

### 4.1. CLI de Instalação

**Comando:**

```bash
npx create-kaven-app my-saas
```

**Fluxo de Instalação:**

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: COLETAR INFORMAÇÕES                                 │
├─────────────────────────────────────────────────────────────┤
│ • Nome do projeto                                           │
│ • Banco de dados (PostgreSQL/MySQL/MongoDB)                 │
│ • Multi-tenant? (Sim/Não)                                   │
│ • Gateway de pagamento (Stripe/Mercado Pago/Nenhum)         │
│ • Módulos opcionais (Analytics, AI Assistant, etc)          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: BAIXAR TEMPLATE                                     │
├─────────────────────────────────────────────────────────────┤
│ • Usar degit (sem histórico Git)                            │
│ • Baixar versão específica (tag)                            │
│ • Extrair para diretório do projeto                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: CONFIGURAR PROJETO                                  │
├─────────────────────────────────────────────────────────────┤
│ • Criar kaven.config.json                                   │
│ • Habilitar módulos selecionados                            │
│ • Remover módulos não selecionados                          │
│ • Configurar .env                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: INSTALAR DEPENDÊNCIAS                               │
├─────────────────────────────────────────────────────────────┤
│ • pnpm install                                              │
│ • Gerar Prisma client                                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: INICIAR GIT                                         │
├─────────────────────────────────────────────────────────────┤
│ • git init                                                  │
│ • git add .                                                 │
│ • git commit -m "chore: initial commit from Kaven v2.0.0"  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: PRONTO!                                             │
├─────────────────────────────────────────────────────────────┤
│ ✅ Projeto configurado                                      │
│ ✅ Dependências instaladas                                  │
│ ✅ Git inicializado (SEM remote do Kaven)                   │
│ ✅ Pronto para desenvolvimento                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Arquivo de Configuração

**kaven.config.json:**

```json
{
  "name": "my-saas",
  "version": "1.0.0",
  "kaven": {
    "version": "2.0.0",
    "installedAt": "2025-12-18T00:00:00Z",
    "repository": "https://github.com/bychrisr/kaven-boilerplate",
    "features": {
      "multiTenant": true,
      "database": "postgresql",
      "payment": "stripe"
    },
    "modules": {
      "core": {
        "auth": true,
        "users": true,
        "tenants": true
      },
      "optional": {
        "payments-stripe": true,
        "payments-mercadopago": false,
        "analytics": true,
        "ai-assistant": false,
        "notifications": false
      }
    },
    "customizations": {
      "removedModules": [],
      "addedModules": ["meu-modulo-custom"]
    }
  }
}
```

---

## 5. SISTEMA DE ATUALIZAÇÃO

### 5.1. Fluxo de Atualização

**Comando:**

```bash
pnpm kaven update
# ou
npx kaven update
```

**Processo de Atualização:**

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: VERIFICAR VERSÃO                                    │
├─────────────────────────────────────────────────────────────┤
│ • Ler kaven.config.json                                     │
│ • Versão atual: 2.0.0                                       │
│ • Buscar última versão: GitHub API                          │
│ • Versão disponível: 2.5.0                                  │
│                                                             │
│ Atualizar de v2.0.0 → v2.5.0?                              │
│ [Y/n]: Y                                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: ANÁLISE DE MUDANÇAS                                 │
├─────────────────────────────────────────────────────────────┤
│ 📊 Analisando diferenças...                                 │
│                                                             │
│ ✅ Adições seguras:                                         │
│   • User.twoFactorSecret (novo campo)                       │
│   • User.emailVerified (novo campo)                         │
│   • TwoFactorBackupCode (nova tabela)                       │
│                                                             │
│ ⚠️  Mudanças de módulos:                                    │
│   • payments-stripe: v1.0 → v2.0                            │
│                                                             │
│ ❌ Breaking changes:                                        │
│   Nenhum detectado                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: CRIAR BRANCH DE UPDATE                              │
├─────────────────────────────────────────────────────────────┤
│ git checkout -b update/kaven-v2.5.0                         │
│                                                             │
│ ✅ Branch criada                                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: BAIXAR NOVA VERSÃO                                  │
├─────────────────────────────────────────────────────────────┤
│ • Baixar Kaven v2.5.0 em /tmp/kaven-update                  │
│ • Verificar checksum (segurança)                            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: ATUALIZAR ARQUIVOS DO KAVEN                         │
├─────────────────────────────────────────────────────────────┤
│ Copiando arquivos atualizáveis:                             │
│   ✅ .kaven/ (metadados)                                    │
│   ✅ apps/api/src/core/ (core modules)                      │
│   ✅ packages/shared/ (shared utils)                        │
│   ✅ prisma/schema.base.prisma (base schema)                │
│                                                             │
│ Preservando arquivos do dev:                                │
│   ⏭️  apps/api/src/custom/ (SKIP)                           │
│   ⏭️  prisma/schema.extended.prisma (SKIP)                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: ATUALIZAR MÓDULOS                                   │
├─────────────────────────────────────────────────────────────┤
│ • payments-stripe: v1.0 → v2.0                              │
│   ✅ Atualizado                                             │
│                                                             │
│ • analytics: v1.0 (sem atualização disponível)              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: EXECUTAR MIGRATIONS                                 │
├─────────────────────────────────────────────────────────────┤
│ Nova migration detectada:                                   │
│   • 010_kaven_2fa_system.sql                                │
│                                                             │
│ Executar migration?                                         │
│ [Y/n]: Y                                                    │
│                                                             │
│ ✅ Migration aplicada                                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: ATUALIZAR CONFIG                                    │
├─────────────────────────────────────────────────────────────┤
│ • kaven.version: 2.0.0 → 2.5.0                              │
│ • updatedAt: 2025-12-18T00:00:00Z                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 9: COMMIT MUDANÇAS                                     │
├─────────────────────────────────────────────────────────────┤
│ git add .                                                   │
│ git commit -m "chore: update Kaven v2.0.0 → v2.5.0"         │
│                                                             │
│ ✅ Atualização completa!                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 10: REVISAR E APLICAR                                  │
├─────────────────────────────────────────────────────────────┤
│ 📋 Revisar mudanças:                                        │
│   git diff main...update/kaven-v2.5.0                       │
│                                                             │
│ ✅ Aplicar atualização:                                     │
│   git checkout main                                         │
│   git merge update/kaven-v2.5.0                             │
│                                                             │
│ ❌ Reverter (se necessário):                                │
│   git branch -D update/kaven-v2.5.0                         │
└─────────────────────────────────────────────────────────────┘
```

### 5.2. Estratégia de Merge Inteligente

**Arquivos que SEMPRE são atualizados:**

```bash
.kaven/                    # Metadados do Kaven
apps/api/src/core/         # Core modules (auth, users, tenants)
packages/shared/           # Shared utilities
prisma/schema.base.prisma  # Base schema
.github/workflows/         # CI/CD workflows
```

**Arquivos que NUNCA são sobrescritos:**

```bash
apps/api/src/custom/                # Código custom do dev
prisma/schema.extended.prisma       # Extensões do schema
.env                                # Variáveis de ambiente
kaven.config.json (apenas version)  # Config (preserva customizações)
```

**Arquivos que são MERGEADOS:**

```bash
package.json          # Dependencies merge
prisma/migrations/    # Adiciona novas, mantém antigas
```

---

## 6. SISTEMA DE MÓDULOS

### 6.1. Arquitetura de Plugins

```typescript
// apps/api/src/modules/payments-stripe/index.ts
import { FastifyPluginAsync } from 'fastify';
import Stripe from 'stripe';

export const stripePlugin: FastifyPluginAsync = async (app, opts) => {
  // Só registra se habilitado no config
  if (!opts.enabled) {
    app.log.info('Stripe module disabled');
    return;
  }

  // Inicializar Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Decorar app com cliente
  app.decorate('stripe', stripe);

  // Registrar rotas
  app.post('/payments/stripe/checkout', async (req, reply) => {
    const { amount, currency } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      amount,
      currency,
      // ...
    });
    
    return { sessionId: session.id };
  });

  app.log.info('Stripe module loaded');
};

export default stripePlugin;
```

### 6.2. Registro Automático de Módulos

```typescript
// apps/api/src/index.ts
import { Fastify } from 'fastify';
import { loadKavenModules } from './.kaven/loader';

const app = Fastify();

// Carregar módulos do Kaven baseado no config
const kavenModules = await loadKavenModules('./kaven.config.json');

for (const module of kavenModules) {
  await app.register(module.plugin, module.options);
}

// Desenvolvedor adiciona seus próprios módulos
await app.register(import('./custom/meu-modulo'));

app.listen({ port: 8000 });
```

### 6.3. Loader de Módulos

```typescript
// .kaven/loader.ts
import fs from 'fs/promises';
import path from 'path';

export async function loadKavenModules(configPath: string) {
  // Ler config
  const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  const modules = [];

  // Carregar módulos habilitados
  for (const [moduleName, enabled] of Object.entries(config.kaven.modules.optional)) {
    if (!enabled) continue;

    const modulePath = path.join(
      process.cwd(),
      'apps/api/src/modules',
      moduleName
    );

    // Verificar se módulo existe
    const exists = await fs.access(modulePath).then(() => true).catch(() => false);
    if (!exists) {
      console.warn(`Module ${moduleName} enabled but not found`);
      continue;
    }

    // Importar módulo
    const module = await import(modulePath);
    
    modules.push({
      name: moduleName,
      plugin: module.default,
      options: {
        enabled: true,
        ...config.kaven.modules.options?.[moduleName]
      }
    });
  }

  return modules;
}
```

### 6.4. Comandos de Gerenciamento

**Adicionar módulo:**

```bash
pnpm kaven module add analytics

# O que acontece:
# 1. Baixa módulo do registry do Kaven
# 2. Instala em apps/api/src/modules/analytics/
# 3. Atualiza kaven.config.json
# 4. Instala dependências do módulo
# 5. Executa migrations (se houver)
# 6. Atualiza package.json
```

**Remover módulo:**

```bash
pnpm kaven module remove analytics

# O que acontece:
# 1. Remove de apps/api/src/modules/analytics/
# 2. Atualiza kaven.config.json
# 3. Remove dependências (se não usadas)
# 4. NÃO remove migrations (data safety)
```

**Listar módulos:**

```bash
pnpm kaven module list

# Output:
# CORE MODULES (sempre habilitados):
#   ✅ auth
#   ✅ users
#   ✅ tenants
#
# OPTIONAL MODULES:
#   ✅ payments-stripe (v2.0.0)
#   ❌ payments-mercadopago
#   ✅ analytics (v1.0.0)
#   ❌ ai-assistant
#
# CUSTOM MODULES:
#   📦 meu-modulo-custom (local)
```

---

## 7. ESTRATÉGIA DE MIGRATIONS

### 7.1. Migrations Aditivas

**Regra de Ouro:**

> **NUNCA** altere ou remova, **SEMPRE** adicione.

**✅ PERMITIDO:**

```sql
-- Adicionar coluna opcional
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;

-- Adicionar coluna com default
ALTER TABLE "User" ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- Criar nova tabela
CREATE TABLE "TwoFactorBackupCode" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  PRIMARY KEY ("id")
);

-- Adicionar índice
CREATE INDEX "User_email_idx" ON "User"("email");

-- Adicionar constraint
ALTER TABLE "TwoFactorBackupCode" 
  ADD CONSTRAINT "TwoFactorBackupCode_userId_fkey" 
  FOREIGN KEY ("userId") REFERENCES "User"("id");
```

**❌ PROIBIDO (breaking changes):**

```sql
-- ❌ Remover coluna
ALTER TABLE "User" DROP COLUMN "name";

-- ❌ Renomear coluna
ALTER TABLE "User" RENAME COLUMN "name" TO "fullName";

-- ❌ Alterar tipo (pode quebrar)
ALTER TABLE "User" ALTER COLUMN "name" TYPE VARCHAR(50);

-- ❌ Adicionar coluna obrigatória (sem default)
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL;

-- ❌ Remover tabela
DROP TABLE "OldTable";
```

### 7.2. Padrão de Deprecation

**Se REALMENTE precisar alterar algo:**

```sql
-- STEP 1: Adicionar nova coluna (migration 1)
ALTER TABLE "User" ADD COLUMN "fullName" TEXT;

-- STEP 2: Popular nova coluna (migration 1)
UPDATE "User" SET "fullName" = "name";

-- STEP 3: Deprecar antiga (comentário no schema)
-- model User {
--   name     String  @deprecated("Use fullName instead")
--   fullName String?
-- }

-- STEP 4: Após 2-3 releases, remover (migration 2)
-- ALTER TABLE "User" DROP COLUMN "name";
```

### 7.3. Naming Convention

```
migrations/
├── 001_kaven_init/                    # Kaven v1.0 (core)
├── 002_dev_add_company_fields/        # Dev custom
├── 003_kaven_add_2fa/                 # Kaven v2.0 (feature)
├── 004_dev_add_orders_table/          # Dev custom
├── 005_kaven_add_notifications/       # Kaven v2.5 (module)
└── 006_dev_add_subscription_table/    # Dev custom

# Pattern:
# {number}_kaven_{feature}/    ← Kaven official
# {number}_dev_{feature}/      ← Dev custom
```

### 7.4. Migration Versioning

```json
// kaven.config.json
{
  "kaven": {
    "migrations": {
      "applied": [
        "001_kaven_init",
        "003_kaven_add_2fa",
        "005_kaven_add_notifications"
      ],
      "custom": [
        "002_dev_add_company_fields",
        "004_dev_add_orders_table",
        "006_dev_add_subscription_table"
      ]
    }
  }
}
```

---

## 8. SCHEMA EXTENSÍVEL

### 8.1. Arquitetura de 3 Camadas

```
┌─────────────────────────────────────────────────────────────┐
│ schema.base.prisma (Kaven - Read-only)                      │
├─────────────────────────────────────────────────────────────┤
│ • Definições core do Kaven                                  │
│ • ⚠️ NUNCA editar manualmente!                              │
│ • Atualizado via `kaven update`                             │
└─────────────────────────────────────────────────────────────┘
                           +
┌─────────────────────────────────────────────────────────────┐
│ schema.extended.prisma (Dev - Editable)                     │
├─────────────────────────────────────────────────────────────┤
│ • Extensões do desenvolvedor                                │
│ • ✅ Livre para editar                                      │
│ • Nunca sobrescrito por updates                             │
└─────────────────────────────────────────────────────────────┘
                           =
┌─────────────────────────────────────────────────────────────┐
│ schema.prisma (Gerado - Auto-merge)                         │
├─────────────────────────────────────────────────────────────┤
│ • Merge automático de base + extended                       │
│ • ⚠️ Arquivo gerado, não editar!                            │
│ • Usado pelo Prisma Client                                  │
└─────────────────────────────────────────────────────────────┘
```

### 8.2. Schema Base (Kaven)

```prisma
// prisma/schema.base.prisma
// ⚠️ DO NOT EDIT THIS FILE MANUALLY!
// This file is managed by Kaven CLI

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════════════════════
// KAVEN CORE MODELS (v2.0.0)
// ═══════════════════════════════════════════════════════════

/// User model (core)
/// @kaven v2.0.0
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Kaven v2.0 additions
  twoFactorSecret String?
  emailVerified   Boolean @default(false)
  
  // Relations
  tenant   Tenant? @relation(fields: [tenantId], references: [id])
  tenantId String?
  
  @@index([email])
}

/// Tenant model (core)
/// @kaven v2.0.0
model Tenant {
  id     String @id @default(uuid())
  name   String
  slug   String @unique
  status String @default("ACTIVE")
  
  users User[]
  
  @@index([slug])
}
```

### 8.3. Schema Extended (Dev)

```prisma
// prisma/schema.extended.prisma
// ✅ Safe to edit - your customizations

// ═══════════════════════════════════════════════════════════
// CUSTOM EXTENSIONS
// ═══════════════════════════════════════════════════════════

// Extend User with custom fields
model User {
  // Base fields from schema.base.prisma
  // (no need to redeclare)
  
  // Custom fields
  company     String?
  phone       String?
  avatar      String?
  preferences Json?
  
  // Custom relations
  orders       Order[]
  subscription Subscription?
}

// Custom tables
model Order {
  id        String   @id @default(uuid())
  userId    String
  total     Decimal
  status    String
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id])
}

model Subscription {
  id        String   @id @default(uuid())
  userId    String   @unique
  plan      String
  status    String
  expiresAt DateTime
  
  user User @relation(fields: [userId], references: [id])
}
```

### 8.4. Merge Automático

```typescript
// .kaven/schema-merger.ts
import fs from 'fs/promises';

export async function mergeSchemas() {
  const base = await fs.readFile('prisma/schema.base.prisma', 'utf-8');
  const extended = await fs.readFile('prisma/schema.extended.prisma', 'utf-8');
  
  // Parse base schema
  const baseModels = parseModels(base);
  const extendedModels = parseModels(extended);
  
  // Merge models
  const merged = mergeModels(baseModels, extendedModels);
  
  // Generate final schema
  const finalSchema = generateSchema(merged);
  
  // Write to schema.prisma
  await fs.writeFile('prisma/schema.prisma', finalSchema);
  
  console.log('✅ Schema merged successfully');
}

// Executar automaticamente em:
// 1. `kaven update` (após atualizar base)
// 2. `pnpm prisma generate` (hook)
// 3. `pnpm prisma migrate` (hook)
```

---

## 9. VERSIONAMENTO E COMPATIBILIDADE

### 9.1. Semantic Versioning

```
MAJOR.MINOR.PATCH

Examples:
v1.0.0 → v1.1.0   = Novos campos opcionais (SAFE)
v1.0.0 → v2.0.0   = Breaking changes (CUIDADO)
v2.0.0 → v2.0.1   = Bug fixes (SAFE)
```

### 9.2. Compatibilidade Garantida

| Update Type | Safe? | Requires Review? | Auto-Apply? |
|-------------|-------|------------------|-------------|
| PATCH (2.0.0 → 2.0.1) | ✅ Sim | ❌ Não | ✅ Sim |
| MINOR (2.0.0 → 2.1.0) | ✅ Sim | ⚠️ Recomendado | ✅ Sim |
| MAJOR (2.0.0 → 3.0.0) | ❌ Não | ✅ Obrigatório | ❌ Não |

### 9.3. Breaking Changes

**Quando permitido:**

- Major version bump (v2.0.0 → v3.0.0)
- Com migration guide detalhado
- Com período de deprecation (2-3 releases)

**Exemplo de CHANGELOG:**

```markdown
# CHANGELOG

## v3.0.0 (2025-06-01)

### ⚠️ BREAKING CHANGES

1. **User.role is now enum** (was string)
   - Migration: `ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING role::"Role"`
   - Affected: Custom code using `user.role = "admin"`
   - Fix: Use `user.role = Role.ADMIN`

2. **Removed deprecated fields**
   - `User.name` → Use `User.fullName` instead
   - `Tenant.domain` → Use `Tenant.customDomain` instead

### 📦 Migration Guide

See [MIGRATION_GUIDE_v3.md](./docs/MIGRATION_GUIDE_v3.md)

### ✨ New Features

- Multi-factor authentication (MFA)
- Audit log system
- Advanced RBAC

### 🔄 How to Upgrade

```bash
# 1. Backup database
pg_dump mydb > backup.sql

# 2. Update Kaven
pnpm kaven update

# 3. Review changes
git diff main...update/kaven-v3.0.0

# 4. Apply (if satisfied)
git checkout main
git merge update/kaven-v3.0.0
```
```

---

## 10. IMPLEMENTAÇÃO TÉCNICA

### 10.1. CLI Package Structure

```
@kaven/cli/
├── bin/
│   ├── create-kaven-app.js       # Entry point for installation
│   └── kaven.js                  # Entry point for updates
│
├── src/
│   ├── commands/
│   │   ├── create.ts             # Installation logic
│   │   ├── update.ts             # Update logic
│   │   └── module.ts             # Module management
│   │
│   ├── utils/
│   │   ├── git.ts                # Git helpers
│   │   ├── schema-merger.ts      # Schema merge logic
│   │   └── migration-detector.ts # Detect schema changes
│   │
│   └── templates/
│       └── kaven.config.json     # Default config template
│
├── package.json
└── README.md
```

### 10.2. Schema Merger Implementation

```typescript
// .kaven/schema-merger.ts
import * as fs from 'fs/promises';
import { parse, print } from '@prisma/internals';

interface Model {
  name: string;
  fields: Field[];
  attributes: Attribute[];
}

interface Field {
  name: string;
  type: string;
  attributes: Attribute[];
}

export async function mergeSchemas(): Promise<void> {
  // Read schemas
  const baseContent = await fs.readFile('prisma/schema.base.prisma', 'utf-8');
  const extendedContent = await fs.readFile('prisma/schema.extended.prisma', 'utf-8');
  
  // Parse both
  const baseSchema = parse(baseContent);
  const extendedSchema = parse(extendedContent);
  
  // Merge models
  const mergedModels = new Map<string, Model>();
  
  // Add all base models
  for (const model of baseSchema.models) {
    mergedModels.set(model.name, model);
  }
  
  // Merge extended models
  for (const extModel of extendedSchema.models) {
    const baseMod = mergedModels.get(extModel.name);
    
    if (baseMod) {
      // Merge fields (extended fields are added)
      const mergedFields = [...baseMod.fields];
      
      for (const extField of extModel.fields) {
        // Check if field already exists in base
        const exists = baseMod.fields.some(f => f.name === extField.name);
        
        if (!exists) {
          mergedFields.push(extField);
        }
      }
      
      mergedModels.set(extModel.name, {
        ...baseMod,
        fields: mergedFields
      });
    } else {
      // New model from extended
      mergedModels.set(extModel.name, extModel);
    }
  }
  
  // Generate final schema
  const finalSchema = print({
    ...baseSchema,
    models: Array.from(mergedModels.values())
  });
  
  // Write
  await fs.writeFile('prisma/schema.prisma', finalSchema);
  
  console.log('✅ Schemas merged successfully');
}
```

### 10.3. Migration Detector

```typescript
// .kaven/migration-detector.ts
import { getDMMF } from '@prisma/internals';
import * as fs from 'fs/promises';

interface SchemaDiff {
  addedModels: string[];
  removedModels: string[];
  addedFields: Array<{ model: string; field: string }>;
  removedFields: Array<{ model: string; field: string }>;
  modifiedFields: Array<{ model: string; field: string; change: string }>;
}

export async function detectSchemaChanges(
  oldSchemaPath: string,
  newSchemaPath: string
): Promise<SchemaDiff> {
  const oldContent = await fs.readFile(oldSchemaPath, 'utf-8');
  const newContent = await fs.readFile(newSchemaPath, 'utf-8');
  
  const oldDMMF = await getDMMF({ datamodel: oldContent });
  const newDMMF = await getDMMF({ datamodel: newContent });
  
  const diff: SchemaDiff = {
    addedModels: [],
    removedModels: [],
    addedFields: [],
    removedFields: [],
    modifiedFields: []
  };
  
  // Detect model changes
  const oldModels = new Set(oldDMMF.datamodel.models.map(m => m.name));
  const newModels = new Set(newDMMF.datamodel.models.map(m => m.name));
  
  for (const model of newModels) {
    if (!oldModels.has(model)) {
      diff.addedModels.push(model);
    }
  }
  
  for (const model of oldModels) {
    if (!newModels.has(model)) {
      diff.removedModels.push(model);
    }
  }
  
  // Detect field changes
  for (const newModel of newDMMF.datamodel.models) {
    const oldModel = oldDMMF.datamodel.models.find(m => m.name === newModel.name);
    
    if (!oldModel) continue; // New model, already tracked
    
    const oldFields = new Map(oldModel.fields.map(f => [f.name, f]));
    const newFields = new Map(newModel.fields.map(f => [f.name, f]));
    
    // Added fields
    for (const [fieldName, field] of newFields) {
      if (!oldFields.has(fieldName)) {
        diff.addedFields.push({
          model: newModel.name,
          field: fieldName
        });
      }
    }
    
    // Removed fields
    for (const [fieldName] of oldFields) {
      if (!newFields.has(fieldName)) {
        diff.removedFields.push({
          model: newModel.name,
          field: fieldName
        });
      }
    }
    
    // Modified fields
    for (const [fieldName, newField] of newFields) {
      const oldField = oldFields.get(fieldName);
      if (!oldField) continue;
      
      if (oldField.type !== newField.type) {
        diff.modifiedFields.push({
          model: newModel.name,
          field: fieldName,
          change: `${oldField.type} → ${newField.type}`
        });
      }
    }
  }
  
  return diff;
}
```

---

## 11. EXEMPLOS DE USO

### 11.1. Instalação

```bash
# 1. Criar novo projeto
npx create-kaven-app my-saas

# Wizard interativo:
? Project name: my-saas
? Database: PostgreSQL
? Enable multi-tenancy? Yes
? Payment gateway: Stripe
? Enable analytics module? Yes
? Enable AI assistant module? No

📦 Downloading Kaven Boilerplate v2.0.0...
⚙️  Configuring project...
📦 Installing dependencies...
🔧 Initializing Git...

✅ Project created successfully!

Next steps:
  cd my-saas
  pnpm dev

# 2. Estrutura criada
my-saas/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── core/                # ← Kaven core
│   │       ├── modules/
│   │       │   ├── payments-stripe/ # ← Habilitado
│   │       │   └── analytics/       # ← Habilitado
│   │       └── custom/              # ← Seu código aqui
│   └── admin/
├── prisma/
│   ├── schema.base.prisma           # ← Kaven (não editar)
│   ├── schema.extended.prisma       # ← Seu (editar)
│   └── schema.prisma                # ← Gerado
├── kaven.config.json                # ← Config
└── package.json

# 3. Git inicializado (sem remote)
git remote -v
# (vazio - sem remote para o Kaven)
```

### 11.2. Desenvolvimento

```bash
# Adicionar campo customizado
# Edit: prisma/schema.extended.prisma

model User {
  // Campos do Kaven (não redeclarar)
  
  // Seus campos
  company String?
  phone   String?
}

# Gerar migration
pnpm prisma migrate dev --name add_company_phone

# Migration criada:
migrations/002_dev_add_company_phone/migration.sql
```

### 11.3. Atualização

```bash
# 6 meses depois... Kaven lança v2.5.0

pnpm kaven update

🔍 Checking for updates...
📦 Current version: v2.0.0
🚀 Available version: v2.5.0

📊 Changes detected:
  ✅ User.twoFactorSecret (new field)
  ✅ User.emailVerified (new field)
  ✅ TwoFactorBackupCode (new table)
  ⚠️  payments-stripe: v1.0 → v2.0

❌ No breaking changes detected

Update to v2.5.0? [Y/n]: Y

📦 Downloading Kaven v2.5.0...
🔄 Creating branch update/kaven-v2.5.0...
📝 Applying changes...
  ✅ Updated core modules
  ✅ Updated base schema
  ✅ Updated payments-stripe module
  ⏭️  Preserved custom code
🗃️  Applying migrations...
  ✅ 010_kaven_2fa_system.sql applied
📝 Committing changes...

✅ Update complete!

Review changes:
  git diff main...update/kaven-v2.5.0

Apply update:
  git checkout main
  git merge update/kaven-v2.5.0

# Revisar
git diff main...update/kaven-v2.5.0

# Aplicar
git checkout main
git merge update/kaven-v2.5.0

# Seu código custom permanece intacto!
```

### 11.4. Adicionar Módulo

```bash
# Adicionar módulo de AI Assistant

pnpm kaven module add ai-assistant

📦 Installing ai-assistant module...
  ✅ Downloaded ai-assistant v1.0.0
  ✅ Installed to apps/api/src/modules/ai-assistant/
  ✅ Updated kaven.config.json
  ✅ Installed dependencies
  ✅ Applied migrations

✅ ai-assistant module installed!

To use:
  import { aiAssistant } from '@/modules/ai-assistant';
  
Configuration:
  Set OPENAI_API_KEY in .env

# kaven.config.json atualizado:
{
  "modules": {
    "optional": {
      "ai-assistant": true  // ← Habilitado
    }
  }
}
```

---

## 12. ROADMAP DE IMPLEMENTAÇÃO

### 12.1. Phase 1: MVP (Semanas 1-2)

**Objetivo:** Sistema básico de instalação

```
✅ Criar CLI básico (@kaven/cli)
✅ Comando create-kaven-app
✅ Download via degit
✅ Configuração interativa (wizard)
✅ Geração de kaven.config.json
✅ Git init automático
```

### 12.2. Phase 2: Sistema de Módulos (Semanas 3-4)

**Objetivo:** Módulos podem ser habilitados/desabilitados

```
✅ Estrutura de módulos (apps/api/src/modules/)
✅ Loader de módulos (registro dinâmico)
✅ Config de módulos (kaven.config.json)
✅ Comando `kaven module add/remove`
```

### 12.3. Phase 3: Schema Extensível (Semanas 5-6)

**Objetivo:** Schema pode ser estendido sem conflitos

```
✅ schema.base.prisma (Kaven)
✅ schema.extended.prisma (Dev)
✅ Schema merger (.kaven/schema-merger.ts)
✅ Hook automático (pnpm prisma generate)
```

### 12.4. Phase 4: Sistema de Atualização (Semanas 7-8)

**Objetivo:** Updates não-destrutivos

```
✅ Comando `kaven update`
✅ Detecção de versão (GitHub API)
✅ Download seletivo de arquivos
✅ Merge inteligente
✅ Migration detector
✅ Git branch automático
```

### 12.5. Phase 5: Refinamento (Semanas 9-10)

**Objetivo:** Testes e documentação

```
✅ Testes de integração (CLI)
✅ Documentação completa
✅ Video tutorial
✅ Migration guides
✅ CHANGELOG detalhado
```

### 12.6. Phase 6: Registry de Módulos (Semanas 11-12)

**Objetivo:** Marketplace de módulos

```
✅ Registry público (kaven.dev/modules)
✅ CLI busca módulos do registry
✅ Versionamento de módulos
✅ Módulos da comunidade
```

---

## 13. DECISÕES ARQUITETURAIS

### ADR-011: Instalação via CLI (não Git Clone)

**Status:** ✅ Aceito

**Contexto:**
Boilerplate precisa ser instalado sem trazer histórico Git e remote do boilerplate.

**Decisão:**
Usar CLI (`create-kaven-app`) que baixa via degit e inicializa Git limpo.

**Alternativas:**
1. ❌ Git clone + script de limpeza (complexo, propenso a erros)
2. ❌ Zip download (não versionado)
3. ✅ Degit + CLI (simples, limpo)

**Consequências:**
- Requer NPM package (@kaven/cli)
- Requer manutenção do CLI
- Melhor DX (developer experience)

---

### ADR-012: Módulos Opcionais via Plugin System

**Status:** ✅ Aceito

**Contexto:**
Nem todo SaaS precisa de todos os módulos (ex: Stripe vs Mercado Pago).

**Decisão:**
Sistema de plugins Fastify com registro dinâmico baseado em config.

**Alternativas:**
1. ❌ Monólito (tudo sempre carregado)
2. ❌ Microservices (muito complexo para boilerplate)
3. ✅ Plugins (flexível, simples)

**Consequências:**
- Requer loader de módulos
- Config em kaven.config.json
- Módulos devem seguir contrato (interface)

---

### ADR-013: Schema em 3 Camadas

**Status:** ✅ Aceito

**Contexto:**
Prisma schema único não permite merge limpo entre Kaven e customizações.

**Decisão:**
Dividir em `schema.base.prisma` (Kaven), `schema.extended.prisma` (Dev), `schema.prisma` (gerado).

**Alternativas:**
1. ❌ Schema único (conflitos de merge)
2. ❌ Database separados (complexo, caro)
3. ✅ Merge de schemas (clean separation)

**Consequências:**
- Requer schema merger
- Hook no prisma generate
- Desenvolvimento mais complexo (merge logic)

---

### ADR-014: Migrations Aditivas Only

**Status:** ✅ Aceito

**Contexto:**
Alterações destrutivas quebram SaaS em produção.

**Decisão:**
Política estrita: apenas `ALTER TABLE ADD`, nunca `DROP` ou `RENAME`.

**Alternativas:**
1. ❌ Permitir breaking changes (quebra prod)
2. ⚠️ Breaking com migration guide (melhor, mas still risky)
3. ✅ Additive only (mais seguro)

**Consequências:**
- Schemas crescem (acceptable)
- Deprecation pattern necessário
- Muito mais seguro

---

## 14. CONCLUSÃO

Este sistema de **Atualização e Módulos Extensíveis** transforma o Kaven Boilerplate em um **produto vivo** que evolui sem quebrar os SaaS construídos em cima dele.

### Benefícios:

1. ✅ **Instalação Limpa:** Sem histórico Git do boilerplate
2. ✅ **Updates Não-Destrutivos:** Preserva 100% das customizações
3. ✅ **Modularidade:** Habilita/desabilita features via config
4. ✅ **Migrations Seguras:** Apenas adições, nunca remoções
5. ✅ **Developer Experience:** CLI intuitivo, automação máxima

### Próximos Passos:

1. ✅ Implementar Phase 1 (CLI MVP)
2. ✅ Testar com usuários beta
3. ✅ Iterar baseado em feedback
4. ✅ Lançar v2.0.0 com sistema completo

---

**📅 Última Atualização:** 18 de Dezembro de 2025  
**✍️ Autor:** Chris (@bychrisr)  
**📧 Contato:** chris@kaven.dev  
**🔗 Docs:** https://docs.kaven.dev/update-system
