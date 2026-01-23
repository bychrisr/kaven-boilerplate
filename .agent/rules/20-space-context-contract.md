---
trigger: always_on
description: "Contrato de Space Context: toda operação multi-tenant deve respeitar x-space-id e validações relacionadas; falhas devem ser fail-secure e testadas."
---

# Regra 20 — Space Context Contract (Kaven)

## Objetivo

Garantir que qualquer implementação de “Spaces” seja:

- consistente
- auditável
- sem duplicações perigosas

## Invariantes

- O Space selecionado deve ser **explicitamente** derivado do contexto (UI/URL/session) e nunca “adivinhado”.
- Toda operação sensível deve ser **scoped** por space.

## Obrigatório

- Tipos fortes: `SpaceId` / `SpaceContext`.
- Funções puras para resolução do Space (sem side effects).
- Testes: unidade (resolver) + integração (gating).

## Evidência

Antes de declarar concluído:

- lint + typecheck
- testes
- diff stat
