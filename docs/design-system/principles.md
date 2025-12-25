# 🎨 Design System - Princípios Fundamentais

> **Kaven Boilerplate** - Design System baseado em Minimals.cc  
> **Tema:** Dark Glassmorphism  
> **Framework:** Next.js 14 + Tailwind CSS

---

## 📐 Filosofia de Design

O Kaven utiliza uma abordagem **Dark Glassmorphism** que combina:

- **Profundidade:** Camadas com blur e transparência
- **Sutileza:** Cores dessaturadas e transições suaves
- **Modernidade:** Gradientes, sombras e micro-animações

### Princípios Core

1. **Clareza Visual:** Hierarquia clara através de contraste e espaçamento
2. **Consistência:** Uso de design tokens para manter padrões
3. **Responsividade:** Mobile-first approach
4. **Acessibilidade:** WCAG 2.1 AA compliance
5. **Performance:** Otimização de animações e imagens

---

## 🎨 Paleta de Cores

### Cores Primárias

```css
/* Primary (Verde) */
--primary-main: #00a76f;
--primary-dark: #007867;
--primary-light: #5be49b;
--primary-lighter: #c8fad6;
--primary-darker: #004b50;

/* Secondary (Roxo) */
--secondary-main: #8e33ff;
--secondary-dark: #5119b7;
--secondary-light: #c684ff;
```

### Cores de Estado

```css
/* Success */
--success-main: #22c55e;
--success-dark: #118d57;
--success-light: #77ed8b;

/* Warning */
--warning-main: #ffab00;
--warning-dark: #b76e00;
--warning-light: #ffd666;

/* Error */
--error-main: #ff5630;
--error-dark: #b71d18;
--error-light: #ffac82;

/* Info */
--info-main: #00b8d9;
--info-dark: #006c9c;
--info-light: #61f3f3;
```

### Cores Neutras (Dark Mode)

```css
/* Background */
--bg-default: #1c252e; /* Fundo principal */
--bg-paper: #212b36; /* Cards e surfaces */
--bg-neutral: #161c24; /* Inputs e áreas secundárias */

/* Text */
--text-primary: #ffffff;
--text-secondary: #919eab;
--text-disabled: #637381;

/* Borders */
--border-default: rgba(145, 158, 171, 0.24);
--border-light: rgba(145, 158, 171, 0.12);
```

### Uso Correto de Cores

#### ✅ DO: Usar cores com propósito

```tsx
// Botão de ação primária
<Button variant="contained" color="primary">
  Criar Usuário
</Button>

// Alerta de sucesso
<Alert severity="success">
  Operação concluída com sucesso!
</Alert>

// Badge de status
<Chip label="Ativo" color="success" variant="soft" />
```

#### ❌ DON'T: Usar cores aleatórias

```tsx
// ❌ Cor hardcoded sem semântica
<div className="bg-[#FF0000] text-white">
  Erro
</div>

// ✅ Usar cor de estado apropriada
<div className="bg-error-main/10 text-error-main border border-error-main/20">
  Erro
</div>
```

---

## 🔤 Tipografia

### Fontes

```css
/* Primary Font (Sans-serif) */
font-family:
  'DM Sans Variable',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;

/* Secondary Font (Display) */
font-family:
  'Barlow',
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;
```

### Escala Tipográfica

| Elemento     | Tamanho | Peso | Line Height | Uso                |
| ------------ | ------- | ---- | ----------- | ------------------ |
| **H1**       | 40px    | 700  | 1.25        | Títulos principais |
| **H2**       | 32px    | 700  | 1.3         | Seções principais  |
| **H3**       | 24px    | 700  | 1.4         | Subsections        |
| **H4**       | 20px    | 600  | 1.5         | Card titles        |
| **H5**       | 18px    | 600  | 1.5         | Small headings     |
| **H6**       | 16px    | 600  | 1.6         | Labels             |
| **Body 1**   | 16px    | 400  | 1.6         | Texto principal    |
| **Body 2**   | 14px    | 400  | 1.6         | Texto secundário   |
| **Caption**  | 12px    | 400  | 1.5         | Legendas           |
| **Overline** | 12px    | 700  | 1.5         | Labels uppercase   |

### Uso Correto de Tipografia

#### ✅ DO: Usar componente Typography

```tsx
import { Typography } from '@/components/foundation/typography';

<Typography variant="h3" color="primary">
  Dashboard Analytics
</Typography>

<Typography variant="body2" color="text.secondary">
  Últimos 30 dias
</Typography>
```

#### ❌ DON'T: Usar classes Tailwind diretas

