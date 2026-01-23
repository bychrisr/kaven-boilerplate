---
description: "Workflow 07: Plan Verification & Walkthrough closure (asks Antigravity to read chats, tasks, walk-throughs and ensure all phases exist)."
---

# 🗂️ Workflow 07: Plan Verification & Walkthrough Closure

> **Mission:** ler toda a documentação relativa aos planos (chats + documentos + tarefas) e garantir que nada ficou “pendente” antes de prosseguir com novas implementações.
>
> **Contexto:** baseie-se nos chats `chats/3. Claude-Ajustes Finais.md`, `chats/4. Claude-Contextualizando chat pesado com mensagens pendentes.md`, e nos artefatos `antigravity/*` que descrevem os planos de Spaces/CLI/Marketplace/Discord.

---

## STEP 0 — Telemetria (opcional, mas recomendada)

```bash
source .agent/scripts/utils.sh
.agent/scripts/init_telemetry.sh "07-plan-verification" "Verifica planos/chat (tasks/walks) e fecha pendências antes da próxima fase"
```

---

## STEP 1 — Absorver os planos (read + digest)

1. Leia completamente os chats:
   - `cat chats/3. Claude-Ajustes Finais.md`
   - `cat chats/4. Claude-Contextualizando chat pesado com mensagens pendentes.md`
2. Leia os planos documentados:
   - `antigravity/spaces-implementation-plan.md`
   - `antigravity/kaven-implementation-plan-spaces-sidebar-entitlements.ptbr.md`
   - `antigravity/1. Planos-Entitlements-Gating.md`
3. Anote (em `walkthrough.md` ou `notes.txt`) qualquer tarefa descrita que **não tenha sido executada** ou qualquer requisito que ainda esteja em aberto (por exemplo: “x-space-id não foi corrigido”, “Marketplace CLI ainda não tem auth híbrido”, “Discord gamification sem DB”). Inclua links para os arquivos/líneas relevantes.

---

## STEP 2 — Auditar Tasks & Walkthroughs

1. Liste checkboxes abertas nos planos:
   ```bash
   rg -n "\\[ \\]" antigravity/*.md
   ```
2. Para cada tick (′`[ ]`), verifique se a etapa correspondente foi implementada no código.
3. Se a tarefa ainda estiver pendente: redija um novo plano faseado (breve, 3 fases) e cole em `walkthrough.md`, por exemplo:
   ```
   Phase 1 — Fix x-space-id propagation (files...). Phase 2 — Grants UI endpoints. Phase 3 — Entitlements gating + sidebar.
   ```
   Inclua quais arquivos tocar, comandos de lint/test e critérios de aceite.

---

## STEP 3 — Garantir Conformidade Técnica

1. Execute checks de qualidade e type:
   ```bash
   pnpm lint
   pnpm -C apps/api lint
   pnpm -C apps/admin lint
   pnpm -C apps/api test --runInBand || true
   pnpm -C apps/admin build || true
   ```
2. Se algum comando falhar:
   - capture logs (ex: `.agent/telemetry/commands_tracker.txt`);
   - corrija first-class (type errors, lint warnings);
   - documente no `walkthrough.md` os passos de correção.

---

## STEP 4 — Testes de Smoke & Walkthrough

1. Verifique endpoints críticos relacionados aos planos:
   - `curl -s http://localhost:8000/api/spaces | head`
   - `curl -s http://localhost:8000/api/requests/pending | head`
2. Confirme que as páginas do Admin (roles, approvals, security) renderizam sem 401/403 (manual ou `pnpm -C apps/admin test`).
3. Se houver falhas inexplicadas, registre a causa em `walkthrough.md` e aumente o plano (ex.: “Phase 2b — fix Grants UI service”).

---

## STEP 5 — Finalização

```bash
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh 07-plan-verification
```

> **Nota:** este workflow sempre termina com um `walkthrough.md` atualizado que descreve o estado atual das fases + próximos passos; esse arquivo também é consumido pelo `finalize_telemetry.sh`.

