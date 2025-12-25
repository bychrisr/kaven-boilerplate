# 🧩 Guia de Componentes - Kaven Design System

> **Componentes reutilizáveis com exemplos práticos**

---

## 📋 Índice

1. [Skeleton Loaders](#skeleton-loaders)
2. [Botões](#botões)
3. [Cards](#cards)
4. [Forms](#forms)
5. [Feedback](#feedback)

---

## 💀 Skeleton Loaders

### Princípios

Skeletons devem:

- ✅ Manter consistência visual com o tema (Dark Glassmorphism)
- ✅ Ter estrutura idêntica ao conteúdo real
- ✅ Usar animação `pulse` nativa do Tailwind
- ✅ Evitar cores chapadas (usar `bg-white/5` ou `bg-muted/10`)

### Dashboard Skeleton

```tsx
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return <div>{/* Conteúdo real */}</div>;
}
```

### Card Skeleton

```tsx
import { CardSkeleton } from '@/components/skeletons/dashboard-skeleton';

export function UserCard({ user, isLoading }: Props) {
  if (isLoading) {
    return <CardSkeleton />;
  }

  return <div className="rounded-2xl bg-card p-6">{/* Conteúdo */}</div>;
}
```

### Table Skeleton

```tsx
import { TableSkeleton } from '@/components/skeletons/dashboard-skeleton';

export function UsersTable({ users, isLoading }: Props) {
  if (isLoading) {
    return <TableSkeleton rows={10} />;
  }

  return <table>{/* Conteúdo */}</table>;
}
```

### ✅ DO: Skeleton com tema consistente

```tsx
<div
  className={cn(
    'rounded-2xl p-6 shadow-xl border',
    'bg-card border-border/50',
    'animate-pulse',
  )}
>
  <div className="h-5 w-3/4 bg-white/5 rounded" />
  <div className="h-4 w-full bg-white/5 rounded mt-2" />
</div>
```

### ❌ DON'T: Skeleton genérico cinza

```tsx
// ❌ Quebra consistência visual
<div className="bg-gray-300 animate-pulse">
  <div className="h-5 w-3/4 bg-gray-400 rounded" />
</div>
```

---

## 🔘 Botões

### Variantes

```tsx
import { Button } from '@/components/ui/button';

// Contained (padrão)
<Button variant="contained" color="primary">
  Criar Usuário
</Button>

// Outlined
<Button variant="outlined" color="secondary">
  Cancelar
</Button>

// Text
<Button variant="text" color="info">
  Saiba mais
</Button>

// Soft (glassmorphism)
<Button variant="soft" color="success">
  Confirmar
</Button>
```

### Tamanhos

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

### Estados

```tsx
// Loading
<Button loading>
  Salvando...
</Button>

// Disabled
<Button disabled>
  Indisponível
</Button>

// Com ícone
<Button startIcon={<Plus />}>
  Adicionar
</Button>

<Button endIcon={<ArrowRight />}>
  Próximo
</Button>
```

### ✅ DO: Usar componente Button

```tsx
<Button
  variant="contained"
  color="primary"
  size="lg"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Salvar
</Button>
```

### ❌ DON'T: Criar botões customizados

```tsx
// ❌ Inconsistente com design system
<button className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
```

---

## 🃏 Cards

### Card Básico

```tsx
<div
  className={cn('rounded-2xl p-6 shadow-xl border', 'bg-card border-border/50')}
>
  <h3 className="text-lg font-bold mb-2">Título</h3>
  <p className="text-muted-foreground">Conteúdo do card</p>
</div>
```

### Card com Glassmorphism

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

### Card de Métrica

```tsx
<div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50">
  {/* Header com ícone */}
  <div className="flex items-center gap-4 mb-4">
    <div className="p-3 bg-primary-main/10 rounded-full">
      <Users className="h-6 w-6 text-primary-main" />
    </div>
    <span className="text-sm font-bold uppercase tracking-wider">
      Total Users
    </span>
  </div>

  {/* Valor */}
  <h3 className="text-3xl font-bold mb-2">{value.toLocaleString()}</h3>

  {/* Trend */}
  <div className="flex items-center gap-2 text-sm">
    <span className="flex items-center text-success-main font-semibold bg-success-main/10 px-1.5 py-0.5 rounded">
      <ArrowUp className="h-3 w-3 mr-1" />
      +2.6%
    </span>
    <span className="text-gray-500">last 7 days</span>
  </div>
</div>
```

### ✅ DO: Usar classes consistentes

```tsx
<div className="rounded-2xl bg-card p-6 shadow-xl border border-border/50">
  {/* Sempre usar: rounded-2xl, bg-card, shadow-xl, border-border/50 */}
</div>
```

### ❌ DON'T: Misturar estilos

```tsx
// ❌ Inconsistente
<div className="rounded-lg bg-gray-800 p-4 shadow-md border border-gray-600">
  {/* Usa valores diferentes */}
</div>
```

---

## 📝 Forms

### TextField

```tsx
import { TextField } from '@/components/ui/text-field';

<TextField
  label="Email"
  type="email"
  placeholder="seu@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  fullWidth
  helperText="Digite seu email principal"
  error={!!errors.email}
  errorMessage={errors.email?.message}
/>;
```

### TextField com Adornments

```tsx
<TextField
  label="Senha"
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  endAdornment={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  }
/>
```

### Select

```tsx
import { Select } from '@/components/ui/select';

<Select
  label="Role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  options={[
    { value: 'USER', label: 'Usuário' },
    { value: 'TENANT_ADMIN', label: 'Admin' },
  ]}
/>;
```

### ✅ DO: Usar componentes de form

```tsx
<form onSubmit={handleSubmit} className="space-y-5">
  <TextField label="Nome" {...register('name')} />
  <TextField label="Email" type="email" {...register('email')} />
  <Button type="submit" loading={isSubmitting}>
    Salvar
  </Button>
</form>
```

### ❌ DON'T: Inputs nativos sem estilo

```tsx
// ❌ Sem consistência visual
<input type="text" placeholder="Nome" />
<input type="email" placeholder="Email" />
<button type="submit">Salvar</button>
```

---

## 💬 Feedback

### Toast Notifications

```tsx
import { toast } from 'sonner';

// Success
toast.success('Usuário criado com sucesso!');

// Error
toast.error('Erro ao criar usuário');

// Info
toast.info('Processando...');

// Warning
toast.warning('Atenção: dados não salvos');

// Loading
const toastId = toast.loading('Salvando...');
// Depois
toast.success('Salvo!', { id: toastId });
```

### Alerts

```tsx
import { Alert } from '@/components/ui/alert';

<Alert severity="success">
  Operação concluída com sucesso!
</Alert>

<Alert severity="error" title="Erro">
  Não foi possível completar a operação.
</Alert>

<Alert severity="warning" closable onClose={() => {}}>
  Atenção: esta ação não pode ser desfeita.
</Alert>
```

### Empty States

```tsx
import { EmptyState } from '@/components/empty-state';

<EmptyState
  icon={Users}
  title="Nenhum usuário encontrado"
  description="Não há usuários cadastrados ainda. Crie o primeiro usuário para começar."
  action={
    <Button variant="contained" color="primary">
      Criar Usuário
    </Button>
  }
/>;
```

### ✅ DO: Feedback contextual

```tsx
// Sucesso com contexto
toast.success('Usuário "João Silva" criado com sucesso!');

// Erro com ação
toast.error('Erro ao salvar', {
  action: {
    label: 'Tentar novamente',
    onClick: () => retry(),
  },
});
```

### ❌ DON'T: Mensagens genéricas

```tsx
// ❌ Muito genérico
toast.success('Sucesso!');
toast.error('Erro!');
```

---

## 🎨 Chips/Badges

### Chips

```tsx
import { Chip } from '@/components/ui/chip';

// Status badges
<Chip label="Ativo" color="success" variant="soft" />
<Chip label="Pendente" color="warning" variant="soft" />
<Chip label="Inativo" color="error" variant="soft" />

// Com ícone
<Chip
  label="Premium"
  color="primary"
  icon={<Star />}
  variant="filled"
/>

// Deletável
<Chip
  label="Tag"
  onDelete={() => removeTag()}
  variant="outlined"
/>
```

### Role Badges

```tsx
const getRoleBadgeClasses = (role: string) => {
  if (role === 'SUPER_ADMIN')
    return 'bg-error-main/10 text-error-main border border-error-main/20';
  if (role === 'TENANT_ADMIN')
    return 'bg-warning-main/10 text-warning-main border border-warning-main/20';
  return 'bg-info-main/10 text-info-main border border-info-main/20';
};

<span
  className={cn(
    'inline-flex rounded-md px-2 py-1 text-xs font-bold',
    getRoleBadgeClasses(user.role),
  )}
>
  {user.role}
</span>;
```

---

## ✅ Checklist de Componentes

Ao criar/usar componentes:

- [ ] Usa componentes do Design System (não cria do zero)
- [ ] Mantém consistência visual (cores, espaçamento, bordas)
- [ ] Implementa todos os estados (loading, error, empty, success)
- [ ] Acessível (ARIA labels, navegação por teclado)
- [ ] Responsivo (mobile-first)
- [ ] Documentado (JSDoc com exemplos)
- [ ] Testado (visual e funcionalmente)

---

## 📚 Componentes Disponíveis

### UI Base (57 componentes)

- Accordion
- Alert
- Avatar
- Badge
- Button
- Card
- Checkbox
- Chip
- Dialog
- Drawer
- Input
- Menu
- Pagination
- Progress
- Radio
- Select
- Skeleton
- Slider
- Switch
- Table
- Tabs
- TextField
- Tooltip
- ... e mais 34 componentes

### Skeletons

- DashboardSkeleton
- CardSkeleton
- TableSkeleton

### Layout

- Sidebar
- Header
- Breadcrumbs

### Auth

- AuthGuard
- LoginForm
- RegisterForm

---

## 💎 Componentes Estilizados

### Hamburger Menu (App Style)

Para um visual mais "premium" (Minimals), usamos um SVG customizado com traços arredondados em vez do ícone padrão.

```tsx
<svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
>
  <path d="M5 7H19" strokeWidth="2.5" strokeLinecap="round" />
  <path d="M5 12H19" strokeWidth="2.5" strokeLinecap="round" />
  <path d="M5 17H19" strokeWidth="2.5" strokeLinecap="round" />
</svg>
```

### Tenant Switcher (Responsivo)

Adapta-se automaticamente ao espaço disponível.

- **Mobile:** Apenas Avatar + Chevron (Compacto)
- **Desktop:** Avatar + Nome + Role + Chevron (Completo)

---

**Anterior:** [Arquitetura](./architecture.md) | **Próximo:** [Design Tokens](./TOKENS.md)
