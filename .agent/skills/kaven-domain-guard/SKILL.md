---
name: kaven-domain-guard
description: Use quando a tarefa envolver Kaven CLI, Spaces, Entitlements, Security Core, ou qualquer mudança que possa divergir dos documentos de especificação.
---

# Kaven Domain Guard

## Objetivo

Garantir aderência aos *sources-of-truth* e evitar regressões arquiteturais.

## Protocolo

1) Antes de codar:
   - localizar e ler a spec relevante
   - extrair invariantes
2) Implementar por fases com testes.
3) Rodar quality gates.
4) Ao final: `/document`.

## Evidência mínima

- diff stat
- lint/type/test
