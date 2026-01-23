---
name: kaven-cli-auth-marketplace
---

# /kaven-cli-auth-marketplace — mudanças em Auth + Marketplace

## Fonte de verdade

- `4. Kaven CLI Auth + Marketplace - Unified Spec + Implementation Guide.md`

## Passos

1) Leia a spec.
2) Liste impactos de segurança (tokens, licensing, downloads).
3) Planeje por fases com testes.
4) Implemente.
5) Rode `/ci-verify`.
6) Ao final: `/impl-notes`.

---

## Fechamento de documentação (aplicação)

Após concluir o PR (gates verdes) e fazer o commit do código, rode também:

- `/document` para gerar **documentação Nextra/MDX** em `apps/docs/content/...` e atualizar `_meta.js`.
- Commit separado de docs é recomendado.
