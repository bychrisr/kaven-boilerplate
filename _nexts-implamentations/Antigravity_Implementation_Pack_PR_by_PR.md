# Antigravity — Implementation Pack (para você colar no Agent e ele codar em cima)

Você não está louco: o que faltou foi o **plano “operacional” em formato de execução**, do tipo:
> “Abra PR #1, crie estes arquivos, rode estes comandos, só avance se passar.”

Este documento é exatamente isso. Ele é um **roteiro de implementação por PR**, com **tarefas**, **arquivos-alvo**, **critérios de aceite**, **checklists**, e um **prompt pronto** para você colar no Antigravity em cada etapa.

---

## 0) Definição de pronto (DoD) do projeto Antigravity no repo

Um repo “implementado” para Antigravity só é considerado pronto quando:

1. Existe uma pasta `.agent/` versionada com:
   - `rules/` (guardrails permanentes)
   - `workflows/` (macros `/...` executáveis)
   - `skills/` (módulos sob demanda, com template + validação)
2. Existe **um contrato de qualidade** (scripts/comandos) e **CI que bloqueia merge** se:
   - lint falhar
   - typecheck falhar
   - testes falharem
   - `.agent` estiver inválido (skills/workflows sem padrão)
3. Cada fase gera documentação via `/document`, gravando em `docs/`:
   - `docs/standards/` (padrões)
   - `docs/architecture/` (visão)
   - `docs/adr/` (decisões)
   - `docs/runbooks/` (como operar)

---

## 1) Como usar este pack (o loop)

Você vai executar **PR por PR**:

1) Copia o **Prompt do PR** (seção de cada PR)  
2) Cola no Antigravity dentro do repo  
3) Deixa ele implementar  
4) Você roda os gates (ou manda ele rodar)  
5) Se passar: merge  
6) Ao final do PR: rodar `/document` com o template

> **Regra:** PR pequeno, objetivo único, gates verdes. Sem “mega-PR”.

---

## 2) Pré-requisitos (antes de qualquer PR)

- O repo já existe e compila/testa “hoje”.
- Você sabe qual stack é dominante:
  - Node/TS (eslint/tsc/vitest)
  - Python (ruff/pyright/pytest)
  - ou monorepo misto

Se for misto: os gates precisam rodar para cada stack com comandos separados.

---

# 3) Sequência de PRs (roteiro completo)

## PR #1 — “Quality Contract + CI Gate” (sem isso nada presta)

### Objetivo
Criar um **contrato único** de qualidade e fazer CI **bloquear merge**.

### Entregáveis mínimos
- Scripts canônicos (um “contrato”):
  - `lint`
  - `typecheck`
  - `test`
- CI rodando esses scripts e **bloqueando merge** ao falhar
- (Opcional robusto) `tools/antigravity/repo-health.*` para validar que o contrato existe

### Passos (o que o agent deve fazer)
1. **Detectar stack** do repo (package.json/pyproject/etc).
2. Criar comandos canônicos:
   - Se TS: `npm run lint`, `npm run typecheck`, `npm run test`
   - Se Python: `make lint/typecheck/test` ou `poetry run ...`
3. Criar/editar pipeline CI (GitHub Actions ou equivalente):
   - job: lint
   - job: typecheck
   - job: test
   - todos obrigatórios no PR
4. Adicionar secret scanning (gitleaks/trufflehog) se ainda não existir (robusto).

### Gates (o PR só passa se)
- CI passa
- Rodar localmente passa:
  - lint
  - typecheck
  - test

### Prompt para colar no Antigravity (PR #1)
```text
Tarefa: Implementar PR #1: Quality Contract + CI Gate.

Regras:
- Não invente ferramentas. Detecte o stack do repo e use o padrão mais comum do próprio repo.
- Crie scripts/comandos canônicos: lint, typecheck, test.
- Configure CI para rodar e bloquear merge em PR.
- Não quebre o repo. Se houver conflito com toolchain existente, alinhe sem remover qualidade.
- Ao final: rode os comandos e reporte saída/resultado.

Saída esperada:
- Commits com scripts + CI.
- Um trecho em docs/standards/quality-gates.md descrevendo o contrato e como rodar local.
```

