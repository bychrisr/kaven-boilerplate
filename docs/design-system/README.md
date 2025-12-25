# 🎨 Kaven Design System

> **Design System completo para o Kaven Boilerplate**  
> Baseado em Minimals.cc com tema Dark Glassmorphism

---

## 📚 Documentação

### Fundamentos

1. **[Princípios de Design](./principles.md)**
   - Paleta de cores
   - Tipografia
   - Glassmorphism
   - Espaçamento e grid
   - Animações e transições

2. **[Arquitetura de Componentes](./architecture.md)**
   - Server vs Client Components
   - Padrão Server Layout + Client Wrapper
   - Estrutura de pastas
   - Performance best practices

3. **[Guia de Componentes](./components.md)**
   - Skeleton Loaders
   - Botões e Forms
   - Cards e Layouts
   - Feedback (Toasts, Alerts)
   - Exemplos práticos (Do vs Don't)

---

## 🚀 Quick Start

### 1. Criar Novo Componente

```tsx
// components/my-component.tsx
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  variant?: 'default' | 'outlined';
}

export function MyComponent({ title, variant = 'default' }: MyComponentProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 shadow-xl border',
        variant === 'default'
          ? 'bg-card border-border/50'
          : 'bg-transparent border-primary-main',
      )}
    >
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );
}
```

### 2. Usar Skeleton Loader

```tsx
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';

export default function Page() {
  const { data, isLoading } = useData();

  if (isLoading) return <DashboardSkeleton />;

  return <div>{/* Conteúdo */}</div>;
}
```

### 3. Separar Server/Client Components

```tsx
// app/my-page/layout.tsx (Server Component)
import { MyLayoutClient } from './layout-client';

export default function Layout({ children }) {
  return <MyLayoutClient>{children}</MyLayoutClient>;
}

// app/my-page/layout-client.tsx (Client Component)
('use client');

export function MyLayoutClient({ children }) {
  return <QueryProvider>{children}</QueryProvider>;
}
```

---

## 🎨 Tema Dark Glassmorphism

### Características

- **Backdrop Blur:** Efeito de vidro fosco
- **Transparência:** Camadas semi-transparentes
- **Bordas Sutis:** `border-white/10`
- **Sombras Profundas:** `shadow-2xl`

### Exemplo de Card

```tsx
<div
  className={cn(
    'rounded-2xl p-6',
    'bg-card/80 backdrop-blur-xl',
    'border border-border/50',
    'shadow-2xl',
  )}
>
  {/* Conteúdo */}
</div>
```

---

## 🧩 Componentes Disponíveis

### UI Base (57 componentes)

- ✅ Button, TextField, Select
- ✅ Card, Dialog, Drawer
- ✅ Alert, Chip, Badge
- ✅ Table, Pagination
- ✅ Progress, Skeleton
- ✅ Menu, Tooltip
- ... e mais 40+ componentes

### Skeletons

- ✅ DashboardSkeleton
- ✅ CardSkeleton
- ✅ TableSkeleton

### Layout

- ✅ Sidebar (collapsible)
- ✅ Header (glassmorphism)
- ✅ Breadcrumbs

---

## ✅ Checklist de Conformidade

Ao criar novos componentes:

- [ ] Usa cores da paleta definida
- [ ] Usa escala tipográfica padrão
- [ ] Usa espaçamento da escala Tailwind
- [ ] Implementa Glassmorphism corretamente
- [ ] Transições suaves (200-300ms)
- [ ] Suporta Dark/Light mode
- [ ] Acessível (WCAG AA)
- [ ] Responsivo (mobile-first)
- [ ] Documentado (JSDoc)
- [ ] Testado

---

## 📖 Guias Relacionados

- [Frontend Overview](/docs/frontend/overview.md)
- [API Documentation](/docs/backend/api.md)
- [Getting Started](/docs/guides/getting-started.md)

---

## 🤝 Contribuindo

Ao adicionar novos componentes ao Design System:

1. Siga os princípios de design
2. Mantenha consistência visual
3. Documente com exemplos
4. Adicione testes visuais
5. Atualize este README

---

**Última atualização:** 25 de dezembro de 2025  
**Versão:** 1.0.0
