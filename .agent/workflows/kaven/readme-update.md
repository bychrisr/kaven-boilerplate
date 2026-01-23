---
name: kaven-readme-update
---

# /kaven-readme-update — atualizar README sem “encolher”

Use quando atualizar o README do Kaven.

## Passos

1) Rode `/doc-safe-update` focando em `README.md`.
2) Garanta que as seções importantes não foram removidas.
3) Se novas features entrarem (CLI V2, Security Core, Spaces/Entitlements), inserir **aditivamente**.
4) Rode `/ci-verify`.
5) Ao final: `/impl-notes`.

---

## Fechamento de documentação (aplicação)

Após concluir o PR (gates verdes) e fazer o commit do código, rode também:

- `/document` para gerar **documentação Nextra/MDX** em `apps/docs/content/...` e atualizar `_meta.js`.
- Commit separado de docs é recomendado.
