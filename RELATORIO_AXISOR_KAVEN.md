# RELATORIO: Axisor -> Kaven

**Data:** 2025-12-23
**Objetivo:** Analisar a arquitetura robusta do Axisor (producao) e identificar como implementa-la no Kaven (boilerplate)

---

## 1. RESUMO EXECUTIVO

### Estado Atual do Kaven

| Aspecto | Status | Completude |
|---------|--------|------------|
| Backend API | Funcional | ~70% |
| Autenticacao | Basica implementada | ~60% |
| Seguranca | Fundacoes prontas | ~40% |
| Middleware | Parcial | ~50% |
| Infraestrutura | Docker local | ~60% |
| Testes | Nao implementados | 0% |

### Gaps Criticos vs Axisor

| Gap | Impacto | Prioridade |
|-----|---------|------------|
| Validacao de ambiente com Zod | Alto | CRITICA |
| Rate limiting robusto (Redis) | Alto | CRITICA |
| CSRF Protection | Alto | CRITICA |
| IDOR Prevention middleware | Alto | CRITICA |
| Sanitizacao de input | Alto | CRITICA |
| Secure Logger (redacao de secrets) | Medio | IMPORTANTE |
| Security headers (Helmet config) | Medio | IMPORTANTE |
| Configuracao centralizada type-safe | Medio | IMPORTANTE |
| Magic Link + OTP verification | Baixo | NICE-TO-HAVE |
| Feature flags | Baixo | NICE-TO-HAVE |

### Prioridade de Implementacao

1. **FASE 1 (Critica):** Seguranca e validacao
2. **FASE 2 (Importante):** Middleware robusto e config
3. **FASE 3 (Nice-to-have):** Features avancadas

---

## 2. ARQUITETURA

### 2.1 Estrutura de Pastas

#### Axisor (Producao)
```
axisor/
├── backend/
│   ├── src/
│   │   ├── config/           # Config centralizada com Zod
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # 11+ middlewares de seguranca
│   │   ├── services/         # Logica de negocio
│   │   ├── routes/           # 70+ endpoints
│   │   ├── schemas/          # Validacao Zod
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── types/            # Contratos TypeScript
│   │   ├── utils/            # Sanitizer, logger, encryption
│   │   ├── lib/              # Prisma singleton
│   │   ├── websocket/        # Handlers WebSocket
│   │   ├── workers/          # Background jobs
│   │   └── queues/           # BullMQ
│   └── prisma/               # Schema + migrations
├── config/
│   ├── docker/               # docker-compose.prod/dev/staging
│   ├── env/                  # .env por ambiente
│   └── nginx/                # Rate limiting configurado
├── k8s/                      # Kubernetes manifests
└── ecosystem.config.js       # PM2
```

#### Kaven (Atual)
```
kaven-boilerplate/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── middleware/   # 4 middlewares basicos
│   │       ├── lib/          # JWT, bcrypt, 2fa
│   │       ├── modules/      # Auth, users, tenants, etc
│   │       ├── routes/       # Health checks
│   │       └── config/       # Queues apenas
│   └── admin/                # Next.js frontend
├── packages/                 # Vazio (potencial)
├── prisma/                   # Schema compartilhado
└── docker-compose.yml        # Stack dev
```

#### O que Kaven Precisa Adotar

```
kaven-boilerplate/apps/api/src/
├── config/
│   └── env.ts              # [CRIAR] Config centralizada com Zod
├── middleware/
│   ├── csrf.middleware.ts   # [CRIAR] Protecao CSRF
│   ├── idor.middleware.ts   # [CRIAR] Prevencao IDOR
│   └── rate-limit.middleware.ts  # [MELHORAR] Redis-backed
├── utils/
│   ├── sanitizer.ts         # [CRIAR] Input sanitization
│   └── secure-logger.ts     # [CRIAR] Log seguro
└── lib/
    └── encryption.ts        # [CRIAR] AES-256 encryption
```

### 2.2 Stack Tecnologico

| Tecnologia | Axisor | Kaven | Alinhamento |
|------------|--------|-------|-------------|
| Runtime | Node.js 20 | Node.js 20 | ✅ Alinhado |
| Framework | Fastify 4 | Fastify 4/5 | ✅ Alinhado |
| TypeScript | 5.x | 5.7 | ✅ Alinhado |
| ORM | Prisma 5 | Prisma 5 | ✅ Alinhado |
| Database | PostgreSQL 15 | PostgreSQL 16 | ✅ Alinhado |
| Cache | Redis 7 | Redis 7 | ✅ Alinhado |
| JWT | @fastify/jwt | jose | ⚠️ Diferente |
| Validacao | Zod | Zod | ✅ Alinhado |
| Queue | BullMQ | BullMQ | ✅ Alinhado |
| Logging | Pino | Winston | ⚠️ Diferente |

