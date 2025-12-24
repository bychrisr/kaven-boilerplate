---
description:
---
# 🛸 ANTIGRAVITY WORKFLOW: SECURITY HARDENING (AXISOR -> KAVEN)

**MISSION:** Implementar a arquitetura de segurança descrita em `RELATORIO_AXISOR_KAVEN.md` no repositório `kaven-boilerplate`.
**TARGET:** `apps/api` (Node.js/Fastify/TypeScript).
**CREDENTIALS:** `admin@test.com` / `senha12345`
**STRICT MODE:** ON.

---

## 🛠️ PROTOCOLOS DE OPERAÇÃO (LEIA ANTES DE INICIAR)

1. **Tolerância Zero a Erros de Tipo:** Proibido comitar código com erros de TypeScript (`any` implícito é proibido). Execute `npx tsc --noEmit` antes de **cada** commit.
2. **Validação Empírica:** Não assuma que funciona. Teste. Se não há interface visual, use `curl` ou scripts `.ts` de disparo único.
3. **Commits Atômicos:** Cada passo completado e testado gera um commit seguindo Conventional Commits (`feat:`, `fix:`, `chore:`).
4. **Sanidade do Ambiente:** Se o Redis for necessário para um teste e não estiver rodando, levante-o via Docker antes de falhar.
5. **Documentação Viva:** Ao implementar variáveis de ambiente, atualize imediatamente o `.env.example` e o `README.md`.

---

## 📋 EXECUTION PLAN

### 📍 FASE 0: RECONHECIMENTO & PREPARAÇÃO

1. **Ingestão de Contexto:**
* Ler arquivo: `~/projects/kaven-boilerplate/RELATORIO_AXISOR_KAVEN.md`.
* Mapear estrutura de pastas atual de `apps/api`.
* Verificar `package.json` atual.


2. **Instalação de Arsenal de Segurança:**
* **Ação:** Instalar dependências listadas no relatório.
* **Comando:**
```bash
cd apps/api
npm install zod ioredis isomorphic-dompurify validator fastify-plugin
npm install -D @types/validator @types/ioredis

```


* **Validação:** Verificar se `node_modules` está integro.
* **Commit:** `build(deps): install security packages (zod, redis, sanitizer)`



---

### 📍 FASE 1: FUNDAÇÃO (CONFIGURATION & LOGGING)

3. **Implementação de Configuração Type-Safe (Zod):**
* **Fonte:** Seção 8.1 do Relatório.
* **Ação:** Criar `apps/api/src/config/env.ts`.
* **Refatoração Crítica:** Buscar globalmente por `process.env` no projeto e substituir pela importação de `env` do novo arquivo.
* **Validação:**
1. Criar arquivo `.env` local com valores dummy válidos.
2. Rodar script de teste: `npx tsx -e 'import { env } from "./src/config/env"; console.log("Env Loaded:", env.PORT)'`.


* **Commit:** `refactor(config): replace process.env with zod validation`


4. **Implementação de Secure Logger:**
* **Fonte:** Seção 8.3 do Relatório.
* **Ação:** Criar `apps/api/src/utils/secure-logger.ts` (Redação de segredos).
* **Refatoração:** Substituir `console.log`, `console.error` e loggers padrão do Fastify/Winston para usar este wrapper.
* **Validação:** Criar script `test-log.ts` que tenta logar um objeto `{ password: "123", email: "ok@ok.com" }` e verificar se a senha sai como `[REDACTED]`.
* **Commit:** `feat(logger): implement secure logger with secret redaction`



---

### 📍 FASE 2: HARDENING DE INPUT & DADOS

5. **Implementação de Sanitizer Centralizado:**
* **Fonte:** Seção 8.2 do Relatório.
* **Ação:** Criar `apps/api/src/utils/sanitizer.ts`.
* **Aplicação:** Criar um Hook global (preValidation ou preSerialization) no Fastify para sanitizar automaticamente strings de entrada no `body`? **Decisão:** Não aplicar globalmente cegamente para não quebrar JSONs complexos, mas aplicar nos DTOs ou Services críticos (Auth/User).
* **Validação:** Teste unitário rápido: `Sanitizer.sanitizeString('<script>')` deve retornar vazio.
* **Commit:** `feat(security): add input sanitizer utility`


