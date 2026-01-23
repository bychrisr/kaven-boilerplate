---
trigger: always_on
description: "Protocolo de veracidade: é proibido declarar concluído sem evidências (diff, comandos rodados, resultados) e sem passar pelos quality gates."
---

# Regra 00 — Protocolo de Verdade & Evidência (OBRIGATÓRIO)

## Problema que estamos eliminando

A classe de falha:

> “README atualizado ✅” (mas o arquivo encolheu, perdeu conteúdo, e não houve teste/diff).

## Regras

1) **Proibido** declarar concluído sem evidência mínima.
2) Evidência mínima para dizer “feito”:
   - `git diff --stat`
   - `lint` + `typecheck` (e `test` quando existir)
3) Se a mudança envolve documentação:
   - `wc -l` antes e depois
   - lista de seções removidas/adicionadas
   - justificativa se remoções > adições
4) Se você está incerto sobre o estado do repo, **não chute**.
   - Rode comandos de inspeção (`git status`, `ls`, `cat`, etc.).

## Tática

Use os scripts do kit:

- `bash .agent/scripts/evidence_init.sh <workflow> <nota>`
- `bash .agent/scripts/evidence_finalize.sh <workflow>`

Eles guardam evidência em `.agent/artifacts/`.
