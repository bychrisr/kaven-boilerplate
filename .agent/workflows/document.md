---
name: document
description: "Gera documentação Nextra MDX (apps/docs/content) para features implementadas, atualizando _meta.js e validando build."
---

# /document — Documentation Generator (Nextra MDX)

Este workflow gera documentação **da aplicação** (Nextra/MDX), no padrão do Kaven Docs.
Ele cria/atualiza arquivos em `apps/docs/content/**` e atualiza o `_meta.js` correto.

## Quando usar
- Feature implementada e testada (gates verdes)
- Você quer “docs de produto/engenharia” (não um report de PR)

## Pré-condições (obrigatórias)
1) A implementação já está no repo (arquivos existem no workspace).
2) Gates passaram: lint + typecheck + test (rode `/ci-verify` antes).

## Input (o que fornecer ao invocar)
Forneça pelo menos **feature_name**. Recomendo este formato:

```text
/document
feature_name: "<Nome da feature>"
type: platform | design-system            # opcional (se não informar, inferir)
section: features | backend | database | architecture | payments | components  # opcional
slug: "<feature-slug>"                    # opcional (se não informar, gerar)
context: "<1-3 frases do que foi feito>"  # opcional
```

Exemplo:
```text
/document
feature_name: "Internationalization (i18n)"
type: platform
section: features
slug: "internationalization"
context: "Implementa next-intl no App Router com pt/en, middleware, routing wrappers e mensagens type-safe."
```

## Saídas esperadas
1) **Arquivo MDX principal** (criado/atualizado):
- `apps/docs/content/platform/<section>/<slug>.mdx` (default: `platform/features`)
ou
- `apps/docs/content/design-system/<section>/<slug>.mdx` (default: `design-system/components`)

2) **Atualização do `_meta.js`** no diretório do arquivo (ou diretório pai apropriado).

3) **Validação**: build da docs (detectar o comando correto a partir do `package.json`).

---

## Passos (execução)

### Fase 0 — Descoberta do alvo (path + meta)
1) Confirmar que existe `apps/docs/` e `apps/docs/content/`.
2) Determinar `type`:
   - Se o usuário forneceu, respeitar.
   - Senão, inferir pelo “centro de gravidade” do código tocado:
     - UI components / design system → `design-system`
     - features / backend / infra → `platform`
3) Determinar `section`:
   - Se o usuário forneceu, respeitar.
   - Senão:
     - platform → `features`
     - design-system → `components`
4) Determinar `slug`:
   - Se fornecido, respeitar.
   - Senão: slugify do `feature_name` (kebab-case, sem acentos)

5) Definir paths:
   - `DOC_FILE = apps/docs/content/<type>/<section>/<slug>.mdx`
   - `META_FILE = apps/docs/content/<type>/<section>/_meta.js`
   - Se `_meta.js` não existir ali, procurar `_meta.js` no diretório pai mais próximo e usar esse.

### Fase 1 — Análise do código (source-of-truth)
Objetivo: documentar **o que existe**, não inventar.

- Localizar arquivos relevantes pelo git diff (se disponível) e pelo diretório da feature.
- Extrair exports, tipos, fluxos, env vars, comandos, e testes.

**Regra:** se algo não está no código, não entra como “implementado”. Pode entrar como **TODO**.

### Fase 2 — Planejar a estrutura MDX (padrão Kaven)
Use como referência documentos existentes em `apps/docs/content/...`.

**Frontmatter obrigatório:**
```yaml
---
title: <feature_name>
description: <descrição curta e técnica>
date: YYYY-MM-DD
author: Chris + Antigravity
version: 1.0.0
tags: [ ... ]
---
```

**Estrutura recomendada (Platform Feature):**
- Visão Geral
- Arquitetura / Estrutura de Arquivos
- Fluxo (Mermaid) — se fizer sentido
- Componentes Principais
- Exemplos de Uso (com código real)
- Configuração (env vars, setup)
- Troubleshooting
- Relacionados

**Estrutura recomendada (Design System Component):**
- Overview
- Variants
- Props / API
- Usage Examples
- Accessibility
- Related Components

### Fase 3 — Gerar conteúdo (MDX)
- Escrever MDX com exemplos reais.
- Usar callouts `[!TIP] [!WARNING] [!IMPORTANT]` quando aplicável.
- Usar Mermaid para fluxos multi-etapas quando necessário.

### Fase 4 — Atualizar `_meta.js`
- Inserir entrada do slug em posição lógica.
- Manter separators/categorias existentes.
- Evitar chaves duplicadas.

### Fase 5 — Validar docs (build)
- Detectar o comando correto lendo `apps/docs/package.json` e/ou o root `package.json`.
- Rodar build (ou comando equivalente).
- Se falhar: corrigir MDX/_meta e rerodar até passar.

### Fase 6 — Commit incremental (recomendado)
Commits recomendados:
1) **Commit 1 — código** (feito antes do `/document`)
2) **Commit 2 — docs**
```bash
git add apps/docs/content
git commit -m "docs: add/update <slug> documentation"
```

---

## Exit Criteria (Done)
- ✅ `DOC_FILE` criado/atualizado com estrutura completa e exemplos reais
- ✅ `_meta.js` atualizado sem quebrar navegação
- ✅ build da docs passa
- ✅ evidência: mostrar `git diff --stat` dos arquivos de docs