### 2.3 Padroes Arquiteturais

| Padrao | Axisor | Kaven | Acao |
|--------|--------|-------|------|
| Singleton Prisma | ✅ getPrisma() | ⚠️ Import direto | Implementar |
| Constructor Injection | ✅ new Service(prisma) | ⚠️ Parcial | Padronizar |
| Zod Config Validation | ✅ Completo | ❌ Ausente | CRITICO |
| Middleware Pipeline | ✅ Auth→Rate→CSRF→IDOR | ⚠️ Auth→Tenant→RBAC | Expandir |
| Error Classes | ⚠️ Basico | ❌ Ausente | Implementar |
| Transaction Pattern | ✅ prisma.$transaction | ⚠️ Parcial | Padronizar |

---

## 3. AUTENTICACAO & SEGURANCA

### 3.1 Sistema de Auth (Axisor)

**Tipo:** JWT + Refresh Token + 2FA TOTP + Magic Link + OTP

**Fluxo Completo:**
```
1. Registro
   ├── Validar input (Zod)
   ├── Hash senha (bcrypt 12 rounds)
   ├── Criar user com email_verified=false
   ├── Enviar email com Magic Link + OTP
   └── Redirect para verificacao

2. Verificacao de Email (DUAL)
   ├── Magic Link: SHA256 hash, 24h expiracao, single-use
   └── OTP: 6 digitos, bcrypt hash, 10min expiracao

3. Login
   ├── Verificar account lock (5 tentativas = 15min)
   ├── Validar credenciais
   ├── Se 2FA ativo: requerer TOTP
   ├── Gerar access token (2h) + refresh token (7d)
   ├── Salvar refresh token em Redis
   └── Retornar tokens + user info

4. Session Validation
   ├── Verificar JWT signature
   ├── Verificar user existe e is_active
   ├── Verificar email_verified
   └── Verificar session_expires_at
```

**JWT Payload (Axisor):**
```typescript
{
  sub: string;        // User ID (NAO userId!)
  email: string;
  planType: string;
  iat: number;
  exp: number;
  iss: 'axisor-api';
  aud: 'axisor-client';
}
```

**Refresh Token:**
- Armazenado em Redis com 7d TTL
- Rotacao automatica a cada uso
- Revogacao por usuario ou global
- Rastreamento de dispositivo

**Password Hashing:**
- Algoritmo: bcrypt
- Salt rounds: 12
- Validacao: Min 8 chars, uppercase, lowercase, number, special char
- Lista de senhas comuns bloqueadas

### 3.2 Comparacao com Kaven

| Aspecto | Axisor | Kaven | Gap |
|---------|--------|-------|-----|
| JWT Claim | `sub` | `userId` | Padronizar |
| Access Token TTL | 2h | 15m | OK (Kaven mais seguro) |
| Refresh Token TTL | 7d | 7d | ✅ Igual |
| Refresh Storage | Redis | PostgreSQL | Considerar Redis |
| Password Validation | Regex + blocklist | Min 8 chars | Melhorar |
| Account Locking | 5 tentativas/15min | 5 tentativas/15min | ✅ Igual |
| Email Verification | Magic Link + OTP | Token simples | Implementar dual |
| 2FA | TOTP + backup codes | TOTP + backup codes | ✅ Igual |
| Session Validation | Real-time DB check | Real-time DB check | ✅ Igual |

**O que Kaven precisa implementar:**

1. **Magic Link com SHA256:**
```typescript
// Axisor pattern
const token = crypto.randomBytes(32).toString('hex');
const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
// Salvar tokenHash no banco, enviar token por email
```

2. **Password Validation Robusta:**
```typescript
// Axisor pattern
const PasswordSchema = z
  .string()
  .min(8)
  .regex(/[a-z]/, 'Deve ter letra minuscula')
  .regex(/[A-Z]/, 'Deve ter letra maiuscula')
  .regex(/\d/, 'Deve ter numero')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/, 'Deve ter char especial');

const COMMON_PASSWORDS = ['password', '123456', 'qwerty', ...];
```

3. **JWT com `sub` claim:**
```typescript
// Kaven atual
{ userId: user.id, ... }

// Axisor pattern (CORRETO)
{ sub: user.id, ... }
```

### 3.3 Middleware de Seguranca

#### Axisor (11+ middlewares)

