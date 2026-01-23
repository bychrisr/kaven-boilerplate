# `.agent` — Kaven / Workspace

Este diretório contém regras, workflows e skills **no escopo do workspace**.

Princípios:

- **Evidência > narrativa** (sem prova, sem “feito”).
- **Quality gates sempre**: lint + typecheck + tests.
- **Sem gambiarras**: solução robusta ou nada.

## Como usar

- Antes de tarefas grandes: `/preflight`
- Antes de PR: `/ci-verify`
- Para mudanças em docs: `/doc-safe-update`
- Quando algo falhar: `/retry-loop`
- Ao final de cada fase: `/document`

## Estrutura

- `config/` — comandos e caminhos do projeto
- `rules/` — regras de execução
- `workflows/` — procedimentos acionáveis
- `skills/` — pacotes ativáveis por intenção
- `scripts/` — helpers de evidência/quality

