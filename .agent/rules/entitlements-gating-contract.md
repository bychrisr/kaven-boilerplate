---
alwaysApply: true
always_on: true
trigger: always_on
applyTo: "**"
description: "Entitlements & Gating Contract: Always enforce plan rights in backend (requireFeature) and mirror in UI with locked/upgrade states"
---

# Entitlements & Gating Contract (Kaven)

## Regra de ouro

`Allow = Authorized(user, action, scope, spaceContext) ∧ Entitled(tenant, feature/quota)`

## Non‑negotiable invariants

- Entitlement é direito do **tenant** (plano/produto/quota).
- Capability é direito do **usuário** (roles/grants/policies).
- UI **nunca** é a única barreira (UI-only gating = bug).

## Backend enforcement (default)

- Para endpoints monetizáveis, aplicar `requireFeature(featureCode, amount?)` no `preHandler`.
- Para QUOTA, passar `amount` e deixar o middleware incrementar usage (ou registrar usage de forma consistente).

## UI gating (UX)

- Sidebar/menu deve suportar: `hidden` vs `locked` vs `upgrade`.
- Evitar N chamadas por item; preferir cache/hook de entitlements (bulk quando possível).