| Middleware | Funcao | Kaven Status |
|------------|--------|--------------|
| auth.middleware.ts | JWT validation | ✅ Existe |
| admin.middleware.ts | Admin role check | ✅ Existe (RBAC) |
| superadmin.middleware.ts | Superadmin check | ✅ Existe (RBAC) |
| rate-limit.middleware.ts | Redis rate limiting | ⚠️ Basico |
| dynamic-rate-limit.middleware.ts | Config do BD | ❌ Ausente |
| user-rate-limit.middleware.ts | Por usuario | ❌ Ausente |
| otp-rate-limit.middleware.ts | OTP especifico | ❌ Ausente |
| csrf.middleware.ts | CSRF protection | ❌ CRITICO |
| idor.middleware.ts | Resource ownership | ❌ CRITICO |
| validation.middleware.ts | Input validation | ⚠️ Parcial |
| cache.middleware.ts | Response caching | ❌ Ausente |

#### CORS (Axisor)
```typescript
const corsConfig = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = [env.CORS_ORIGIN];
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
  maxAge: 86400, // 24 horas
};
```

#### Rate Limiting (Axisor)
```typescript
// Configuracoes pre-definidas
export const rateLimiters = {
  auth: { windowMs: 15*60*1000, max: 5 },      // 5/15min - RIGOROSO
  api: { windowMs: 60*1000, max: 100 },        // 100/min
  trading: { windowMs: 60*1000, max: 200 },    // 200/min
  payments: { windowMs: 60*1000, max: 10 },    // 10/min - RIGOROSO
  admin: { windowMs: 60*1000, max: 50 },       // 50/min
  notifications: { windowMs: 60*1000, max: 30 } // 30/min
};

// Redis Sorted Set para precisao
const multi = redis.multi();
multi.zremrangebyscore(key, '-inf', windowStart);
multi.zcard(key);
await multi.exec();
```

---

## 4. INFRAESTRUTURA

### 4.1 Axisor

**Docker Setup:**
- `docker-compose.dev.yml`: Dev completo (hot reload)
- `docker-compose.prod.yml`: 9 services (postgres, redis, backend, frontend, nginx, 5 workers)
- `docker-compose.staging.yml`: Staging environment
- Multi-stage Dockerfile (deps → builder → runner)
- Non-root user (UID 1001)
- Health checks em todos services

**Variaveis de Ambiente:**
```bash
# Validacao com Zod (MINIMO 32 chars para secrets)
JWT_SECRET=your-jwt-secret-minimum-32-chars
REFRESH_TOKEN_SECRET=your-refresh-secret-minimum-32-chars
ENCRYPTION_KEY=your-encryption-key-minimum-32-chars
```

**Secrets Management:**
- Kubernetes secrets com encryption at rest
- RBAC para acesso a secrets
- Rotation mensal via CronJob

**CI/CD:**
- GitHub Actions (assumido)
- Multi-environment (dev, staging, prod)
- Health checks antes de deploy

**Logging:**
- Pino JSON format em producao
- Log level configuravel
- Secure logger com redacao de secrets

**Monitoring:**
- Prometheus metrics
- Grafana dashboards
- Sentry error tracking
- Health endpoints (/health, /health/ready, /health/live)

### 4.2 Kaven

**Setup Atual:**
- `docker-compose.yml`: Stack dev (postgres, redis, pgadmin, prometheus, grafana)
- Prometheus + Grafana configurados
- Health endpoints implementados

**O que Falta:**
- [ ] Dockerfile multi-stage
- [ ] docker-compose.prod.yml
- [ ] Non-root user no container
- [ ] Kubernetes manifests
- [ ] CI/CD pipeline
- [ ] Secrets rotation
- [ ] Sentry integration

---

## 5. PADROES DE CODIGO

### 5.1 Convencoes

| Aspecto | Axisor | Kaven | Acao |
|---------|--------|-------|------|
| Classes | PascalCase | PascalCase | ✅ OK |
| Funcoes | camelCase | camelCase | ✅ OK |
| Constantes | UPPER_SNAKE | UPPER_SNAKE | ✅ OK |
| Routes | kebab-case | kebab-case | ✅ OK |
| Database | snake_case | snake_case | ✅ OK |
| JWT claim | `sub` | `userId` | Corrigir |
| Error codes | UPPER_SNAKE | lowercase | Padronizar |

### 5.2 Exemplos - Codigo Real

#### Config Validation (Axisor - REPLICAR)

**Axisor:**
```typescript
// backend/src/config/env.ts
import { z } from 'zod';
import * as dotenv from 'dotenv';

if (process.env['NODE_ENV'] !== 'production') {
  dotenv.config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging']).default('development'),
  PORT: z.string().transform(Number).default(() => 13000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  RATE_LIMIT_MAX: z.union([z.string().transform(Number), z.number()]).default(100),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation failed:');
      console.error(error.issues.map(i => `${i.path}: ${i.message}`).join('\n'));
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
```

