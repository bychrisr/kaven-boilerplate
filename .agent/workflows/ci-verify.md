---
name: ci-verify
---

# /ci-verify — Quality gates + evidência (workspace)

## 0) Iniciar evidências

```bash
bash .agent/scripts/evidence_init.sh ci-verify "rodando gates"
```

## 1) Rodar gates

```bash
bash .agent/scripts/ag.sh lint
bash .agent/scripts/ag.sh typecheck
bash .agent/scripts/ag.sh test
```

## 2) Evidência mínima

- outputs dos comandos
- `git diff --stat`

## 3) Finalizar evidências

```bash
bash .agent/scripts/evidence_finalize.sh ci-verify
```

## 4) Documentar

- `/impl-notes`

---

## Fechamento de documentação (aplicação)

Após concluir o PR (gates verdes) e fazer o commit do código, rode também:

- `/document` para gerar **documentação Nextra/MDX** em `apps/docs/content/...` e atualizar `_meta.js`.
- Commit separado de docs é recomendado.
