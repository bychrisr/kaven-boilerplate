---
trigger: always_on
description: "Quality gates obrigatórios: lint + typecheck + testes (e validações do .agent). Nada está 'pronto' sem gates verdes."
---

# Regra 01 — Quality Gates (lint + type + tests)

## Invariantes

- Nada entra no repo sem passar:
  - Lint
  - Typecheck
  - Testes (quando houver)

## Como executar

Os comandos são definidos em `.agent/config/quality.env`.

- `AG_LINT_CMD`
- `AG_TYPECHECK_CMD`
- `AG_TEST_CMD`

## Política de falha

- Se falhar, aplicar `/retry-loop`.
- Proibido: comentar teste, relaxar regra, desativar lint.
