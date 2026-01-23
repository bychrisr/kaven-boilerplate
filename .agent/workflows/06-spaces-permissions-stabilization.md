---
description: "Workflow 06: Spaces & Permissions Stabilization (anti-refactor) — fix x-space-id propagation, Admin HTTP consistency, and Grants/Approvals endpoint drift"
---

# 🧭 Workflow 06: Spaces & Permissions Stabilization (Anti‑Refactor)

> **Mission:** estabilizar o pilar de Spaces/Permissions **sem refatorar arquitetura** e sem “espalhar fix” por dezenas de arquivos.
>
> **Reality-check (AS‑IS):** o backend já tem `AuthorizationService`, `requireCapability`, `Policies`, `GrantRequest`, `2FA Reset`, `Impersonation`, `Export watermark`, `cron jobs` e schema Prisma.
>
> **Principal risco hoje:** Admin não propaga `x-space-id` globalmente + existem chamadas `fetch('/api/...')` sem auth e até com endpoint errado.

---

## STEP 0 — Telemetria (recomendado)

> Se você quiser relatório automático via `.agent/reports/`, inicialize e finalize telemetria.

```bash
source .agent/scripts/utils.sh
.agent/scripts/init_telemetry.sh "06-spaces-permissions-stabilization" "Stabilize x-space-id + Admin HTTP client + Grants/Approvals drift"
```

## ✅ Objetivos (Definition of Done)

### A) Contrato de Space Context
- [ ] Toda request Admin → API que depende de `requireCapability(...)` envia `x-space-id = currentSpace.id` (UUID).
- [ ] `x-space-id` nunca usa `Space.code`.
- [ ] Rotas com `:spaceId` não ficam inconsistentes com o header.

### B) Consistência de HTTP no Admin
- [ ] Admin não usa `fetch('/api/...')` para endpoints do backend que exigem Bearer token.
- [ ] Os endpoints de Grants/Requests no Admin batem com o backend (`/api/requests/*`).

### C) UX mínima funcionando
- [ ] Space switcher carrega spaces (`GET /api/spaces`) sem 401.
- [ ] Páginas críticas (Roles, Policies, Security/2FA, Export, Approvals) não quebram por falta de header.

---

## 🧱 Regras anti-refactor (não negociar)

1) **Corrigir contratos cross-cutting antes de features novas** (headers + client HTTP).
2) **Não renomear capability codes** já existentes. Se precisar, criar nova + migração.
3) **Não rebatizar spaces “no susto”** (seed tem 6 spaces hoje). Expansões só com plano/migração.
4) **PRs pequenas e atômicas**: preferir 2–5 commits pequenos do que 1 commit gigante.

---

## Phase 0 — Preflight (auditoria rápida)

### 0.1 Confirmar “onde o backend depende de x-space-id”

```bash
rg -n "requireCapability\\(" apps/api/src/modules -S
```

### 0.2 Identificar “raw fetch /api” no Admin (alto risco)

```bash
rg -n "fetch\\('/api" apps/admin -S
```

### 0.3 Identificar onde `x-space-id` já existe no Admin (baseline)

```bash
rg -n "x-space-id" apps/admin -S
```

> Esperado hoje: só `apps/admin/hooks/use-capabilities.ts` envia header explicitamente.

---

## Phase 1 — Fix #1 (mais importante): `x-space-id` global no client HTTP (Admin)

**Alvo:** `apps/admin/lib/api.ts`

### Requisito
No interceptor de request, além de `Authorization` e `X-Tenant-ID`, setar:
- `x-space-id` = `space-storage-v2.currentSpace.id` (se existir)

### Guardrails
- Proteger acesso a `localStorage` (client-only): `if (typeof window !== 'undefined')`.
- Se não existir `currentSpace`, não enviar header (fail-secure no backend).

### Aceite
- Qualquer call `api.get('/api/...')` feita pelo Admin carrega `x-space-id` automaticamente.