**Kaven (ATUAL):**
```typescript
// Nao existe - usa process.env diretamente
const jwtSecret = process.env.JWT_SECRET || 'change-me-in-production';
```

**Kaven (DEVERIA SER):**
```typescript
// apps/api/src/config/env.ts
// Copiar o padrao do Axisor acima
```

#### Sanitizer (Axisor - REPLICAR)

**Axisor:**
```typescript
// backend/src/utils/sanitizer.ts
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export class Sanitizer {
  static sanitizeString(input: string): string {
    let sanitized = input.replace(/\0/g, ''); // null bytes
    sanitized = sanitized.trim();
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // control chars
    return sanitized.substring(0, 10000); // max length
  }

  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email);
    return validator.normalizeEmail(sanitized) || '';
  }

  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }

  static sanitizeJson(input: any): any {
    if (typeof input === 'string') return this.sanitizeString(input);
    if (Array.isArray(input)) return input.map(item => this.sanitizeJson(item));
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[this.sanitizeString(key)] = this.sanitizeJson(value);
      }
      return sanitized;
    }
    return input;
  }

  static escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}
```

**Kaven:** Nao existe

#### Secure Logger (Axisor - REPLICAR)

**Axisor:**
```typescript
// backend/src/utils/secure-logger.ts
const SENSITIVE_KEYS = [
  'password', 'apiKey', 'api_key', 'apiSecret', 'api_secret',
  'passphrase', 'token', 'jwt', 'secret', 'key',
  'authorization', 'cookie', 'session'
];

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    const lowerStr = obj.toLowerCase();
    for (const key of SENSITIVE_KEYS) {
      if (lowerStr.includes(key)) {
        return '[REDACTED]';
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const isSensitive = SENSITIVE_KEYS.some(k =>
        key.toLowerCase().includes(k)
      );
      sanitized[key] = isSensitive ? '[REDACTED]' : sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

export const secureLog = {
  info: (message: string, data?: any) => {
    console.log(message, data ? sanitizeObject(data) : undefined);
  },
  error: (message: string, error?: any) => {
    console.error(message, error ? sanitizeObject(error) : undefined);
  }
};
```

**Kaven:** Nao existe

#### CSRF Middleware (Axisor - REPLICAR)

**Axisor:**
```typescript
// backend/src/middleware/csrf.middleware.ts
import crypto from 'crypto';
import { Redis } from 'ioredis';

export class CSRFMiddleware {
  private redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  async generateCSRFToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const key = `csrf:${userId}:${token}`;
    await this.redis.setex(key, 3600, '1'); // 1 hora
    return token;
  }

  async validateCSRFToken(userId: string, token: string): Promise<boolean> {
    if (!token) return false;
    const key = `csrf:${userId}:${token}`;
    const exists = await this.redis.get(key);
    return exists === '1';
  }

  async csrfProtection(request: any, reply: any): Promise<void> {
    // Skip para GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return;
    }

    // Skip para endpoints com JWT (ja protegido)
    if (request.url.startsWith('/api/') && request.headers.authorization) {
      return;
    }

    const user = request.user;
    if (!user) return;

    const csrfToken =
      request.headers['x-csrf-token'] ||
      request.body?.csrf_token;

    if (!csrfToken) {
      return reply.status(403).send({ error: 'CSRF_TOKEN_MISSING' });
    }

    const isValid = await this.validateCSRFToken(user.id, csrfToken);
    if (!isValid) {
      return reply.status(403).send({ error: 'CSRF_TOKEN_INVALID' });
    }

    // One-time use
    await this.redis.del(`csrf:${user.id}:${csrfToken}`);
  }
}
```

**Kaven:** Nao existe

#### IDOR Middleware (Axisor - REPLICAR)

**Axisor:**
```typescript
// backend/src/middleware/idor.middleware.ts
export function requireResourceAccess(
  resourceIdParam: string,
  tableName: string,
  userIdField: string = 'user_id'
) {
  return async (request: any, reply: any): Promise<void> => {
    const user = request.user;
    if (!user) {
      return reply.status(401).send({ error: 'UNAUTHORIZED' });
    }

    const resourceId = request.params[resourceIdParam];
    if (!resourceId) {
      return reply.status(400).send({ error: 'BAD_REQUEST' });
    }

    // Admin tem acesso a tudo
    const adminUser = await prisma.adminUser.findUnique({
      where: { user_id: user.id }
    });
    if (adminUser) return;

    // Verificar ownership
    const resource = await (prisma as any)[tableName].findUnique({
      where: { id: resourceId },
      select: { [userIdField]: true }
    });

    if (!resource) {
      return reply.status(404).send({ error: 'NOT_FOUND' });
    }

    if (resource[userIdField] !== user.id) {
      return reply.status(403).send({ error: 'FORBIDDEN' });
    }
  };
}
```

