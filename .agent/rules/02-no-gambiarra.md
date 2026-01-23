---
trigger: always_on
description: "Anti-gambiarra: soluções devem ser robustas, testáveis e com rollback. Exceções exigem ADR + justificativa + plano de correção."
---

# Regra 02 — Sem gambiarras

## Definição prática

“Gambiarra” = qualquer mudança que:

- resolve o sintoma sem eliminar a causa
- piora invariantes (tipagem, segurança, previsibilidade)
- cria dívida para “refatorar depois”

## Obrigatório

- Escolher um design com invariantes claros.
- Evitar estados implícitos.
- Preferir camadas (contratos + adapters) em vez de patches locais.

## Anti-padrões

- `any` por preguiça
- `// TODO` como substituto de design
- “fiz um if aqui” para contornar regra de negócio
