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

---

## 📌 Documentação principal do kit

Este workspace `.agent/` é parte do **Kaven Agent Kit v3**.

- Leia o **README completo do kit** (na raiz do ZIP) para entender regras, workflows, skills e MCPs.

### Fechamento
- Use `/ci-verify` para gates + evidência.
- Use `/impl-notes` para notas internas em `docs/agent`.
- Use `/document` para gerar docs Nextra/MDX em `apps/docs/content`.