✅ Depois do merge do PR #1: executar `/document` com “Fase/PR #1”.

---

## PR #2 — “.agent skeleton + Validação mínima no CI”

### Objetivo
Criar a pasta `.agent/` com estrutura base e **validadores** que impedem bagunça.

### Entregáveis
- `.agent/rules/` com 4 arquivos (só skeleton + princípios)
- `.agent/workflows/` com 6 workflows skeleton (sem depender de MCP ainda)
- `tools/antigravity/validate-workflows.*`
- `tools/antigravity/validate-skills.*`
- CI rodando validações

### Arquivos que devem existir após o PR
```
.agent/
  rules/
    GLOBAL_RULES.md
    SECURITY_RULES.md
    CODESTYLE_RULES.md
    ARCH_RULES.md
  workflows/
    document.md
    lint.md
    typecheck.md
    test.md
    ci-verify.md
    spec.md
    implement.md
tools/antigravity/
  validate-workflows.(py|ts)
  validate-skills.(py|ts)
```

### Conteúdo (diretriz, não “texto bonito”)
- Rules: curtas, verificáveis, com “Violations Policy”.
- Workflows: sempre conter:
  - objetivo
  - passos numerados
  - “Exit Criteria”
  - seção “Safety/Checks” (mesmo que simples)

### Gates
- CI roda `validate-workflows` e `validate-skills` e passa.
- Workflows skeleton não podem conter comandos destrutivos.

### Prompt (PR #2)
```text
Tarefa: Implementar PR #2: .agent skeleton + validações no CI.

Faça:
1) Criar a estrutura .agent/rules e .agent/workflows com skeletons.
2) Criar validadores em tools/antigravity:
   - validate-workflows: garante que todo workflow tem "Exit Criteria" e headings obrigatórios.
   - validate-skills: garante que toda skill tem frontmatter name/description e seções obrigatórias.
3) Integrar esses validadores no CI do PR #1 (sem quebrar nada).

Restrições:
- Não inventar mega-framework.
- Validadores podem ser simples, mas devem bloquear drift.
- Se o repo é TS, prefira TS; se é Python, prefira Python.

Saída:
- Commits.
- docs/standards/agent-governance.md explicando estrutura .agent e regras de contribuição.
```

✅ Depois do merge do PR #2: rodar `/document`.

---

## PR #3 — “Workflows funcionais (lint/type/test/ci-verify/document)”

### Objetivo
Transformar skeleton em workflows realmente úteis para o dia a dia.

### Entregáveis
- Workflows:
  - `/lint` roda lint (e opcionalmente conserta formatação segura)
  - `/typecheck` roda typecheck
  - `/test` roda testes
  - `/ci-verify` roda lint + typecheck + test + validações `.agent`
  - `/document` gera/atualiza docs a partir de mudanças no repo
- Cada workflow termina com:
  - “O que foi feito”
  - “Como validar”
  - “Pendências / riscos”

### Gates
- `/ci-verify` retorna verde local e no CI
- `/document` não inventa — documenta só o que está no repo

### Prompt (PR #3)
```text
Tarefa: PR #3: Tornar workflows funcionais.

Faça:
1) Implementar workflows lint/typecheck/test/ci-verify com comandos do contrato do PR #1.
2) Implementar /document como workflow, seguindo:
   - atualiza docs/standards, docs/architecture, docs/runbooks quando fizer sentido
   - cria ADR quando houver decisão estrutural
3) Garantir que validate-workflows continua passando.

Saída:
- Commits.
- docs/runbooks/how-to-use-agent.md com exemplos de execução de /lint /ci-verify /document.
```

✅ Depois do merge do PR #3: rodar `/document`.

---

## PR #4 — “Skills: template + 3 skills core (spec-writer, test-author, refactor-guard)”

### Objetivo
Criar skills úteis e **não genéricas**, com exemplos e padrões.

### Entregáveis
- Template e 3 skills:
  - `spec-writer/`
  - `test-author/`
  - `refactor-guard/`