**Kaven:** Tem `requireResourceOwnership` mas menos robusto

---

## 6. GAPS ESPECIFICOS POR AREA

### 6.1 Auth

| Gap | Descricao | Impacto | Arquivos Afetados |
|-----|-----------|---------|-------------------|
| 1 | JWT usa `userId` em vez de `sub` | Medio | `apps/api/src/lib/jwt.ts` |
| 2 | Password validation simples | Alto | `apps/api/src/modules/auth/services/auth.service.ts` |
| 3 | Sem Magic Link | Baixo | `apps/api/src/modules/auth/` |
| 4 | Sem blocklist de senhas comuns | Medio | `apps/api/src/lib/` |
| 5 | Refresh token em PostgreSQL (nao Redis) | Baixo | Opcional |

### 6.2 Middleware

| Gap | Descricao | Impacto | Arquivos Afetados |
|-----|-----------|---------|-------------------|
| 1 | Sem CSRF middleware | CRITICO | `apps/api/src/middleware/` |
| 2 | Sem IDOR generico | CRITICO | `apps/api/src/middleware/` |
| 3 | Rate limiting basico (sem Redis robust) | Alto | `apps/api/src/middleware/` |
| 4 | Sem OTP rate limiting especifico | Medio | `apps/api/src/middleware/` |
| 5 | Sem rate limiting dinamico do BD | Baixo | `apps/api/src/middleware/` |

### 6.3 Config

| Gap | Descricao | Impacto | Arquivos Afetados |
|-----|-----------|---------|-------------------|
| 1 | Sem validacao Zod de env | CRITICO | `apps/api/src/config/` |
| 2 | Sem minimum length para secrets | CRITICO | `.env.example` |
| 3 | Sem security config centralizada | Alto | `apps/api/src/config/` |
| 4 | Sem feature flags | Baixo | `apps/api/src/config/` |

### 6.4 Utils

| Gap | Descricao | Impacto | Arquivos Afetados |
|-----|-----------|---------|-------------------|
| 1 | Sem input sanitizer | CRITICO | `apps/api/src/utils/` |
| 2 | Sem secure logger | Alto | `apps/api/src/utils/` |
| 3 | Sem encryption service (AES-256) | Medio | `apps/api/src/lib/` |

### 6.5 Infraestrutura

| Gap | Descricao | Impacto | Arquivos Afetados |
|-----|-----------|---------|-------------------|
| 1 | Sem Dockerfile multi-stage | Medio | `apps/api/` |
| 2 | Sem docker-compose.prod | Alto | `./` |
| 3 | Sem Kubernetes manifests | Baixo | `k8s/` |
| 4 | Sem CI/CD | Alto | `.github/workflows/` |
| 5 | Sem Sentry | Medio | `apps/api/src/` |

---

## 7. PLANO DE IMPLEMENTACAO

### 7.1 Fase 1 (CRITICA) - Seguranca Core

**Estimativa:** Alta prioridade, implementar primeiro

| Item | O que fazer | Por que |
|------|-------------|---------|
| 1 | Criar `apps/api/src/config/env.ts` com Zod | Garantir env valido, secrets minimo 32 chars |
| 2 | Criar `apps/api/src/utils/sanitizer.ts` | Prevenir XSS, injection attacks |
| 3 | Criar `apps/api/src/middleware/csrf.middleware.ts` | Proteger contra CSRF em forms |
| 4 | Criar `apps/api/src/middleware/idor.middleware.ts` | Proteger recursos por ownership |
| 5 | Melhorar rate limiting com Redis robusto | Proteção contra brute force |
| 6 | Implementar password validation forte | Prevenir senhas fracas |

### 7.2 Fase 2 (IMPORTANTE) - Robustez

| Item | O que fazer | Por que |
|------|-------------|---------|
| 1 | Criar `apps/api/src/utils/secure-logger.ts` | Evitar log de secrets |
| 2 | Padronizar JWT com `sub` claim | Seguir RFC 7519 |
| 3 | Implementar Helmet config completo | Security headers |
| 4 | Criar Singleton Prisma com getPrisma() | Connection pooling otimizado |
| 5 | Dockerfile multi-stage | Build otimizado, non-root user |
| 6 | docker-compose.prod.yml | Ambiente de producao |

### 7.3 Fase 3 (NICE-TO-HAVE) - Avancado

