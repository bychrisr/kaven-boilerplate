# 🏗️ Arquitetura de Componentes - Next.js 14

> **Padrões e Best Practices para Kaven Boilerplate**

---

## 📋 Índice

1. [Server vs Client Components](#server-vs-client-components)
2. [Padrão Server Layout + Client Wrapper](#padrão-server-layout--client-wrapper)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Composição de Componentes](#composição-de-componentes)
5. [Performance Best Practices](#performance-best-practices)

---

## 🔄 Server vs Client Components

### Regra de Ouro

> **Por padrão, TODOS os componentes são Server Components no Next.js 14.**  
> Use `'use client'` **APENAS** quando absolutamente necessário.

### Quando Usar Server Components ✅

- **Fetching de dados** (queries, API calls)
- **Acesso a recursos do backend** (database, filesystem)
- **Segurança** (manter tokens/secrets no servidor)
- **Reduzir bundle JS** (componentes estáticos)
- **SEO** (conteúdo renderizado no servidor)

```tsx
// ✅ Server Component (padrão)
// app/users/page.tsx
import { prisma } from '@/lib/prisma';

export default async function UsersPage() {
  // Fetch direto no servidor
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Usuários</h1>
      <UserList users={users} />
    </div>
  );
}
```

### Quando Usar Client Components ⚠️

- **Interatividade** (onClick, onChange, etc)
- **Hooks do React** (useState, useEffect, useContext)
- **Browser APIs** (localStorage, window, document)
- **Event listeners**
- **Bibliotecas de terceiros** que dependem de browser

```tsx
// ✅ Client Component (quando necessário)
// components/user-form.tsx
'use client';

import { useState } from 'react';

export function UserForm() {
  const [name, setName] = useState('');

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </form>
  );
}
```

### ❌ Erro Comum: Client Component Desnecessário

```tsx
// ❌ ERRADO: Marcar layout inteiro como client
'use client';

export default function DashboardLayout({ children }) {
  return (
    <QueryProvider>
      <AuthGuard>{children}</AuthGuard>
    </QueryProvider>
  );
}
```

**Problema:** Bloqueia SSR de TODAS as páginas filhas!

---

## 🎯 Padrão Server Layout + Client Wrapper

### O Problema

Layouts precisam ser Server Components para habilitar SSR, mas providers (QueryProvider, AuthGuard, etc) precisam de `'use client'`.

### A Solução: Wrapper Pattern

**Estrutura:**

```
app/(dashboard)/
├── layout.tsx          ← Server Component (limpo)
└── layout-client.tsx   ← Client Component (providers)
```

### Implementação

#### 1. Layout (Server Component)

```tsx
// app/(dashboard)/layout.tsx
import { ReactNode } from 'react';
import { DashboardLayoutClient } from './layout-client';

/**
 * Dashboard Layout (Server Component)
 *
 * Mantido como Server Component para habilitar SSR.
 * Delega lógica de estado para DashboardLayoutClient.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
```

#### 2. Layout Client (Client Component)

```tsx
// app/(dashboard)/layout-client.tsx
'use client';

import { ReactNode } from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayoutInner } from './layout-inner';

/**
 * Dashboard Layout Client Component
 *
 * Encapsula providers e lógica de estado.
 * Separado do layout principal para permitir SSR.
 */
export function DashboardLayoutClient({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthGuard>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </AuthGuard>
    </QueryProvider>
  );
}
```

### Benefícios

✅ **SSR Habilitado:** Páginas filhas podem ser Server Components  
✅ **Bundle Reduzido:** Apenas código client necessário vai pro browser  
✅ **Performance:** First Paint mais rápido  
✅ **SEO:** Conteúdo indexável pelos crawlers

---

## 📁 Estrutura de Pastas

### Organização Recomendada

```
apps/admin/
├── app/                          # Rotas Next.js
│   ├── (auth)/                  # Grupo de rotas (sem layout)
│   │   ├── login/
│   │   │   ├── page.tsx         # ← Server Component
│   │   │   └── login-form.tsx   # ← Client Component
│   │   └── layout.tsx           # ← Server Component
│   │
│   └── (dashboard)/             # Grupo de rotas (com layout)
│       ├── layout.tsx           # ← Server Component
│       ├── layout-client.tsx    # ← Client Component
│       └── dashboard/
│           └── page.tsx         # ← Server Component
│
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # Componentes base (Button, Input)
│   ├── layout/                  # Componentes de layout (Sidebar, Header)
│   ├── skeletons/               # Loading skeletons
│   └── auth/                    # Componentes de autenticação
│
├── hooks/                        # Custom hooks
├── lib/                          # Utilitários
├── providers/                    # React providers
└── stores/                       # Zustand stores
```

### Convenções de Nomenclatura

| Tipo                | Convenção        | Exemplo                      |
| ------------------- | ---------------- | ---------------------------- |
| **Páginas**         | `page.tsx`       | `app/users/page.tsx`         |
| **Layouts**         | `layout.tsx`     | `app/(dashboard)/layout.tsx` |
| **Client Wrappers** | `*-client.tsx`   | `layout-client.tsx`          |
| **Componentes UI**  | `PascalCase.tsx` | `Button.tsx`                 |
| **Hooks**           | `use-*.ts`       | `use-users.ts`               |
| **Stores**          | `*.store.ts`     | `auth.store.ts`              |

---

## 🧩 Composição de Componentes

### Princípio: Componentes Pequenos e Focados

#### ✅ DO: Componentes com responsabilidade única

```tsx
// components/user-card.tsx
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="rounded-lg bg-card p-4">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <Button onClick={() => onEdit(user.id)}>Editar</Button>
    </div>
  );
}
```

#### ❌ DON'T: Componentes monolíticos

```tsx
// ❌ Componente fazendo tudo
export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  // 200 linhas de lógica...

  return <div>{/* 300 linhas de JSX... */}</div>;
}
```

### Padrão: Container/Presentational

#### Container (Lógica)

```tsx
// app/users/page.tsx (Server Component)
import { UserList } from './user-list';

export default async function UsersPage() {
  const users = await fetchUsers();

  return <UserList users={users} />;
}
```

#### Presentational (UI)

```tsx
// app/users/user-list.tsx (Client Component)
'use client';

export function UserList({ users }: { users: User[] }) {
  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

---

## ⚡ Performance Best Practices

### 1. Lazy Loading de Client Components

```tsx
import dynamic from 'next/dynamic';

// Carrega apenas quando necessário
const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Desabilita SSR se não for necessário
});
```

### 2. Otimização de Imagens

```tsx
import Image from 'next/image';

// ✅ Usar next/image
<Image
  src="/avatar.jpg"
  alt="Avatar"
  width={40}
  height={40}
  priority // Para imagens above-the-fold
/>

// ❌ Não usar <img> direto
<img src="/avatar.jpg" alt="Avatar" />
```

### 3. Memoização Estratégica

```tsx
'use client';

import { useMemo } from 'react';

export function ExpensiveList({ items }: { items: Item[] }) {
  // Computação pesada apenas quando items mudar
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

### 4. Suspense Boundaries

```tsx
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
```

---

## 🚫 Anti-Patterns a Evitar

### 1. ❌ 'use client' no Topo da Árvore

```tsx
// ❌ ERRADO
'use client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

**Impacto:** Desabilita SSR para TODA a aplicação!

### 2. ❌ Fetch de Dados em Client Components

```tsx
// ❌ ERRADO
'use client';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users').then(/* ... */);
  }, []);

  return <div>{/* ... */}</div>;
}
```

**Melhor:** Fetch no Server Component ou use TanStack Query.

### 3. ❌ Providers Aninhados Desnecessariamente

```tsx
// ❌ ERRADO
<Provider1>
  <Provider2>
    <Provider3>
      <Provider4>{children}</Provider4>
    </Provider3>
  </Provider2>
</Provider1>
```

**Melhor:** Combine providers quando possível.

---

## ✅ Checklist de Arquitetura

Ao criar novos componentes/páginas:

- [ ] É Server Component por padrão?
- [ ] `'use client'` apenas onde necessário?
- [ ] Layout separado de lógica de estado?
- [ ] Componentes pequenos e focados?
- [ ] Usa Suspense para loading states?
- [ ] Imagens otimizadas com next/image?
- [ ] Lazy loading para componentes pesados?
- [ ] Memoização apenas onde necessário?

---

## 📚 Recursos

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

**Próximo:** [Guia de Componentes](./components.md)
