---
alwaysApply: true
always_on: true
trigger: always_on
applyTo: "**"
description: "Space Context Contract (x-space-id): enforce UUID space context across Admin→API and prevent silent SUPER_ADMIN-only behavior"
---

# Space Context Contract (Kaven)

## Non‑negotiable invariants

- `x-space-id` **sempre** representa `Space.id` (**UUID**), nunca `Space.code`.
- Qualquer endpoint protegido por `requireCapability(...)` **depende** de `x-space-id` para usuários não-`SUPER_ADMIN`.
- Fail-secure é obrigatório: se não tiver contexto/headers → negar por padrão.

## Anti‑patterns (proibidos)

- `fetch('/api/...')` no Admin para endpoints do backend sem enviar `Authorization`.
- Enviar `x-space-id` como `FINANCE`, `SUPPORT`, etc (isso é `code`, não `id`).
- “Consertar” 403 adicionando bypass ou relaxando `requireCapability` (isso vira buraco de segurança).

## Default implementation pattern (Admin)

- Centralizar headers no client HTTP (`apps/admin/lib/api.ts`):
  - `Authorization: Bearer ...`
  - `X-Tenant-ID: ...` (quando existir)
  - `x-space-id: currentSpace.id` (quando existir)

## Debug quick triage

- `401` → normalmente token ausente (raw fetch / client errado).
- `403` → normalmente `x-space-id` ausente/incorreto OU role/capability não atribuída naquele space.

