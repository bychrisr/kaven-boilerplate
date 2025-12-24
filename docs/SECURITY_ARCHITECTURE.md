# Arquitetura de Segurança (Axisor Hardening)

> **Status:** Implementado
> **Baseado em:** Relatório de Auditoria Axisor
> **Data:** 2025-12-24

Este documento detalha as implementações de segurança realizadas no Kaven Boilerplate para mitigar vulnerabilidades críticas e endurecer a aplicação contra ataques comuns.

## 1. Fundação & Configuração

### Configuração Segura (`src/config/env.ts`)

- **Implementação:** Substituição do acesso direto a `process.env` por um wrapper validado via Zod.
- **Benefício:** Garante que a aplicação não inicie sem variáveis críticas (DB URL, Redis, JWT Secret) e tipa fortemente as configurações.

### Secure Logger (`src/utils/secure-logger.ts`)

- **Implementação:** Logger customizado que intercepta objetos de log.
- **Redação Automática:** Remove/mascara proativamente chaves sensíveis como `password`, `token`, `secret`, `authorization`, `cookie` antes de escrever no stdout/arquivo.
- **Padrão:** JSON estruturado para ingestão fácil em ferramentas de observabilidade.

## 2. Hardening de Autenticação

### Password Policy (`src/lib/password.ts`)

- **Algoritmo:** bcrypt com cost factor 12 (ajustável).
- **Validação:** Regex enforced para complexidade (min 8 chars, maiúscula, minúscula, número, especial).

### JWT Standard (`src/lib/jwt.ts`)

- **Claim `sub`:** Padronização do payload JWT usando a claim `sub` para o User ID, conforme RFC 7519.
- **Rotação:** Access Tokens de curta duração (15m) e Refresh Tokens de longa duração (7d) com revogação no banco.

## 3. Middlewares de Defesa (`src/middleware/`)

### 3.1 Rate Limiting (`rate-limit.middleware.ts`)

- **Backing:** Redis (Atomic Increments).
- **Janela:** Sliding Window.
- **Limites:**
  - Public: 100 req/min
  - Auth: 5 req/min (Login endpoints)
- **Headers:** Expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

### 3.2 CSRF Protection (`csrf.middleware.ts`)

- **Estratégia:** Double Submit Cookie ou verificação de Origin/Referer estrita para APIs não-browser.
- **Escopo:** Aplica-se a todos os verbos mutáveis (`POST`, `PUT`, `DELETE`, `PATCH`).

### 3.3 IDOR Prevention (`idor.middleware.ts`)

- **Verificação:** Middleware genérico que valida se o `resourceId` na rota pertence ao `userId` do token.
- **Aplicação:** Check obrigatório em rotas de User e Tenant management.

### 3.4 HTTP Security Headers

- **Helmet:** Configurado com defaults seguros (HSTS, No-Sniff, XSS-Protection).
- **Tracer:** `reqId` global injetado em cada request para rastreabilidade de ponta a ponta.

## 4. Hardening de Dados

### Input Sanitization (`src/utils/sanitizer.ts`)

- **Ferramenta:** `isomorphic-dompurify`.
- **Ação:** Remove scripts maliciosos de strings de entrada para prevenir Stored XSS.
- **Scope:** Recursivo em objetos JSON recebidos no body.

### Validação de Esquema

- **Zod:** Todos os inputs (Body, Query, Params) passam por schemas estritos (`strip()` desconhecidos por padrão).

## 5. Auditoria & Monitoramento

### Scripts de Auditoria

- `scripts/security-audit.sh`: Smoke test automatizado que verifica a presença e eficácia dos controles de segurança.
- `scripts/audit-attack.ts`: Simulação de ataques (Brute Force, XSS payload) para validar as defesas.