| Item | O que fazer | Por que |
|------|-------------|---------|
| 1 | Magic Link + OTP dual verification | UX melhor, mais seguro |
| 2 | Rate limiting dinamico do BD | Configuracao em runtime |
| 3 | Feature flags | Controle de features |
| 4 | Kubernetes manifests | Deploy em K8s |
| 5 | CI/CD com GitHub Actions | Automacao |
| 6 | Sentry integration | Error tracking |

---

## 8. SNIPPETS CHAVE

### 8.1 Config Validation (CRIAR)

**Arquivo:** `apps/api/src/config/env.ts`

```typescript
import { z } from 'zod';
import * as dotenv from 'dotenv';

if (process.env['NODE_ENV'] !== 'production') {
  dotenv.config();
}

const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('8000'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Redis
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  // JWT - MINIMUM 32 CHARACTERS
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(32, 'REFRESH_TOKEN_SECRET must be at least 32 characters'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Multi-tenant
  MULTI_TENANT_MODE: z.string().transform(v => v === 'true').default('true'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Feature Flags
  OTP_MAX_ATTEMPTS_15M: z.string().transform(Number).default('5'),
  EMAIL_VERIF_MAX_RESENDS_PER_HOUR: z.string().transform(Number).default('3'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter(err => err.code === 'too_small' && err.minimum === 1)
        .map(err => err.path.join('.'));
      const invalidVars = error.issues
        .filter(err => err.code !== 'too_small' || err.minimum !== 1)
        .map(err => `${err.path.join('.')}: ${err.message}`);

      console.error('❌ Environment validation failed:');
      if (missingVars.length) console.error('Missing:', missingVars.join(', '));
      if (invalidVars.length) console.error('Invalid:', invalidVars.join(', '));
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';

// Configuracoes exportadas
export const config = {
  env,
  isDevelopment,
  isProduction,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.REFRESH_TOKEN_SECRET,
  },
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW_MS,
  },
  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
  },
};
```

### 8.2 Sanitizer (CRIAR)

**Arquivo:** `apps/api/src/utils/sanitizer.ts`

```typescript
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export class Sanitizer {
  /**
   * Remove null bytes, control chars, e limita tamanho
   */
  static sanitizeString(input: string, maxLength: number = 10000): string {
    if (typeof input !== 'string') return '';
    let sanitized = input.replace(/\0/g, ''); // null bytes
    sanitized = sanitized.trim();
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // control chars
    return sanitized.substring(0, maxLength);
  }

  /**
   * Normaliza e valida email
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email, 254);
    const normalized = validator.normalizeEmail(sanitized);
    return normalized || '';
  }

  /**
   * Sanitiza HTML permitindo apenas tags seguras
   */
  static sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: [],
    });
  }

  /**
   * Sanitiza objeto JSON recursivamente
   */
  static sanitizeJson(input: any): any {
    if (input === null || input === undefined) return input;
    if (typeof input === 'string') return this.sanitizeString(input);
    if (typeof input === 'number' || typeof input === 'boolean') return input;
    if (Array.isArray(input)) return input.map(item => this.sanitizeJson(item));
    if (typeof input === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(input)) {
        const sanitizedKey = this.sanitizeString(key, 100);
        sanitized[sanitizedKey] = this.sanitizeJson(value);
      }
      return sanitized;
    }
    return input;
  }

  /**
   * Escapa HTML entities
   */
  static escapeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /**
   * Valida e sanitiza UUID
   */
  static sanitizeUuid(input: string): string | null {
    const sanitized = this.sanitizeString(input, 36);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(sanitized) ? sanitized : null;
  }
}
```

### 8.3 Secure Logger (CRIAR)

**Arquivo:** `apps/api/src/utils/secure-logger.ts`