---

## Phase 2 — Fix #2: Space Store não pode usar fetch sem auth

**Alvo:** `apps/admin/stores/space.store.ts`

### Ajuste
- Trocar `fetch('/api/spaces')` por `api.get('/api/spaces')` (usar o axios client padrão).
- Remover logs ruidosos (deixar só logs essenciais ou nenhum).
- Garantir regra de “default currentSpace”:
  - se `currentSpace` persistido ainda existe na lista → manter
  - senão → escolher o primeiro (ou por `sortOrder` quando existir)

### Aceite
- `useSpaces()` carrega spaces e define `currentSpace` sem 401.

---

## Phase 3 — Fix #3: Grants/Requests UI (endpoint drift + auth)

### 3.1 Corrigir endpoints (source of truth)

**Backend AS‑IS (prefix `/api`):**
- `POST /api/requests`
- `GET /api/requests/my`
- `GET /api/requests/pending`
- `PUT /api/requests/:id/review`

**Admin já tem um service correto:**
- `apps/admin/services/grant-request.service.ts`

### 3.2 Corrigir página Approvals

**Alvo:** `apps/admin/app/[locale]/(dashboard)/approvals/page.tsx`

- Trocar `fetch('/api/grant-requests?...')` por `grantRequestService.listPending(...)`.
- Ajustar tipos/shape conforme o DTO real retornado pelo backend (sem inventar campos).

### 3.3 Corrigir GrantApprovalDialog

**Alvo:** `apps/admin/components/grants/grant-approval-dialog.tsx`

- Trocar `fetch('/api/grant-requests/...')` por `grantRequestService.review(...)`.
- Garantir que o call usa o axios client (logo: Bearer + x-space-id via interceptor).

### Aceite
- Approvals carrega sem 401/404.
- Aprovar/rejeitar funciona (ao menos para SUPER_ADMIN / aprovador válido).

---

## Phase 4 — Hardening mínimo (sem expandir escopo)

### 4.1 “Confused deputy” (opcional, recomendado)

Para rotas que têm `:spaceId` no path (ex.: roles):
- Se header `x-space-id` existir e for diferente do param, retornar `400/403`.

> Fazer isso só depois de Phase 1 (para não bloquear tudo enquanto o header ainda não é propagado).

### 4.2 Remover outros raw fetch críticos

Rodar novamente:
```bash
rg -n "fetch\\('/api" apps/admin -S
```

Priorizar migração para `api` somente quando:
- rota é proxy para backend (ex.: `/api/spaces`, `/api/grants`, `/api/security`, etc)
- ou falha com 401/403 no dev

---

## Phase 5 — Validação e checklist final

### 5.1 Typecheck (mínimo)
```bash
pnpm -C apps/admin lint || true
pnpm -C apps/admin build || true
```

> Se `build` for pesado, pelo menos garantir `pnpm -C apps/admin lint` + navegação manual.

### 5.2 Smoke checks manuais (Admin)
- [ ] Sidebar renderiza sem crash
- [ ] Space switcher carrega spaces
- [ ] `/roles` lista roles (com `x-space-id` setado automaticamente)
- [ ] `/security/2fa-reset` carrega requests (quando permitido)
- [ ] `/approvals` carrega lista de pendências (se o usuário for aprovador)

---

## Notes / References

- Documento operacional (fora do repo): `/home/bychrisr/Documentos/ObsidianVault/chrisOS/00_inbox/CLI/5. Antigravity - Spaces & Permissions - Workflows + Execution Order.md`
- Plano robusto: `/home/bychrisr/Documentos/ObsidianVault/chrisOS/00_inbox/CLI/antigravity/spaces-implementation-plan.md`

---

## STEP FINAL — Finalizar telemetria + gerar report

```bash
.agent/scripts/finalize_telemetry.sh
bash .agent/scripts/consolidate_workflow_report.sh 06-spaces-permissions-stabilization
```
