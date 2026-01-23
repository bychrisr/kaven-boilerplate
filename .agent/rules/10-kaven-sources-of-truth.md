---
trigger: always_on
description: "Fontes de verdade do Kaven: decisões e contratos documentados (ex.: Spaces, Entitlements, Security Core, CLI). Nunca contradizer docs sem ADR."
---

# Regra 10 — Kaven: sources-of-truth

Para mudanças de CLI e segurança, estes documentos são **canônicos**:

- `3. Kaven CLI Module System - Unified Spec + Implementation Guide.md`
- `4. Kaven CLI Auth + Marketplace - Unified Spec + Implementation Guide.md`
- `README.md` (documento principal)

Regra:

- Se a implementação divergir do documento, ou o documento muda ou o código muda — **não pode ficar divergente**.
- Sempre que fizer mudança relevante, ao final da fase rode `/document`.
