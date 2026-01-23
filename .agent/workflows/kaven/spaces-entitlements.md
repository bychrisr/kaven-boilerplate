---
name: kaven-spaces-entitlements
---

# /kaven-spaces-entitlements — Spaces + Entitlements + Gating

## Passos

1) Aplique as regras:
   - `rules/20-space-context-contract.md`
   - `rules/21-entitlements-gating-contract.md`
2) Defina contratos de tipos e boundaries.
3) Implemente por fases:
   - Fase: contratos
   - Fase: resolução de contexto
   - Fase: gating
   - Fase: UX e edge-cases
4) Testes por fase.
5) `/ci-verify`.
6) `/impl-notes`.

---

## Fechamento de documentação (aplicação)

Após concluir o PR (gates verdes) e fazer o commit do código, rode também:

- `/document` para gerar **documentação Nextra/MDX** em `apps/docs/content/...` e atualizar `_meta.js`.
- Commit separado de docs é recomendado.