```typescript
const SENSITIVE_KEYS = [
  'password', 'senha', 'apiKey', 'api_key', 'apiSecret', 'api_secret',
  'passphrase', 'token', 'jwt', 'secret', 'key', 'authorization',
  'cookie', 'session', 'refreshToken', 'accessToken', 'bearer',
  'credential', 'private', 'twoFactorSecret', 'backupCodes',
];

function isSensitiveKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return SENSITIVE_KEYS.some(sensitive => lowerKey.includes(sensitive));
}

function sanitizeValue(value: any, depth: number = 0): any {
  if (depth > 10) return '[MAX_DEPTH]';

  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    // Redact strings que parecem tokens
    if (value.length > 20 && /^[A-Za-z0-9._-]+$/.test(value)) {
      return value.substring(0, 10) + '...[REDACTED]';
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, depth + 1));
  }

  if (typeof value === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      if (isSensitiveKey(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeValue(val, depth + 1);
      }
    }
    return sanitized;
  }

  return value;
}

export const secureLog = {
  info: (message: string, data?: any) => {
    const sanitized = data ? sanitizeValue(data) : undefined;
    console.log(`[INFO] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
  },

  warn: (message: string, data?: any) => {
    const sanitized = data ? sanitizeValue(data) : undefined;
    console.warn(`[WARN] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
  },

  error: (message: string, error?: any) => {
    const sanitized = error ? sanitizeValue(error) : undefined;
    console.error(`[ERROR] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      const sanitized = data ? sanitizeValue(data) : undefined;
      console.debug(`[DEBUG] ${message}`, sanitized !== undefined ? JSON.stringify(sanitized) : '');
    }
  },
};
```

### 8.4 CSRF Middleware (CRIAR)

**Arquivo:** `apps/api/src/middleware/csrf.middleware.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class CSRFMiddleware {
  /**
   * Gera CSRF token para usuario
   */
  static async generateToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const key = `csrf:${userId}:${token}`;
    await redis.setex(key, 3600, '1'); // 1 hora
    return token;
  }

  /**
   * Valida CSRF token
   */
  static async validateToken(userId: string, token: string): Promise<boolean> {
    if (!token || !userId) return false;
    const key = `csrf:${userId}:${token}`;
    const exists = await redis.get(key);
    return exists === '1';
  }

  /**
   * Middleware de protecao CSRF
   */
  static async protect(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    // Skip para metodos seguros
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return;
    }

    // Skip para APIs com JWT (ja protegidas)
    if (request.url.startsWith('/api/') && request.headers.authorization) {
      return;
    }

    const user = (request as any).user;
    if (!user) return;

    const csrfToken =
      (request.headers['x-csrf-token'] as string) ||
      (request.body as any)?.csrf_token;

    if (!csrfToken) {
      return reply.status(403).send({
        error: 'CSRF_TOKEN_MISSING',
        message: 'CSRF token is required',
      });
    }

    const isValid = await this.validateToken(user.id, csrfToken);
    if (!isValid) {
      return reply.status(403).send({
        error: 'CSRF_TOKEN_INVALID',
        message: 'Invalid CSRF token',
      });
    }

    // Consumir token (one-time use)
    await redis.del(`csrf:${user.id}:${csrfToken}`);
  }
}
```

### 8.5 IDOR Middleware (CRIAR)

**Arquivo:** `apps/api/src/middleware/idor.middleware.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';

/**
 * Valida acesso a recurso baseado em ownership
 */
export function requireResourceAccess(
  resourceIdParam: string,
  tableName: string,
  userIdField: string = 'userId'
) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    const user = (request as any).user;
    if (!user) {
      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'User not authenticated',
      });
    }

    const resourceId = (request.params as Record<string, string>)[resourceIdParam];
    if (!resourceId) {
      return reply.status(400).send({
        error: 'BAD_REQUEST',
        message: `${resourceIdParam} is required`,
      });
    }

    // SUPER_ADMIN tem acesso a tudo
    if (user.role === 'SUPER_ADMIN') {
      return;
    }

    // Buscar recurso
    const resource = await (prisma as any)[tableName].findUnique({
      where: { id: resourceId },
      select: { [userIdField]: true, tenantId: true },
    });

    if (!resource) {
      return reply.status(404).send({
        error: 'NOT_FOUND',
        message: 'Resource not found',
      });
    }

    // TENANT_ADMIN pode acessar recursos do seu tenant
    if (user.role === 'TENANT_ADMIN') {
      if (resource.tenantId && resource.tenantId === user.tenantId) {
        return;
      }
    }

    // USER so pode acessar seus proprios recursos
    if (resource[userIdField] !== user.id) {
      return reply.status(403).send({
        error: 'FORBIDDEN',
        message: 'Access denied to this resource',
      });
    }
  };
}

/**
 * Valida acesso a tenant
 */