6. **Refatoração de Autenticação (JWT & Password):**
* **Fonte:** Seção 6.1 e 8.7 do Relatório.
* **Ação A (Password):** Atualizar `lib/password.ts` com validação de complexidade e blocklist.
* **Ação B (JWT Standard):**
* Alterar geração de token: payload `{ userId: ... }` -> `{ sub: ... }`.
* Alterar `fastify-jwt` verify: ler `request.user.sub`.


* **Validação (Crucial):**
* Rodar `npx tsc --noEmit` para pegar todas as quebras de tipagem onde `user.userId` era chamado.
* Corrigir todas as ocorrências.


* **Commit:** `refactor(auth): standardize jwt claims to 'sub' and harden passwords`



---

### 📍 FASE 3: MIDDLEWARES DE DEFESA (REDIS REQUIRED)

*⚠️ Checkpoint: Verifique se o Redis está rodando (`docker ps`). Se não, inicie-o.*

7. **Rate Limiting Robusto:**
* **Fonte:** Seção 8.6 do Relatório.
* **Ação:** Criar `apps/api/src/middleware/rate-limit.middleware.ts`.
* **Lógica:** Implementar Sliding Window com Redis.
* **Config:** Registrar no `app.ts` (global ou por rota).
* **Validação:** Script Bash.
```bash
# Disparar 20 requests em loop e ver se retorna 429 após o limite
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/health; done

```


* **Commit:** `feat(middleware): implement redis-backed sliding window rate limit`


8. **Proteção CSRF:**
* **Fonte:** Seção 8.4 do Relatório.
* **Ação:** Criar `apps/api/src/middleware/csrf.middleware.ts`.
* **Aplicação:** Proteger rotas de mutação (POST/PUT/DELETE) que não usam Bearer Token (se houver auth por cookie) ou reforçar Double Submit Cookie.
* **Commit:** `feat(middleware): add csrf protection middleware`


9. **Prevenção IDOR (Resource Ownership):**
* **Fonte:** Seção 8.5 do Relatório.
* **Ação:** Criar `apps/api/src/middleware/idor.middleware.ts`.
* **Integração:** Aplicar em uma rota de teste (ex: `GET /users/:id`).
* **Commit:** `feat(middleware): add generic idor prevention middleware`



---

### 📍 FASE 4: INTEGRAÇÃO FINAL & TESTE DE FOGO

10. **Wiring (app.ts):**
* Garantir que todos os middlewares estão registrados na ordem correta:
1. Sanitizer/Security Headers (Helmet - instale se faltar).
2. Rate Limit.
3. Auth (JWT).
4. CSRF / IDOR (Rotas específicas).


* **Validação:** `npm run build`. O build **tem** que passar limpo.


11. **E2E Smoke Test (Terminal):**
* **Ação:** Criar e rodar `scripts/security-audit.sh`.
* **Conteúdo do Script:**
1. Tentar logar com senha fraca (Esperar erro 400).
2. Logar com `admin@test.com`. Capturar Token.
3. Decodificar Token (verificar claim `sub`).
4. Acessar recurso de outro usuário (Esperar erro 403 - IDOR).
5. Spam de requests (Esperar erro 429 - Rate Limit).


* **Commit:** `test(e2e): add automated security smoke tests`



---

### 📍 FASE 5: DOCUMENTAÇÃO & ENTREGA

12. **Atualização de Documentação:**
* Atualizar `README.md` com os novos pré-requisitos (Redis obrigatório).
* Atualizar `.env.example` com as chaves exigidas pelo Zod (`JWT_SECRET` min 32 chars, etc).
* **Commit Final:** `docs: update security requirements and env examples`



---

## 🚦 COMANDOS PARA O AGENTE

1. **Inicie pela FASE 0.** Não pule a instalação.
2. Ao chegar na **FASE 1 (Item 3)**, pare e confirme que o `env.ts` está bloqueando o app se as variáveis estiverem erradas.
3. Na **FASE 2 (Item 6)**, atenção máxima ao TypeScript. Não deixe `any` passar no refactor do JWT.
4. Ao final, me entregue o relatório do `scripts/security-audit.sh`.
