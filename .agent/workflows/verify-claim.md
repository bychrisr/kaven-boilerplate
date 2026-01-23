---
name: verify-claim
---

# /verify-claim — validação dura

Use quando existir risco de “foi dito que fez”.

## Checklist

- `git status` limpo?
- `git diff --stat` condiz com o que foi dito?
- `lint` + `typecheck` + `test` passaram?
- Para docs: `wc -l` antes/depois, headings preservados?

## Resultado

- Se não houver evidência suficiente: a entrega é inválida.