- Cada skill tem:
  - `SKILL.md` com frontmatter `name` e `description` (estreita)
  - seção “When to use”
  - seção “When NOT to use”
  - seção “Output format”
  - 2–3 exemplos em `references/`

### Gates
- validate-skills passa
- skill não pode dizer “faça X” sem exigir gates quando mexe em código

### Prompt (PR #4)
```text
Tarefa: PR #4: Criar 3 skills core com template robusto.

Faça:
1) Definir template SKILL.md (padrão do repo) e atualizar validate-skills se necessário.
2) Criar spec-writer, test-author, refactor-guard com descrições estreitas e exemplos.
3) Garantir que qualquer orientação de código referencia /ci-verify e gates.

Saída:
- Commits.
- docs/standards/skills-styleguide.md explicando como criar skills sem bloat.
```

✅ Depois do merge do PR #4: rodar `/document`.

---

## PR #5 — “MCP readiness: inventário + permissões + wrappers seguros (sem ‘superpoderes’)”

### Objetivo
Preparar integrações externas com **least privilege** e políticas de segurança.

### Entregáveis
- `docs/architecture/mcp-inventory.md`
- ADR de escopo e permissões
- (Se você já usa MCP) Skills que encapsulam uso com defaults seguros:
  - `github-pr-reviewer/` (read/analysis-first)
  - `issue-triage/`
  - `db-inspector-readonly/` (SELECT-only)

### Gates
- integração em sandbox funciona
- ações proibidas falham (permissão mínima)

### Prompt (PR #5)
```text
Tarefa: PR #5: MCP readiness com least privilege.

Faça:
1) Documentar inventário MCP e escopos.
2) Criar ADR de permissões.
3) Se houver integrações ativas, criar skills que encapsulam:
   - read-only default
   - confirmação humana para write
   - logs/resumo das ações
```

✅ Depois do merge do PR #5: rodar `/document`.

---

## PR #6 — “Evals: anti-regressão da camada `.agent`”

### Objetivo
Evitar que workflows/skills degradem com o tempo.

### Entregáveis
- `evals/` com:
  - prompts por categoria
  - goldens (saídas esperadas)
  - scoring simples
- Job CI “nightly” ou PR-gated para mudanças em `.agent`

### Gates
- regressão bloqueia merge em PRs que mexem na automação

### Prompt (PR #6)
```text
Tarefa: PR #6: Evals para evitar regressão na camada do agente.

Faça:
1) Criar estrutura evals/ com goldens.
2) Criar runner (tools/antigravity/evals-runner.*) simples.
3) Integrar ao CI: roda quando houver mudança em .agent/ (ou nightly).
```

✅ Depois do merge do PR #6: rodar `/document`.

---

# 4) Template de `/document` (cole sempre após cada PR)

```text
/document
Contexto: Finalizamos PR #<N> do Plano Antigravity.
Mudanças feitas: <commits/arquivos>
Decisões tomadas: <ADRs>
Riscos e mitigação: <riscos + como detectar + rollback>
Como validar: <comandos>
Como operar: <runbook curto + links em docs/>
Saída desejada:
- Atualizar docs/standards/*
- Atualizar docs/runbooks/*
- Atualizar docs/architecture/*
- Criar/atualizar docs/adr/*
Restrições:
- Documentar só o que existe.
- Se houver dúvida: “Assunções pendentes”.
```

---

# 5) Para você não ficar preso em “prompt ruim”: Meta-regras para o Agent

Cole isto junto em **todo PR** (é o “contrato de comportamento”):

```text
Meta-regras:
- Trabalhe em passos curtos, com commits pequenos.
- Sempre rode lint/type/test antes de declarar pronto.
- Nunca resolva type errors com ‘any’ ou cast sem justificar.
- Se precisar de decisão estrutural: crie ADR.
- Se algo for destrutivo ou arriscado: peça checkpoint humano.
- No final, produza: (1) lista de arquivos alterados (2) comandos para validar (3) resultados.
```

---

## Resultado final (o que você terá ao terminar PR #6)

- Um repo com Antigravity operando como “engenharia”:  
  **workflows confiáveis + skills modulares + gates rígidos + docs vivas**.

Sem gambiarra. Sem “vai refatorar depois”. Sem ruído.

