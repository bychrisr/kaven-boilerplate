---
name: impl-notes
---

# /impl-notes — documentação de implementação (workspace)

Objetivo: gerar **notas internas** (auditáveis) da implementação e anexar evidências.

⚠️ Isto NÃO substitui `/document` (docs Nextra/MDX).

## Inputs

- Evidence bundle mais recente em `.agent/artifacts/`.
- Diferenças no git.

## Passos

1) Gere um resumo de evidência:

```bash
bash .agent/scripts/evidence_summary.sh > /tmp/agent_evidence_summary.txt
```

2) Gere um documento em `docs/agent/` (ver `.agent/config/docs.env`).

Formato recomendado:

- Contexto
- Plano/fases executadas
- Mudanças (arquivos, principais decisões)
- Testes rodados (outputs)
- Evidências (diff stat)
- Próximos passos

3) Se a fase mexeu em contratos (Spaces/Entitlements/Security), inclua notas de compatibilidade.
