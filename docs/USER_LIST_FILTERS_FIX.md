# Fix: Contadores Instáveis nos Filtros da Lista de Usuários

## Problema Reportado

Contadores dos filtros (All, Active, Pending, Banned, Rejected) mudavam incorretamente ao clicar:

- All mostrava 9, Active mostrava 6
- Ao clicar em Active → All mudava para 6, Active mudava para 8
- Números ficavam "dançando" entre os filtros

## Investigação

### Sintomas Observados

**Logs do Frontend:**

```
📊 [getStatusCount] status: all, count: 6, filterStatus: all
📊 [getStatusCount] status: active, count: 6, filterStatus: all
📊 [getStatusCount] status: pending, count: 0, filterStatus: all
```

**Logs do Backend:**

```
📊 [getStats] tenantId: b51e68bf-e541-45c0-aed7-87dd5c3479c8
📊 [getStats] where: {"tenantId":"b51e68bf-e541-45c0-aed7-87dd5c3479c8","deletedAt":null}
📊 [getStats] Results: { total: 6, active: 6, pending: 0, banned: 0, rejected: 0 }
```

Mas `listUsers` retornava `total: 9` (sem filtro de tenant).

### Causa Raiz Dupla

#### 1. Problema no Frontend (Race Condition)

**Arquivo:** `apps/admin/sections/user/view/user-view.tsx`

**Código Problemático:**

```typescript
const getStatusCount = (status: string) => {
  const isCurrentlySelected =
    (status === 'all' && filterStatus === 'all') ||
    (status !== 'all' && status.toUpperCase() === filterStatus.toUpperCase());

  if (isCurrentlySelected) {
    return totalUsers; // ❌ PROBLEMA: usa dados da query filtrada
  }

  return statusCounts[status as keyof typeof statusCounts] ?? 0;
};
```

**Problema:** Misturava duas fontes de dados:

- Tab selecionada: `totalUsers` (dados dinâmicos da query filtrada)
- Tabs não selecionadas: `statusCounts` (stats globais fixos)

**Race Condition:**

1. Usuário clica em "Active"
2. `filterStatus` muda para "active" (síncrono)
3. `totalUsers` ainda é 9 (dados do filtro anterior)
4. `getStatusCount("active")` retorna 9 ❌
5. Query nova executa
6. `totalUsers` atualiza para 6
7. Re-render: `getStatusCount("active")` retorna 6 ✅

Entre os passos 4 e 7, o contador estava **ERRADO**!

#### 2. Problema no Backend (Inconsistência de Filtros)

**Arquivo:** `apps/api/src/modules/users/controllers/user.controller.ts`

**Inconsistência:**

**`getStats` (ANTES):**

```typescript
const tenantId = request.headers['x-tenant-id']; // ❌ Usa header
const stats = await userService.getStats(tenantId);
```

**`listUsers`:**

```typescript
const { tenantId } = request.query; // ✅ Usa query parameter
const result = await userService.listUsers(tenantId, ...);
```

**Resultado:**

- `getStats` filtrava por tenant (6 usuários do tenant)
- `listUsers` NÃO filtrava para SUPER_ADMIN (9 usuários globais)
- **Inconsistência:** Contadores mostravam 6, lista mostrava 9!

---

## Solução Implementada

### 1. Frontend: Usar APENAS Stats Globais

**Arquivo:** `apps/admin/sections/user/view/user-view.tsx`

**Código Corrigido:**

```typescript
const getStatusCount = (status: string) => {
  return statusCounts[status as keyof typeof statusCounts] ?? 0;
};
```

**Benefícios:**

- ✅ Elimina race condition
- ✅ Contadores sempre estáveis
- ✅ Simplifica código (14 linhas → 3 linhas)
- ✅ Uma única fonte de verdade (statusCounts)

**Comportamento:**

- "All" sempre mostra total global (ex: 9)
- "Active" sempre mostra total de ativos globais (ex: 7)
- "Pending" sempre mostra total de pendentes globais (ex: 1)
- Números **NUNCA** mudam, independente do filtro selecionado

### 2. Backend: Consistência de Filtros

**Arquivo:** `apps/api/src/modules/users/controllers/user.controller.ts`

**Código Corrigido:**

