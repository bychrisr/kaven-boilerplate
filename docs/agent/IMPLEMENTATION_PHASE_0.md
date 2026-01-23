# Implementação: PR #1 (Phase 0) - Module System Prerequisites

**Contexto:** Normalizar o sistema de módulos do Kaven CLI, removendo hardcoding e introduzindo manifestos `module.json` para suportar marketplace futuro.

## 1. Mudanças Propostas

### A. Novo Schema de Manifesto (`module.json`)

Local: `apps/kaven-cli/src/types/module-manifest.ts` (Zod Schema)

O manifesto deve suportar:

1.  Metadados (name, slug, version, description).
2.  Dependências (npm packages, outros módulos).
3.  Arquivos a copiar (source -> destination).
4.  **Injeções de Código**:
    - **Type `anchor`**: Injetar conteúdo em um ponto de ancoragem conhecido (ex: `// [KAVEN_MODULE_IMPORTS]`).
    - **Type `patch`**: Substituição avançada (para casos legados como `AuthController`) onde buscamos um padrão (regex/string) e aplicamos um replace/insert.

### B. Migração de Módulos Locais

Criar arquivos `module.json` para os módulos existentes em `apps/kaven-cli/modules/`.

1.  **Payments (`apps/kaven-cli/modules/payments/module.json`)**
    - Slug: `payments` (não `payments-stripe`).
    - Strategy: `anchor` injection em `app.ts`.
2.  **Observability (`apps/kaven-cli/modules/observability/module.json`)**
    - Slug: `observability`.
    - Strategy: `anchor` para `app.ts`/`server.ts` + `patch` para `auth.controller.ts`.

### C. Refatoração `ModuleManager`

Local: `apps/kaven-cli/src/core/module-manager.ts`

- Remover propriedade `private injections` hardcoded.
- Novo método `loadManifest(name: string): Promise<ModuleManifest>`.
- Refatorar `injectRoutes` e `ejectRoutes` para iterar sobre `manifest.injections`.
- Garantir idempotência (verificar se já existe antes de injetar).

### D. Normalização de Naming (Drift Fix)

Local: `apps/kaven-cli/src/core/project-initializer.ts` e `kaven.config.json`

- Atualizar lógica de inicialização para usar `payments` como feature flag genérica.
- Atualizar templates se necessário.

## 2. Estratégia de Testes

### Unit Tests (`vitest`)

- **`ModuleManager.test.ts`**:
  - Mock de `fs` para simular leitura de `module.json`.
  - Teste de `add`: Verifica se `fs.writeFile` foi chamado com conteúdo injetado corretamente.
  - Teste de `remove`: Verifica se conteúdo foi removido.
  - Teste de Idempotência: Chamar `add` duas vezes não deve duplicar linhas.

### Smoke Test (Manual/Scripted)

1.  Criar projeto dummy: `node dist/index.js init ../smoke-test`
2.  Adicionar módulo: `node dist/index.js module add payments --cwd ../smoke-test`
3.  Verificar arquivo: `cat ../smoke-test/apps/api/src/app.ts` (deve ter rotas de payments).
4.  Remover módulo: `node dist/index.js module remove payments --cwd ../smoke-test`
5.  Verificar arquivo: `app.ts` deve estar limpo.

## 3. Arquivos Afetados

- `apps/kaven-cli/src/types/index.ts` (Update)
- `apps/kaven-cli/src/types/module-manifest.ts` (New)
- `apps/kaven-cli/modules/payments/module.json` (New)
- `apps/kaven-cli/modules/observability/module.json` (New)
- `apps/kaven-cli/src/core/module-manager.ts` (Refactor)
- `apps/kaven-cli/src/core/project-initializer.ts` (Refactor)
- `apps/kaven-cli/src/core/__tests__/module-manager.test.ts` (New)

## 4. Passos de Validação

1.  `pnpm -C kaven-cli lint`
2.  `pnpm -C kaven-cli typecheck`
3.  `pnpm -C kaven-cli test`