export async function requireTenantResourceAccess(
  request: FastifyRequest,
  reply: FastifyReply,
  tenantId: string
): Promise<boolean> {
  const user = (request as any).user;

  if (user.role === 'SUPER_ADMIN') return true;
  if (user.tenantId === tenantId) return true;

  reply.status(403).send({
    error: 'FORBIDDEN',
    message: 'Access denied to this tenant',
  });
  return false;
}
```

### 8.6 Rate Limit Robusto (MELHORAR)

**Arquivo:** `apps/api/src/middleware/rate-limit.middleware.ts`

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

export class RateLimiter {
  static create(config: RateLimitConfig) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const key = this.getKey(request);
      const now = Date.now();
      const windowStart = now - config.windowMs;

      try {
        // Usar Redis Sorted Set para precisao
        const multi = redis.multi();
        multi.zremrangebyscore(key, '-inf', windowStart);
        multi.zcard(key);
        const results = await multi.exec();

        const requestCount = (results?.[1]?.[1] as number) || 0;

        // Headers de rate limit
        const remaining = Math.max(0, config.max - requestCount - 1);
        const resetTime = now + config.windowMs;

        reply.header('X-RateLimit-Limit', config.max.toString());
        reply.header('X-RateLimit-Remaining', remaining.toString());
        reply.header('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

        if (requestCount >= config.max) {
          reply.header('Retry-After', Math.ceil(config.windowMs / 1000).toString());
          return reply.status(429).send({
            error: 'RATE_LIMIT_EXCEEDED',
            message: config.message || 'Too many requests, please try again later',
            retry_after: Math.ceil(config.windowMs / 1000),
          });
        }

        // Registrar request
        await redis.zadd(key, now, `${now}:${Math.random()}`);
        await redis.expire(key, Math.ceil(config.windowMs / 1000));
      } catch (error) {
        // Fallback: continuar sem rate limiting se Redis falhar
        console.error('Rate limiting error:', error);
      }
    };
  }

  private static getKey(request: FastifyRequest): string {
    const ip = this.getClientIP(request);
    const userId = (request as any).user?.id;
    const endpoint = request.routerPath || request.url;
    const identifier = userId ? `user:${userId}` : `ip:${ip}`;
    return `ratelimit:${identifier}:${endpoint}`;
  }

  private static getClientIP(request: FastifyRequest): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    }
    const realIP = request.headers['x-real-ip'];
    if (realIP) {
      return Array.isArray(realIP) ? realIP[0] : realIP;
    }
    return request.ip || 'unknown';
  }
}

// Configuracoes pre-definidas
export const rateLimiters = {
  auth: RateLimiter.create({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: 'Too many authentication attempts. Please wait 15 minutes.',
  }),
  api: RateLimiter.create({
    windowMs: 60 * 1000, // 1 minuto
    max: 100,
    message: 'Too many requests. Please slow down.',
  }),
  payments: RateLimiter.create({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many payment requests.',
  }),
};
```

### 8.7 Password Validation (MELHORAR)

**Arquivo:** `apps/api/src/lib/password.ts`

```typescript
import { z } from 'zod';

// Senhas comuns bloqueadas
export const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '123456789', 'qwerty',
  'abc123', 'letmein', 'welcome', 'admin', 'login',
  '12345678', 'password1', 'iloveyou', '1234567', 'sunshine',
  'princess', 'monkey', 'dragon', 'master', 'qwerty123',
];

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be at most 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
    'Password must contain at least one special character'
  )
  .refine(
    (password) => !COMMON_PASSWORDS.includes(password.toLowerCase()),
    'This password is too common. Please choose a more unique password.'
  );

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const result = PasswordSchema.safeParse(password);
  if (result.success) {
    return { valid: true, errors: [] };
  }
  return {
    valid: false,
    errors: result.error.errors.map((e) => e.message),
  };
}

export function checkPasswordStrength(password: string): {
  score: number;
  strength: 'weak' | 'fair' | 'good' | 'strong';
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) score++;
  if (password.length >= 16) score++;

  const strength = score <= 2 ? 'weak' : score <= 4 ? 'fair' : score <= 6 ? 'good' : 'strong';

  return { score, strength };
}
```

---

## CONCLUSAO

O **Kaven Boilerplate** possui uma base solida, mas precisa de melhorias criticas de seguranca antes de ser usado em producao. Os principais gaps sao:

1. **Validacao de ambiente** - Sem Zod, secrets podem ser fracos
2. **Sanitizacao de input** - Vulneravel a XSS/injection
3. **CSRF Protection** - Ausente para forms
4. **IDOR Prevention** - Basico, precisa de middleware generico
5. **Rate Limiting** - Precisa de Redis robusto

Com as implementacoes da Fase 1 (~1-2 sprints), o Kaven estara pronto para ser o boilerplate padrao de novos projetos.

---

**Arquivos de Referencia do Axisor:**
- `/home/bychrisr/projects/axisor/backend/src/config/env.ts`
- `/home/bychrisr/projects/axisor/backend/src/middleware/csrf.middleware.ts`
- `/home/bychrisr/projects/axisor/backend/src/middleware/idor.middleware.ts`
- `/home/bychrisr/projects/axisor/backend/src/middleware/rate-limit.middleware.ts`
- `/home/bychrisr/projects/axisor/backend/src/utils/sanitizer.ts`
- `/home/bychrisr/projects/axisor/backend/src/utils/secure-logger.ts`
- `/home/bychrisr/projects/axisor/backend/prisma/schema.prisma`
