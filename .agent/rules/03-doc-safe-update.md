---
trigger: glob
glob: "**/*.md"
description: "Atualização segura de docs/README: edições incrementais, preservar conteúdo e headings; exigir baseline (wc/heading map) e evidência (diffstat)."
---

# Regra 03 — Atualização Segura de Docs

## Objetivo

Evitar “perder conteúdo” ao atualizar docs grandes.

## Obrigatório ao mexer em docs

1) Capturar baseline:

- `wc -l <arquivo>`
- mapa de headings (pelo menos mentalmente: seção A, B, C)

2) Fazer mudança preferencialmente **aditiva**.

3) Depois:

- `git diff --stat`
- comparar seções

Se linhas removidas > adicionadas, justificar.

## Workflow padrão

Use `/doc-safe-update`.
