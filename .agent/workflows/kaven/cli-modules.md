---
name: kaven-cli-modules
---

# /kaven-cli-modules — mudanças no Module System

## Fonte de verdade

- `3. Kaven CLI Module System - Unified Spec + Implementation Guide.md`

## Passos

1) Leia a spec.
2) Liste invariantes afetados.
3) Planeje por fases e escreva testes por fase.
4) Implemente.
5) Rode `/ci-verify`.
6) Ao final: `/impl-notes`.

---

## Fechamento de documentação (aplicação)

Após concluir o PR (gates verdes) e fazer o commit do código, rode também:

- `/document` para gerar **documentação Nextra/MDX** em `apps/docs/content/...` e atualizar `_meta.js`.
- Commit separado de docs é recomendado.
