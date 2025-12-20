# Middleware Camaleão - Guia de Uso

## 📋 Visão Geral

O **Middleware Camaleão** permite detecção automática de tenant em aplicações multi-tenant, suportando 3 métodos diferentes de identificação.

---

## 🎯 Métodos de Detecção

### 1. Header `X-Tenant-ID` (Recomendado)

**Uso:** Enviar UUID do tenant no header da requisição.

```bash
curl -H "X-Tenant-ID: 08711e98-5eda-46a1-8792-8ec74f61b6c7" \
  http://localhost:8000/api/users
```

**Vantagens:**

- ✅ Simples de implementar
- ✅ Funciona em qualquer ambiente
- ✅ Não requer configuração de DNS

---

### 2. Subdomain

**Uso:** Acessar via subdomain configurado no tenant.

```bash
# Adicionar ao /etc/hosts:
127.0.0.1 empresa-teste.localhost

# Fazer requisição:
curl http://empresa-teste.localhost:8000/api/users
```

**Vantagens:**

- ✅ URL amigável para usuários
- ✅ Isolamento visual claro
- ✅ Ideal para produção

**Desvantagens:**

- ❌ Requer configuração de DNS
- ❌ Mais complexo em desenvolvimento

---

### 3. Path `/tenants/:slug`

**Uso:** Incluir slug do tenant no path da URL.

```bash
curl http://localhost:8000/tenants/empresa-teste/api/users
```

**Status:** 🚧 Em desenvolvimento (rotas precisam ser ajustadas)

---

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Modo multi-tenant (true) ou single-tenant (false)
MULTI_TENANT_MODE="true"
```

### Modo Single Tenant

Se `MULTI_TENANT_MODE=false`, o middleware não detecta tenant e permite acesso sem restrições.

---

## 💻 Uso no Código

### Acessar Tenant Context

```typescript
import { FastifyRequest } from 'fastify';

async function handler(request: FastifyRequest) {
  const { tenantId, tenantSlug, isSingleTenant } = request.tenantContext || {};

  if (isSingleTenant) {
    // Modo single tenant - sem restrições
    return await getUsers();
  }

  if (!tenantId) {
    // Multi-tenant mas sem tenant detectado
    throw new Error('Tenant não identificado');
  }

  // Filtrar por tenant
  return await getUsers({ tenantId });
}
```

### Require Tenant Helper

```typescript
import { requireTenant } from '../middleware/tenant.middleware';

// Em uma rota:
fastify.get('/api/users', {
  preHandler: [requireTenant],
  handler: userController.list,
});
```

---

## 🧪 Testes

### Criar Tenant

```bash
curl -X POST http://localhost:8000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minha Empresa",
    "slug": "minha-empresa",
    "domain": "minha-empresa.localhost"
  }'
```

### Testar Detecção

```bash
# Via header
curl -H "X-Tenant-ID: <tenant-id>" http://localhost:8000/api/users

# Via subdomain (após configurar /etc/hosts)
curl http://minha-empresa.localhost:8000/api/users
```

---

## 📊 Fluxo de Detecção

```
Request recebido
    ↓
Modo SINGLE? → Sim → tenantContext = { tenantId: null, isSingleTenant: true }
    ↓ Não
Header X-Tenant-ID presente? → Sim → Buscar tenant por ID
    ↓ Não
Path /tenants/:slug? → Sim → Buscar tenant por slug
    ↓ Não
Subdomain válido? → Sim → Buscar tenant por domain
    ↓ Não
tenantContext = { tenantId: null, isSingleTenant: false }
```

---

## ⚠️ Limitações Atuais

1. **Path-based routing** ainda não implementado completamente
2. **Subdomain** requer configuração manual de DNS/hosts
3. **Cache** de tenant não implementado (cada request faz query no DB)

---

## 🚀 Melhorias Futuras

- [ ] Cache Redis para tenant lookups
- [ ] Suporte completo a path-based routing
- [ ] Wildcard subdomain support
- [ ] Tenant switching via cookie
- [ ] Audit log de tenant access

---

## 📝 Exemplo Completo

```typescript
// 1. Criar tenant
const tenant = await prisma.tenant.create({
  data: {
    name: 'Acme Corp',
    slug: 'acme',
    domain: 'acme.myapp.com',
    status: 'ACTIVE',
  },
});

// 2. Fazer requisição com tenant
const response = await fetch('http://localhost:8000/api/users', {
  headers: {
    'X-Tenant-ID': tenant.id,
    'Content-Type': 'application/json',
  },
});

// 3. No backend, o middleware já injetou tenantContext
// request.tenantContext.tenantId === tenant.id
```

---

**Versão:** 1.0.0  
**Última atualização:** 2025-12-19
