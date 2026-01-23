---
name: preflight
---

# /preflight — Pré-voo (workspace)

Use antes de qualquer tarefa grande.

## 0) Iniciar evidências

Execute:

```bash
bash .agent/scripts/evidence_init.sh preflight "início de tarefa"
```

## 1) Entendimento

- Reescreva o objetivo em 1 frase.
- Liste explicitamente:
  - arquivos que serão tocados
  - docs/specs canônicos a ler
  - riscos de segurança

## 2) Plano faseado (obrigatório)

Crie:

- Fase 0: Reconhecimento (mapa de repo)
- Fase 1..N: Implementação (subfases)

Para cada fase:

- Escopo
- Arquivos
- Testes (lint/type/test)
- Critérios de aceite
- Evidência necessária
- “Ao final: rodar /impl-notes”

## 3) Checar quality commands

Garanta que `.agent/config/quality.env` está correto.

## 4) Finalizar evidências

```bash
bash .agent/scripts/evidence_finalize.sh preflight
```

## 5) Documentar

Rode:

- `/impl-notes` (gerar doc do pré-voo)

---

## Fechamento de documentação (aplicação)

Após concluir o PR (gates verdes) e fazer o commit do código, rode também:

- `/document` para gerar **documentação Nextra/MDX** em `apps/docs/content/...` e atualizar `_meta.js`.
- Commit separado de docs é recomendado.
