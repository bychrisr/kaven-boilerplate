# Introdução - Design System Minimals

## 🎯 Visão Geral

O Design System Minimals é uma implementação moderna e profissional baseada no [Minimals.cc](https://minimals.cc), focada em:

- **Consistência**: Componentes e padrões unificados
- **Escalabilidade**: Arquitetura modular e reutilizável
- **Performance**: Otimizado para Next.js 15 e React 19
- **Acessibilidade**: WCAG AA compliance
- **Developer Experience**: TypeScript strict, ESLint zero warnings

## 🏗️ Filosofia

### 1. Design Tokens First

Todos os valores de design (cores, espaçamento, tipografia) são definidos como tokens reutilizáveis:

```typescript
// ✅ Bom - Usando tokens
<div className="bg-primary-main text-white p-24">

// ❌ Ruim - Valores hardcoded
<div className="bg-[#1877F2] text-white p-6">
```

### 2. Component-Driven Development

Componentes pequenos, focados e composáveis:

```tsx
// ✅ Bom - Componentes compostos
<Card>
  <CardHeader title="Título" />
  <CardContent>Conteúdo</CardContent>
</Card>

// ❌ Ruim - Componente monolítico
<Card title="Título" content="Conteúdo" />
```

### 3. Sections Pattern

Lógica de negócio separada em `sections/`:

```
app/(dashboard)/users/page.tsx        → 10 linhas
sections/user/user-view.tsx           → Lógica completa
```

**Benefícios**:

- Páginas extremamente simples (10-15 linhas)
- Reutilização de lógica
- Testabilidade
- Manutenibilidade

## 📦 Estrutura do Projeto

```
apps/admin/
├── components/
│   ├── ui/              # Componentes base (Button, Card, etc.)
│   ├── extra/           # Componentes auxiliares
│   └── foundation/      # Componentes de fundação
├── sections/            # Lógica de negócio por feature
│   ├── user/
│   ├── tenant/
│   ├── dashboard/
│   └── settings/
├── lib/
│   ├── design-system/   # Tokens e utilitários
│   ├── mock/            # Geradores de dados
│   ├── utils/           # Funções auxiliares
│   └── config/          # Configurações
└── app/                 # Páginas Next.js (App Router)
```

## 🎨 Design Principles

### 1. Minimalismo Profissional

- Espaço em branco generoso
- Hierarquia visual clara
- Cores intencionais

### 2. Consistência Visual

- Mesmos radius em componentes similares
- Shadows consistentes por nível de elevação
- Tipografia harmoniosa

### 3. Feedback Imediato

- Hover states em todos os elementos interativos
- Loading states claros
- Animações suaves (300ms)

## 🚀 Getting Started

### Instalação

```bash
cd apps/admin
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
pnpm tsc --noEmit
```

## 📊 Métricas

- **Componentes**: 10+ componentes base
- **Redução de código**: ~92% nas páginas
- **TypeScript Errors**: 0
- **ESLint Warnings**: 0
- **Performance**: Lighthouse 90+

## 🔗 Próximos Passos

1. [Cores](./02-colors.md) - Entenda a paleta de cores
2. [Tipografia](./03-typography.md) - Sistema tipográfico
3. [Componentes](./06-components/) - Explore os componentes
