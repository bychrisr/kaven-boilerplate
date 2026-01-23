---
trigger: always_on
description: "Contrato de Entitlements/Gating: recursos monetizáveis exigem checagem server-side + estado de UI consistente; proibido gating apenas no front-end."
---

# Regra 21 — Entitlements & Gating (Kaven)

## Objetivo

Entitlements precisam ser:

- determinísticos
- consistentes por contexto (Space, Plano, Feature)
- rastreáveis

## Invariantes

- “Planos” definem *entitlements* (direitos).
- “Gating” aplica entitlements no contexto.
- Mudanças devem ser compatíveis com expansão futura sem refatorar.

## Obrigatório

- Centralizar a fonte de verdade (um único lugar para regras).
- Tipagem forte.
- Testes cobrindo:
  - cada entitlement crítico
  - cada caminho de gating crítico

## Evidência

- lint + typecheck + tests
- diff stat
