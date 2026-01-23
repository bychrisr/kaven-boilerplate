---
name: security-audit-lite
description: Use quando houver alteração em autenticação, tokens, licensing, marketplace, ou manipulação de dados sensíveis. Exige checagens de segurança e evidência de testes.
---

# Security Audit (lite)

## Checklist

- Valide superfícies de ataque introduzidas.
- Cheque vazamento de dados em logs.
- Confirme masking / redaction onde aplicável.
- Revise permissões (entitlements).

## Protocolo

- Rode Snyk via plugin (se instalado).
- Rode testes.
- Forneça evidência.