```typescript
async getStats(request: FastifyRequest, reply: FastifyReply) {
  try {
    // NÃO usar x-tenant-id automaticamente
    // SUPER_ADMIN deve ver stats globais (sem filtro de tenant)
    // Se precisar filtrar por tenant, passar como query parameter
    const { tenantId } = request.query as any;
    const stats = await userService.getStats(tenantId);
    reply.send(stats);
  } catch (error: any) {
    reply.status(400).send({ error: error.message });
  }
}
```

**Mudança:**

- ❌ ANTES: `request.headers['x-tenant-id']` (automático)
- ✅ DEPOIS: `request.query.tenantId` (explícito)

**Benefícios:**

- ✅ Consistência com `listUsers`
- ✅ SUPER_ADMIN vê stats globais
- ✅ Filtro por tenant apenas quando explicitamente solicitado

---

## Arquivos Modificados

### Frontend

- `apps/admin/sections/user/view/user-view.tsx` - Simplifica getStatusCount

### Backend

- `apps/api/src/modules/users/controllers/user.controller.ts` - Usa query parameter
- `apps/api/src/modules/users/services/user.service.ts` - Logs de debug (removidos)

---

## Validação

### Antes da Correção

```
Estado inicial:
- All: 9 ✅
- Active: 6 ✅

Clica em "Active":
- All: 6 ❌ (errado! deveria ser 9)
- Active: 8 ❌ (errado! deveria ser 6)
```

### Depois da Correção

```
Estado inicial:
- All: 9 ✅
- Active: 7 ✅
- Pending: 1 ✅
- Banned: 1 ✅
- Rejected: 0 ✅

Clica em "Active":
- All: 9 ✅ (correto! não muda)
- Active: 7 ✅ (correto! não muda)

Clica em "Pending":
- All: 9 ✅
- Active: 7 ✅
- Pending: 1 ✅
```

**Contadores permanecem ESTÁVEIS independente do filtro selecionado!** ✅

---

## Lições Aprendidas

### 1. Nunca Misture Fontes de Dados Dinâmicas e Estáticas

**Padrão Problemático:**

```typescript
// ❌ NUNCA faça isso:
const getValue = () => {
  if (isSelected) {
    return dynamicData; // Dados que podem estar desatualizados
  }
  return cachedData;
};
```

**Padrão Correto:**

```typescript
// ✅ SEMPRE use uma única fonte de verdade:
const getValue = () => {
  return cachedData; // Sempre consistente
};
```

### 2. Consistência Entre Endpoints

Endpoints relacionados devem usar a **mesma lógica de filtros**:

- ✅ Ambos usam query parameters
- ✅ Ambos respeitam permissões de SUPER_ADMIN
- ✅ Ambos retornam dados consistentes

### 3. Quando Usar Dados Dinâmicos

Dados dinâmicos (como `totalUsers`) devem ser usados APENAS para:

- ✅ Exibir a lista filtrada
- ✅ Mostrar paginação ("1-5 of 7")
- ✅ Indicadores de "X resultados encontrados"

**NUNCA** para contadores de filtros que devem ser estáveis!

---

## Relação com Problema Anterior (Tenant Select)

Este problema tem a **MESMA CAUSA RAIZ** do bug do Tenant Select:

**Tenant Select (Problema Anterior):**

- `tenantId` mudava (síncrono)
- `tenants` ainda não carregados (assíncrono)
- Select mostrava valor errado temporariamente

**User Filters (Problema Atual):**

- `filterStatus` mudava (síncrono)
- `totalUsers` ainda não atualizado (assíncrono)
- Contadores mostravam valores errados temporariamente

**Solução Comum:**

- **Não misturar estado síncrono com dados assíncronos**
- **Usar apenas uma fonte de verdade estável**

---

## Commits Realizados

```bash
# 1. Correção do frontend
fix(admin): corrige contadores instáveis nos filtros de usuários

# 2. Correção do backend
fix(api): corrige getStats para respeitar permissões de SUPER_ADMIN

# 3. Limpeza
chore: remove logs de debug dos contadores de usuários
```

---

## Referências

- [Documentação do Tenant Select Fix](file:///home/bychrisr/projects/kaven-boilerplate/docs/USER_EDIT_TENANT_FIX.md)
- [React: Avoiding Race Conditions](https://react.dev/learn/you-might-not-need-an-effect#fetching-data)
- [TanStack Query: Stale While Revalidate](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)

---

**Data:** 2025-12-26  
**Versão:** 1.0.0  
**Status:** ✅ Resolvido e Validado
