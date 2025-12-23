# Architecture - Design System Minimals

## 🏛️ Visão Geral

Arquitetura baseada no **Sections Pattern** para separação de responsabilidades.

## Sections Pattern

### Conceito

Separar lógica de negócio (sections) de rotas (pages).

**Estrutura**:

```
app/(dashboard)/users/page.tsx        → 10 linhas (rota)
sections/user/user-view.tsx           → Lógica completa
```

### Benefícios

1. **Páginas Simples**: 10-15 linhas apenas
2. **Reutilização**: Sections podem ser usadas em múltiplas rotas
3. **Testabilidade**: Testar sections independentemente
4. **Manutenibilidade**: Mudanças isoladas

### Exemplo

**Page (Rota)**:

```tsx
// app/(dashboard)/users/page.tsx
import { UserView } from '@/sections/user/user-view';

export default function UsersPage() {
  return <UserView />;
}
```

**Section (Lógica)**:

```tsx
// sections/user/user-view.tsx
export function UserView() {
  const { users, isLoading } = useUsers();

  return (
    <div>
      <UserToolbar />
      <UserTable users={users} loading={isLoading} />
    </div>
  );
}
```

## Estrutura de Diretórios

```
sections/
├── user/
│   ├── user-view.tsx          # View principal
│   ├── user-toolbar.tsx       # Toolbar com ações
│   ├── user-table-row.tsx     # Linha da tabela
│   └── index.ts               # Exports
├── tenant/
│   ├── tenant-view.tsx
│   ├── tenant-card.tsx
│   ├── tenant-toolbar.tsx
│   └── index.ts
└── dashboard/
    ├── dashboard-view.tsx
    ├── dashboard-widget-summary.tsx
    └── index.ts
```

## Component Hierarchy

```
Page (Route)
  └── View (Section)
      ├── Toolbar
      ├── Table/Grid
      │   └── Row/Card
      └── Pagination
```

## Data Flow

```
1. Page → Renderiza View
2. View → Busca dados (hooks)
3. View → Passa dados para componentes
4. Componentes → Renderizam UI
```

## Best Practices

### ✅ Fazer

- Manter pages com 10-15 linhas
- Colocar lógica em sections
- Usar hooks para data fetching
- Componentizar partes reutilizáveis

### ❌ Não Fazer

- Lógica complexa em pages
- Sections muito grandes (\u003e300 linhas)
- Acoplamento entre sections
- Data fetching em componentes UI
