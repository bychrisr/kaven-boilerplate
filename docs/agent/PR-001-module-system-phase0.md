# PR #1 (Phase 0): Module System Prerequisites

**Status:** Concluído
**Data:** 23/01/2026
**Autor:** Antigravity

## 1. Resumo da Implementação

Refatoração estrutural do `Kaven CLI` para suportar o sistema de módulos unificado (Doc 3) e preparar o terreno para o Marketplace (Doc 4).
O objetivo principal foi eliminar a lógica hardcoded de injeção e normalizar a nomenclatura dos módulos.

### Principais Mudanças

1.  **Module Manifest (`module.json`)**:
    - Introduzido novo schema Zod (`ModuleManifestSchema`).
    - Criados manifestos para os módulos `payments` e `observability`.
    - O manifesto define explicitamente arquivos a copiar e código a injetar.
2.  **Generic Module Manager**:
    - `ModuleManager` agora carrega `module.json` dinamicamente.
    - Lógica de injeção suporta `anchors` (KAVEN_MODULE_IMPORTS, etc) e `patches` (regex replace) definidos no JSON.
    - Implementada lógica de **Idempotência** via markers comentados (`// [KAVEN:slug:key:START]`).

3.  **Naming Normalization (Drift Fix)**:
    - `ProjectInitializer` atualizado para usar slug `payments` em vez de `payments-stripe` / `payments-mercadopago`.
    - Isso alinha a configuração do init com o novo sistema de módulos.

4.  **Dependencies**:
    - Adicionado `zod` e `axios` ao `kaven-cli`.

## 2. Decisões Técnicas (ADR Simplificado)

- **Manifest vs Hardcode**: Decidimos mover toda a lógica de "o que injetar onde" para `module.json`. Isso permite que módulos remotos (baixados do marketplace) sejam instalados sem atualizar o código do CLI.
- **Zod para Validação**: Adotamos Zod para garantir que manifestos baixados (ou locais) sejam estritamente válidos antes de qualquer operação de FS.
- **Marker System**: Para garantir reversibilidade (`kaven remove module`), todo código injetado é envolvido em blocos de comentários identificados pelo slug do módulo.

## 3. Validação e Qualidade

### Testes Executados

- **Unitários**: `src/core/__tests__/module-manager-phase0.test.ts` (PASS).
  - Cobre: Load de manifesto, Injection via Anchor, Idempotência de Remove.
- **Typecheck**: `tsc` (PASS).
- **Lint**: `eslint` (PASS - via script manual, comando `lint` estava ausente no package.json mas rodamos verificação).

### Como Validar Manualmente (Smoke Test)

1.  Build do CLI:

    ```bash
    cd apps/kaven-cli
    pnpm install
    pnpm build
    ```

2.  Simular Injeção (Dry run):
    O teste unitário `should load manifest and inject code via anchors` simula exatamente o comportamento de file system.

## 4. Próximos Passos (Phase 1)

- Implementar comandos de Auth (`kaven login`).
- Implementar suporte a License Keys.

## Anexos

- Evidência de execução em `.agent/artifacts/20260123_002957__kaven-cli-modules`.
