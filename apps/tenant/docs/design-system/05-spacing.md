# Spacing & Layout - Design System Minimals

## 📐 Visão Geral

Sistema de espaçamento baseado em múltiplos de 8px para consistência e harmonia visual.

## Escala de Espaçamento

### Base: 8px

Todos os espaçamentos são múltiplos de 8:

| Valor | Pixels | Uso                      |
| ----- | ------ | ------------------------ |
| 0     | 0px    | Sem espaçamento          |
| 1     | 8px    | Espaçamento mínimo       |
| 2     | 16px   | Espaçamento pequeno      |
| 3     | 24px   | Espaçamento médio        |
| 4     | 32px   | Espaçamento grande       |
| 6     | 48px   | Espaçamento extra grande |
| 8     | 64px   | Seções                   |
| 12    | 96px   | Grandes seções           |

### Tokens Minimals

```typescript
spacing: {
  xs: '8px',    // 1 unit
  sm: '16px',   // 2 units
  md: '24px',   // 3 units
  lg: '32px',   // 4 units
  xl: '48px',   // 6 units
  xxl: '64px',  // 8 units
}
```

## Padding

### Componentes

```tsx
// Card - padding 24px (md)
<Card className="p-6">
  Conteúdo
</Card>

// Button - padding 12px 24px
<Button className="px-6 py-3">
  Texto
</Button>

// Input - padding 16px
<Input className="p-4">
  Valor
</Input>
```

### Containers

```tsx
// Container principal - padding 24px
<main className="p-6">
  Conteúdo da página
</main>

// Section - padding vertical 48px
<section className="py-12">
  Seção
</section>
```

## Margin

### Espaçamento entre Elementos

```tsx
// Stack vertical - gap 16px
<div className="space-y-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// Stack horizontal - gap 24px
<div className="flex gap-6">
  <Button>Ação 1</Button>
  <Button>Ação 2</Button>
</div>
```

### Seções

```tsx
// Margem entre seções - 48px
<div>
  <section className="mb-12">Seção 1</section>
  <section className="mb-12">Seção 2</section>
</div>
```

## Grid System

### Container

```tsx
// Container responsivo
<div className="container mx-auto px-4 sm:px-6 lg:px-8">Conteúdo centralizado</div>
```

### Grid Layout

```tsx
// Grid 3 colunas com gap 24px
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// Grid 2 colunas com gap diferente
<div className="grid grid-cols-2 gap-x-6 gap-y-4">
  <div>Coluna 1</div>
  <div>Coluna 2</div>
</div>
```

## Flexbox

### Layouts Comuns

```tsx
// Header com espaçamento entre elementos
<header className="flex items-center justify-between p-6">
  <Logo />
  <Navigation />
</header>

// Card com conteúdo e ações
<Card className="flex flex-col gap-4 p-6">
  <div className="flex-1">
    Conteúdo
  </div>
  <div className="flex gap-3 justify-end">
    <Button>Cancelar</Button>
    <Button>Salvar</Button>
  </div>
</Card>
```

## Border Radius

### Valores

```typescript
radius: {
  none: '0px',
  sm: '4px',    // Elementos pequenos
  md: '8px',    // Padrão (botões, inputs)
  lg: '12px',   // Cards médios
  xl: '16px',   // Cards grandes
  full: '9999px', // Círculos, pills
}
```

### Uso

```tsx
// Botão - radius md (8px)
<Button className="rounded-md">
  Ação
</Button>

// Card - radius xl (16px)
<Card className="rounded-xl">
  Conteúdo
</Card>

// Avatar - radius full
<img className="rounded-full" src="avatar.jpg" />

// Badge - radius full
<span className="rounded-full px-3 py-1">
  Badge
</span>
```

## Breakpoints

### Valores

```typescript
breakpoints: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

### Uso Responsivo

```tsx
// Padding responsivo
<div className="p-4 md:p-6 lg:p-8">
  Conteúdo
</div>

// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
  <Card>Item</Card>
</div>

// Texto responsivo
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Título
</h1>
```

## Layouts Comuns

### Dashboard Layout

```tsx
<div className="flex h-screen">
  {/* Sidebar - 280px */}
  <aside className="w-[280px] border-r">Navegação</aside>

  {/* Main Content */}
  <div className="flex-1 flex flex-col">
    {/* Header - 72px */}
    <header className="h-[72px] border-b">App Bar</header>

    {/* Content - padding 24px */}
    <main className="flex-1 overflow-auto p-6">Conteúdo</main>
  </div>
</div>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map((item) => (
    <Card key={item.id} className="p-6">
      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
      <p className="text-grey-600">{item.description}</p>
    </Card>
  ))}
</div>
```

### Form Layout

```tsx
<form className="space-y-6 max-w-2xl">
  <div className="space-y-4">
    <div>
      <label className="block mb-2">Nome</label>
      <Input />
    </div>
    <div>
      <label className="block mb-2">Email</label>
      <Input type="email" />
    </div>
  </div>

  <div className="flex gap-3 justify-end">
    <Button variant="outlined">Cancelar</Button>
    <Button variant="contained">Salvar</Button>
  </div>
</form>
```

## Best Practices

### ✅ Fazer

- Usar múltiplos de 8px
- Manter consistência em componentes similares
- Usar tokens de espaçamento (xs, sm, md, lg, xl)
- Aplicar padding generoso em cards (24px)
- Usar gap em vez de margin quando possível

### ❌ Não Fazer

- Usar valores arbitrários (13px, 27px)
- Misturar unidades (px, rem, em)
- Espaçamento muito apertado (\u003c8px)
- Ignorar responsividade

## Referências

- [8-Point Grid System](https://spec.fm/specifics/8-pt-grid)
- [Tailwind Spacing](https://tailwindcss.com/docs/customizing-spacing)
