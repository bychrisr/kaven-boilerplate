---
name: doc-safe-update
---

# /doc-safe-update — atualizar docs sem destruir conteúdo

## 0) Iniciar evidências

```bash
bash .agent/scripts/evidence_init.sh doc-safe-update "mudança de docs"
```

## 1) Baseline

Para cada arquivo de doc afetado:

```bash
wc -l <arquivo>
```

Opcional (mas recomendado): liste headings principais.

## 2) Mudança aditiva

- Prefira inserir seções em vez de reescrever tudo.
- Se precisar remover, explique.

## 3) Prova pós-mudança

```bash
git diff --stat
```

Se remoções > adições, justifique.

## 4) Finalizar

```bash
bash .agent/scripts/evidence_finalize.sh doc-safe-update
```

## 5) Documentar

- `/impl-notes`

---

## Fechamento de documentação (aplicação)

Após concluir o PR (gates verdes) e fazer o commit do código, rode também:

- `/document` para gerar **documentação Nextra/MDX** em `apps/docs/content/...` e atualizar `_meta.js`.
- Commit separado de docs é recomendado.
