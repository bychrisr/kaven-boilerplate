---
trigger: glob
glob: .agent/workflows/**
description: "Padrões de workflows: passos numerados, checkpoints de risco, quality gates, evidence bundle e encerramento com /document."
---

# Regra 90 — Padrões de Workflows

## Todo workflow deve:

- começar com pré-voo (escopo + arquivos alvo + testes)
- registrar evidência via scripts de evidence bundle
- rodar quality gates
- terminar exigindo `/document`

## Estrutura sugerida

1) Contexto
2) Plano por fases
3) Execução por fase (com testes)
4) Evidence bundle
5) Documentação (`/document`)
