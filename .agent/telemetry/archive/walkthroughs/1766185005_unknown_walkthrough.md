# 🔄 Walkthrough de Teste Robusto

## Objetivo

Validar ciclo de vida completo: Consumo, Arquivamento e Limpeza.

## Checkpoints

1.  **Finalize**: Arquiva em `archive/walkthroughs/` e move para `staging_walkthrough.md`.
2.  **Consolidate**: Lê de `staging`, insere no relatório e **deleta** `staging`.
3.  **Links**: Links devem ser gerados via `realpath`.

## Status

Se você lê isso, o staging foi consumido corretamente! ✅