```tsx
// ❌ Inconsistente
<h3 className="text-2xl font-bold text-white">
  Dashboard Analytics
</h3>

// ✅ Usar Typography component
<Typography variant="h3">
  Dashboard Analytics
</Typography>
```

---

## 🌈 Glassmorphism

### Características

1. **Backdrop Blur:** `backdrop-blur-xl` (24px)
2. **Transparência:** `bg-opacity-80` ou `bg-white/5`
3. **Bordas Sutis:** `border border-white/10`
4. **Sombras Profundas:** `shadow-2xl`

### Exemplo de Card Glassmorphism

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

### Header com Glassmorphism

```tsx
<header
  className={cn(
    'sticky top-0 z-30',
    'backdrop-blur-xl bg-opacity-80',
    'bg-[#1C252E]/80',
    'border-b border-border/50',
  )}
>
  {/* Conteúdo */}
</header>
```

---

## 📏 Espaçamento

### Escala de Espaçamento (Tailwind)

```
0   = 0px
1   = 4px
2   = 8px
3   = 12px
4   = 16px
5   = 20px
6   = 24px
8   = 32px
10  = 40px
12  = 48px
16  = 64px
20  = 80px
24  = 96px
```

### Padrões de Uso

| Contexto                | Espaçamento | Classe Tailwind             |
| ----------------------- | ----------- | --------------------------- |
| Entre seções            | 32-48px     | `space-y-8` ou `space-y-12` |
| Entre cards             | 24px        | `gap-6`                     |
| Padding de cards        | 24px        | `p-6`                       |
| Entre elementos de form | 20px        | `space-y-5`                 |
| Margem de botões        | 16px        | `gap-4`                     |

#### ✅ DO: Usar escala consistente

```tsx
<div className="space-y-8">
  <section className="space-y-6">
    <h2>Título</h2>
    <div className="grid gap-6 md:grid-cols-3">{/* Cards */}</div>
  </section>
</div>
```

#### ❌ DON'T: Usar valores arbitrários

```tsx
// ❌ Valores inconsistentes
<div className="space-y-[17px]">
  <div className="mb-[23px]">
    {/* Conteúdo */}
  </div>
</div>

// ✅ Usar escala padrão
<div className="space-y-4">
  <div className="mb-6">
    {/* Conteúdo */}
  </div>
</div>
```

---

## 🎭 Animações e Transições

### Durações Padrão

```css
--duration-shortest: 150ms;
--duration-shorter: 200ms;
--duration-short: 250ms;
--duration-standard: 300ms;
--duration-complex: 375ms;
--duration-entering: 225ms;
--duration-leaving: 195ms;
```

### Easing Functions

```css
--easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
--easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
--easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--easing-sharp: cubic-bezier(0.4, 0, 0.6, 1);
```

### Uso Correto

#### ✅ DO: Usar transições suaves

```tsx
<button
  className={cn(
    'px-4 py-2 rounded-lg',
    'bg-primary-main text-white',
    'transition-all duration-300',
    'hover:bg-primary-dark hover:shadow-lg',
  )}
>
  Hover me
</button>
```

#### ❌ DON'T: Animações excessivas

```tsx
// ❌ Muito lento e distrator
<button className="transition-all duration-1000 hover:scale-150">
  Click
</button>

// ✅ Sutil e rápido
<button className="transition-transform duration-200 hover:scale-105">
  Click
</button>
```

---

## 🌓 Dark Mode

### Implementação

O Kaven usa **Dark Mode por padrão** com opção de Light Mode.

```tsx
import { useSettings } from '@/stores/settings.store';

function MyComponent() {
  const { theme } = useSettings();

  return (
    <div
      className={cn(
        'p-6 rounded-lg',
        theme === 'dark' ? 'bg-[#212B36] text-white' : 'bg-white text-gray-900',
      )}
    >
      {/* Conteúdo */}
    </div>
  );
}
```

### Classes Utilitárias

```tsx
// Usar classes CSS variables do Tailwind
<div className="bg-card text-foreground border border-border">
  {/* Adapta automaticamente ao tema */}
</div>
```

---

## ✅ Checklist de Conformidade

Ao criar novos componentes, verifique:

- [ ] Usa cores da paleta definida (não hardcoded)
- [ ] Usa escala tipográfica padrão
- [ ] Usa espaçamento da escala Tailwind
- [ ] Implementa Glassmorphism corretamente
- [ ] Transições suaves (200-300ms)
- [ ] Suporta Dark/Light mode
- [ ] Acessível (contraste WCAG AA)
- [ ] Responsivo (mobile-first)

---

**Próximo:** [Arquitetura de Componentes](./architecture.md)
