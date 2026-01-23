# Preflight: Kaven CLI Module System & Marketplace Evolution

**Data:** 2026-01-23
**Status:** Planning
**Docs Canônicos:**

- `_nexts-implamentations/3. Kaven CLI Module System - Unified Spec + Implementation Guide.md`
- `_nexts-implamentations/4. Kaven CLI Auth + Marketplace - Unified Spec + Implementation Guide.md`

## 1. Objetivo & Entendimento

O objetivo é evoluir o Kaven CLI para suportar um **Marketplace** (módulos remotos, downloads assinados) e **Autenticação Híbrida** (License Key + Login), conforme especificações TO-BE.
Atualmente (AS-IS), existe um "Drift" de configuração (`payments` vs `payments-stripe`) e o `ModuleManager` é hardcoded, o que impede a escala para um marketplace dinâmico.

**Arquivos Impactados (Core):**

- `apps/kaven-cli/src/core/module-manager.ts` (Refactor)
- `apps/kaven-cli/src/core/project-initializer.ts` (Fix Drift)
- `apps/kaven-cli/modules/` (Novos arquivos JSON)

**Riscos de Segurança:**

- Manipulação de `module.json` para injetar código malicioso (mitigado por checksum/assinatura da store).
- Vazamento de tokens (mitigado por `CredentialManager` seguro).

## 2. Plano de Execução (Faseado)

### [PHASE 0] Module System Refactor (Foundation)

**Objetivo:** Eliminar hardconding, resolver drift e preparar engine genérica.

- **PR 0.1: Normalização de Naming & Config Drift**
  - **Escopo:** Padronizar `payments` no `ProjectInitializer` e `KavenConfig`.
  - **Arquivos:** `project-initializer.ts`, `types/index.ts`.
  - **Validação:** `pnpm test`, verificação manual de `init`.

- **PR 0.2: Schema `module.json` & Migração de Módulos Locais**
  - **Escopo:** Criar schema `module-manifest.ts` e arquivos `module.json` para `payments` e `observability`.
  - **Arquivos:** `types/module-manifest.ts`, `modules/*/module.json`.
  - **Validação:** Script de validação Zod.

- **PR 0.3: Generic Module Engine**
  - **Escopo:** Refatorar `ModuleManager` para consumir `module.json` e usar Anchors genéricos em vez de strings hardcoded.
  - **Arquivos:** `module-manager.ts`.
  - **Validação:** Testes unitários (`ModuleManager.test.ts` - NEW). garantindo que `injectRoutes` produz o mesmo output.

### [PHASE 1] Auth & Security Foundation

**Objetivo:** Autenticação e gestão de chaves.

- **PR 1.1: Comandos de Auth (`auth:*`)**
  - **Escopo:** Login, Logout, Whoami. Stub de device code flow.
  - **Arquivos:** `commands/auth.ts`, `core/auth/auth-service.ts`.
  - **Validação:** Login fake persiste token; Logout remove.

- **PR 1.2: License Key Support**
  - **Escopo:** Flag `--key` e validação básica.
  - **Arquivos:** `commands/marketplace.ts`.
  - **Validação:** Instalar com chave inválida falha.

### [PHASE 2] Marketplace Integration

**Objetivo:** Download remoto e verificação.

- **PR 2.1: Marketplace Client & Download**
  - **Escopo:** Client HTTP para Store API + `DownloadManager` integration (já existente).
  - **Arquivos:** `core/marketplace/client.ts`.
  - **Validação:** Mock de API retornando URL de download signed.

- **PR 2.2: Comando `install` Híbrido**
  - **Escopo:** Unificar lógica: Local (dev) -> Remoto (prod). Validar assinatura Ed25519 antes de instalar.
  - **Arquivos:** `commands/add.ts`, `module-manager.ts`.
  - **Validação:** Instalar módulo remoto (mockado).

## 3. Critérios de Qualidade (Quality Gates)

Para cada PR:

1. `pnpm -C kaven-cli lint` (ESLint sem erros)
2. `pnpm -C kaven-cli typecheck` (TSC 0 erros)
3. `pnpm -C kaven-cli test` (Vitest/Jest pass)

## 4. Dependências

- `Phase 0` é bloqueante para `Phase 2` (engine precisa ser genérica pare receber módulos da store).
- `Phase 1` pode correr em paralelo com `Phase 0`.
